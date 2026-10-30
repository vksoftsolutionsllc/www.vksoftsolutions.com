import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, BadgeCheck, Briefcase, CheckCircle2, Handshake, Quote, Rocket, Sparkle, Users } from "lucide-react";
import { usePageMeta } from "../lib/meta";
import { services, talent } from "../data/services";
import { industries } from "../data/industries";
import { articles } from "../data/insights";
import { CircleText, Marquee, RotatingWords } from "../components/Effects";

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
    for (let i = 0; i <= 48; i++) {
      const fixed = -2.8 + (i * 5.6) / 48;
      for (const axis of [0, 1]) {
        let d = "";
        for (let j = 0; j <= 90; j++) {
          const a = -3.5 + (j * 7) / 90;
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
      <g fill="none" stroke="#8FBAFF" strokeWidth=".6" opacity=".35" mask="url(#mesh-mask)">{lines.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

const tech = [
  ["Jv", "Java & Spring", "Enterprise back ends and APIs"],
  [".N", ".NET & C#", "Business applications on Microsoft stack"],
  ["Re", "React & Angular", "Fast, accessible web front ends"],
  ["Py", "Python & AI", "Data pipelines, ML and generative AI"],
  ["Aw", "AWS · Azure · GCP", "Cloud architecture and migration"],
  ["K8", "Kubernetes & DevOps", "CI/CD, containers and automation"],
  ["Sf", "Salesforce", "Sales, Service and Experience Cloud"],
  ["Wd", "Workday · SAP · ServiceNow", "Enterprise platform expertise"],
];

function IndustrySlider() {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const pages = 3;
  const go = (p: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: ((el.scrollWidth - el.clientWidth) * p) / (pages - 1), behavior: "smooth" });
  };
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPage(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (pages - 1)));
  };
  return (
    <>
      <div className="ind-track" ref={track} onScroll={onScroll}>
        {industries.map(ind => (
          <Link key={ind.slug} to={`/industries/${ind.slug}`} className="ind-card" data-cursor-text="Explore">
            <img src={ind.image} alt={ind.imageAlt} loading="lazy" width={800} height={900} />
            <div className="ind-glass">
              <h3>{ind.short}</h3>
              <p>{ind.intro}</p>
              <div className="tags">{ind.applications.slice(0, 2).map(([t]) => <span key={t}>{t}</span>)}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="slider-dots">
        {Array.from({ length: pages }, (_, i) => <button key={i} type="button" aria-label={`Show industries ${i + 1}`} aria-pressed={page === i} onClick={() => go(i)} />)}
      </div>
    </>
  );
}

export default function Home() {
  usePageMeta();
  return (
    <>
      {/* Hero */}
      <section className="home-hero panel-dark">
        <div className="hero-bg" data-parallax="8" aria-hidden="true" />
        <MeshBackdrop />
        <div className="hero-glow" aria-hidden="true" />
        <div className="container">
          <div className="hero-inner">
            <p className="eyebrow" data-anim="up">Consult • Develop • Innovate</p>
            <h1>
              <span data-anim="chars-3d" style={{ display: "block" }}>We help businesses grow with</span>
              <RotatingWords words={["Smart IT Consulting", "Custom Software", "AI & Data Solutions", "Cloud Platforms", "Expert Tech Talent"]} />
            </h1>
            <p className="hero-copy" data-anim="up">VK Soft Solutions brings together IT consulting, software engineering and technology talent — so you can plan with clarity, build with confidence and hire the right people across the US and India.</p>
            <div className="hero-actions" data-anim="up">
              <Link to="/contact" className="button primary">Start a Project <ArrowUpRight size={18} /></Link>
              <Link to="/contact?kind=hire_talent" className="button ghost">Hire Talent <ArrowUpRight size={18} /></Link>
            </div>
          </div>
          <div className="hero-cards">
            <Link to="/services/it-consulting" className="hero-card"><div><strong>Consult</strong><small>Strategy & advisory</small></div><p>Technology roadmaps, architecture and delivery guidance grounded in your goals.</p></Link>
            <Link to="/services/software-development" className="hero-card"><div><strong>Develop</strong><small>Software, AI & cloud</small></div><p>Web, mobile, data and cloud solutions engineered to last and to change.</p></Link>
            <Link to="/talent" className="hero-card"><div><strong>Innovate</strong><small>Talent & teams</small></div><p>Specialists, contract-to-hire and dedicated teams that ramp up fast.</p></Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container about-grid">
          <div className="about-media">
            <div className="img-reveal"><img src="/images/consulting.jpg" alt="Consultants planning on a whiteboard" width={1000} height={667} loading="lazy" /></div>
            <div className="img-reveal"><img src="/images/engineer.jpg" alt="An engineer working on a laptop" width={800} height={600} loading="lazy" /></div>
            <div className="about-badge" data-anim="up"><strong><span data-count="2">2</span> hubs</strong><span>US-led engagements with India-based delivery</span></div>
          </div>
          <div className="about-copy">
            <p className="eyebrow">About Us</p>
            <h2 data-anim="words">Your trusted partner for technology &amp; talent</h2>
            <p data-anim="up">We help organizations make better technology decisions, build reliable software and find the people to run it. One partner, from first conversation to long-term support.</p>
            <div className="feature-pair">
              <div><span className="icon-badge"><BadgeCheck size={22} /></span><h3>Quality that drives results</h3><p>Clear scope, tested releases and measurable outcomes on every engagement.</p></div>
              <div><span className="icon-badge"><Handshake size={22} /></span><h3>Partnership you can rely on</h3><p>Responsive account management and honest advice, even when it’s the simpler option.</p></div>
            </div>
            <ul className="check-list">
              <li><CheckCircle2 size={19} />Strategy, engineering and staffing under one roof</li>
              <li><CheckCircle2 size={19} />Certified consultants on leading enterprise platforms</li>
              <li><CheckCircle2 size={19} />Flexible contract, contract-to-hire and permanent options</li>
            </ul>
            <div className="about-foot">
              <Link to="/about" className="button primary">More About Us <ArrowUpRight size={18} /></Link>
              <Link to="/careers" className="mini-card"><img src="/images/interview.jpg" alt="" /><div><strong>Looking for a role?</strong><small>Browse open positions →</small></div></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-panel panel-dark">
        <div className="container">
          <div className="section-head split">
            <div><p className="eyebrow">Our Services</p><h2>Technology services that drive real results</h2></div>
            <div><p>From strategy to production, our consultants and engineers deliver solutions that are secure, scalable and built around how your business works.</p><Link to="/services" className="button primary">View All Services <ArrowUpRight size={18} /></Link></div>
          </div>
          <div className="svc-grid">
            {services.map((s, i) => (
              <Link to={`/services/${s.slug}`} className="svc-card" key={s.slug}>
                <span className="svc-num">0{i + 1}</span>
                <span className="icon-badge"><s.icon size={22} /></span>
                <h3>{s.title}</h3>
                <p>{s.lead.split(" — ")[0].replace(/\.?$/, ".")}</p>
                <span className="text-link">Learn More <ArrowUpRight size={16} /></span>
              </Link>
            ))}
          </div>
          <p className="panel-note"><span className="pill">Talent</span>Need people rather than a project? <Link to="/talent">Explore our talent solutions</Link></p>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container why-grid">
          <div>
            <p className="eyebrow">Why Choose Us</p>
            <h2 className="section-title" data-anim="words">Your digital success, built with precision</h2>
            <blockquote className="quote-card">“A company is only as good as the promises it keeps — so we promise only what we can deliver.”<Quote size={44} aria-hidden="true" /></blockquote>
            <div className="why-items">
              <div className="why-item"><span className="icon-badge"><Rocket size={22} /></span><div><h3>Fast, focused starts</h3><p>Short discovery phases and pre-screened talent mean work begins in days, not months.</p></div></div>
              <div className="why-item"><span className="icon-badge"><Users size={22} /></span><div><h3>Experts who fit your team</h3><p>Consultants and engineers who follow your standards and communicate clearly.</p></div></div>
            </div>
            <Link to="/about/approach" className="button primary" style={{ marginTop: 28 }}>Our Approach <ArrowUpRight size={18} /></Link>
          </div>
          <div className="why-media">
            <div className="img-reveal m1"><img src="/images/team.jpg" alt="A team collaborating on laptops" loading="lazy" width={900} height={600} /></div>
            <div className="img-reveal m2"><img src="/images/collaboration.jpg" alt="Colleagues working together" loading="lazy" width={800} height={1100} /></div>
            <div className="why-float" data-anim="up"><strong>US + India delivery</strong><small>Overlapping hours and a single point of contact.</small></div>
          </div>
        </div>
      </section>

      {/* Ribbons */}
      <section className="ribbon-section" aria-label="What we do">
        <img src="/images/workspace.jpg" alt="" data-parallax="6" loading="lazy" />
        <div className="ribbons" aria-hidden="true">
          <Marquee className="ribbon r1" icon={<Sparkle size={20} fill="currentColor" />} items={["IT Consulting", "Software Development", "AI & Data", "Cloud & DevOps", "Enterprise Apps", "Quality Engineering"]} />
          <Marquee className="ribbon r2" reverse icon={<Sparkle size={20} fill="currentColor" />} items={["Staff Augmentation", "Contract-to-Hire", "Direct Hire", "Dedicated Teams", "Scaled Hiring", "Leadership Search"]} />
        </div>
      </section>

      {/* Talent models */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Talent Solutions</p>
            <h2>Flexible ways to bring the right people on board</h2>
            <p>From a single specialist to a complete delivery team — choose the hiring model that fits your timeline, budget and goals.</p>
          </div>
          <div className="model-grid">
            {talent.map((t, i) => (
              <Link to={`/talent/${t.slug}`} key={t.slug} className="model-card">
                <span className="num">0{i + 1}</span>
                <h3>{t.title}</h3>
                <p>{t.short}</p>
              </Link>
            ))}
          </div>
          <p className="inline-cta"><Briefcase size={18} aria-hidden="true" /> Ready to grow your team? <Link to="/contact?kind=hire_talent">Request talent today</Link></p>
        </div>
      </section>

      {/* Numbers */}
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

      {/* Industries */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Industries</p>
            <h2>Innovation across industries</h2>
            <p>Every sector has its own regulations, systems and talent markets. We bring that context to every engagement and every search.</p>
          </div>
          <IndustrySlider />
        </div>
      </section>

      {/* Tech stack */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Our Technology Stack</p>
            <h2>Smart tools fueling scalable solutions</h2>
          </div>
          <div className="tech-grid">
            {tech.map(([mono, name, copy]) => (
              <div className="tech-card" key={name}><span className="mono">{mono}</span><h3>{name}</h3><p>{copy}</p></div>
            ))}
          </div>
          <p className="inline-cta">Let’s build something great together. <Link to="/contact">Get a free consultation</Link></p>
        </div>
      </section>

      {/* Process */}
      <section className="process-panel panel-dark">
        <div className="container">
          <div className="section-head split">
            <div><p className="eyebrow">How We Work</p><h2>A clear process from first call to delivery</h2></div>
            <div><p>Every engagement follows the same simple rhythm, so you always know what happens next.</p><Link to="/about/approach" className="button primary">Our Approach <ArrowUpRight size={18} /></Link></div>
          </div>
          <div className="process-grid">
            {[["Discover", "We listen, ask the right questions and understand your goals, systems and constraints."], ["Plan", "We agree scope, team, timeline and success criteria — with options and honest trade-offs."], ["Deliver", "We build or staff in short, visible iterations with regular demos and reporting."], ["Support", "We stay on for improvements, managed support and knowledge transfer."]].map(([t, c], i) => (
              <div className="process-step" key={t}><span className="n">Step 0{i + 1}</span><h3>{t}</h3><p>{c}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Latest Insights</p>
            <h2>Smart reads for technology leaders</h2>
          </div>
          <div className="blog-grid">
            {articles.slice(0, 3).map(a => (
              <Link to={`/insights/${a.slug}`} key={a.slug} className="blog-card" data-cursor-text="Read">
                <img src={a.image} alt={a.imageAlt} loading="lazy" width={800} height={600} />
                <span className="cat">{a.category}</span>
                <h3>{a.title}</h3>
                <span className="text-link">Read More <ArrowUpRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-panel panel-dark">
        <div className="hero-bg" data-parallax="6" aria-hidden="true" />
        <div className="container cta-grid">
          <div>
            <p className="eyebrow">Contact Us Today</p>
            <h2 data-anim="words">Let’s discuss your project &amp; bring your ideas to life</h2>
            <p>Share your goals with us — our team will guide you to the right approach, people and next step.</p>
            <Link to="/contact" aria-label="Contact us"><CircleText text="Contact Us • Contact Us • Contact Us • "><ArrowUpRight size={22} /></CircleText></Link>
          </div>
          <div className="cta-options">
            <h3>Get In Touch</h3>
            <Link to="/contact" className="cta-option"><span className="icon-badge"><Rocket size={20} /></span><div><strong>Start a project</strong><small>Consulting, software, AI, cloud</small></div><ArrowUpRight size={20} /></Link>
            <Link to="/contact?kind=hire_talent" className="cta-option"><span className="icon-badge"><Users size={20} /></span><div><strong>Hire talent</strong><small>Contract, C2H, direct hire, teams</small></div><ArrowUpRight size={20} /></Link>
            <Link to="/careers" className="cta-option"><span className="icon-badge"><Briefcase size={20} /></span><div><strong>Find a job</strong><small>Browse roles or send your résumé</small></div><ArrowUpRight size={20} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
