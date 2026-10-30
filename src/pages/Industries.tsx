import { Link, useParams } from "react-router";
import { ArrowUpRight, ShieldCheck, UserCheck } from "lucide-react";
import { CTA, Hero, InnerPage, SignalPanel } from "../components/PageBlocks";
import { industries } from "../data/industries";
import { services } from "../data/services";
import { usePageMeta } from "../lib/meta";
import NotFound from "./NotFound";

export function IndustriesOverview() {
  usePageMeta("Industries", "IT consulting, software engineering and technology talent for financial services, healthcare, technology, energy, retail and manufacturing.");
  return (
    <InnerPage>
      <Hero eyebrow="Industry perspectives" title={<>Technology in context.<br /><span>Business comes first.</span></>} copy="The right solution depends on the work, the people and the environment around it. Explore how we support organizations across these sectors." breadcrumbs={[{ label: "Industries" }]} />
      <section className="inner-section inner-section-tight">
        <div className="container">
          <div className="inner-industry-layout">
            <div className="inner-industry-intro">
              <p className="eyebrow">Innovation Across Industries</p>
              <h2>Explore the possibilities.</h2>
              <p>Every sector has its own regulations, systems and talent markets. We bring that context to every engagement and every search.</p>
              <Link className="text-link" to="/contact">Ask us about your industry <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
            <div className="inner-industry-accordion">
              {industries.map((ind, i) => (
                <details key={ind.slug} open={i === 0} name="industry-perspectives">
                  <summary><span className="inner-industry-toggle" aria-hidden="true">+</span>{ind.title}</summary>
                  <div className="inner-industry-panel">
                    <img src={ind.image} alt={ind.imageAlt} width={1100} height={650} loading="lazy" />
                    <p>{ind.intro}</p>
                    <Link className="text-link" to={`/industries/${ind.slug}`}>Explore {ind.short} <ArrowUpRight size={17} aria-hidden="true" /></Link>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </InnerPage>
  );
}

export function IndustryDetail() {
  const { slug } = useParams();
  const ind = industries.find(i => i.slug === slug);
  usePageMeta(ind?.title, ind?.intro);
  if (!ind) return <NotFound />;
  return (
    <InnerPage>
      <Hero eyebrow="Industry perspectives" title={<>{ind.title}<span className="inner-title-dot">.</span></>} copy={ind.intro} breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: ind.short }]}>
        <SignalPanel label="Start with the business context" />
      </Hero>
      <section className="inner-section inner-section-tight">
        <div className="container">
          <div className="inner-section-heading">
            <div><p className="eyebrow">Where we help</p><h2>Common starting points.</h2></div>
            <p>Each engagement is shaped by your systems, data and requirements. These are areas where clients in this sector often begin.</p>
          </div>
          <div className="inner-grid inner-grid-three">
            {ind.applications.map(([title, copy], i) => <article className="inner-capability-card" key={title}><span className="inner-small-number">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>
      <section className="inner-section inner-surface">
        <div className="container inner-split">
          <div>
            <p className="eyebrow">Context matters</p>
            <h2>What we plan for<br />from day one.</h2>
            <p className="inner-muted">Any recommendation starts with a review of your environment and obligations.</p>
          </div>
          <ul className="inner-check-list">{ind.considerations.map(c => <li key={c}><ShieldCheck size={20} aria-hidden="true" />{c}</li>)}</ul>
        </div>
      </section>
      <section className="inner-section">
        <div className="container inner-split">
          <div>
            <p className="eyebrow">Talent for this sector</p>
            <h2>Roles we frequently fill.</h2>
            <p className="inner-muted">Contract, contract-to-hire and permanent placements — plus dedicated teams.</p>
            <Link className="button primary" to="/contact?kind=hire_talent">Request talent <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <ul className="inner-check-list">{ind.roles.map(r => <li key={r}><UserCheck size={20} aria-hidden="true" />{r}</li>)}</ul>
        </div>
      </section>
      <section className="inner-section inner-surface">
        <div className="container">
          <p className="eyebrow">Ways to move forward</p>
          <h2>Choose the kind of support you need.</h2>
          <div className="inner-grid inner-grid-three inner-related">
            {services.map(s => <Link to={`/services/${s.slug}`} className="inner-related-card" key={s.slug}><s.icon size={23} aria-hidden="true" /><h3>{s.title}</h3><ArrowUpRight size={20} aria-hidden="true" /></Link>)}
          </div>
        </div>
      </section>
      <CTA title="Tell us about your environment." />
    </InnerPage>
  );
}
