import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { services, talent } from "../data/services";
import { industries } from "../data/industries";
import { aboutPages } from "../data/about";
import { site } from "../config/site";

export function Brand({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Link to="/" className="brand" aria-label={`${site.name} home`}>
      <img src={tone === "light" ? "/logo-white.png" : "/logo.png"} alt={`${site.name} — Consult • Develop • Innovate`} width={970} height={175} />
    </Link>
  );
}

const menus = [
  { label: "Services", href: "/services", links: [["All services", "/services"], ...services.map(s => [s.title, `/services/${s.slug}`])] },
  { label: "Talent Solutions", href: "/talent", links: [["All talent solutions", "/talent"], ...talent.map(s => [s.title, `/talent/${s.slug}`])] },
  { label: "Industries", href: "/industries", links: [["All industries", "/industries"], ...industries.map(i => [i.short, `/industries/${i.slug}`])] },
  { label: "About Us", href: "/about", links: [["About us", "/about"], ...aboutPages.map(a => [a.title, `/about/${a.slug}`])] },
];

export default function Header() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Solid after 60px; hide while scrolling down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > 300 && y > last + 4);
      if (y < last - 4 || y <= 300) setHidden(false);
      last = y;
    };
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
      headerRef.current?.querySelectorAll(".nav-dropdown[open]").forEach(d => { if (!d.contains(e.target as Node)) d.removeAttribute("open"); });
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

  const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!e.currentTarget.open) return;
    headerRef.current?.querySelectorAll(".nav-dropdown[open]").forEach(d => { if (d !== e.currentTarget) d.removeAttribute("open"); });
  };

  const cls = ["site-header", scrolled && "is-scrolled", hidden && !mobileOpen && "is-hidden"].filter(Boolean).join(" ");
  return (
    <header className={cls} ref={headerRef}>
      <div className="container">
        <div className="header-bar">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink className="nav-link" to="/" end>Home</NavLink>
            {menus.map(menu => (
              <details className="nav-dropdown" key={menu.label} onToggle={onToggle}>
                <summary className={pathname.startsWith(menu.href) ? "active" : undefined}>{menu.label}<ChevronDown size={14} /></summary>
                <div className="nav-dropdown-menu" data-lenis-prevent>{menu.links.map(([label, href]) => <Link to={href} key={href}>{label}</Link>)}</div>
              </details>
            ))}
            <NavLink className="nav-link" to="/insights">Insights</NavLink>
            <NavLink className="nav-link" to="/careers">Careers</NavLink>
          </nav>
          <Link to="/contact" className="button primary header-cta">Contact Us <ArrowUpRight size={17} /></Link>
          <button className="mobile-menu-toggle" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && (
          <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation" data-lenis-prevent>
            <Link to="/">Home</Link>
            {menus.map(menu => (
              <details key={menu.label} className="mobile-group">
                <summary>{menu.label}<ChevronDown size={16} /></summary>
                {menu.links.map(([label, href]) => <Link className="mobile-sub" to={href} key={href}>{label}</Link>)}
              </details>
            ))}
            <Link to="/insights">Insights</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact" className="button primary">Contact Us <ArrowUpRight size={16} /></Link>
          </nav>
        )}
      </div>
    </header>
  );
}
