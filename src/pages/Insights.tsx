import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";
import { CTA, Hero, InnerPage } from "../components/PageBlocks";
import { articles } from "../data/insights";
import { usePageMeta } from "../lib/meta";
import NotFound from "./NotFound";

export function InsightsOverview() {
  usePageMeta("Insights", "Practical guides on AI, technology decisions, cloud and building great technology teams.");
  const [category, setCategory] = useState("All insights");
  const categories = ["All insights", ...new Set(articles.map(a => a.category))];
  const visible = category === "All insights" ? articles : articles.filter(a => a.category === category);
  return (
    <InnerPage>
      <Hero image="/images/analytics.jpg" eyebrow="Ideas & perspectives" title={<>A little more clarity.<br /><span>A better next question.</span></>} copy="Practical guides on AI, technology decisions, cloud and building great teams — to help you start the next conversation with more context." breadcrumbs={[{ label: "Insights" }]} />
      <section className="inner-section inner-section-tight">
        <div className="container">
          <div className="inner-filters" role="group" aria-label="Filter insights by topic">
            {categories.map(c => <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}
          </div>
          <p className="inner-result-count" aria-live="polite">{visible.length} {visible.length === 1 ? "guide" : "guides"}</p>
          <div className="inner-insight-grid">
            {visible.map(a => (
              <Link key={a.slug} to={`/insights/${a.slug}`} className="inner-insight-card">
                <div className="inner-insight-art"><img src={a.image} alt={a.imageAlt} width={1200} height={800} loading="lazy" /></div>
                <div className="inner-insight-body">
                  <div className="inner-insight-meta"><span>{a.category}</span><span>{a.read}</span></div>
                  <h2>{a.title}</h2><p>{a.description}</p>
                  <span className="inner-card-link">Read the guide <ArrowUpRight size={17} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTA title="Have a question of your own?" />
    </InnerPage>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);
  usePageMeta(article?.title, article?.description);
  if (!article) return <NotFound />;
  return (
    <InnerPage>
      <Hero image={article.image} eyebrow={article.category} title={article.title} copy={article.description} breadcrumbs={[{ label: "Insights", href: "/insights" }, { label: article.category }]} compact />
      <section className="inner-section inner-section-tight">
        <div className="container inner-editorial-layout">
          <aside className="inner-editorial-aside">
            <span className="inner-guide-label">Guide</span>
            <p>{article.read}</p>
            <nav aria-label="In this guide">
              <p className="eyebrow">In this guide</p>
              {article.sections.map((s, i) => <a href={`#section-${i + 1}`} key={s.heading}>{s.heading.replace(/^\d\. /, "")}</a>)}
            </nav>
            <Link className="text-link" to="/insights"><ArrowLeft size={16} aria-hidden="true" /> All insights</Link>
          </aside>
          <article className="inner-prose">
            <p className="inner-article-intro">{article.intro}</p>
            {article.sections.map((s, i) => (
              <section id={`section-${i + 1}`} key={s.heading}>
                <h2>{s.heading}</h2>
                {s.paragraphs.map(p => <p key={p}>{p}</p>)}
                {s.bullets && <ul>{s.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
              </section>
            ))}
            <div className="inner-article-end">
              <span className="inner-icon"><Compass size={24} aria-hidden="true" /></span>
              <h2>Apply the questions to your business.</h2>
              <p>Share the situation you’re working through and we’ll suggest a practical next step.</p>
              <Link className="text-link" to="/contact">Talk to an expert <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </article>
        </div>
      </section>
    </InnerPage>
  );
}
