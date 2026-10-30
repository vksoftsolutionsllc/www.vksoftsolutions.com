import { Link, useParams } from "react-router";
import { ArrowUpRight, Building2, CheckCircle2, Eye, Globe2, MapPin, Phone, Quote, Target } from "lucide-react";
import { CTA, FAQ, Hero, InnerPage, SignalPanel } from "../components/PageBlocks";
import { aboutOverview, aboutPages } from "../data/about";
import { services, talent } from "../data/services";
import { industries } from "../data/industries";
import { usePageMeta } from "../lib/meta";
import { mapLinkUrl, site, telHref } from "../config/site";
import NotFound from "./NotFound";

function OtherAboutPages({ current }: { current?: string }) {
  return (
    <section className="inner-section inner-surface">
      <div className="container">
        <div className="inner-section-heading">
          <div><p className="eyebrow">Get to know us</p><h2>How we think about work.</h2></div>
          <p>Our approach, values and commitments shape every engagement and every hire.</p>
        </div>
        <div className="about-links">
          {aboutPages.filter(a => a.slug !== current).map((a, i) => (
            <Link className="about-link-card" key={a.slug} to={`/about/${a.slug}`}>
              <span className="about-link-num">0{i + 1}</span>
              <span className="icon-badge"><a.icon size={22} aria-hidden="true" /></span>
              <h3>{a.title}</h3>
              <p>{a.copy}</p>
              <span className="text-link">Read more <ArrowUpRight size={16} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutOverview() {
  usePageMeta("About Us", "VK Soft Solutions is an IT consulting, software engineering and technology talent company headquartered in Cumming, Georgia — helping organizations consult, develop and innovate.");
  const o = aboutOverview;
  return (
    <InnerPage>
      <Hero image="/images/consulting.jpg" eyebrow="About us" title={<>Business understanding.<br /><span>Technology perspective.</span></>} copy="VK Soft Solutions brings together IT consulting, software engineering and technology talent around one starting point: what your business needs to do next." breadcrumbs={[{ label: "About Us" }]}>
        <SignalPanel label="Consult. Develop. Innovate." caption={<>Headquartered in<br />Cumming, Georgia, USA</>} index="Consulting / Engineering / Talent" />
      </Hero>

      {/* Who we are */}
      <section className="inner-section">
        <div className="container about-intro">
          <div className="about-intro-media">
            <div className="img-reveal tall"><img src="/images/collaboration.jpg" alt="Colleagues working together at a table" width={800} height={1100} loading="lazy" /></div>
            <div className="img-reveal"><img src="/images/office.jpg" alt="A modern glass-walled office" width={900} height={600} loading="lazy" /></div>
            <div className="about-intro-badge" data-anim="up"><Building2 size={22} aria-hidden="true" /><strong>{site.address.city}, {site.address.region}</strong><span>US headquarters</span></div>
          </div>
          <div className="about-intro-copy">
            <p className="eyebrow">Who we are</p>
            <h2>A partner that starts by understanding.</h2>
            <p className="inner-prose-lead">Technology decisions affect people, workflows and the future of a business. We connect practical advice with the engineering and talent our clients need to move forward.</p>
            <div className="inner-copy">
              <p>Whether it’s a technology roadmap, a new platform, a data and AI initiative or a hard-to-fill role, we bring consultants, engineers and recruiters together under one roof — so you work with a single partner who understands the whole picture.</p>
              <p>Our teams combine close, US-led collaboration with the capacity of an India-based delivery model. We serve organizations across financial services, healthcare, technology, energy, retail and manufacturing.</p>
            </div>
            <div className="mv-grid">
              <div className="mv-card"><span className="icon-badge"><Target size={20} aria-hidden="true" /></span><h3>Our mission</h3><p>{o.mission}</p></div>
              <div className="mv-card"><span className="icon-badge"><Eye size={20} aria-hidden="true" /></span><h3>Our vision</h3><p>{o.vision}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="stats-panel panel-dark">
        <div className="container">
          <div className="section-head split">
            <div><p className="eyebrow">At a Glance</p><h2>One partner, every layer of your technology</h2></div>
            <div><p>Consulting, engineering and hiring expertise in one place — so you spend less time coordinating vendors and more time moving forward.</p></div>
          </div>
          <div className="stats-band">
            <div className="stat"><strong data-count={services.length}>{services.length}</strong><span>Technology service lines</span></div>
            <div className="stat"><strong data-count={talent.length}>{talent.length}</strong><span>Flexible hiring models</span></div>
            <div className="stat"><strong data-count={industries.length}>{industries.length}</strong><span>Industries supported</span></div>
            <div className="stat"><strong data-count="2">2</strong><span>Delivery hubs — US &amp; India</span></div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="inner-section">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">What We Do</p>
            <h2>Consult. Develop. Innovate.</h2>
            <p>Three connected capabilities that take you from the right decision to the right solution — and the right people to run it.</p>
          </div>
          <div className="pillar-grid">
            {o.pillars.map((p, i) => (
              <article className="pillar-card" key={p.title}>
                <span className="pillar-num">0{i + 1}</span>
                <h3>{p.title}</h3>
                <small>{p.sub}</small>
                <p>{p.copy}</p>
                <ul>{p.links.map(([label, href]) => <li key={href}><Link to={href}>{label}<ArrowUpRight size={15} aria-hidden="true" /></Link></li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="inner-section inner-surface">
        <div className="container">
          <div className="inner-section-heading">
            <div><p className="eyebrow">How We Work</p><h2>A simple rhythm, every engagement.</h2></div>
            <p>Clear stages, regular check-ins and honest reporting — so you always know what happens next.</p>
          </div>
          <ol className="timeline">
            {o.steps.map(([t, c], i) => <li key={t}><span className="tl-dot">{i + 1}</span><h3>{t}</h3><p>{c}</p></li>)}
          </ol>
          <Link className="text-link" to="/about/approach" style={{ marginTop: 34 }}>Read about our approach <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>

      {/* Values */}
      <section className="inner-section">
        <div className="container">
          <div className="inner-section-heading">
            <div><p className="eyebrow">Our Values</p><h2>Principles we work by.</h2></div>
            <p>Six commitments that guide how we advise, build and recruit.</p>
          </div>
          <div className="inner-grid inner-grid-three">
            {aboutPages[1].sections.map(v => (
              <article className="inner-capability-card" key={v.title}><span className="inner-icon"><v.icon size={24} strokeWidth={1.6} /></span><h3>{v.title}</h3><p>{v.copy}</p></article>
            ))}
          </div>
        </div>
      </section>

      {/* Where we work */}
      <section className="inner-section" style={{ paddingTop: 0 }}>
        <div className="container where-grid">
          <div className="where-card dark">
            <p className="eyebrow">Headquarters</p>
            <h3>{site.name}</h3>
            <address><MapPin size={17} aria-hidden="true" />{site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}, {site.address.country}</address>
            <a href={telHref}><Phone size={17} aria-hidden="true" />{site.phone}</a>
            <a className="button primary" href={mapLinkUrl} target="_blank" rel="noreferrer">Get Directions <ArrowUpRight size={17} /></a>
          </div>
          <div className="where-card">
            <span className="icon-badge"><Globe2 size={22} aria-hidden="true" /></span>
            <h3>US-led, globally delivered</h3>
            <p>Engagement leadership and client communication in US hours, backed by India-based engineering and recruiting capacity for coverage, scale and value.</p>
            <div className="chip-row">{industries.map(i => <Link key={i.slug} to={`/industries/${i.slug}`}>{i.short}</Link>)}</div>
          </div>
        </div>
      </section>

      <OtherAboutPages />
      <FAQ items={aboutOverview.faqs} />
      <CTA />
    </InnerPage>
  );
}

export function AboutDetail() {
  const { slug } = useParams();
  const page = aboutPages.find(a => a.slug === slug);
  usePageMeta(page?.title, page?.lead);
  if (!page) return <NotFound />;
  return (
    <InnerPage>
      <Hero image={page.image} eyebrow={page.title} title={page.heading} copy={page.lead} breadcrumbs={[{ label: "About Us", href: "/about" }, { label: page.title }]}>
        <SignalPanel label={page.title} caption={page.copy} index="VK Soft Solutions · About" />
      </Hero>

      <section className="inner-section">
        <div className="container about-intro">
          <div className="detail-media img-reveal"><img src={page.image} alt={page.imageAlt} width={1000} height={700} loading="lazy" /></div>
          <div className="about-intro-copy">
            <p className="eyebrow">{page.title}</p>
            <h2>{page.statement}</h2>
            <div className="inner-copy"><p>{page.intro}</p></div>
            <nav className="about-subnav" aria-label="About sections">
              {aboutPages.map(a => <Link key={a.slug} to={`/about/${a.slug}`} aria-current={a.slug === page.slug ? "page" : undefined}><a.icon size={16} aria-hidden="true" />{a.title}</Link>)}
            </nav>
          </div>
        </div>
      </section>

      <section className="inner-section inner-surface">
        <div className="container">
          <div className="inner-section-heading">
            <div><p className="eyebrow">What guides us</p><h2>Six principles we live by.</h2></div>
            <p>{page.copy}</p>
          </div>
          <div className="inner-grid inner-grid-three">
            {page.sections.map((s, i) => (
              <article className="inner-capability-card" key={s.title}>
                <span className="principle-head"><span className="inner-icon"><s.icon size={24} strokeWidth={1.6} /></span><span className="inner-small-number">0{i + 1}</span></span>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section">
        <div className="container practice-panel panel-dark">
          <div>
            <p className="eyebrow">In practice</p>
            <h2>{page.practiceTitle}</h2>
            <blockquote className="practice-quote"><Quote size={28} aria-hidden="true" />{page.quote}</blockquote>
          </div>
          <ul className="practice-list">
            {page.practices.map(p => <li key={p}><CheckCircle2 size={20} aria-hidden="true" />{p}</li>)}
          </ul>
        </div>
      </section>

      <OtherAboutPages current={page.slug} />
      <CTA title="Let’s see if we’re the right fit." copy="Tell us about your goals and we’ll show you how we work — with a practical next step and no obligation." />
    </InnerPage>
  );
}
