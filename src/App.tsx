import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BackToTop, MagicCursor } from "./components/Effects";
import { animatePage, scrollToElement, scrollToTop, startSmoothScroll, stopSmoothScroll } from "./lib/motion";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { OfferingDetail, OfferingsOverview } from "./pages/Offerings";
import { IndustriesOverview, IndustryDetail } from "./pages/Industries";
import { AboutDetail, AboutOverview } from "./pages/About";
import { ArticlePage, InsightsOverview } from "./pages/Insights";
import { CareersPage, GeneralApplicationPage, JobDetailPage } from "./pages/Careers";
import { PrivacyPage, TermsPage } from "./pages/Legal";

// The admin panel (and supabase-js + recharts) only loads for /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"));

/** Remounts each route (key = pathname) so SplitText never fights React over DOM it rendered. */
function AnimatedOutlet() {
  const { pathname, hash } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) scrollToElement(el);
    } else scrollToTop();
  }, [pathname, hash]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cleanup = () => {};
    let cancelled = false;
    // Split lines only after web fonts are ready, otherwise line breaks are wrong.
    if (document.fonts.status === "loaded") cleanup = animatePage(root);
    else document.fonts.ready.then(() => { if (!cancelled) cleanup = animatePage(root); });
    return () => { cancelled = true; cleanup(); };
  }, [pathname]);

  return <div ref={ref} key={pathname}><Outlet /></div>;
}

function SiteLayout() {
  useEffect(() => {
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content"><AnimatedOutlet /></main>
      <Footer />
      <BackToTop />
      <MagicCursor />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<div className="admin-boot">Loading admin…</div>}><AdminApp /></Suspense>} />
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<OfferingsOverview section="services" />} />
        <Route path="services/:slug" element={<OfferingDetail section="services" />} />
        <Route path="talent" element={<OfferingsOverview section="talent" />} />
        <Route path="talent/:slug" element={<OfferingDetail section="talent" />} />
        <Route path="industries" element={<IndustriesOverview />} />
        <Route path="industries/:slug" element={<IndustryDetail />} />
        <Route path="about" element={<AboutOverview />} />
        <Route path="about/:slug" element={<AboutDetail />} />
        <Route path="insights" element={<InsightsOverview />} />
        <Route path="insights/:slug" element={<ArticlePage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="careers/apply" element={<GeneralApplicationPage />} />
        <Route path="careers/:slug" element={<JobDetailPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
