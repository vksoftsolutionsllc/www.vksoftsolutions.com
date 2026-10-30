import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, CalendarDays, FileText, Info, Mail, MapPin, Phone } from "lucide-react";
import { Hero, InnerPage } from "../components/PageBlocks";
import { usePageMeta } from "../lib/meta";
import { scrollToElement } from "../lib/motion";
import { fullAddress, site, telHref } from "../config/site";
import { privacy, terms, type LegalDoc } from "../data/legal";

/** Highlights the table-of-contents entry for the section currently in view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    // The last section whose heading has passed the reading line (~35% down) wins; before that, the first.
    const update = () => {
      let current = ids[0];
      const line = Math.max(200, window.innerHeight * 0.35);
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ids]);
  return active;
}

function LegalPage({ doc, other }: { doc: LegalDoc; other: { label: string; to: string } }) {
  const ids = useMemo(() => doc.sections.map(s => s.id), [doc]);
  const active = useActiveSection(ids);
  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) { scrollToElement(el); history.replaceState(null, "", `#${id}`); }
  };

  return (
    <InnerPage>
      <Hero image="/images/architecture.jpg" eyebrow="Legal" title={`${doc.title}.`} copy={doc.intro} breadcrumbs={[{ label: doc.title }]} compact />

      <section className="inner-section">
        <div className="container">
          <div className="legal-meta" data-anim="up">
            <span><CalendarDays size={16} aria-hidden="true" />Last updated: {doc.updated}</span>
            <span><FileText size={16} aria-hidden="true" />{doc.sections.length} sections</span>
            <Link to={other.to}>{other.label} <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="legal-summary">
            {doc.summary.map((s, i) => (
              <div className="legal-summary-card" key={s.title}><span>0{i + 1}</span><h2 data-anim="none">{s.title}</h2><p>{s.copy}</p></div>
            ))}
          </div>

          <div className="legal-layout">
            <aside className="legal-toc" aria-label="On this page">
              <p className="eyebrow">On this page</p>
              <ol>
                {doc.sections.map((s, i) => (
                  <li key={s.id}><a href={`#${s.id}`} onClick={e => jump(e, s.id)} aria-current={active === s.id ? "true" : undefined}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>
                ))}
              </ol>
            </aside>
            <article className="legal-body">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id}>
                  <h2 data-anim="none"><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>
                  {s.blocks.map((b, j) =>
                    typeof b === "string" ? <p key={j}>{b}</p>
                      : "list" in b ? <ul key={j}>{b.list.map(li => <li key={li}>{li}</li>)}</ul>
                      : <p key={j} className="legal-note"><Info size={18} aria-hidden="true" />{b.note}</p>,
                  )}
                </section>
              ))}
              <div className="legal-contact">
                <div>
                  <p className="eyebrow">Questions?</p>
                  <h2>We’re happy to help.</h2>
                  <p>Contact us about our {doc.title} or any request about your information.</p>
                </div>
                <ul>
                  <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${site.email}`}>{site.email}</a></li>
                  <li><Phone size={18} aria-hidden="true" /><a href={telHref}>{site.phone}</a></li>
                  <li><MapPin size={18} aria-hidden="true" /><span>{fullAddress}</span></li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>
    </InnerPage>
  );
}

export function PrivacyPage() {
  usePageMeta("Privacy Policy", `How ${site.name} collects, uses, shares and protects personal information.`);
  return <LegalPage doc={privacy} other={{ label: "Terms of Use", to: "/terms" }} />;
}

export function TermsPage() {
  usePageMeta("Terms of Use", `The terms that apply to your use of the ${site.name} website.`);
  return <LegalPage doc={terms} other={{ label: "Privacy Policy", to: "/privacy" }} />;
}
