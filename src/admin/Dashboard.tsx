import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Briefcase, Inbox, Mail, RefreshCw, Users } from "lucide-react";
import { supabase } from "./supabase";
import { PageHead, StatusBadge, timeAgo, titleCase } from "./ui";
import { serviceLabel } from "../shared/forms";

type Stats = {
  totals: { inquiries: number; applications: number; subscribers: number; open_jobs: number; new_inquiries: number; new_applications: number };
  period: { inquiries: number; applications: number; subscribers: number; prev_inquiries: number; prev_applications: number; prev_subscribers: number };
  daily: { day: string; inquiries: number; applications: number }[];
  by_service: { service: string; count: number }[];
  inquiry_status: Record<string, number>;
  application_status: Record<string, number>;
  top_jobs: { job_title: string; count: number }[];
};
type Recent = { id: string; kind: "inquiry" | "application"; name: string; detail: string; status: string; created_at: string };

// Validated pair (dataviz validator: CVD ΔE 25.4, normal ΔE 29.3, ≥3:1 on surface).
const SERIES = { inquiries: "#B74D2B", applications: "#2a78d6" };
const PIPELINE = ["new", "screening", "interview", "offer", "hired", "rejected"];
const RANGES = [7, 30, 90];

function Delta({ now, prev }: { now: number; prev: number }) {
  if (!prev && !now) return <span className="delta flat">No activity yet</span>;
  if (!prev) return <span className="delta up"><ArrowUpRight size={13} aria-hidden="true" />New this period</span>;
  const pct = Math.round(((now - prev) / prev) * 100);
  const Icon = pct >= 0 ? ArrowUpRight : ArrowDownRight;
  return <span className={`delta ${pct > 0 ? "up" : pct < 0 ? "down" : "flat"}`}><Icon size={13} aria-hidden="true" />{pct > 0 ? "+" : ""}{pct}% vs previous</span>;
}

