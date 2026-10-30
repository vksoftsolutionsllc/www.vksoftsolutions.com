import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CTA, Hero, InnerPage, SignalPanel } from "../components/PageBlocks";
import { aboutPages } from "../data/about";
import { usePageMeta } from "../lib/meta";
import NotFound from "./NotFound";

export function AboutOverview() {
  usePageMeta("About Us", "VK Soft Solutions brings together IT consulting, software engineering and technology talent around one starting point: what your business needs to do next.");
  return (
    <InnerPage>
      <Hero eyebrow="About us" title={<>Business understanding.<br /><span>Technology perspective.</span></>} copy="VK Soft Solutions brings together IT consulting, software engineering and technology talent around one starting point: what your business needs to do next." breadcrumbs={[{ label: "About Us" }]}>
        <SignalPanel label="People. Technology. Progress." />
      </Hero>
      <section className="inner-section inner-section-tight">
        <div className="container inner-split">
          <div><p className="eyebrow">Who we are</p><h2>A partner that starts<br />by understanding.</h2></div>
          <div className="inner-copy">
            <p>Technology decisions affect people, workflows and the future of a business. We connect practical advice with the engineering and talent our clients need to move forward — whether that’s a roadmap, a new platform or a hard-to-fill role.</p>
            <p>Our teams work across the United States and India, combining close collaboration with clients and the capacity of a global delivery model. We serve organizations from fast-growing companies to large enterprises across financial services, healthcare, technology, energy, retail and manufacturing.</p>
            <p>Whatever the engagement, the commitment is the same: be clear, be practical and keep our promises.</p>
          </div>
        </div>
      </section>
      <section className="inner-section inner-surface">
        <div className="container">
          <div className="inner-section-heading"><div><p className="eyebrow">Get to know us</p><h2>How we think about work.</h2></div></div>
          <div className="inner-grid inner-grid-two">
            {aboutPages.map(a => (
              <Link className="inner-about-card" key={a.slug} to={`/about/${a.slug}`}>
                <a.icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{a.title}</h3><p>{a.copy}</p><ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
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
      <Hero eyebrow={page.title} title={page.heading} copy={page.lead} breadcrumbs={[{ label: "About Us", href: "/about" }, { label: page.title }]} compact />
      <section className="inner-section inner-section-tight">
        <div className="container inner-editorial-layout">
          <aside className="inner-editorial-aside">
            <page.icon size={40} strokeWidth={1} aria-hidden="true" />
            <nav aria-label="About sections">
              <p className="eyebrow">Who we are</p>
              {aboutPages.map(a => <Link key={a.slug} to={`/about/${a.slug}`} aria-current={a.slug === slug ? "page" : undefined}>{a.title}</Link>)}
            </nav>
            <Link className="text-link" to="/about"><ArrowLeft size={16} aria-hidden="true" /> About the company</Link>
          </aside>
          <div className="inner-prose">
            {page.sections.map(([heading, copy], i) => <section key={heading}><span className="inner-small-number">0{i + 1}</span><h2>{heading}</h2><p>{copy}</p></section>)}
          </div>
        </div>
      </section>
      <CTA />
    </InnerPage>
  );
}
