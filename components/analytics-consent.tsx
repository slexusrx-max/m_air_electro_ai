"use client";
import Link from "@/components/localized-link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsConsent, analyticsProvider, saveAnalyticsConsent, syncGoogleMeasurement, trackEvent, type AnalyticsProperties } from "@/lib/analytics";

export function AnalyticsConsent({ ro }: { ro: boolean }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("unset");
  const path = usePathname();
  const pageview = useRef({ path: "", sent: false });
  const provider = analyticsProvider();
  useEffect(() => {
    const sync = () => { const c = analyticsConsent(); setChoice(c); setOpen(c === "unset" && Boolean(analyticsProvider())); syncGoogleMeasurement(); };
    sync(); window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    // Read persisted consent directly: the initial UI state must not cancel an
    // already consented product event queued by a child during hydration.
    syncGoogleMeasurement(path);
  }, [choice, path]);
  useEffect(() => {
    if (pageview.current.path !== path) pageview.current = { path, sent: false };
    if (choice === "accepted" && !pageview.current.sent) pageview.current.sent = trackEvent("pageview");
    const click = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const target = event.target;
      const link = target instanceof Element ? target.closest("a[href]") as HTMLAnchorElement | null : null;
      if (link && link.protocol === "https:" && link.origin !== window.location.origin) {
        const data = link.dataset;
        if (data.supplierProduct && data.supplier && data.supplierCategory && data.supplierLanguage) {
          const properties: AnalyticsProperties = { product: data.supplierProduct, supplier: data.supplier, category: data.supplierCategory, language: data.supplierLanguage,
            kind: data.supplierKind as AnalyticsProperties["kind"], brand: data.supplierBrand, sku: data.supplierSku, tracking: data.trackingStatus as AnalyticsProperties["tracking"] };
          trackEvent("supplier_outbound", properties);
          // A marked, server-resolved affiliate link is a subset of all supplier departures.
          if (data.trackingStatus === "active") trackEvent("affiliate_click", properties);
        } else trackEvent("outbound_click");
      }
    };
    document.addEventListener("click", click);
    document.addEventListener("auxclick", click);
    return () => { document.removeEventListener("click", click); document.removeEventListener("auxclick", click); };
  }, [path, choice]);
  function choose(value: "accepted" | "rejected") {
    const saved = saveAnalyticsConsent(value);
    syncGoogleMeasurement(path, saved);
    setChoice(saved); setOpen(false);
    window.dispatchEvent(new Event("mair-analytics-consent"));
  }
  return <aside className="analytics-settings" data-analytics-provider={provider ?? "none"} aria-label={ro ? "Setări analiză" : "Analytics settings"}>
    <button className="button-outline" onClick={() => setOpen(!open)} aria-expanded={open}>{ro ? "Setări analiză" : "Analytics settings"}</button>
    {open && <div className="content-panel">
      <h2>{ro ? "Analiză opțională" : "Optional analytics"}</h2>
      <p>{provider === "ga4" ? (ro ? "Cu acordul tău, Google Analytics 4 măsoară utilizarea paginilor publice și a instrumentelor. Nu trimitem căutările, valorile introduse sau identificatorii de cont. Funcțiile de publicitate rămân dezactivate. Refuzul nu limitează funcțiile site-ului." : "With your consent, Google Analytics 4 measures public page and tool use. Searches, entered values and account identifiers are excluded. Advertising features remain disabled. Refusal does not limit the website.")
        : provider === "plausible" ? (ro ? "Cu acordul tău, Plausible măsoară utilizarea paginilor publice și a instrumentelor. Refuzul nu limitează funcțiile." : "With your consent, Plausible measures public page and tool use. Refusal does not limit functionality.")
          : (ro ? "Analiza nu este configurată. Nu trimitem evenimente de analiză. Poți folosi toate instrumentele fără acord pentru analiză." : "Analytics is not configured. No analytics events are sent. All tools remain available without analytics consent.")}</p>
      <p><Link href="/privacy">{ro ? "Confidențialitate" : "Privacy"}</Link></p>
      <div className="action-row">
        {provider && <button className="button-outline" onClick={() => choose("accepted")}>Accept</button>}
        <button className="button-outline" onClick={() => choose("rejected")}>{ro ? "Refuz / retrag acordul" : "Reject / withdraw consent"}</button>
      </div>
    </div>}
  </aside>;
}
