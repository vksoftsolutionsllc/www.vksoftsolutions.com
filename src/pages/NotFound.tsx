import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "../lib/meta";

export default function NotFound() {
  usePageMeta("Page not found", undefined, { noindex: true });
  return (
    <section className="not-found">
      <p className="section-intro">404</p>
      <h1>We couldn’t find that page.</h1>
      <p>The page may have moved, or the link may be out of date. Try one of these instead.</p>
      <div className="not-found-actions">
        <Link to="/" className="button primary">Go home <ArrowRight size={17} /></Link>
        <Link to="/careers" className="button secondary">Browse jobs</Link>
        <Link to="/contact" className="button secondary">Contact us</Link>
      </div>
    </section>
  );
}
