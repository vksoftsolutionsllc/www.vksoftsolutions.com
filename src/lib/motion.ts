// Scroll/text animation engine (GSAP + SplitText + ScrollTrigger, Lenis smooth scroll).
// Pages opt in with data-anim attributes; common interior elements are animated automatically.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
const raf = (time: number) => lenis?.raf(time * 1000);

export function startSmoothScroll() {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -110 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
}

export function stopSmoothScroll() {
  gsap.ticker.remove(raf);
  lenis?.destroy();
  lenis = null;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: -110 });
  else el.scrollIntoView();
}

/** Glide an element into view below the fixed header, then give it focus (for form results and errors). */
export function scrollToAndFocus(el: HTMLElement, offset = -130) {
  el.focus({ preventScroll: true });
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
}

// Heading styles (data-anim values):
//   words    — words slide in from the right            (default for section h2)
//   chars    — characters slide in, staggered
//   chars-3d — characters spring in with perspective    (default for page-title h1)
//   scrub    — characters brighten as you scroll past   (default for lead paragraphs)
const SEL = {
  chars3d: '[data-anim="chars-3d"], .inner-hero h1',
  words: '[data-anim="words"], .inner-section h2:not([data-anim]), .section-head h2:not([data-anim]), .inner-cta h2',
  chars: '[data-anim="chars"]',
  scrub: '[data-anim="scrub"], .inner-prose-lead',
  img: '[data-anim="img"] img, .img-reveal img, .inner-service-image img, .inner-industry-panel img, .inner-insight-art img',
  up: [
    '[data-anim="up"]', ".inner-breadcrumb", ".inner-hero .eyebrow", ".inner-lead", ".inner-context-note",
    ".inner-capability-card", ".inner-service-card", ".inner-about-card", ".inner-related-card", ".inner-insight-card",
    ".inner-steps article", ".inner-outcomes li", ".inner-check-list li", ".inner-faq details", ".inner-industry-accordion details",
    ".inner-copy p", ".inner-prose > section", ".inner-section-heading > p", ".inner-empty-state", ".inner-policy-notice",
    ".section-head > p", ".section-head .button", ".hero-card", ".feature-pair > div", ".check-list li", ".about-foot",
    ".svc-card", ".model-card", ".stat", ".ind-card", ".tech-card", ".process-step", ".blog-card", ".quote-card", ".why-item",
    ".cta-options", ".contact-intro > *", ".contact-form-card", ".job-filters",
    ".mv-card", ".pillar-card", ".timeline li", ".where-card", ".about-link-card", ".practice-list li", ".practice-quote",
    ".legal-summary-card", ".legal-toc", ".legal-body > section", ".legal-contact", ".about-subnav",
  ].join(","),
};

function split(el: HTMLElement, splits: SplitText[]) {
  const s = new SplitText(el, { type: "lines,words,chars", linesClass: "split-line" });
  splits.push(s);
  return s;
}

/** Wire up animations inside `root`. Returns a cleanup that restores the DOM. */
export function animatePage(root: HTMLElement): () => void {
  if (reducedMotion()) return () => {};
  const splits: SplitText[] = [];
  // On first load, start after the preloader has faded.
  const intro = document.getElementById("preloader") ? 0.9 : 0;
  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>(SEL.chars3d).forEach(el => {
      const s = split(el, splits);
      gsap.set(el, { perspective: 400 });
      gsap.from(s.chars, { opacity: 0, x: 50, rotateX: -40, duration: 1, ease: "back.out(1.7)", stagger: 0.02, delay: 0.1 + intro, scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    root.querySelectorAll<HTMLElement>(SEL.words).forEach(el => {
      const s = split(el, splits);
      gsap.from(s.words, { x: 20, autoAlpha: 0, duration: 1, stagger: 0.05, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
    root.querySelectorAll<HTMLElement>(SEL.chars).forEach(el => {
      const s = split(el, splits);
      gsap.from(s.chars, { x: 20, autoAlpha: 0, duration: 1, stagger: 0.03, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
    root.querySelectorAll<HTMLElement>(SEL.scrub).forEach(el => {
      const s = new SplitText(el, { type: "words,chars" });
      splits.push(s);
      gsap.fromTo(s.chars, { opacity: 0.25, x: -7 }, { opacity: 1, x: 0, stagger: 0.2, ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: 1 } });
    });
    root.querySelectorAll<HTMLElement>(SEL.img).forEach(img => {
      gsap.fromTo(img, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power2.out", scrollTrigger: { trigger: img, start: "top 90%" } });
    });

    const ups = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(SEL.up));
    if (ups.length) {
      gsap.set(ups, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(ups, {
        start: "top 92%",
        onEnter: batch => gsap.to(batch, { delay: intro, autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true, clearProps: "transform" }),
      });
    }

    root.querySelectorAll<HTMLElement>("[data-parallax]").forEach(el => {
      gsap.fromTo(el, { yPercent: -Number(el.dataset.parallax || 8) }, { yPercent: Number(el.dataset.parallax || 8), ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    root.querySelectorAll<HTMLElement>("[data-count]").forEach(el => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? "";
      const state = { v: 0 };
      el.textContent = `0${suffix}`;
      gsap.to(state, { v: end, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%" }, onUpdate: () => { el.textContent = `${Math.round(state.v)}${suffix}`; } });
    });
  }, root);

  // Late-loading images change layout; recalculate trigger positions.
  const refresh = () => ScrollTrigger.refresh();
  const imgs = Array.from(root.querySelectorAll("img")).filter(i => !i.complete);
  imgs.forEach(i => i.addEventListener("load", refresh, { once: true }));

  return () => {
    imgs.forEach(i => i.removeEventListener("load", refresh));
    ctx.revert();
    splits.forEach(s => s.revert());
  };
}

/** Pointer-following glow on dark service cards. */
export function trackCardGlow(e: PointerEvent) {
  const card = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(".svc-card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export { gsap, ScrollTrigger };
