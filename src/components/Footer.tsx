import { Link } from "react-router";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { Brand } from "./Header";
import NewsletterForm from "./NewsletterForm";
import { site } from "../config/site";
import { services, talent } from "../data/services";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>IT consulting, software engineering and technology talent — built around your business.</p>
            <div className="footer-contact">
              {site.email && <a href={`mailto:${site.email}`}><Mail size={14} aria-hidden="true" />{site.email}</a>}
              {site.phone && <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}><Phone size={14} aria-hidden="true" />{site.phone}</a>}
              {site.social.linkedin && <a href={site.social.linkedin} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" />LinkedIn</a>}
            </div>
            {site.offices.map(o => <address key={o.label} className="footer-office"><strong>{o.label}</strong>{o.lines.map(l => <span key={l}>{l}</span>)}</address>)}
          </div>
          <div className="footer-column">
            <h3>Services</h3>
            {services.slice(0, 5).map(s => <Link key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>)}
          </div>
          <div className="footer-column">
            <h3>Talent</h3>
            {talent.slice(0, 4).map(s => <Link key={s.slug} to={`/talent/${s.slug}`}>{s.title}</Link>)}
            <Link to="/careers">Search jobs</Link>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <Link to="/about">About us</Link>
            <Link to="/industries">Industries</Link>
            <Link to="/insights">Insights</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-newsletter"><NewsletterForm /></div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
          <div><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms of use</Link><Link to="/contact">Contact</Link></div>
        </div>
      </div>
    </footer>
  );
}
