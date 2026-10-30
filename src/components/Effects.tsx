import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { gsap, reducedMotion, scrollToTop, trackCardGlow } from "../lib/motion";

/** Custom cursor: a dot plus a lagging ring that grows over interactive elements. */
export function MagicCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(pointer: fine)").matches || !dot.current || !ring.current) return;
    const d = dot.current, r = ring.current;
    const dx = gsap.quickTo(d, "x", { duration: 0.1 }), dy = gsap.quickTo(d, "y", { duration: 0.1 });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      document.documentElement.classList.add("cursor-ready");
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      trackCardGlow(e);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const textEl = t.closest<HTMLElement>("[data-cursor-text]");
      r.classList.toggle("is-text", Boolean(textEl));
      r.dataset.text = textEl?.dataset.cursorText ?? "";
      r.classList.toggle("is-hover", !textEl && Boolean(t.closest("a,button,summary,select,label,input,textarea")));
    };
    const leave = () => document.documentElement.classList.remove("cursor-ready");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      leave();
    };
  }, []);
  return <><div className="cursor-dot" ref={dot} aria-hidden="true" /><div className="cursor-ring" ref={ring} aria-hidden="true" /></>;
}

/** Back-to-top button with a scroll-progress ring. */
export function BackToTop() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const c = 2 * Math.PI * 24;
  return (
    <button type="button" className={`to-top${progress > 0.08 ? " show" : ""}`} onClick={() => scrollToTop()} aria-label="Back to top">
      <svg className="ring" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24" stroke="rgba(255,255,255,.15)" />
        <circle cx="26" cy="26" r="24" stroke="#8FBAFF" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} strokeLinecap="round" />
      </svg>
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}

/** Infinite horizontal ticker. Content is duplicated so the loop is seamless. */
export function Marquee({ items, icon, className = "", reverse = false, speed = 35 }: { items: string[]; icon?: React.ReactNode; className?: string; reverse?: boolean; speed?: number }) {
  const track = (hidden: boolean) => (
    <div className="marquee-track" aria-hidden={hidden || undefined} style={{ ["--speed" as string]: `${speed}s` }}>
      {items.map((t, i) => <span key={i}>{t}{icon}</span>)}
    </div>
  );
  return <div className={`marquee ${reverse ? "reverse" : ""} ${className}`}>{track(false)}{track(true)}</div>;
}

/** Spinning circular text badge. */
export function CircleText({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="circle-text">
      <svg viewBox="0 0 130 130" aria-hidden="true">
        <defs><path id="circle-path" d="M65,65 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" /></defs>
        <text><textPath href="#circle-path">{text}</textPath></text>
      </svg>
      <span className="circle-core">{children}</span>
    </div>
  );
}

/** Headline words that swap with a per-character flip animation. */
export function RotatingWords({ words, interval = 2800 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (reducedMotion()) return;
    let swap: number;
    const t = window.setInterval(() => {
      setOut(true);
      swap = window.setTimeout(() => { setI(n => (n + 1) % words.length); setOut(false); }, 380);
    }, interval);
    return () => { clearInterval(t); clearTimeout(swap); };
  }, [words.length, interval]);
  const word = words[i];
  return (
    <span className={`hero-rotator${out ? " out" : ""}`} aria-live="off">
      <span className="visually-hidden">{words.join(", ")}</span>
      <span className="word" aria-hidden="true" key={i}>
        {[...word].map((ch, n) => <span className="ch" key={n} style={{ animationDelay: `${n * 0.03}s` }}>{ch === " " ? " " : ch}</span>)}
      </span>
    </span>
  );
}
