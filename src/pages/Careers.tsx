import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, Briefcase, Clock, MapPin, Search, Users } from "lucide-react";
import { CTA, FAQ, Hero, InnerPage, SignalPanel } from "../components/PageBlocks";
import ApplicationForm from "../components/ApplicationForm";
import { fetchJob, fetchJobs, type Job } from "../lib/jobs";
import { usePageMeta } from "../lib/meta";
import NotFound from "./NotFound";

function useJobs() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetchJobs().then(setJobs).catch(() => { setFailed(true); setJobs([]); });
  }, []);
  return { jobs, failed };
}

function JobMeta({ job }: { job: Job }) {
  return (
    <ul className="job-meta">
      <li><MapPin size={14} aria-hidden="true" />{job.location}</li>
      <li><Briefcase size={14} aria-hidden="true" />{job.employment_type}</li>
      {job.experience && <li><Clock size={14} aria-hidden="true" />{job.experience}</li>}
    </ul>
  );
}

export function CareersPage() {
  usePageMeta("Careers", "Explore open technology roles with VK Soft Solutions — contract, contract-to-hire and full-time positions across the US and India.");
  const { jobs, failed } = useJobs();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [type, setType] = useState("All");
  const departments = useMemo(() => ["All", ...new Set((jobs ?? []).map(j => j.department))], [jobs]);
  const types = useMemo(() => ["All", ...new Set((jobs ?? []).map(j => j.employment_type))], [jobs]);
  const visible = (jobs ?? []).filter(j =>
    (dept === "All" || j.department === dept) && (type === "All" || j.employment_type === type) &&
    (!q || `${j.title} ${j.location} ${j.summary} ${j.requirements.join(" ")}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <InnerPage>
      <Hero eyebrow="Careers" title={<>Good work starts<br /><span>with good people.</span></>} copy="Find your next role in software, data, cloud, QA and enterprise applications — on contract, contract-to-hire or full-time, with clients across the US and India." breadcrumbs={[{ label: "Careers" }]}>
        <SignalPanel label="Your next opportunity" caption={<>Search open roles,<br />or send us your résumé.</>} index="Contract / C2H / Full-time" />
      </Hero>
      <section className="inner-section inner-section-tight" id="openings">
        <div className="container">
          <div className="inner-section-heading"><div><p className="eyebrow">Open positions</p><h2>Find your next role.</h2></div><p>Don’t see the right fit? Send a general application and we’ll match you with future openings.</p></div>
          <div className="job-filters">
            <label className="job-search"><Search size={16} aria-hidden="true" /><span className="visually-hidden">Search jobs</span><input type="search" placeholder="Search title, skill or location" value={q} onChange={e => setQ(e.target.value)} /></label>
            <label><span className="visually-hidden">Department</span><select value={dept} onChange={e => setDept(e.target.value)}>{departments.map(d => <option key={d} value={d}>{d === "All" ? "All departments" : d}</option>)}</select></label>
            <label><span className="visually-hidden">Job type</span><select value={type} onChange={e => setType(e.target.value)}>{types.map(t => <option key={t} value={t}>{t === "All" ? "All job types" : t}</option>)}</select></label>
          </div>
          {jobs === null ? (
            <div className="job-list" aria-busy="true">{[0, 1, 2].map(i => <div key={i} className="job-card skeleton" />)}</div>
          ) : visible.length ? (
            <>
              <p className="inner-result-count" aria-live="polite">{visible.length} open {visible.length === 1 ? "position" : "positions"}</p>
              <div className="job-list">
                {visible.map(j => (
                  <Link to={`/careers/${j.slug}`} className="job-card" key={j.id}>
                    <div>
                      <span className="job-dept">{j.department}</span>
                      <h3>{j.title}</h3>
                      <JobMeta job={j} />
                      <p>{j.summary}</p>
                    </div>
                    <span className="inner-card-link">View &amp; apply <ArrowUpRight size={17} aria-hidden="true" /></span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="inner-empty-state">
              <div className="inner-icon"><Users size={29} strokeWidth={1.4} aria-hidden="true" /></div>
              <div>
                <h3>{failed ? "We couldn’t load openings right now." : jobs.length ? "No roles match your filters." : "No openings are posted right now."}</h3>
                <p>{failed ? "Please refresh the page in a moment." : "We’re always meeting great people. Send a general application and our recruiters will reach out when a matching role opens."}</p>
                <Link to="/careers/apply" className="button primary">Send your résumé <ArrowUpRight size={17} aria-hidden="true" /></Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="inner-section inner-surface">
        <div className="container inner-split">
          <div><p className="eyebrow">Why work with us</p><h2>Support at every<br />step of your career.</h2></div>
          <div>
            <ul className="inner-check-list">
              {["Roles with established clients across industries", "A recruiter who knows the role — and keeps you informed", "Contract, contract-to-hire and full-time options", "Onboarding, payroll and benefits handled for our consultants", "Opportunities in the US and India"].map(t => <li key={t}><ArrowUpRight size={20} aria-hidden="true" />{t}</li>)}
            </ul>
            <Link to="/careers/apply" className="button primary">Submit a general application <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <FAQ items={[
        ["How long does the process take?", "It depends on the role and client, but we aim to give you an update within a week of applying and keep you informed at each stage."],
        ["Do you sponsor visas?", "Some roles support H-1B transfers or sponsorship. Eligibility is listed with each role or confirmed by your recruiter."],
        ["Will you share my résumé without asking?", "No. We discuss each opportunity with you before submitting your profile to a client."],
      ]} />
      <CTA to="/contact?kind=hire_talent" title="Hiring? We can help." copy="Tell us about the roles you need to fill and we’ll share relevant, pre-screened candidates." label="Request talent" />
    </InnerPage>
  );
}

export function JobDetailPage() {
  const { slug = "" } = useParams();
  const [job, setJob] = useState<Job | null | undefined>(undefined);
  useEffect(() => { fetchJob(slug).then(setJob).catch(() => setJob(null)); }, [slug]);
  usePageMeta(job?.title ?? (job === null ? "Job not found" : "Careers"), job?.summary);

  if (job === null) return <NotFound />;
  if (!job) return <InnerPage><section className="inner-hero"><div className="container"><div className="job-card skeleton" style={{ height: 240 }} /></div></section></InnerPage>;

  const posting = {
    "@context": "https://schema.org", "@type": "JobPosting", title: job.title, description: `${job.summary}\n${job.responsibilities.join("\n")}\n${job.requirements.join("\n")}`,
    datePosted: job.created_at.slice(0, 10), employmentType: job.employment_type.toUpperCase().replace(/[^A-Z]+/g, "_"),
    hiringOrganization: { "@type": "Organization", name: "VK Soft Solutions", sameAs: "https://www.vksoftsolutions.com" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } },
  };

  return (
    <InnerPage>
      <script type="application/ld+json">{JSON.stringify(posting)}</script>
      <Hero eyebrow={job.department} title={job.title} copy={job.summary} breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: job.title }]} compact />
      <section className="inner-section inner-section-tight">
        <div className="container job-detail-layout">
          <article className="inner-prose">
            <JobMeta job={job} />
            {job.responsibilities.length > 0 && <section><h2>What you’ll do</h2><ul>{job.responsibilities.map(r => <li key={r}>{r}</li>)}</ul></section>}
            {job.requirements.length > 0 && <section><h2>What you’ll bring</h2><ul>{job.requirements.map(r => <li key={r}>{r}</li>)}</ul></section>}
            <section><h2>Equal opportunity</h2><p>VK Soft Solutions is an equal opportunity employer and considers all qualified applicants without regard to any protected characteristic.</p></section>
            <Link className="text-link" to="/careers"><ArrowLeft size={16} aria-hidden="true" /> All open positions</Link>
          </article>
          <ApplicationForm jobId={job.id} jobTitle={job.title} />
        </div>
      </section>
    </InnerPage>
  );
}

export function GeneralApplicationPage() {
  usePageMeta("Submit Your Résumé", "Send your résumé to VK Soft Solutions and we’ll match you with current and future technology roles.");
  return (
    <InnerPage>
      <Hero eyebrow="Careers" title={<>Send us your résumé.<br /><span>We’ll find the fit.</span></>} copy="Our recruiters review every application and reach out when a role matches your skills and goals — often before it’s publicly posted." breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: "Submit résumé" }]} compact />
      <section className="inner-section inner-section-tight">
        <div className="container job-detail-layout">
          <div className="inner-prose">
            <section><h2>What happens next</h2><ul><li>A recruiter reviews your profile, usually within a few business days.</li><li>If there’s a match, we’ll call to discuss the role, client and expectations.</li><li>We only submit your résumé to a client with your agreement.</li></ul></section>
            <Link className="text-link" to="/careers"><ArrowLeft size={16} aria-hidden="true" /> View open positions</Link>
          </div>
          <ApplicationForm jobTitle="General application" />
        </div>
      </section>
    </InnerPage>
  );
}
