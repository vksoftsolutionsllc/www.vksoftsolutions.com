import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import Turnstile, { type TurnstileHandle } from "./Turnstile";
import { submitForm } from "../lib/submit";
import { scrollToAndFocus } from "../lib/motion";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [armed, setArmed] = useState(false);
  const ts = useRef<TurnstileHandle>(null);
  const done = useRef<HTMLParagraphElement>(null);

  useEffect(() => { if (state === "done" && done.current) scrollToAndFocus(done.current, -200); }, [state]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (!token) { setArmed(true); setError("Please complete the quick security check."); return; }
    setState("sending");
    setError("");
    const res = await submitForm({ type: "newsletter", email, website, token });
    if (res.ok) { setState("done"); return; }
    setState("idle");
    setError(res.fields?.email ?? res.error);
    ts.current?.reset();
  }

  if (state === "done") {
    return <p className="newsletter-done" role="status" tabIndex={-1} ref={done}><CheckCircle2 size={18} aria-hidden="true" /> Thanks — you’re subscribed. Look out for our next insights in your inbox.</p>;
  }

  return (
    <form className="newsletter" onSubmit={submit} noValidate>
      <label htmlFor="newsletter-email">Insights in your inbox</label>
      <p>Occasional ideas on technology, AI and building great teams. No spam.</p>
      <div className="newsletter-row">
        <input id="newsletter-email" type="email" required autoComplete="email" placeholder="you@company.com" value={email}
          onFocus={() => setArmed(true)} onChange={e => { setEmail(e.target.value); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "newsletter-error" : undefined} />
        <button type="submit" className="button primary" disabled={state === "sending"} aria-label="Subscribe">
          {state === "sending" ? <LoaderCircle className="contact-spinner" size={17} /> : <ArrowRight size={17} />}
        </button>
      </div>
      <div className="contact-honeypot" aria-hidden="true"><label htmlFor="nl-website">Website</label><input id="nl-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
      {armed && <Turnstile ref={ts} action="newsletter" onToken={setToken} size="flexible" />}
      {error && <p className="newsletter-error" id="newsletter-error" role="alert">{error}</p>}
    </form>
  );
}
