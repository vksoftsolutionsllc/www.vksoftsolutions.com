import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { usePageMeta } from "../lib/meta";
import { services, talent } from "../data/services";
import { industries } from "../data/industries";
import { articles } from "../data/insights";

function MeshBackdrop() {
  const lines = useMemo(() => {
    function point(u: number, v: number) {
      const x = u * 520, y = v * 340, z = 240 * Math.sin(u * 1.15 + v * 0.6);
      const ry = y * Math.cos(0.9) - z * Math.sin(0.9), rz = y * Math.sin(0.9) + z * Math.cos(0.9);
      const rx = x * Math.cos(-0.3) + rz * Math.sin(-0.3), depth = -x * Math.sin(-0.3) + rz * Math.cos(-0.3);
      const p = 1050 / (1250 + depth);
      return [810 + (rx * Math.cos(-0.24) - ry * Math.sin(-0.24)) * p, 440 + (rx * Math.sin(-0.24) + ry * Math.cos(-0.24)) * p];
    }
    const out: string[] = [];
    for (let i = 0; i <= 68; i++) {
      const fixed = -2.8 + (i * 5.6) / 68;
      for (const axis of [0, 1]) {
        let d = "";
        for (let j = 0; j <= 110; j++) {
          const a = -3.5 + (j * 7) / 110;
          const [x, y] = point(axis === 0 ? a : fixed, axis === 0 ? fixed : a);
          d += `${j === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
        }
        out.push(d);
      }
    }
    return out;
  }, []);
  return (
    <svg className="hero-mesh" viewBox="0 0 1440 850" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="mesh-fade"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <mask id="mesh-mask"><rect width="1440" height="850" fill="url(#mesh-fade)" /></mask>
      </defs>
      <g fill="none" stroke="#C89275" strokeWidth=".65" opacity=".38" mask="url(#mesh-mask)">{lines.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

const firstClause = (s: string) => s.split(" — ")[0].replace(/\.?$/, ".");
const solutions = [
  ...services.map(s => ({ ...s, href: `/services/${s.slug}` })),
  ...talent.slice(0, 3).map(s => ({ ...s, href: `/talent/${s.slug}` })),
].map(s => ({ title: s.title, copy: firstClause(s.lead), image: s.image, alt: s.imageAlt, tags: s.capabilities.slice(0, 2).map(c => c.title), href: s.href }));

function SolutionCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const pages = 3;
  function go(p: number) {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(pages - 1, p));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: ((el.scrollWidth - el.clientWidth) * target) / (pages - 1), behavior: reduce ? "instant" : "smooth" });
    setPage(target);
  }
  function onScroll() {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPage(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (pages - 1)));
  }
  return (
    <>
      <div className="solution-track" ref={track} onScroll={onScroll} aria-label="Our solutions">
        {solutions.map(item => (
          <article key={item.title} className="solution-card">
            <Link to={item.href} className="solution-photo"><img src={item.image} alt={item.alt} width={700} height={470} loading="lazy" /></Link>
            <Link to={item.href}><h3>{item.title}</h3></Link>
            <p>{item.copy}</p>
            <div className="solution-tags">{item.tags.map(tag => <Link to={item.href} key={tag}>{tag}</Link>)}</div>
          </article>
        ))}
      </div>
      <div className="carousel-controls">
        {Array.from({ length: pages }, (_, i) => (
          <button key={i} type="button" className={`carousel-dot ${page === i ? "active" : ""}`} aria-label={`Show solutions page ${i + 1}`} aria-pressed={page === i} onClick={() => go(i)} />
        ))}
        <button type="button" className="carousel-arrow" aria-label="Previous solutions" onClick={() => go(page - 1)} disabled={page === 0}><ArrowLeft size={21} /></button>
        <button type="button" className="carousel-arrow" aria-label="Next solutions" onClick={() => go(page + 1)} disabled={page === pages - 1}><ArrowRight size={21} /></button>
      </div>
    </>
  );
}

export default function Home() {
  usePageMeta();
  return (
    <>
      <section className="reference-hero">
        <MeshBackdrop />
        <div className="hero-center">
          <h1><em>In pursuit of</em><strong>PROGRESS</strong></h1>
          <div className="audience-paths">
            <Link to="/contact?kind=hire_talent" className="audience-path companies"><span>For Companies</span><h2>Find Talent &amp;<br />Solutions</h2><ArrowRight size={30} strokeWidth={1} /></Link>
            <Link to="/careers" className="audience-path candidates"><span>For Professionals</span><h2>Find Your<br />Next Role</h2><ArrowRight size={30} strokeWidth={1} /></Link>
          </div>
        </div>
      </section>

      <section className="solutions-section">
        <div className="container">
          <p className="section-intro">Our Suite of Services</p>
          <h2 className="section-title">Customized Solutions</h2>
          <SolutionCarousel />
        </div>
      </section>

      <section className="company-condensed">
        <div className="belief-panel"><p>We believe in <em>what’s possible.</em><br />Together,<br />we bring it to life.</p></div>
        <div className="condensed-grid">
          <div className="condensed-heading">CONNECTED<br />EXPERTISE</div>
          <div><strong>IT</strong><span>Consulting<br />&amp; Advisory</span></div>
          <div><strong>Build</strong><span>Software, AI<br />&amp; Cloud</span></div>
          <div><strong>Talent</strong><span>Staffing &amp;<br />Dedicated Teams</span></div>
        </div>
      </section>

      <section className="human-section">
        <div className="container human-grid">
          <div className="human-copy">
            <p className="section-intro">Creating Human Connection</p>
            <h2>Technology that works.<br />People who<br /><em>make it happen.</em></h2>
            <p>Every business challenge has a human side. VK Soft Solutions brings consulting, engineering and technology talent together around the goals that matter to you.</p>
            <p>Start with a conversation. Define the right approach. Build the next step together — across the US and India.</p>
            <Link to="/about/approach" className="button primary">Discover Our Approach <ArrowRight size={18} /></Link>
          </div>
          <div className="human-photos">
            <img className="human-photo-one" src="/images/consulting.jpg" alt="People discussing ideas in a shared workspace" width={1000} height={667} loading="lazy" />
            <img className="human-photo-two" src="/images/collaboration.jpg" alt="Colleagues working together at a table" width={1000} height={1499} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="industries-section">
        <div className="container industry-grid">
          <div className="industry-copy">
            <h2><em>Innovation Across</em> Industries</h2>
            <p>Explore how consulting, engineering and specialist talent support the challenges and opportunities in your industry.</p>
            <Link to="/industries" className="text-link">Explore Industries <ArrowRight size={18} /></Link>
          </div>
          <div className="industry-accordion">
            {industries.map((item, i) => (
              <details key={item.slug} name="industry-selection" open={i === 0}>
                <summary><Plus size={13} />{item.title}</summary>
                <div className="industry-detail">
                  <img src={item.image} alt={item.imageAlt} width={900} height={550} loading="lazy" />
                  <Link to={`/industries/${item.slug}`}>Explore {item.short.toLowerCase()} <ArrowUpRight size={17} /></Link>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="perspectives-section">
        <div className="container">
          <p className="section-intro">PERSPECTIVES</p>
          <div className="perspectives-heading">
            <h2>Ideas for your next conversation.</h2>
            <Link to="/insights" className="text-link">Explore All Insights <ArrowRight size={17} /></Link>
          </div>
          <div className="perspective-grid">
            {articles.slice(0, 3).map(item => (
              <Link to={`/insights/${item.slug}`} key={item.slug} className="perspective-card">
                <span>{item.category.toUpperCase()}</span><h3>{item.title}</h3><p>{item.description}</p><div>Read the guide <ArrowRight size={20} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-contact">
        <div className="container home-contact-inner">
          <div><p className="section-intro">Let’s Connect</p><h2>What’s your next move?</h2></div>
          <div className="home-contact-actions">
            <Link to="/careers" className="button secondary">Explore Careers <ArrowRight size={19} /></Link>
            <Link to="/contact" className="button primary">Talk to an Expert <ArrowRight size={19} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
