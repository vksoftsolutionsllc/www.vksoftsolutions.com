import { Link, useParams } from "react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { CTA, FAQ, Hero, InnerPage, SignalPanel } from "../components/PageBlocks";
import { services, talent, type Offering } from "../data/services";
import { industries } from "../data/industries";
import { usePageMeta } from "../lib/meta";
import NotFound from "./NotFound";

type Section = "services" | "talent";

const sectionInfo: Record<Section, { label: string; eyebrow: string; title: [string, string]; copy: string; signal: string; list: Offering[]; cta: string; steps: [string, string, string][] }> = {
  services: {
    label: "Services",
    eyebrow: "Our Suite of Services",
    title: ["Customized solutions.", "For your business."],
    copy: "Advice, engineering and platform expertise — six ways we help organizations move forward with technology.",
    signal: "Consulting. Engineering. Delivery.",
    list: services,
    cta: "/contact",
    steps: [["01", "Understand the need", "Explore the problem, the people involved and the constraints that matter."], ["02", "Define the approach", "Compare options and agree scope, responsibilities and success criteria."], ["03", "Deliver and improve", "Ship in small, visible increments with regular reviews."]],
  },
  talent: {
    label: "Talent Solutions",
    eyebrow: "Talent Solutions",
    title: ["The right people.", "Right when you need them."],
    copy: "From a single specialist to a complete delivery team — flexible ways to bring proven technology talent into your business.",
    signal: "Contract. Permanent. Teams.",
    list: talent,
    cta: "/contact?kind=hire_talent",
    steps: [["01", "Define the role", "Agree skills, seniority, budget, timeline and how success will be measured."], ["02", "Source and screen", "Targeted search, technical vetting and a short, qualified shortlist."], ["03", "Onboard and support", "Compliance, onboarding and regular check-ins once work begins."]],
  },
};

const photos = ["/images/office.jpg", "/images/architecture.jpg", "/images/team.jpg"];

export function OfferingsOverview({ section }: { section: Section }) {
  const info = sectionInfo[section];
  usePageMeta(info.label, info.copy);
  const other = section === "services" ? sectionInfo.talent : sectionInfo.services;
  return (
    <InnerPage>
      <Hero eyebrow={info.eyebrow} title={<>{info.title[0]}<br /><span>{info.title[1]}</span></>} copy={info.copy} breadcrumbs={[{ label: info.label }]}>
        <SignalPanel label={info.signal} />
      </Hero>
      <section className="inner-section inner-section-tight">
        <div className="container inner-service-grid">
          {info.list.map((s, i) => (
            <Link to={`/${section}/${s.slug}`} className="inner-service-card" key={s.slug}>
              <div className="inner-service-image"><img src={s.image || photos[i % 3]} alt={s.imageAlt} width={1000} height={650} loading="lazy" /></div>
              <h2>{s.title}</h2>
              <p className="inner-service-short">{s.short}</p>
              <p>{s.intro}</p>
              <div className="inner-tags">{s.capabilities.slice(0, 3).map(c => <span key={c.title}>{c.title}</span>)}</div>
              <span className="inner-card-link">Explore {section === "services" ? "service" : "solution"} <ArrowUpRight size={17} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="inner-section inner-surface">
        <div className="container inner-split">
          <div><p className="eyebrow">{section === "services" ? "Need people too?" : "Need a delivered outcome?"}</p><h2>{section === "services" ? <>Explore our<br />talent solutions.</> : <>Explore our<br />consulting & engineering services.</>}</h2></div>
          <div>
            <p className="inner-prose-lead">{other.copy}</p>
            <Link className="text-link" to={`/${section === "services" ? "talent" : "services"}`}>View {other.label.toLowerCase()} <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <CTA to={info.cta} label={section === "talent" ? "Request talent" : "Talk to an expert"} />
    </InnerPage>
  );
}

export function OfferingDetail({ section }: { section: Section }) {
  const { slug } = useParams();
  const info = sectionInfo[section];
  const s = info.list.find(x => x.slug === slug);
  usePageMeta(s?.title, s?.lead);
  if (!s) return <NotFound />;
  const siblings = info.list.filter(x => x.slug !== s.slug).slice(0, 3);
  const contact = section === "talent" ? `/contact?kind=hire_talent&service=${s.formService}` : `/contact?service=${s.formService}`;
  return (
    <InnerPage>
      <Hero eyebrow={s.title} title={<>{s.headline[0]}<br /><span>{s.headline[1]}</span></>} copy={s.lead} breadcrumbs={[{ label: info.label, href: `/${section}` }, { label: s.title }]}>
        <SignalPanel label={s.eyebrow} />
      </Hero>
      <section className="inner-section inner-section-tight">
        <div className="container">
          <div className="inner-section-heading">
            <div><p className="eyebrow">What we can do together</p><h2>Practical capabilities.</h2></div>
            <p>{s.intro}</p>
          </div>
          <div className="inner-grid inner-grid-two">
            {s.capabilities.map(c => (
              <article className="inner-capability-card" key={c.title}>
                <span className="inner-icon"><c.icon size={24} strokeWidth={1.5} /></span>
                <h3>{c.title}</h3>
                <p>{c.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="inner-section inner-surface">
        <div className="container inner-split">
          <div>
            <p className="eyebrow">A shared direction</p>
            <h2>What a first engagement<br />typically delivers.</h2>
            <p className="inner-muted">Exact deliverables depend on your needs and the scope we agree together.</p>
          </div>
          <ul className="inner-outcomes">{s.outcomes.map((o, i) => <li key={o}><span>0{i + 1}</span>{o}<Check size={19} aria-hidden="true" /></li>)}</ul>
        </div>
      </section>
      <section className="inner-section">
        <div className="container">
          <div className="inner-section-heading"><div><p className="eyebrow">How it works</p><h2>Understand. Shape. Move forward.</h2></div></div>
          <div className="inner-steps">{info.steps.map(([n, title, copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </section>
      <FAQ items={s.questions} />
      <section className="inner-section inner-surface">
        <div className="container">
          <p className="eyebrow">Related</p>
          <h2>Explore more {section === "services" ? "services" : "talent solutions"}.</h2>
          <div className="inner-grid inner-grid-three inner-related">
            {siblings.map(x => <Link to={`/${section}/${x.slug}`} className="inner-related-card" key={x.slug}><x.icon size={23} aria-hidden="true" /><h3>{x.title}</h3><ArrowUpRight size={20} aria-hidden="true" /></Link>)}
          </div>
          <p className="inner-footnote">Industries we support: {industries.map((ind, i) => <span key={ind.slug}>{i > 0 && " · "}<Link to={`/industries/${ind.slug}`}>{ind.short}</Link></span>)}</p>
        </div>
      </section>
      <CTA to={contact} label={section === "talent" ? "Request talent" : "Talk to an expert"} title={section === "talent" ? "Tell us who you need." : undefined} />
    </InnerPage>
  );
}
