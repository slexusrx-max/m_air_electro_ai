"use client";
import Link from "@/components/localized-link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsConsent, consentKey, trackEvent } from "@/lib/analytics";

export function AnalyticsConsent({ ro }: { ro: boolean }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("unset");
  const path = usePathname();
  useEffect(() => {
    const sync = () => { const c = analyticsConsent(); setChoice(c); setOpen(c === "unset"); };
    sync(); window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    const layer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    if (choice !== "accepted" || analyticsConsent() !== "accepted") {
      if (layer) layer.push(["consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }]);
      return;
    }
    if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl || navigator.webdriver) return;
    if (layer && document.querySelector("script[data-mair-google-ads]")) {
      layer.push(["consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "granted" }]);
      return;
    }
    const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer ||= [];
    // Basic consent mode: the Google script is loaded only after explicit consent.
    dataLayer.push(["consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }]);
    dataLayer.push(["consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "granted" }]);
    dataLayer.push(["js", new Date()]);
    dataLayer.push(["config", "AW-18541953196"]);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW-18541953196";
    script.dataset.mairGoogleAds = "true";
    document.head.appendChild(script);
  }, [choice]);
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
  return <aside className="analytics-settings" aria-label={ro ? "Setări analiză" : "Analytics settings"}>
    <button className="button-outline" onClick={() => setOpen(!open)} aria-expanded={open}>{ro ? "Setări analiză" : "Analytics settings"}</button>
    {open && <div className="content-panel">
      <h2>{ro ? "Analiză și măsurarea reclamelor" : "Optional analytics and ads measurement"}</h2>
      <p>{ro ? "Cu acordul tău, Google Ads măsoară vizitele din reclame; Plausible măsoară utilizarea site-ului când este configurat. Refuzul nu limitează funcțiile." : "With your consent, Google Ads measures ad visits; Plausible measures site use when configured. Refusal does not limit functionality."}</p>
      <p><Link href="/privacy">{ro ? "Confidențialitate" : "Privacy"}</Link></p>
      <div className="action-row">
        <button className="button-outline" onClick={() => choose("accepted")}>Accept</button>
        <button className="button-outline" onClick={() => choose("rejected")}>{ro ? "Refuz / retrag acordul" : "Reject / withdraw consent"}</button>
      </div>
    </div>}
  </aside>;
}
