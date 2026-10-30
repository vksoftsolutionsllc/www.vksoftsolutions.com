import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "./supabase";

/* ───────── formatting ───────── */
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(iso);
}
export const titleCase = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

/* ───────── status badges (label text always present; color is secondary) ───────── */
const TONE: Record<string, string> = {
  new: "info", in_progress: "warn", qualified: "good", closed: "muted", spam: "bad",
  screening: "warn", interview: "info", offer: "good", hired: "good", rejected: "muted",
  active: "good", unsubscribed: "muted", published: "good", draft: "muted",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${TONE[status] ?? "muted"}`}>{titleCase(status)}</span>;
}

/* ───────── toasts ───────── */
type Toast = { id: number; text: string; tone: "ok" | "err" };
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, text, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">{toasts.map(t => <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>)}</div>
    </ToastCtx.Provider>
  );
}

/* ───────── drawer ───────── */
export function Drawer({ open, title, onClose, children, footer }: { open: boolean; title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer" role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : "Details"} tabIndex={-1} ref={panel}>
        <header className="drawer-head"><h2>{title}</h2><button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        <div className="drawer-body">{children}</div>
        {footer && <footer className="drawer-foot">{footer}</footer>}
      </div>
    </div>
  );
}

/* ───────── pagination ───────── */
export function Pager({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total ? page * pageSize + 1 : 0;
  const to = Math.min(total, (page + 1) * pageSize);
  return (
    <div className="pager">
      <span>{from}–{to} of {total}</span>
      <button type="button" className="icon-btn" disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      <span>Page {page + 1} / {pages}</span>
      <button type="button" className="icon-btn" disabled={page + 1 >= pages} onClick={() => onPage(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </div>
  );
}

/* ───────── hooks ───────── */
export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

/** Escape a user search term for PostgREST `or=(… ilike …)` filters. */
export const searchTerm = (q: string) => q.replace(/[,()*%\\]/g, " ").trim();

/* ───────── CSV ───────── */
export function downloadCsv(filename: string, rows: Record<string, unknown>[], columns: [string, string][]) {
  const cell = (v: unknown) => {
    let s = v == null ? "" : Array.isArray(v) ? v.join("; ") : typeof v === "object" ? JSON.stringify(v) : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralize spreadsheet formulas
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [columns.map(c => cell(c[1])).join(","), ...rows.map(r => columns.map(([k]) => cell(r[k])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadResume(applicationId: string) {
  const { data, error } = await supabase.rpc("get_resume", { p_application_id: applicationId });
  if (error) throw error;
  const row = (data as { filename: string; mime_type: string; data_base64: string }[])[0];
  if (!row) throw new Error("No résumé on file");
  const bytes = Uint8Array.from(atob(row.data_base64), c => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: row.mime_type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: row.filename });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
