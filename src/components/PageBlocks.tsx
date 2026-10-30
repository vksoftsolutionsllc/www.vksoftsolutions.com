import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="inner-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/">Home</Link></li>
        {items.map((item, i) => (
          <li key={i}><span aria-hidden="true">/</span>{item.href ? <Link to={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function Hero({ eyebrow, title, copy, breadcrumbs, children, compact = false }: { eyebrow: string; title: ReactNode; copy: string; breadcrumbs: Crumb[]; children?: ReactNode; compact?: boolean }) {
  return (
    <section className={`inner-hero${compact ? " inner-hero-compact" : ""}`}>
      <div className="container">
        <Breadcrumb items={breadcrumbs} />
        <div className={`inner-hero-grid${children ? "" : " inner-hero-single"}`}>
          <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="inner-lead">{copy}</p></div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function CTA({ to = "/contact", title = "Let’s work out what comes next.", copy = "Bring your questions, your challenges or an idea you want to explore. We usually reply within one business day.", label = "Talk to an expert" }: { to?: string; title?: string; copy?: string; label?: string }) {
  return (
    <section className="inner-cta">
      <div className="container inner-cta-content">
        <div><p className="eyebrow">A conversation is a good place to start</p><h2>{title}</h2><p>{copy}</p></div>
        <Link className="button primary" to={to}>{label} <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}

export function SignalPanel({ label, caption = <>Understand the business.<br />Define the right support.</>, index = "Consulting / Engineering / Talent" }: { label: string; caption?: ReactNode; index?: string }) {
  return (
    <aside className="inner-context-note">
      <p className="inner-note-label">The starting point</p>
      <p className="inner-note-statement">{label}</p>
      <p className="inner-note-caption">{caption}</p>
      <span className="inner-note-index">{index}</span>
    </aside>
  );
}

export function FAQ({ items }: { items: [string, string][] }) {
  return (
    <section className="inner-section">
      <div className="container inner-split">
        <div><p className="eyebrow">Good questions</p><h2>Before we begin.</h2><p className="inner-muted">A few things you may be wondering about.</p></div>
        <div className="inner-faq">
          {items.map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}
        </div>
      </div>
    </section>
  );
}

export function InnerPage({ children }: { children: ReactNode }) {
  return <div className="inner-page">{children}</div>;
}
