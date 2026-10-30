import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { services, talent } from "../data/services";
import { industries } from "../data/industries";
import { aboutPages } from "../data/about";
import { site } from "../config/site";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label={`${site.name} home`}>
      <svg className="brand-mark" viewBox="0 0 32 36" fill="none" aria-hidden="true">
        <path d="M16 2 30 10v16l-14 8L2 26V10L16 2Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="m9 14 7-4 7 4v8l-7 4-7-4v-8Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="m2 10 14 8 14-8M16 18v16" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span>VK Soft<b className="brand-accent"> Solutions</b></span>
    </Link>
  );
}

const menus = [
  { label: "Services", href: "/services", links: [["All services", "/services"], ...services.map(s => [s.title, `/services/${s.slug}`])] },
  { label: "Talent Solutions", href: "/talent", links: [["All talent solutions", "/talent"], ...talent.map(s => [s.title, `/talent/${s.slug}`])] },
  { label: "Industries", href: "/industries", links: [["All industries", "/industries"], ...industries.map(i => [i.short, `/industries/${i.slug}`])] },
  { label: "Who We Are", href: "/about", links: [["About us", "/about"], ...aboutPages.map(a => [a.title, `/about/${a.slug}`])] },
];

export default function Header() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const home = pathname === "/";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    headerRef.current?.querySelectorAll("details[open]").forEach(d => d.removeAttribute("open"));
  }, [pathname]);

  useEffect(() => {
    const closeOutside = (e: MouseEvent) => {
      headerRef.current?.querySelectorAll("details[open]").forEach(d => { if (!d.contains(e.target as Node)) d.removeAttribute("open"); });
    };
    const closeEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      headerRef.current?.querySelectorAll("details[open]").forEach(d => { d.removeAttribute("open"); d.querySelector("summary")?.focus(); });
    };
    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("click", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, []);

  // Only one dropdown open at a time.
  const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!e.currentTarget.open) return;
    headerRef.current?.querySelectorAll("details[open]").forEach(d => { if (d !== e.currentTarget) d.removeAttribute("open"); });
  };

  const cls = ["site-header", home && "home-header", home && !scrolled && !mobileOpen && "on-hero"].filter(Boolean).join(" ");
  return (
    <header className={cls} ref={headerRef}>
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {menus.map(menu => (
            <details className="nav-dropdown" key={menu.label} onToggle={onToggle}>
              <summary className={pathname.startsWith(menu.href) ? "active" : undefined}>{menu.label}<ChevronDown size={10} /></summary>
              <div className="nav-dropdown-menu">{menu.links.map(([label, href]) => <Link to={href} key={href}>{label}</Link>)}</div>
            </details>
          ))}
          <NavLink className="nav-link" to="/insights">Insights</NavLink>
          <NavLink className="nav-link" to="/careers">Careers</NavLink>
        </nav>
        <Link to="/contact" className="button secondary header-cta">Contact Us <ArrowUpRight size={14} /></Link>
        <button className="mobile-menu-toggle" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileOpen && (
        <nav id="mobile-navigation" className="container mobile-menu" aria-label="Mobile navigation">
          <Link to="/">Home</Link>
          {menus.map(menu => (
            <details key={menu.label} className="mobile-group">
              <summary>{menu.label}<ChevronDown size={14} /></summary>
              {menu.links.map(([label, href]) => <Link className="mobile-sub" to={href} key={href}>{label}</Link>)}
            </details>
          ))}
          <Link to="/insights">Insights</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/contact" className="button primary">Talk to an expert <ArrowUpRight size={16} /></Link>
        </nav>
      )}
    </header>
  );
}
