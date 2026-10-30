import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowUpRight, CheckCircle2, FileText, LoaderCircle, Upload, X } from "lucide-react";
import Turnstile, { type TurnstileHandle } from "./Turnstile";
import FormField, { fieldA11y } from "./FormField";
import { RESUME_MAX_BYTES, RESUME_TYPES, WORK_AUTH_OPTIONS } from "../shared/forms";
import { fileToBase64, submitForm } from "../lib/submit";

const empty = { name: "", email: "", phone: "", location: "", linkedin: "", experience: "", workAuthorization: "", coverLetter: "", website: "" };
type Fields = typeof empty;

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

export default function ApplicationForm({ jobId, jobTitle }: { jobId?: string; jobTitle: string }) {
  const [fields, setFields] = useState<Fields>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const ts = useRef<TurnstileHandle>(null);
  const form = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const requestId = useRef<string | null>(null);

  useEffect(() => { if (saved) success.current?.focus(); }, [saved]);

  function update(name: keyof Fields, value: string) {
    setFields(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: "" }));
    requestId.current = null;
  }

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (!RESUME_TYPES[f.type]) { setErrors(e => ({ ...e, resume: "Upload a PDF, DOC or DOCX file." })); return; }
    if (f.size > RESUME_MAX_BYTES) { setErrors(e => ({ ...e, resume: `File is ${formatSize(f.size)}. The limit is 2.5 MB.` })); return; }
    setFile(f);
    setErrors(e => ({ ...e, resume: "" }));
    requestId.current = null;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setError("");
    if (!file) { setErrors(x => ({ ...x, resume: "Please attach your résumé (PDF or Word)." })); setError("Please attach your résumé."); return; }
    if (!token) { setError("Please complete the security check below."); return; }
    setSending(true);
    requestId.current ??= crypto.randomUUID();
    const data = await fileToBase64(file);
    const res = await submitForm({ type: "application", jobId, ...fields, resume: { name: file.name, type: file.type, data }, token, requestId: requestId.current });
    setSending(false);
    if (res.ok) { setSaved(true); return; }
    setError(res.error);
    setErrors(res.fields ?? {});
    ts.current?.reset();
    const first = res.fields && Object.keys(res.fields)[0];
    if (first) (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  }

  const bind = (name: keyof Fields) => ({ ...fieldA11y(name, errors[name]), value: fields[name], disabled: sending, onChange: (e: { target: { value: string } }) => update(name, e.target.value) });

  if (saved) {
    return (
      <div className="contact-form-card contact-success" ref={success} tabIndex={-1} role="status">
        <CheckCircle2 size={30} strokeWidth={1.4} aria-hidden="true" />
        <span className="eyebrow">APPLICATION RECEIVED</span>
        <h2>Thanks for applying,<br />{fields.name.split(" ")[0]}.</h2>
        <p>Your application for <strong>{jobTitle}</strong> is with our recruiting team. If your experience is a match, a recruiter will contact you at {fields.email}.</p>
        <Link className="button secondary" to="/careers">Browse more roles <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    );
  }

  return (
    <form className="contact-form-card" id="apply" onSubmit={submit} ref={form} aria-busy={sending} aria-labelledby="apply-heading" noValidate>
      <div className="contact-form-heading"><h2 id="apply-heading">Apply{jobId ? " for this role" : " — general application"}</h2><p>{jobId ? jobTitle : "Tell us about yourself and the kind of work you’re looking for."}</p></div>
      <p className="contact-required-note">Fields marked * are required.</p>
      <div className="contact-fields-row">
        <FormField id="name" label="Full name" required error={errors.name}><input {...bind("name")} autoComplete="name" maxLength={100} /></FormField>
        <FormField id="email" label="Email" required error={errors.email}><input {...bind("email")} type="email" autoComplete="email" maxLength={254} /></FormField>
      </div>
      <div className="contact-fields-row">
        <FormField id="phone" label="Phone" error={errors.phone}><input {...bind("phone")} type="tel" autoComplete="tel" maxLength={40} /></FormField>
        <FormField id="location" label="Current location" required error={errors.location}><input {...bind("location")} autoComplete="address-level2" maxLength={120} placeholder="City, State / Country" /></FormField>
      </div>
      <div className="contact-fields-row">
        <FormField id="experience" label="Years of experience" required error={errors.experience}>
          <select {...bind("experience")}><option value="" disabled>Select</option>{["0–1", "2–3", "4–6", "7–10", "11–15", "15+"].map(o => <option key={o}>{o}</option>)}</select>
        </FormField>
        <FormField id="workAuthorization" label="Work authorization" required error={errors.workAuthorization}>
          <select {...bind("workAuthorization")}><option value="" disabled>Select</option>{WORK_AUTH_OPTIONS.map(o => <option key={o}>{o}</option>)}</select>
        </FormField>
      </div>
      <FormField id="linkedin" label="LinkedIn or portfolio URL" error={errors.linkedin}><input {...bind("linkedin")} type="url" maxLength={300} placeholder="https://linkedin.com/in/…" /></FormField>

      <div className="contact-field">
        <label htmlFor="resume">Résumé <span aria-hidden="true">*</span></label>
        <div className={`file-drop${dragging ? " dragging" : ""}${errors.resume ? " invalid" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files[0]); }}>
          {file ? (
            <div className="file-chosen">
              <FileText size={20} aria-hidden="true" /><span>{file.name}<small>{formatSize(file.size)}</small></span>
              <button type="button" onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ""; }} aria-label="Remove file" disabled={sending}><X size={16} /></button>
            </div>
          ) : (
            <button type="button" className="file-pick" onClick={() => fileInput.current?.click()} disabled={sending}>
              <Upload size={20} aria-hidden="true" /><span><strong>Choose a file</strong> or drag it here<small>PDF, DOC or DOCX · max 2.5 MB</small></span>
            </button>
          )}
          <input ref={fileInput} id="resume" name="resume" type="file" className="visually-hidden" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e => pickFile(e.target.files?.[0])} aria-invalid={Boolean(errors.resume)} aria-describedby={errors.resume ? "resume-error" : undefined} />
        </div>
        {errors.resume && <span className="contact-field-error" id="resume-error">{errors.resume}</span>}
      </div>

      <FormField id="coverLetter" label="Anything else we should know?" error={errors.coverLetter}>
        <textarea {...bind("coverLetter")} rows={4} maxLength={4000} placeholder="Availability, notice period, preferred work arrangement, rate or salary expectations…" />
      </FormField>
      <div className="contact-honeypot" aria-hidden="true"><label htmlFor="app-website">Website</label><input id="app-website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={e => update("website", e.target.value)} /></div>
      <div className="turnstile-field"><Turnstile ref={ts} action="application" onToken={setToken} /></div>
      {error && <p className="contact-form-error" role="alert">{error}</p>}
      <p className="contact-privacy">By applying you agree that we may store your details and share your résumé with clients for relevant roles. See our <Link to="/privacy">privacy policy</Link>.</p>
      <button type="submit" className="button primary contact-submit" disabled={sending}>
        {sending ? <>Submitting<LoaderCircle className="contact-spinner" size={17} aria-hidden="true" /></> : <>Submit application<ArrowUpRight size={18} aria-hidden="true" /></>}
      </button>
    </form>
  );
}
