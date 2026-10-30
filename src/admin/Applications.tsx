import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Download, FileDown, Link2, Mail, Search, Trash2 } from "lucide-react";
import { supabase } from "./supabase";
import { downloadCsv, downloadResume, Drawer, Empty, fmtDate, fmtDateTime, PageHead, Pager, searchTerm, StatusBadge, titleCase, useDebounced, useToast } from "./ui";

type Application = {
  id: string; created_at: string; job_id: string | null; job_title: string; name: string; email: string; phone: string | null;
  location: string | null; linkedin: string | null; experience_years: string | null; work_authorization: string | null;
  cover_letter: string | null; has_resume: boolean; status: string; notes: string | null;
};
const STATUSES = ["new", "screening", "interview", "offer", "hired", "rejected"];
const PAGE = 20;

export default function Applications() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const [rows, setRows] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState<string[]>([]);
  const status = params.get("status") ?? "";
  const job = params.get("job") ?? "";
  const openId = params.get("id");
  const query = useDebounced(q);
  const [selected, setSelected] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    supabase.from("job_applications").select("job_title").limit(2000).then(({ data }) => setJobs([...new Set((data ?? []).map(d => d.job_title as string))].sort()));
  }, []);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("id");
    setParams(next, { replace: true });
    setPage(0);
  };

  const build = useCallback(() => {
    let b = supabase.from("job_applications").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (status) b = b.eq("status", status);
    if (job) b = b.eq("job_title", job);
    const t = searchTerm(query);
    if (t) b = b.or(`name.ilike.*${t}*,email.ilike.*${t}*,location.ilike.*${t}*,job_title.ilike.*${t}*`);
    return b;
  }, [status, job, query]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, count, error } = await build().range(page * PAGE, page * PAGE + PAGE - 1);
    setLoading(false);
    if (error) { toast(error.message, "err"); return; }
    setRows(data as Application[]);
    setTotal(count ?? 0);
  }, [build, page, toast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!openId) return;
    supabase.from("job_applications").select("*").eq("id", openId).single().then(({ data }) => { if (data) open(data as Application); });
  }, [openId]);

  function open(r: Application) { setSelected(r); setNotes(r.notes ?? ""); }
  function close() {
    setSelected(null);
    if (openId) { const next = new URLSearchParams(params); next.delete("id"); setParams(next, { replace: true }); }
  }

  async function save(patch: Partial<Application>) {
    if (!selected) return;
    const { data, error } = await supabase.from("job_applications").update(patch).eq("id", selected.id).select().single();
    if (error) { toast(error.message, "err"); return; }
    setSelected(data as Application);
    setRows(rs => rs.map(r => (r.id === selected.id ? (data as Application) : r)));
    toast("Saved");
  }

  async function remove() {
    if (!selected || !confirm(`Delete ${selected.name}’s application and résumé? This can’t be undone.`)) return;
    const { error } = await supabase.from("job_applications").delete().eq("id", selected.id);
    if (error) { toast(error.message, "err"); return; }
    toast("Application deleted");
    close();
    load();
  }

  async function resume(id: string) {
    setDownloading(true);
    try { await downloadResume(id); } catch (e) { toast((e as Error).message, "err"); }
    setDownloading(false);
  }

  async function exportCsv() {
    const { data, error } = await build().range(0, 4999);
    if (error) { toast(error.message, "err"); return; }
    downloadCsv(`applications-${new Date().toISOString().slice(0, 10)}.csv`, data as Application[],
      [["created_at", "Date"], ["job_title", "Job"], ["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"], ["experience_years", "Experience"], ["work_authorization", "Work authorization"], ["linkedin", "LinkedIn"], ["status", "Status"], ["notes", "Notes"], ["cover_letter", "Message"]]);
  }

  return (
    <>
      <PageHead title="Applications" sub="Candidates who applied through the careers pages."
        actions={<button type="button" className="btn ghost" onClick={exportCsv}><Download size={15} aria-hidden="true" />Export CSV</button>} />
      <div className="toolbar">
        <label className="search"><Search size={15} aria-hidden="true" /><input type="search" placeholder="Search name, email, location, role" value={q} onChange={e => { setQ(e.target.value); setPage(0); }} aria-label="Search applications" /></label>
        <select value={status} onChange={e => setFilter("status", e.target.value)} aria-label="Stage"><option value="">All stages</option>{STATUSES.map(s => <option key={s} value={s}>{titleCase(s)}</option>)}</select>
        <select value={job} onChange={e => setFilter("job", e.target.value)} aria-label="Job"><option value="">All roles</option>{jobs.map(j => <option key={j} value={j}>{j}</option>)}</select>
      </div>
      <div className="card table-card">
        {rows.length ? (
          <table className="table">
            <thead><tr><th>Applied</th><th>Candidate</th><th className="hide-sm">Role</th><th className="hide-md">Experience</th><th className="hide-md">Authorization</th><th>Stage</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} onClick={() => open(r)} tabIndex={0} onKeyDown={e => { if (e.key === "Enter") open(r); }} className={r.status === "new" ? "unread" : undefined}>
                  <td>{fmtDate(r.created_at)}</td>
                  <td><strong>{r.name}</strong><small>{r.location ?? r.email}</small></td>
                  <td className="hide-sm">{r.job_title}</td>
                  <td className="hide-md">{r.experience_years ? `${r.experience_years} yrs` : "—"}</td>
                  <td className="hide-md">{r.work_authorization ?? "—"}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>{loading ? "Loading…" : "No applications match these filters."}</Empty>}
        <Pager page={page} pageSize={PAGE} total={total} onPage={setPage} />
      </div>

      <Drawer open={Boolean(selected)} onClose={close} title={selected?.name ?? ""}
        footer={selected && <>
          <button type="button" className="btn danger ghost" onClick={remove}><Trash2 size={15} aria-hidden="true" />Delete</button>
          <a className="btn ghost" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Your application: ${selected.job_title}`)}`}><Mail size={15} aria-hidden="true" />Email</a>
          {selected.has_resume && <button type="button" className="btn primary" disabled={downloading} onClick={() => resume(selected.id)}><FileDown size={15} aria-hidden="true" />Résumé</button>}
        </>}>
        {selected && (
          <>
            <div className="detail-meta"><StatusBadge status={selected.status} /><span>{selected.job_title}</span><span>{fmtDateTime(selected.created_at)}</span></div>
            <dl className="detail">
              <dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd>
              {selected.phone && <><dt>Phone</dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd></>}
              <dt>Location</dt><dd>{selected.location ?? "—"}</dd>
              <dt>Experience</dt><dd>{selected.experience_years ? `${selected.experience_years} years` : "—"}</dd>
              <dt>Work authorization</dt><dd>{selected.work_authorization ?? "—"}</dd>
              {selected.linkedin && <><dt>Profile</dt><dd><a href={selected.linkedin} target="_blank" rel="noreferrer noopener"><Link2 size={13} aria-hidden="true" /> {selected.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</a></dd></>}
              <dt>Résumé</dt><dd>{selected.has_resume ? <button type="button" className="linkish" onClick={() => resume(selected.id)} disabled={downloading}>Download</button> : "Not provided"}</dd>
            </dl>
            {selected.cover_letter && <><h3 className="sub-h">Message</h3><p className="message">{selected.cover_letter}</p></>}
            <div className="field">
              <label htmlFor="app-status">Stage</label>
              <select id="app-status" value={selected.status} onChange={e => save({ status: e.target.value })}>{STATUSES.map(s => <option key={s} value={s}>{titleCase(s)}</option>)}</select>
            </div>
            <div className="field">
              <label htmlFor="app-notes">Internal notes</label>
              <textarea id="app-notes" rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Screening notes, interview feedback…" />
              <button type="button" className="btn ghost sm" disabled={notes === (selected.notes ?? "")} onClick={() => save({ notes })}>Save notes</button>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
