"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsConsent, consentKey, trackEvent } from "@/lib/analytics";

export function AnalyticsConsent({ ro }: { ro: boolean }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("unset");
  const path = usePathname();
  useEffect(() => {
    const sync = () => { const c = analyticsConsent(); setChoice(c); setOpen(c === "unset" && Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN)); };
    sync(); window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (choice === "accepted") trackEvent("pageview");
    const click = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const target = event.target;
      const link = target instanceof Element ? target.closest("a[href]") as HTMLAnchorElement | null : null;
      if (link && link.protocol === "https:" && link.origin !== window.location.origin) {
        const data = link.dataset;
        if (data.supplierProduct && data.supplier && data.supplierCategory && data.supplierLanguage) {
          trackEvent("supplier_outbound_click", { product: data.supplierProduct, supplier: data.supplier, category: data.supplierCategory, language: data.supplierLanguage });
        } else trackEvent("outbound_click");
      }
    };
    document.addEventListener("click", click);
    document.addEventListener("auxclick", click);
    return () => { document.removeEventListener("click", click); document.removeEventListener("auxclick", click); };
  }, [path, choice]);
  function choose(value: string) {
    try { localStorage.setItem(consentKey, JSON.stringify({ choice: value, at: Date.now() })); } catch { /* No persistent storage means no tracking. */ }
    setChoice(value); setOpen(false);
  }
  const configured = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
  return <aside className="analytics-settings" aria-label={ro ? "Setări analiză" : "Analytics settings"}>
    <button className="button-outline" onClick={() => setOpen(!open)} aria-expanded={open}>{ro ? "Setări analiză" : "Analytics settings"}</button>
    {open && <div className="content-panel">
      <h2>{ro ? "Analiză opțională" : "Optional analytics"}</h2>
      <p>{configured ? (ro ? "Cu acordul tău, Plausible măsoară vizitele și utilizarea instrumentelor. Refuzul nu limitează funcțiile." : "With your consent, Plausible measures visits and tool use. Refusal does not limit functionality.") : (ro ? "Analiza nu este configurată. Nu trimitem evenimente de analiză." : "Analytics is not configured. No analytics events are sent.")}</p>
      <p><Link href="/privacy">{ro ? "Confidențialitate" : "Privacy"}</Link></p>
      <div className="action-row">
        {configured && <button className="button-outline" onClick={() => choose("accepted")}>{ro ? "Accept" : "Accept"}</button>}
        <button className="button-outline" onClick={() => choose("rejected")}>{ro ? "Refuz / retrag acordul" : "Reject / withdraw consent"}</button>
      </div>
    </div>}
  </aside>;
}
