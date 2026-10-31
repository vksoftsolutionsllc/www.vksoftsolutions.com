// POST /api/submit — the only write path for public forms.
// Flow: same-origin check → honeypot → validation → Turnstile → rate limit → insert.
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { db } from "./_lib/db.js";
import { verifyTurnstile } from "./_lib/turnstile.js";
import { text, Validator } from "./_lib/validate.js";
import {
  ENGAGEMENT_TYPES, HEADCOUNT_OPTIONS, INQUIRY_KINDS, RESUME_MAX_BYTES, RESUME_TYPES,
  SERVICE_OPTIONS, TIMELINE_OPTIONS, type SubmitResponse,
} from "../src/shared/forms.js";

const MAX_BODY = 4_000_000;
const HOURLY_LIMIT: Record<string, number> = { contact: 8, application: 6, newsletter: 5 };
const ALLOWED_HOSTS = ["www.vksoftsolutions.com", "vksoftsolutions.com", "localhost", "127.0.0.1"];

type Body = Record<string, unknown> & { type?: string; token?: string; website?: string; requestId?: string };

function json(data: SubmitResponse, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function clientIp(req: Request) {
  return req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
}

function hashIp(ip: string | undefined) {
  return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? ""}:${ip ?? "unknown"}`).digest("hex").slice(0, 32);
}

function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.includes(host) || host.endsWith(".vercel.app") || host === new URL(req.url).hostname;
  } catch {
    return false;
  }
}

export async function POST(req: Request): Promise<Response> {
  if (!originAllowed(req)) return json({ ok: false, error: "This form can only be submitted from our website." }, 403);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return json({ ok: false, error: "The submission is too large. Try a smaller résumé file." }, 413);

  let body: Body;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return json({ ok: false, error: "The submission is too large. Try a smaller résumé file." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "We couldn’t read that submission." }, 400);
  }

  // Bots fill hidden fields; pretend success so they move on.
  if (typeof body.website === "string" && body.website.trim()) return json({ ok: true });

  const type = body.type;
  if (type !== "contact" && type !== "application" && type !== "newsletter") return json({ ok: false, error: "Unknown form." }, 400);

  // Validate first so people fix typos without burning a Turnstile token.
  const v = new Validator();
  const prepared = type === "contact" ? prepareContact(body, v) : type === "application" ? prepareApplication(body, v) : prepareNewsletter(body, v);
  if (!v.ok) return json({ ok: false, error: "Please check the highlighted fields.", fields: v.errors }, 422);

  const token = text(body.token, 2048);
  if (!token) return json({ ok: false, error: "Please complete the security check.", fields: { token: "Please complete the security check." } }, 400);

  const ip = clientIp(req);
  const requestId = text(body.requestId, 64) || randomUUID();
  try {
    const check = await verifyTurnstile(token, ip, requestId);
    if (!check.success) {
      return json({ ok: false, error: "The security check expired or failed. Please try it again.", fields: { token: "Please complete the security check again." } }, 400);
    }
  } catch (err) {
    console.error("turnstile", err);
    return json({ ok: false, error: "We couldn’t verify the security check right now. Please try again in a minute." }, 503);
  }

  const ipHash = hashIp(ip);
  const userAgent = text(req.headers.get("user-agent"), 300) || null;
  const sourcePage = text(body.sourcePage, 300) || null;
  const pool = db();

  try {
    const recent = await pool.query(
      "select count(*)::int as n from submission_log where ip_hash = $1 and kind = $2 and created_at > now() - interval '1 hour'",
      [ipHash, type]);
    if (recent.rows[0].n >= HOURLY_LIMIT[type]) {
      return json({ ok: false, error: "You’ve sent several submissions in a short time. Please try again later or email us directly." }, 429);
    }
    await pool.query("insert into submission_log (ip_hash, kind) values ($1, $2)", [ipHash, type]);
    if (Math.random() < 0.05) await pool.query("delete from submission_log where created_at < now() - interval '2 days'");

    const saved = await prepared.save({ ipHash, userAgent, sourcePage });
    return json({ ok: true, ...saved });
  } catch (err) {
    console.error("submit", type, err);
    return json({ ok: false, error: "We couldn’t save your submission. Please try again." }, 500);
  }
}

export function GET() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}

type Meta = { ipHash: string; userAgent: string | null; sourcePage: string | null };
type Saved = { id?: string; reference?: string };
type Prepared = { save: (meta: Meta) => Promise<Saved> };

// Unambiguous characters only (no 0/O, 1/I/L) so codes are easy to read out over the phone.
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** e.g. VKA-261031-7F3K9Q — date for humans, 6 random chars (~887M per day) for uniqueness. */
function referenceCode() {
  const d = new Date();
  const date = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Array.from(randomBytes(6), b => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
  return `VKA-${date}-${rand}`;
}

/** Stored name = reference + cleaned original name, so uploads can never overwrite or be confused with each other. */
function storedFileName(reference: string, original: string, ext: string) {
  const base = original.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "resume";
  return `${reference}_${base}.${ext}`;
}

function prepareContact(b: Body, v: Validator): Prepared {
  const kind = v.oneOf("kind", text(b.kind, 20) || "project", INQUIRY_KINDS, "Inquiry type");
  const name = v.required("name", text(b.name, 100), "Full name", 2);
  const email = v.email("email", text(b.email, 254));
  const phone = v.phone("phone", text(b.phone, 40));
  const company = text(b.company, 150) || null;
  const service = v.oneOf("service", text(b.service, 60), SERVICE_OPTIONS.map(s => s.value), "Service");
  const message = v.required("message", text(b.message, 4000), "Message", 10);

  const details: Record<string, string> = {};
  if (kind === "hire_talent") {
    const roles = v.required("roles", text(b.roles, 300), "Roles needed", 2);
    details.roles = roles;
    details.headcount = v.oneOf("headcount", text(b.headcount, 10), HEADCOUNT_OPTIONS, "Headcount");
    details.engagement = v.oneOf("engagement", text(b.engagement, 30), ENGAGEMENT_TYPES, "Engagement type");
    details.timeline = v.oneOf("timeline", text(b.timeline, 30), TIMELINE_OPTIONS, "Timeline");
    if (!company) v.errors.company = "Company is required for hiring requests.";
  }

  return {
    async save(m) {
      const r = await db().query(
        `insert into inquiries (kind, name, email, phone, company, service, message, details, source_page, ip_hash, user_agent)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`,
        [kind, name, email, phone, company, service, message, JSON.stringify(details), m.sourcePage, m.ipHash, m.userAgent]);
      return { id: r.rows[0].id };
    },
  };
}

function prepareApplication(b: Body, v: Validator): Prepared {
  const jobId = text(b.jobId, 40) || null;
  const name = v.required("name", text(b.name, 100), "Full name", 2);
  const email = v.email("email", text(b.email, 254));
  const phone = v.phone("phone", text(b.phone, 40));
  const location = v.required("location", text(b.location, 120), "Current location", 2);
  const linkedin = v.url("linkedin", text(b.linkedin, 300));
  const experience = v.required("experience", text(b.experience, 20), "Years of experience");
  const workAuth = v.required("workAuthorization", text(b.workAuthorization, 80), "Work authorization");
  const coverLetter = text(b.coverLetter, 4000) || null;
  if (jobId && !/^[0-9a-f-]{36}$/i.test(jobId)) v.errors.jobId = "Unknown job.";

  const resume = b.resume as { name?: unknown; type?: unknown; data?: unknown } | undefined;
  let file: { name: string; ext: string; type: string; bytes: Buffer } | null = null;
  if (!resume || typeof resume.data !== "string") {
    v.errors.resume = "Please attach your résumé (PDF or Word).";
  } else {
    const type = text(resume.type, 120);
    const bytes = Buffer.from(resume.data, "base64");
    const head = bytes.subarray(0, 4).toString("hex");
    const magicOk = (type === "application/pdf" && head === "25504446")
      || (RESUME_TYPES[type] === "docx" && head.startsWith("504b"))
      || (RESUME_TYPES[type] === "doc" && head === "d0cf11e0");
    if (!RESUME_TYPES[type] || !magicOk) v.errors.resume = "Upload a PDF, DOC or DOCX file.";
    else if (bytes.length > RESUME_MAX_BYTES) v.errors.resume = "Résumé must be 2.5 MB or smaller.";
    else file = { name: text(resume.name, 200).replace(/[^\w.\- ()]/g, "_") || `resume.${RESUME_TYPES[type]}`, ext: RESUME_TYPES[type], type, bytes };
  }

  return {
    async save(m) {
      const client = await db().connect();
      try {
        await client.query("begin");
        let jobTitle = "General application";
        let job: string | null = null;
        if (jobId) {
          const j = await client.query("select id, title from jobs where id = $1 and is_published", [jobId]);
          if (j.rowCount) { job = j.rows[0].id; jobTitle = j.rows[0].title; }
        }
        // Retry with a fresh code on the (astronomically unlikely) chance of a duplicate.
        let id = "";
        let reference = "";
        for (let attempt = 0; !id; attempt++) {
          reference = referenceCode();
          await client.query("savepoint new_application");
          try {
            const r = await client.query(
              `insert into job_applications (reference_code, job_id, job_title, name, email, phone, location, linkedin, experience_years,
                 work_authorization, cover_letter, has_resume, source_page, ip_hash, user_agent)
               values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) returning id`,
              [reference, job, jobTitle, name, email, phone, location, linkedin, experience, workAuth, coverLetter, Boolean(file), m.sourcePage, m.ipHash, m.userAgent]);
            id = r.rows[0].id;
          } catch (err) {
            await client.query("rollback to savepoint new_application");
            if ((err as { code?: string }).code !== "23505" || attempt >= 4) throw err;
          }
        }
        if (file) {
          await client.query(
            `insert into application_files (application_id, filename, original_filename, mime_type, size_bytes, sha256, data)
             values ($1,$2,$3,$4,$5,$6,$7)`,
            [id, storedFileName(reference, file.name, file.ext), file.name, file.type, file.bytes.length,
              createHash("sha256").update(file.bytes).digest("hex"), file.bytes]);
        }
        await client.query("commit");
        return { id, reference };
      } catch (err) {
        await client.query("rollback");
        throw err;
      } finally {
        client.release();
      }
    },
  };
}

function prepareNewsletter(b: Body, v: Validator): Prepared {
  const email = v.email("email", text(b.email, 254));
  return {
    async save(m) {
      await db().query(
        `insert into newsletter_subscribers (email, source_page, ip_hash) values ($1,$2,$3)
         on conflict (email) do update set status = 'active'`,
        [email, m.sourcePage, m.ipHash]);
      return {};
    },
  };
}
