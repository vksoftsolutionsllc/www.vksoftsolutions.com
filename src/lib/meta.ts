import { useEffect } from "react";
import { site } from "../config/site";

const DEFAULT_DESCRIPTION =
  "VK Soft Solutions delivers IT consulting, custom software, AI and data, cloud, enterprise applications and IT staffing for growing businesses across the US and India.";

function setMeta(selector: string, attr: "name" | "property" | "rel", key: string, value: string, valueAttr = "content") {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(attr === "rel" ? "link" : "meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(valueAttr, value);
}

/** Sets the document title, description, canonical URL and social tags for a page. */
export function usePageMeta(title?: string, description = DEFAULT_DESCRIPTION, options: { noindex?: boolean } = {}) {
  useEffect(() => {
    const full = title ? `${title} | ${site.name}` : `${site.name} — IT Consulting, Software & Talent Solutions`;
    document.title = full;
    const url = site.url + window.location.pathname;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", full);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('link[rel="canonical"]', "rel", "canonical", url, "href");
    setMeta('meta[name="robots"]', "name", "robots", options.noindex ? "noindex, follow" : "index, follow");
  }, [title, description, options.noindex]);
}
