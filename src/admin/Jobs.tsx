import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "./supabase";
import { Drawer, Empty, fmtDate, PageHead, StatusBadge, useToast } from "./ui";

type Job = {
  id: string; created_at: string; updated_at: string; slug: string; title: string; department: string; location: string;
  employment_type: string; experience: string | null; summary: string; responsibilities: string[]; requirements: string[]; is_published: boolean;
};
const TYPES = ["Full-time", "Contract", "Contract-to-hire", "Part-time", "Internship"];
const blank = { title: "", slug: "", department: "Engineering", location: "Remote (US)", employment_type: "Full-time", experience: "", summary: "", responsibilities: "", requirements: "", is_published: false };
type Draft = typeof blank & { id?: string };

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const lines = (s: string) => s.split("\n").map(l => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

export default function Jobs() {
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data, error }, apps] = await Promise.all([
      supabase.from("jobs").select("*").order("is_published", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("job_applications").select("job_id").not("job_id", "is", null).limit(5000),
    ]);
    setLoading(false);
    if (error) { toast(error.message, "err"); return; }
    setJobs(data as Job[]);
    const c: Record<string, number> = {};
    for (const a of apps.data ?? []) c[a.job_id as string] = (c[a.job_id as string] ?? 0) + 1;
    setCounts(c);
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  function edit(j?: Job) {
    setSlugTouched(Boolean(j));
    setDraft(j ? { id: j.id, title: j.title, slug: j.slug, department: j.department, location: j.location, employment_type: j.employment_type, experience: j.experience ?? "", summary: j.summary, responsibilities: j.responsibilities.join("\n"), requirements: j.requirements.join("\n"), is_published: j.is_published } : { ...blank });
  }

  async function togglePublish(j: Job) {
    const { error } = await supabase.from("jobs").update({ is_published: !j.is_published }).eq("id", j.id);
    if (error) { toast(error.message, "err"); return; }
    toast(j.is_published ? "Job unpublished" : "Job published — now live on Careers");
    load();
  }

  async function remove(j: Job) {
    if (!confirm(`Delete “${j.title}”? Existing applications are kept but unlinked.`)) return;
    const { error } = await supabase.from("jobs").delete().eq("id", j.id);
    if (error) { toast(error.message, "err"); return; }
    toast("Job deleted");
    load();
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    const row = {
      title: draft.title.trim(), slug: slugify(draft.slug || draft.title), department: draft.department.trim(), location: draft.location.trim(),
      employment_type: draft.employment_type, experience: draft.experience.trim() || null, summary: draft.summary.trim(),
      responsibilities: lines(draft.responsibilities), requirements: lines(draft.requirements), is_published: draft.is_published,
    };
    const { error } = draft.id ? await supabase.from("jobs").update(row).eq("id", draft.id) : await supabase.from("jobs").insert(row);
    setSaving(false);
    if (error) { toast(error.code === "23505" ? "That URL slug is already used by another job." : error.message, "err"); return; }
    toast(draft.id ? "Job updated" : "Job created");
    setDraft(null);
    load();
  }

  const set = (k: keyof Draft, v: string | boolean) => setDraft(d => {
    if (!d) return d;
    const next = { ...d, [k]: v };
    if (k === "title" && !slugTouched) next.slug = slugify(String(v));
    return next;
  });

  return (
    <>
      <PageHead title="Jobs" sub="Openings shown on the public careers page. Only published jobs are visible."
        actions={<button type="button" className="btn primary" onClick={() => edit()}><Plus size={15} aria-hidden="true" />New job</button>} />
      <div className="card table-card">
        {jobs.length ? (
          <table className="table">
            <thead><tr><th>Title</th><th className="hide-sm">Type</th><th className="hide-md">Location</th><th>Applicants</th><th>Status</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="no-click">
                  <td><strong>{j.title}</strong><small>{j.department} · updated {fmtDate(j.updated_at)}</small></td>
                  <td className="hide-sm">{j.employment_type}</td>
                  <td className="hide-md">{j.location}</td>
                  <td>{counts[j.id] ? <Link className="linkish" to={`/admin/applications?job=${encodeURIComponent(j.title)}`}>{counts[j.id]}</Link> : 0}</td>
                  <td><StatusBadge status={j.is_published ? "published" : "draft"} /></td>
                  <td className="row-actions">
                    <button type="button" className="icon-btn" title={j.is_published ? "Unpublish" : "Publish"} aria-label={j.is_published ? `Unpublish ${j.title}` : `Publish ${j.title}`} onClick={() => togglePublish(j)}>{j.is_published ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    <button type="button" className="icon-btn" title="Edit" aria-label={`Edit ${j.title}`} onClick={() => edit(j)}><Pencil size={16} /></button>
                    {j.is_published && <a className="icon-btn" title="View on site" aria-label={`View ${j.title} on site`} href={`/careers/${j.slug}`} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>}
                    <button type="button" className="icon-btn danger" title="Delete" aria-label={`Delete ${j.title}`} onClick={() => remove(j)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>{loading ? "Loading…" : "No jobs yet. Create your first opening."}</Empty>}
      </div>

      <Drawer open={Boolean(draft)} onClose={() => setDraft(null)} title={draft?.id ? "Edit job" : "New job"}
        footer={<><button type="button" className="btn ghost" onClick={() => setDraft(null)}>Cancel</button><button type="submit" form="job-form" className="btn primary" disabled={saving}>{saving ? "Saving…" : "Save job"}</button></>}>
        {draft && (
          <form id="job-form" className="form-grid" onSubmit={save}>
            <div className="field full"><label htmlFor="j-title">Job title *</label><input id="j-title" required maxLength={140} value={draft.title} onChange={e => set("title", e.target.value)} /></div>
            <div className="field full"><label htmlFor="j-slug">URL</label><div className="prefixed"><span>/careers/</span><input id="j-slug" value={draft.slug} onChange={e => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} /></div></div>
            <div className="field"><label htmlFor="j-dept">Department *</label><input id="j-dept" required list="dept-list" value={draft.department} onChange={e => set("department", e.target.value)} />
              <datalist id="dept-list">{["Engineering", "Data & AI", "Cloud & DevOps", "Enterprise Applications", "Quality Engineering", "Consulting", "Infrastructure", "Recruiting"].map(d => <option key={d} value={d} />)}</datalist></div>
            <div className="field"><label htmlFor="j-type">Employment type *</label><select id="j-type" value={draft.employment_type} onChange={e => set("employment_type", e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="field"><label htmlFor="j-loc">Location *</label><input id="j-loc" required value={draft.location} onChange={e => set("location", e.target.value)} placeholder="Remote (US) · Dallas, TX · Hyderabad" /></div>
            <div className="field"><label htmlFor="j-exp">Experience</label><input id="j-exp" value={draft.experience} onChange={e => set("experience", e.target.value)} placeholder="5+ years" /></div>
            <div className="field full"><label htmlFor="j-sum">Summary *</label><textarea id="j-sum" required rows={3} value={draft.summary} onChange={e => set("summary", e.target.value)} /></div>
            <div className="field full"><label htmlFor="j-resp">Responsibilities <small>one per line</small></label><textarea id="j-resp" rows={5} value={draft.responsibilities} onChange={e => set("responsibilities", e.target.value)} /></div>
            <div className="field full"><label htmlFor="j-req">Requirements <small>one per line</small></label><textarea id="j-req" rows={5} value={draft.requirements} onChange={e => set("requirements", e.target.value)} /></div>
            <label className="check full"><input type="checkbox" checked={draft.is_published} onChange={e => set("is_published", e.target.checked)} /> Published (visible on the careers page)</label>
          </form>
        )}
      </Drawer>
    </>
  );
}
