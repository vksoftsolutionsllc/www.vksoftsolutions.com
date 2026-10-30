import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router";
import type { Session } from "@supabase/supabase-js";
import { Briefcase, ExternalLink, Inbox, LayoutDashboard, LogOut, Mail, Menu, Settings as SettingsIcon, Users, X } from "lucide-react";
import { supabase } from "./supabase";
import { ToastProvider } from "./ui";
import { LoginPage, ResetPasswordPage } from "./Login";
import Dashboard from "./Dashboard";
import Inquiries from "./Inquiries";
import Applications from "./Applications";
import Jobs from "./Jobs";
import Subscribers from "./Subscribers";
import Settings from "./Settings";
import "./admin.css";

type AuthState = { session: Session | null; isAdmin: boolean | null };
const AuthCtx = createContext<AuthState>({ session: null, isAdmin: null });
export const useAuth = () => useContext(AuthCtx);

function useAdminAuth(): AuthState & { loading: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    let cancelled = false;
    supabase.rpc("is_admin").then(({ data }) => { if (!cancelled) setIsAdmin(data === true); });
    return () => { cancelled = true; };
  }, [session?.user.id]);

  return { session, isAdmin, loading };
}

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/applications", label: "Applications", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function Shell({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <div className={`admin-shell${open ? " nav-open" : ""}`}>
      <aside className="admin-side">
        <div className="admin-brand"><span className="admin-logo">VK</span><div><strong>VK Soft Solutions</strong><small>Admin</small></div></div>
        <nav aria-label="Admin">
          {nav.map(n => <NavLink key={n.to} to={n.to} end={n.end}><n.icon size={17} aria-hidden="true" />{n.label}</NavLink>)}
        </nav>
        <div className="admin-side-foot">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" />View website</a>
          <span className="admin-user" title={session.user.email}>{session.user.email}</span>
          <button type="button" onClick={() => supabase.auth.signOut()}><LogOut size={15} aria-hidden="true" />Sign out</button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="icon-btn" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X size={20} /> : <Menu size={20} />}</button>
          <span>VK Soft Solutions · Admin</span>
        </header>
        <div className="admin-content">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="applications" element={<Applications />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
      {open && <div className="admin-scrim" onClick={() => setOpen(false)} />}
    </div>
  );
}

export default function AdminApp() {
  const auth = useAdminAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = "Admin | VK Soft Solutions";
    const robots = document.querySelector('meta[name="robots"]') ?? document.head.appendChild(Object.assign(document.createElement("meta"), { name: "robots" }));
    robots.setAttribute("content", "noindex, nofollow");
  }, [pathname]);

  let body;
  if (pathname.startsWith("/admin/reset")) body = <ResetPasswordPage />;
  else if (auth.loading || (auth.session && auth.isAdmin === null)) body = <div className="admin-boot">Loading…</div>;
  else if (!auth.session) body = <LoginPage />;
  else if (!auth.isAdmin) body = (
    <div className="auth-wrap"><div className="auth-card">
      <h1>No admin access</h1>
      <p>{auth.session.user.email} is signed in but isn’t on the admin list. Ask an existing admin to add you in Settings.</p>
      <button className="btn primary" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div></div>
  );
  else body = <Shell session={auth.session} />;

  return <AuthCtx.Provider value={auth}><ToastProvider><div className="admin-root">{body}</div></ToastProvider></AuthCtx.Provider>;
}
