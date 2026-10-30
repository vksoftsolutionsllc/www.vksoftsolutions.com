import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import Turnstile, { type TurnstileHandle } from "../components/Turnstile";

type Mode = "signin" | "forgot";

// Supabase Auth verifies captchaToken itself once CAPTCHA protection is enabled
// in the dashboard, so the check can't be bypassed by calling the Auth API directly.
function authMessage(error: AuthError) {
  if (/captcha/i.test(error.message)) return "The security check expired or failed. Please complete it again.";
  if (error.message === "Invalid login credentials") return "Email or password is incorrect.";
  return error.message;
}

export function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "err" | "ok"; text: string } | null>(null);
  const ts = useRef<TurnstileHandle>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!token) { setMsg({ tone: "err", text: "Please complete the security check." }); return; }
    setBusy(true);
    setMsg(null);
    const captchaToken = token;
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });
      if (error) setMsg({ tone: "err", text: authMessage(error) });
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/reset`, captchaToken });
      setMsg(error ? { tone: "err", text: authMessage(error) } : { tone: "ok", text: "If that email has an account, a reset link is on its way." });
    }
    // Turnstile tokens are single-use: get a fresh one for the next attempt.
    ts.current?.reset();
    setBusy(false);
  }

  const heading = mode === "signin" ? "Sign in" : "Reset your password";
  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="admin-brand"><img src="/logo.png" alt="VK Soft Solutions" width={970} height={175} /><small>Admin panel</small></div>
        <h1>{heading}</h1>
        <label>Email<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        {mode === "signin" && <label>Password<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>}
        <div className="auth-captcha">
          <Turnstile ref={ts} action="admin-login" onToken={setToken} size={window.innerWidth < 400 ? "compact" : "flexible"} />
        </div>
        {msg && <p className={`auth-msg ${msg.tone}`} role="alert">{msg.text}</p>}
        <button className="btn primary block" type="submit" disabled={busy}>{busy && <LoaderCircle className="spin" size={16} />}{mode === "signin" ? "Sign in" : "Send reset link"}</button>
        <div className="auth-links">
          {mode === "forgot" && <button type="button" onClick={() => { setMode("signin"); setMsg(null); }}>Back to sign in</button>}
          {mode === "signin" && <button type="button" onClick={() => { setMode("forgot"); setMsg(null); }}>Forgot password?</button>}
        </div>
      </form>
    </div>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((event, s) => { if (event === "PASSWORD_RECOVERY" || s) setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setMsg("Passwords don’t match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setMsg(error.message);
    else navigate("/admin", { replace: true });
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1>Choose a new password</h1>
        {!ready ? <p className="auth-note">Open this page from the reset link in your email. Links expire after a short time.</p> : (
          <>
            <label>New password<input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
            <label>Confirm password<input type="password" required minLength={10} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
            {msg && <p className="auth-msg err" role="alert">{msg}</p>}
            <button className="btn primary block" type="submit" disabled={busy}>Update password</button>
          </>
        )}
      </form>
    </div>
  );
}
