import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowUpRight, Briefcase, CheckCircle2, FileText, Layers, LoaderCircle, Mail, MapPin, Navigation, Phone, Users } from "lucide-react";
import Turnstile, { type TurnstileHandle } from "../components/Turnstile";
import FormField, { fieldA11y } from "../components/FormField";
import { Hero, InnerPage, SignalPanel } from "../components/PageBlocks";
import { ENGAGEMENT_TYPES, HEADCOUNT_OPTIONS, INQUIRY_KINDS, SERVICE_OPTIONS, TIMELINE_OPTIONS, type InquiryKind } from "../shared/forms";
import { submitForm } from "../lib/submit";
import { usePageMeta } from "../lib/meta";
import { scrollToAndFocus } from "../lib/motion";
import { mapEmbedUrl, mapLinkUrl, site, telHref } from "../config/site";

const KIND_LABELS: Record<InquiryKind, { tab: string; heading: string; sub: string; message: string; placeholder: string }> = {
  project: { tab: "Start a project", heading: "Tell us about your project", sub: "Share what you’re working on and we’ll suggest a practical next step.", message: "Tell us about your project", placeholder: "What would you like to achieve? Share your challenge, timeline and any systems involved." },
  hire_talent: { tab: "Hire talent", heading: "Tell us who you need", sub: "Share the roles and we’ll come back with availability, rates and next steps.", message: "Role details", placeholder: "Key skills, seniority, location / remote, duration, budget or rate range…" },
  general: { tab: "General question", heading: "How can we help?", sub: "Partnerships, media or anything else — we’ll route it to the right person.", message: "Your message", placeholder: "How can we help?" },
};

const empty = { name: "", email: "", company: "", phone: "", service: "", message: "", roles: "", headcount: "", engagement: "", timeline: "", website: "" };
type Fields = typeof empty;

