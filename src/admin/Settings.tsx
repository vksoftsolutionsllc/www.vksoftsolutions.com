import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { supabase } from "./supabase";
import { useAuth } from "./AdminApp";
import { fmtDate, PageHead, useToast } from "./ui";

export default function Settings() {
  const { session } = useAuth();
  const toast = useToast();
  const me = session?.user.email?.toLowerCase() ?? "";
  const [admins, setAdmins] = useState<{ email: string; created_at: string }[]>([]);
  const [newAdmin, setNewAdmin] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("admin_users").select("*").order("created_at");
    if (error) toast(error.message, "err"); else setAdmins(data ?? []);
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (pw !== pw2) { toast("Passwords don’t match", "err"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) toast(error.message, "err"); else { toast("Password updated"); setPw(""); setPw2(""); }
  }

  async function addAdmin(e: FormEvent) {
    e.preventDefault();
    const email = newAdmin.trim().toLowerCase();
    const { error } = await supabase.from("admin_users").insert({ email });
    if (error) { toast(error.code === "23505" ? "Already an admin" : error.message, "err"); return; }
    toast(`${email} added`);
    setNewAdmin("");
    load();
  }

  async function removeAdmin(email: string) {
    if (!confirm(`Remove admin access for ${email}?`)) return;
    const { error } = await supabase.from("admin_users").delete().eq("email", email);
    if (error) toast(error.message, "err"); else { toast("Access removed"); load(); }
  }

  return (
    <>
      <PageHead title="Settings" sub={`Signed in as ${me}`} />
      <div className="settings-grid">
        <section className="card pad-lg">
          <h2>Change password</h2>
          <form className="stack" onSubmit={changePassword}>
            <div className="field"><label htmlFor="pw1">New password</label><input id="pw1" type="password" required minLength={10} autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} /></div>
            <div className="field"><label htmlFor="pw2">Confirm new password</label><input id="pw2" type="password" required minLength={10} autoComplete="new-password" value={pw2} onChange={e => setPw2(e.target.value)} /></div>
            <button className="btn primary" type="submit" disabled={busy}>Update password</button>
          </form>
        </section>
        <section className="card pad-lg">
          <h2>Admin users</h2>
          <p className="muted">People on this list can sign in and manage all submissions. Self sign-up is disabled: after adding an email here, create the login with <code>npm run admin:create -- their@email.com</code>, which prints a temporary password to share with them.</p>
          <ul className="admin-list">
            {admins.map(a => (
              <li key={a.email}>
                <div><strong>{a.email}</strong><small>Added {fmtDate(a.created_at)}{a.email === me ? " · you" : ""}</small></div>
                {a.email !== me && <button type="button" className="icon-btn danger" aria-label={`Remove ${a.email}`} onClick={() => removeAdmin(a.email)}><Trash2 size={16} /></button>}
              </li>
            ))}
          </ul>
          <form className="inline-form" onSubmit={addAdmin}>
            <input type="email" required placeholder="colleague@vksoftsolutions.com" value={newAdmin} onChange={e => setNewAdmin(e.target.value)} aria-label="Admin email" />
            <button className="btn primary" type="submit"><UserPlus size={15} aria-hidden="true" />Add</button>
          </form>
        </section>
      </div>
    </>
  );
}
