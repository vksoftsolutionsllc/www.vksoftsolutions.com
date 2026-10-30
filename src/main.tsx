import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./styles/globals.css";
import "./styles/interior.css";
import "./styles/contact.css";
import "./styles/home.css";
import "./styles/about.css";
import "./styles/site.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

// Fade the preloader once fonts are ready (so split-text headings measure correctly),
// with a hard cap so a slow font never blocks the page.
const preloader = document.getElementById("preloader");
if (preloader) {
  const hide = () => {
    preloader.classList.add("done");
    setTimeout(() => preloader.remove(), 700);
  };
  Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1800))]).then(() => setTimeout(hide, 250));
}