export default function Contact() {
  usePageMeta("Contact Us", "Talk to VK Soft Solutions about IT consulting, software, AI and data, cloud, enterprise applications or hiring technology talent.");
  const [params] = useSearchParams();
  const initialKind = INQUIRY_KINDS.includes(params.get("kind") as InquiryKind) ? (params.get("kind") as InquiryKind) : "project";
  const [kind, setKind] = useState<InquiryKind>(initialKind);
  const [fields, setFields] = useState<Fields>(() => {
    const service = params.get("service");
    const valid = SERVICE_OPTIONS.some(s => s.value === service) ? service! : initialKind === "hire_talent" ? "staffing" : "";
    return { ...empty, service: valid };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const requestId = useRef<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const ts = useRef<TurnstileHandle>(null);
  const copy = KIND_LABELS[kind];

  useEffect(() => { if (saved && success.current) scrollToAndFocus(success.current); }, [saved]);

  // After a failed submit, glide to the first problem field (or the error banner).
  function revealError(first?: string) {
    requestAnimationFrame(() => {
      const field = first ? form.current?.elements.namedItem(first) : null;
      const target = field instanceof HTMLElement ? field : form.current?.querySelector<HTMLElement>(".contact-form-error, .turnstile-field");
      if (target) scrollToAndFocus(target, -160);
    });
  }

  function update(name: keyof Fields, value: string) {
    setFields(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: "" }));
    requestId.current = null;
  }

  function switchKind(k: InquiryKind) {
    setKind(k);
    setErrors({});
    setError("");
    if (k === "hire_talent" && !fields.service) update("service", "staffing");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setError("");
    if (!token) { setErrors(x => ({ ...x, token: "Please complete the security check." })); setError("Please complete the security check below."); revealError(); return; }
    setSending(true);
    requestId.current ??= crypto.randomUUID();
    const res = await submitForm({ type: "contact", kind, ...fields, token, requestId: requestId.current });
    setSending(false);
    if (res.ok) { setSaved(true); return; }
    setError(res.error);
    setErrors(res.fields ?? {});
    ts.current?.reset();
    revealError(res.fields && Object.keys(res.fields)[0]);
  }

  const bind = (name: keyof Fields) => ({ ...fieldA11y(name, errors[name]), value: fields[name], disabled: sending, onChange: (e: { target: { value: string } }) => update(name, e.target.value) });

  return (
    <InnerPage>
    <Hero image="/images/office.jpg" eyebrow="Contact Us" title={<>What’s your<br /><span>next move?</span></>}
      copy="Whether you’re planning a project, need specialists on your team or have a question, tell us a little about it and the right person will get back to you — usually within one business day."
      breadcrumbs={[{ label: "Contact Us" }]}>
      <SignalPanel label="Let’s talk." caption={<>{site.phone}<br />{site.email}</>} index={`${site.address.city}, ${site.address.region} · USA`} />
    </Hero>
    <section className="contact-page">
      <div className="container">
        <div className="contact-layout">
          <div className="contact-intro">
            <div className="contact-expect">
              <h2>What happens next</h2>
              <ol>
                <li>We review your message and route it to the right lead.</li>
                <li>We reply — usually within one business day — to set up a short call.</li>
                <li>You get a clear proposal, shortlist or answer. No obligation.</li>
              </ol>
            </div>
            <div className="contact-focus">
              <span>REACH US DIRECTLY</span>
              <ul className="contact-info">
                <li><span className="icon-badge"><Phone size={18} aria-hidden="true" /></span><div><small>Call us</small><a href={telHref}>{site.phone}</a></div></li>
                <li><span className="icon-badge"><Mail size={18} aria-hidden="true" /></span><div><small>Email us</small><a href={`mailto:${site.email}`}>{site.email}</a></div></li>
                <li><span className="icon-badge"><MapPin size={18} aria-hidden="true" /></span><div><small>Visit us</small><address>{site.address.street}<br />{site.address.city}, {site.address.region} {site.address.postalCode}, {site.address.country}</address></div></li>
              </ul>
            </div>
            <div className="contact-promo">
              <img src="/images/team.jpg" alt="" loading="lazy" width={900} height={600} />
              <div className="contact-promo-body">
                <p className="eyebrow">Prefer to talk?</p>
                <h3>Speak with our team today.</h3>
                <p>Get quick answers about services, hiring or open roles from a real person.</p>
                <a className="button primary" href={telHref}><Phone size={17} aria-hidden="true" />Call Us Now</a>
              </div>
              <nav className="contact-quick" aria-label="Quick links">
                <Link to="/contact?kind=hire_talent" onClick={() => switchKind("hire_talent")}><Users size={18} aria-hidden="true" /><span>Hire tech talent</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
                <Link to="/careers"><Briefcase size={18} aria-hidden="true" /><span>Browse open jobs</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
                <Link to="/careers/apply"><FileText size={18} aria-hidden="true" /><span>Send your résumé</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
                <Link to="/services"><Layers size={18} aria-hidden="true" /><span>Explore our services</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
              </nav>
            </div>
          </div>

          {saved ? (
            <div className="contact-form-card contact-success" ref={success} tabIndex={-1} role="status">
              <CheckCircle2 size={30} strokeWidth={1.4} aria-hidden="true" />
              <span className="eyebrow">MESSAGE RECEIVED</span>
              <h2>Thank you,<br />{fields.name.split(" ")[0] || "we’ve got it"}.</h2>
              <p>Your {kind === "hire_talent" ? "talent request" : "message"} has reached our team. We’ll be in touch at {fields.email} soon.</p>
              <button className="button secondary" type="button" onClick={() => { setSaved(false); setFields(empty); setToken(""); requestId.current = null; }}>Send another message <ArrowUpRight size={17} aria-hidden="true" /></button>
              <Link className="text-link" to="/services">Explore our services <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </div>
          ) : (
            <form className="contact-form-card" onSubmit={submit} ref={form} aria-busy={sending} aria-labelledby="inquiry-heading" noValidate>
              <div className="form-tabs" role="tablist" aria-label="Inquiry type">
                {INQUIRY_KINDS.map(k => (
                  <button key={k} type="button" role="tab" aria-selected={kind === k} className={kind === k ? "active" : ""} onClick={() => switchKind(k)}>{KIND_LABELS[k].tab}</button>
                ))}
              </div>
              <div className="contact-form-heading"><h2 id="inquiry-heading">{copy.heading}</h2><p>{copy.sub}</p></div>
              <p className="contact-required-note">Fields marked * are required.</p>
              <div className="contact-fields-row">
                <FormField id="name" label="Full name" required error={errors.name}><input {...bind("name")} type="text" autoComplete="name" required maxLength={100} placeholder="Your name" /></FormField>
                <FormField id="email" label={kind === "general" ? "Email address" : "Work email"} required error={errors.email}><input {...bind("email")} type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></FormField>
              </div>
              <div className="contact-fields-row">
                <FormField id="company" label="Company" required={kind === "hire_talent"} error={errors.company}><input {...bind("company")} type="text" autoComplete="organization" maxLength={150} placeholder="Company name" /></FormField>
                <FormField id="phone" label="Phone" error={errors.phone}><input {...bind("phone")} type="tel" autoComplete="tel" maxLength={40} placeholder="+1 555 000 0000" /></FormField>
              </div>
              <FormField id="service" label="What can we help with?" required error={errors.service}>
                <select {...bind("service")} required><option value="" disabled>Select a service</option>{SERVICE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
              </FormField>
              {kind === "hire_talent" && (
                <>
                  <FormField id="roles" label="Roles needed" required error={errors.roles}><input {...bind("roles")} type="text" maxLength={300} placeholder="e.g. 2 × Senior Java developers, 1 × QA automation" /></FormField>
                  <div className="contact-fields-row contact-fields-three">
                    <FormField id="headcount" label="Headcount" required error={errors.headcount}><select {...bind("headcount")}><option value="" disabled>Select</option>{HEADCOUNT_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></FormField>
                    <FormField id="engagement" label="Engagement" required error={errors.engagement}><select {...bind("engagement")}><option value="" disabled>Select</option>{ENGAGEMENT_TYPES.map(o => <option key={o}>{o}</option>)}</select></FormField>
                    <FormField id="timeline" label="Start" required error={errors.timeline}><select {...bind("timeline")}><option value="" disabled>Select</option>{TIMELINE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></FormField>
                  </div>
                </>
              )}
              <FormField id="message" label={copy.message} required error={errors.message}
                hint={<div className="contact-message-help" id="message-help"><span>Please leave out passwords and sensitive information.</span><span>{fields.message.length}/4,000</span></div>}>
                <textarea {...bind("message")} required minLength={10} maxLength={4000} rows={5} placeholder={copy.placeholder} />
              </FormField>
              <div className="contact-honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" value={fields.website} onChange={e => update("website", e.target.value)} tabIndex={-1} autoComplete="off" /></div>
              <div className={`turnstile-field${errors.token ? " has-error" : ""}`}>
                <Turnstile ref={ts} action="contact" onToken={t => { setToken(t); if (t) setErrors(x => ({ ...x, token: "" })); }} />
              </div>
              {error && <p className="contact-form-error" role="alert">{error}</p>}
              <p className="contact-privacy">We’ll use your details only to respond to your inquiry. Read our <Link to="/privacy">privacy policy</Link>.</p>
              <button type="submit" className="button primary contact-submit" disabled={sending}>
                {sending ? <>Sending<LoaderCircle className="contact-spinner" size={17} aria-hidden="true" /></> : <>{kind === "hire_talent" ? "Send talent request" : "Send message"}<ArrowUpRight size={18} aria-hidden="true" /></>}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="container contact-map-wrap">
        <div className="contact-map">
          <iframe title={`Map showing ${site.name} at ${site.address.street}, ${site.address.city}, ${site.address.region}`} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <div className="map-card">
            <p className="eyebrow">Our Office</p>
            <h2>{site.name}</h2>
            <address>{site.address.street}<br />{site.address.city}, {site.address.region} {site.address.postalCode}<br />{site.address.country}</address>
            <a href={telHref}><Phone size={15} aria-hidden="true" />{site.phone}</a>
            <a href={`mailto:${site.email}`}><Mail size={15} aria-hidden="true" />{site.email}</a>
            <a className="button primary" href={mapLinkUrl} target="_blank" rel="noreferrer">Get Directions <Navigation size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
    </InnerPage>
  );
}