const shortDay = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="chart-tip">
      <strong>{shortDay(label)}</strong>
      {payload.map(p => <div key={p.dataKey}><i style={{ background: SERIES[p.dataKey as keyof typeof SERIES] }} />{titleCase(p.dataKey)}<b>{p.value}</b></div>)}
    </div>
  );
}

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Recent[] | null>(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError("");
    supabase.rpc("admin_dashboard_stats", { p_days: days }).then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error.message); else setStats(data as Stats);
    });
    Promise.all([
      supabase.from("inquiries").select("id,name,company,service,status,created_at").order("created_at", { ascending: false }).limit(6),
      supabase.from("job_applications").select("id,name,job_title,status,created_at").order("created_at", { ascending: false }).limit(6),
    ]).then(([i, a]) => {
      if (cancelled) return;
      const rows: Recent[] = [
        ...(i.data ?? []).map(r => ({ id: r.id, kind: "inquiry" as const, name: r.name, detail: r.company ? `${r.company} · ${serviceLabel(r.service)}` : serviceLabel(r.service), status: r.status, created_at: r.created_at })),
        ...(a.data ?? []).map(r => ({ id: r.id, kind: "application" as const, name: r.name, detail: r.job_title, status: r.status, created_at: r.created_at })),
      ].sort((x, y) => y.created_at.localeCompare(x.created_at)).slice(0, 8);
      setRecent(rows);
    });
    return () => { cancelled = true; };
  }, [days, tick]);

  const s = stats;
  const pipelineMax = s ? Math.max(1, ...PIPELINE.map(k => s.application_status[k] ?? 0)) : 1;
  const services = (s?.by_service ?? []).map(x => ({ ...x, label: serviceLabel(x.service).replace(/ \(.*\)$/, "") }));
  const lastIdx = (s?.daily.length ?? 0) - 1;

  return (
    <>
      <PageHead title="Dashboard" sub="Website activity at a glance."
        actions={<>
          <div className="seg" role="group" aria-label="Date range">{RANGES.map(r => <button key={r} type="button" aria-pressed={days === r} onClick={() => setDays(r)}>{r}d</button>)}</div>
          <button type="button" className="btn ghost" onClick={() => setTick(t => t + 1)}><RefreshCw size={15} aria-hidden="true" />Refresh</button>
        </>} />
      {error && <p className="alert err">{error}</p>}

      <div className="kpis">
        <Link to="/admin/inquiries" className="kpi">
          <span className="kpi-label"><Inbox size={15} aria-hidden="true" />Inquiries · {days}d</span>
          <strong>{s?.period.inquiries ?? "–"}</strong>
          {s && <Delta now={s.period.inquiries} prev={s.period.prev_inquiries} />}
        </Link>
        <Link to="/admin/applications" className="kpi">
          <span className="kpi-label"><Users size={15} aria-hidden="true" />Applications · {days}d</span>
          <strong>{s?.period.applications ?? "–"}</strong>
          {s && <Delta now={s.period.applications} prev={s.period.prev_applications} />}
        </Link>
        <Link to="/admin/subscribers" className="kpi">
          <span className="kpi-label"><Mail size={15} aria-hidden="true" />New subscribers · {days}d</span>
          <strong>{s?.period.subscribers ?? "–"}</strong>
          <span className="delta flat">{s ? `${s.totals.subscribers} active in total` : ""}</span>
        </Link>
        <Link to="/admin/jobs" className="kpi">
          <span className="kpi-label"><Briefcase size={15} aria-hidden="true" />Published jobs</span>
          <strong>{s?.totals.open_jobs ?? "–"}</strong>
          <span className="delta flat">Live on the careers page</span>
        </Link>
      </div>

      {s && (s.totals.new_inquiries > 0 || s.totals.new_applications > 0) && (
        <div className="attention">
          <strong>Needs attention:</strong>
          {s.totals.new_inquiries > 0 && <Link to="/admin/inquiries?status=new">{s.totals.new_inquiries} new {s.totals.new_inquiries === 1 ? "inquiry" : "inquiries"} <ArrowRight size={14} /></Link>}
          {s.totals.new_applications > 0 && <Link to="/admin/applications?status=new">{s.totals.new_applications} new {s.totals.new_applications === 1 ? "application" : "applications"} <ArrowRight size={14} /></Link>}
        </div>
      )}

      <div className="dash-grid">
        <section className="card span-2">
          <div className="card-head">
            <h2>Submissions per day</h2>
            <div className="legend" aria-label="Legend">
              <span><i style={{ background: SERIES.inquiries }} />Inquiries</span>
              <span><i style={{ background: SERIES.applications }} />Applications</span>
            </div>
          </div>
          <div className="chart" style={{ height: 260 }}>
            {s && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s.daily} margin={{ top: 12, right: 92, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#ECEAE5" />
                  <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fontSize: 11, fill: "#5D6367" }} tickLine={false} axisLine={{ stroke: "#DEDCD6" }} minTickGap={28} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5D6367" }} tickLine={false} axisLine={false} width={44} />
                  <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#8e8c85", strokeDasharray: "3 3" }} />
                  {(["inquiries", "applications"] as const).map(key => (
                    <Line key={key} type="linear" dataKey={key} stroke={SERIES[key]} strokeWidth={2} dot={false}
                      activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} isAnimationActive={false}>
                      <LabelList dataKey={key} content={(p) => {
                        const { index, x, y, value } = p as { index?: number; x?: number; y?: number; value?: number };
                        if (index !== lastIdx || x == null || y == null) return null;
                        return <text x={x + 8} y={y + 4} fontSize={11} fill="#17212A">{titleCase(key)} {value}</text>;
                      }} />
                    </Line>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {s && (
            <details className="data-table">
              <summary>View as table</summary>
              <table><thead><tr><th>Day</th><th>Inquiries</th><th>Applications</th></tr></thead>
                <tbody>{s.daily.filter(d => d.inquiries || d.applications).map(d => <tr key={d.day}><td>{shortDay(d.day)}</td><td>{d.inquiries}</td><td>{d.applications}</td></tr>)}</tbody></table>
            </details>
          )}
        </section>

        <section className="card">
          <div className="card-head"><h2>Recent activity</h2></div>
          {recent === null ? <p className="muted pad">Loading…</p> : recent.length ? (
            <ul className="activity">
              {recent.map(r => (
                <li key={`${r.kind}-${r.id}`}>
                  <Link to={r.kind === "inquiry" ? `/admin/inquiries?id=${r.id}` : `/admin/applications?id=${r.id}`}>
                    <span className={`dot ${r.kind}`} aria-hidden="true" />
                    <div><strong>{r.name}</strong><small>{r.kind === "inquiry" ? "Inquiry" : "Application"} · {r.detail}</small></div>
                    <time dateTime={r.created_at}>{timeAgo(r.created_at)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="muted pad">No submissions yet. They’ll appear here as soon as the website forms are used.</p>}
        </section>

        <section className="card">
          <div className="card-head"><h2>Inquiries by service · {days}d</h2></div>
          {services.length ? (
            <div className="chart" style={{ height: Math.max(120, services.length * 38 + 20) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={services} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }} barCategoryGap={8}>
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis type="category" dataKey="label" width={170} tick={{ fontSize: 12, fill: "#17212A" }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "#F3F2EE" }} formatter={(v) => [v, "Inquiries"]} />
                  <Bar dataKey="count" fill={SERIES.inquiries} radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
                    <LabelList dataKey="count" position="right" fontSize={12} fill="#17212A" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="muted pad">No inquiries in this period.</p>}
        </section>

        <section className="card">
          <div className="card-head"><h2>Hiring pipeline</h2><Link to="/admin/applications" className="link-sm">Open <ArrowRight size={13} /></Link></div>
          <ul className="pipeline">
            {PIPELINE.map(k => {
              const n = s?.application_status[k] ?? 0;
              return (
                <li key={k}>
                  <Link to={`/admin/applications?status=${k}`}>
                    <span>{titleCase(k)}</span>
                    <span className="bar"><i style={{ width: `${(n / pipelineMax) * 100}%` }} /></span>
                    <b>{n}</b>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card">
          <div className="card-head"><h2>Inquiry status</h2><Link to="/admin/inquiries" className="link-sm">Open <ArrowRight size={13} /></Link></div>
          <ul className="status-list">
            {["new", "in_progress", "qualified", "closed", "spam"].map(k => (
              <li key={k}><Link to={`/admin/inquiries?status=${k}`}><StatusBadge status={k} /><b>{s?.inquiry_status[k] ?? 0}</b></Link></li>
            ))}
          </ul>
          {s && s.top_jobs.length > 0 && (
            <>
              <h3 className="sub-h">Most applied roles · {days}d</h3>
              <ul className="status-list">{s.top_jobs.map(j => <li key={j.job_title}><span>{j.job_title}</span><b>{j.count}</b></li>)}</ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}
