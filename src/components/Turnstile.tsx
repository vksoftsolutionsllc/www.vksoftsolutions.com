import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { env } from "../lib/env";

type RenderOptions = {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};
type TurnstileApi = { render: (el: HTMLElement, o: RenderOptions) => string; reset: (id: string) => void; remove: (id: string) => void };
declare global { interface Window { turnstile?: TurnstileApi } }

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loader: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loader ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable")));
    s.onerror = () => { loader = null; reject(new Error("Turnstile failed to load")); };
    document.head.appendChild(s);
  });
  return loader;
}

export type TurnstileHandle = { reset: () => void };

type Props = {
  action: string;
  onToken: (token: string) => void;
  appearance?: RenderOptions["appearance"];
  size?: RenderOptions["size"];
};

/** Cloudflare Turnstile widget. Calls onToken("") whenever the token expires or errors. */
const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile({ action, onToken, appearance = "always", size = "flexible" }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const callback = useRef(onToken);
  callback.current = onToken;

  useImperativeHandle(ref, () => ({
    reset() {
      callback.current("");
      if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
    },
  }), []);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile().then(api => {
      if (cancelled || !box.current) return;
      widget.current = api.render(box.current, {
        sitekey: env.turnstileSiteKey,
        action,
        theme: "light",
        size,
        appearance,
        callback: t => callback.current(t),
        "expired-callback": () => callback.current(""),
        "error-callback": () => callback.current(""),
      });
    }).catch(() => { /* Server-side check will reject; the form shows that error. */ });
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [action, appearance, size]);

  return <div className="turnstile-box" ref={box} />;
});

export default Turnstile;
