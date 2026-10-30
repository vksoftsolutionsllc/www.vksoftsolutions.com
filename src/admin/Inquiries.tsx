import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Download, Mail, Phone, Search, Trash2 } from "lucide-react";
import { supabase } from "./supabase";
import { downloadCsv, Drawer, Empty, fmtDate, fmtDateTime, PageHead, Pager, searchTerm, StatusBadge, titleCase, useDebounced, useToast } from "./ui";
import { serviceLabel, SERVICE_OPTIONS } from "../shared/forms";

type Inquiry = {
  id: string; created_at: string; kind: string; name: string; email: string; phone: string | null; company: string | null;
  service: string; message: string; details: Record<string, string>; status: string; notes: string | null; source_page: string | null;
};
const STATUSES = ["new", "in_progress", "qualified", "closed", "spam"];
const PAGE = 20;

export default function Inquiries() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const status = params.get("status") ?? "";
  const kind = params.get("kind") ?? "";
  const service = params.get("service") ?? "";
  const openId = params.get("id");
  const query = useDebounced(q);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("id");
    setParams(next, { replace: true });
    setPage(0);
  };

  const build = useCallback(() => {
    let b = supabase.from("inquiries").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (status) b = b.eq("status", status);
    if (kind) b = b.eq("kind", kind);
    if (service) b = b.eq("service", service);
    const t = searchTerm(query);
    if (t) b = b.or(`name.ilike.*${t}*,email.ilike.*${t}*,company.ilike.*${t}*,message.ilike.*${t}*`);
    return b;
  }, [status, kind, service, query]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, count, error } = await build().range(page * PAGE, page * PAGE + PAGE - 1);
    setLoading(false);
    if (error) { toast(error.message, "err"); return; }
    setRows(data as Inquiry[]);
    setTotal(count ?? 0);
  }, [build, page, toast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!openId) return;
    supabase.from("inquiries").select("*").eq("id", openId).single().then(({ data }) => { if (data) open(data as Inquiry); });
  }, [openId]);

  function open(r: Inquiry) { setSelected(r); setNotes(r.notes ?? ""); }
  function close() {
    setSelected(null);
    if (openId) { const next = new URLSearchParams(params); next.delete("id"); setParams(next, { replace: true }); }
  }

  async function save(patch: Partial<Inquiry>) {
    if (!selected) return;
    const { data, error } = await supabase.from("inquiries").update(patch).eq("id", selected.id).select().single();
    if (error) { toast(error.message, "err"); return; }
    setSelected(data as Inquiry);
    setRows(rs => rs.map(r => (r.id === selected.id ? (data as Inquiry) : r)));
    toast("Saved");
  }

  async function remove() {
    if (!selected || !confirm(`Delete the inquiry from ${selected.name}? This can’t be undone.`)) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", selected.id);
    if (error) { toast(error.message, "err"); return; }
    toast("Inquiry deleted");
    close();
    load();
  }

  async function exportCsv() {
    const { data, error } = await build().range(0, 4999);
    if (error) { toast(error.message, "err"); return; }
    downloadCsv(`inquiries-${new Date().toISOString().slice(0, 10)}.csv`, (data as Inquiry[]).map(r => ({ ...r, service: serviceLabel(r.service), ...r.details })),
      [["created_at", "Date"], ["kind", "Type"], ["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["company", "Company"], ["service", "Service"], ["roles", "Roles"], ["headcount", "Headcount"], ["engagement", "Engagement"], ["timeline", "Timeline"], ["message", "Message"], ["status", "Status"], ["notes", "Notes"]]);
  }

  return (
    <>
      <PageHead title="Inquiries" sub="Project, hiring and general requests from the contact form."
        actions={<button type="button" className="btn ghost" onClick={exportCsv}><Download size={15} aria-hidden="true" />Export CSV</button>} />
      <div className="toolbar">
        <label className="search"><Search size={15} aria-hidden="true" /><input type="search" placeholder="Search name, email, company, message" value={q} onChange={e => { setQ(e.target.value); setPage(0); }} aria-label="Search inquiries" /></label>
        <select value={status} onChange={e => setFilter("status", e.target.value)} aria-label="Status"><option value="">All statuses</option>{STATUSES.map(s => <option key={s} value={s}>{titleCase(s)}</option>)}</select>
        <select value={kind} onChange={e => setFilter("kind", e.target.value)} aria-label="Type"><option value="">All types</option><option value="project">Project</option><option value="hire_talent">Hire talent</option><option value="general">General</option></select>
        <select value={service} onChange={e => setFilter("service", e.target.value)} aria-label="Service"><option value="">All services</option>{SERVICE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
      </div>
      <div className="card table-card">
        {rows.length ? (
          <table className="table">
            <thead><tr><th>Received</th><th>Name</th><th className="hide-sm">Company</th><th className="hide-md">Service</th><th className="hide-sm">Type</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} onClick={() => open(r)} tabIndex={0} onKeyDown={e => { if (e.key === "Enter") open(r); }} className={r.status === "new" ? "unread" : undefined}>
                  <td>{fmtDate(r.created_at)}</td>
                  <td><strong>{r.name}</strong><small>{r.email}</small></td>
                  <td className="hide-sm">{r.company ?? "—"}</td>
                  <td className="hide-md">{serviceLabel(r.service)}</td>
                  <td className="hide-sm">{titleCase(r.kind === "hire_talent" ? "hire talent" : r.kind)}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>{loading ? "Loading…" : "No inquiries match these filters."}</Empty>}
        <Pager page={page} pageSize={PAGE} total={total} onPage={setPage} />
      </div>

      <Drawer open={Boolean(selected)} onClose={close} title={selected?.name ?? ""}
        footer={selected && <>
          <button type="button" className="btn danger ghost" onClick={remove}><Trash2 size={15} aria-hidden="true" />Delete</button>
          <a className="btn primary" href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: your inquiry to VK Soft Solutions")}`}><Mail size={15} aria-hidden="true" />Reply by email</a>
        </>}>
        {selected && (
          <>
            <div className="detail-meta">
              <StatusBadge status={selected.status} />
              <span>{titleCase(selected.kind === "hire_talent" ? "hire talent" : selected.kind)}</span>
              <span>{fmtDateTime(selected.created_at)}</span>
            </div>
            <dl className="detail">
              <dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd>
              {selected.phone && <><dt>Phone</dt><dd><a href={`tel:${selected.phone}`}><Phone size={13} aria-hidden="true" /> {selected.phone}</a></dd></>}
              {selected.company && <><dt>Company</dt><dd>{selected.company}</dd></>}
              <dt>Service</dt><dd>{serviceLabel(selected.service)}</dd>
              {Object.entries(selected.details ?? {}).map(([k, v]) => <div key={k} className="contents"><dt>{titleCase(k)}</dt><dd>{v}</dd></div>)}
              {selected.source_page && <><dt>Sent from</dt><dd>{selected.source_page}</dd></>}
            </dl>
            <h3 className="sub-h">Message</h3>
            <p className="message">{selected.message}</p>
            <div className="field">
              <label htmlFor="inq-status">Status</label>
              <select id="inq-status" value={selected.status} onChange={e => save({ status: e.target.value })}>{STATUSES.map(s => <option key={s} value={s}>{titleCase(s)}</option>)}</select>
            </div>
            <div className="field">
              <label htmlFor="inq-notes">Internal notes</label>
              <textarea id="inq-notes" rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Visible to admins only" />
              <button type="button" className="btn ghost sm" disabled={notes === (selected.notes ?? "")} onClick={() => save({ notes })}>Save notes</button>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
