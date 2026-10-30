import { useCallback, useEffect, useState } from "react";
import { Copy, Download, Search, Trash2 } from "lucide-react";
import { supabase } from "./supabase";
import { downloadCsv, Empty, fmtDate, PageHead, Pager, searchTerm, StatusBadge, useDebounced, useToast } from "./ui";

type Subscriber = { id: string; created_at: string; email: string; status: string; source_page: string | null };
const PAGE = 30;

export default function Subscribers() {
  const toast = useToast();
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("active");
  const query = useDebounced(q);

  const build = useCallback(() => {
    let b = supabase.from("newsletter_subscribers").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (status) b = b.eq("status", status);
    const t = searchTerm(query);
    if (t) b = b.ilike("email", `%${t}%`);
    return b;
  }, [status, query]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, count, error } = await build().range(page * PAGE, page * PAGE + PAGE - 1);
    setLoading(false);
    if (error) { toast(error.message, "err"); return; }
    setRows(data as Subscriber[]);
    setTotal(count ?? 0);
  }, [build, page, toast]);
  useEffect(() => { load(); }, [load]);

  async function setSubStatus(r: Subscriber, next: string) {
    const { error } = await supabase.from("newsletter_subscribers").update({ status: next }).eq("id", r.id);
    if (error) { toast(error.message, "err"); return; }
    toast(next === "active" ? "Resubscribed" : "Unsubscribed");
    load();
  }

  async function remove(r: Subscriber) {
    if (!confirm(`Permanently delete ${r.email}?`)) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", r.id);
    if (error) { toast(error.message, "err"); return; }
    toast("Subscriber deleted");
    load();
  }

  async function all() {
    const { data, error } = await build().range(0, 9999);
    if (error) { toast(error.message, "err"); return null; }
    return data as Subscriber[];
  }

  return (
    <>
      <PageHead title="Subscribers" sub="People who signed up for insights from the website footer."
        actions={<>
          <button type="button" className="btn ghost" onClick={async () => { const d = await all(); if (d) { await navigator.clipboard.writeText(d.map(r => r.email).join(", ")); toast(`${d.length} emails copied`); } }}><Copy size={15} aria-hidden="true" />Copy emails</button>
          <button type="button" className="btn ghost" onClick={async () => { const d = await all(); if (d) downloadCsv(`subscribers-${new Date().toISOString().slice(0, 10)}.csv`, d, [["email", "Email"], ["status", "Status"], ["created_at", "Subscribed"], ["source_page", "Page"]]); }}><Download size={15} aria-hidden="true" />Export CSV</button>
        </>} />
      <div className="toolbar">
        <label className="search"><Search size={15} aria-hidden="true" /><input type="search" placeholder="Search email" value={q} onChange={e => { setQ(e.target.value); setPage(0); }} aria-label="Search subscribers" /></label>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }} aria-label="Status"><option value="active">Active</option><option value="unsubscribed">Unsubscribed</option><option value="">All</option></select>
      </div>
      <div className="card table-card">
        {rows.length ? (
          <table className="table">
            <thead><tr><th>Email</th><th className="hide-sm">Subscribed</th><th className="hide-md">Page</th><th>Status</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="no-click">
                  <td><strong>{r.email}</strong></td>
                  <td className="hide-sm">{fmtDate(r.created_at)}</td>
                  <td className="hide-md">{r.source_page ?? "—"}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="row-actions">
                    <button type="button" className="btn ghost sm" onClick={() => setSubStatus(r, r.status === "active" ? "unsubscribed" : "active")}>{r.status === "active" ? "Unsubscribe" : "Resubscribe"}</button>
                    <button type="button" className="icon-btn danger" aria-label={`Delete ${r.email}`} onClick={() => remove(r)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>{loading ? "Loading…" : "No subscribers yet."}</Empty>}
        <Pager page={page} pageSize={PAGE} total={total} onPage={setPage} />
      </div>
    </>
  );
}
