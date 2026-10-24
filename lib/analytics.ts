export type AnalyticsEvent = "pageview" | "outbound_click" | "supplier_outbound_click" | "calculator_complete" | "comparison_view" | "comparison_add" | "finder_start" | "finder_result" | "contact_accepted";
export type SupplierClick = { product: string; supplier: string; category: string; language: string };

/** Public catalog identifiers only. Never send query strings, destination URLs or visitor IDs. */
export function supplierClickProperties(input: SupplierClick, pathname: string) {
  if (![input.product, input.supplier, input.category].every(value => /^[a-z0-9][a-z0-9-]{0,99}$/.test(value)) || !["ro", "en"].includes(input.language)) return undefined;
  const source = pathname.split(/[?#]/)[0];
  if (!/^\/[a-z0-9/-]*$/.test(source)) return undefined;
  return { product: input.product, supplier: input.supplier, category: input.category, language: input.language, source_page: source };
}
export const consentKey = "mair-analytics-consent-v1";
export function analyticsConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || "null");
    const age = saved && Date.now() - saved.at;
    return saved && Number.isFinite(saved.at) && age >= 0 && age < 180 * 86400000 && ["accepted", "rejected"].includes(saved.choice) ? saved.choice as string : "unset";
  } catch { return "unset"; }
}
export function trackEvent(name: AnalyticsEvent, supplier?: SupplierClick) {
  if (typeof window === "undefined" || analyticsConsent() !== "accepted" || navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl || navigator.webdriver) return;
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain || domain !== window.location.hostname || /^(localhost|127\.)/.test(domain)) return;
  const path = window.location.pathname.split(/[?#]/)[0];
  const unlocalizedPath = path.replace(/^\/(en|ro)(?=\/|$)/, "") || "/";
  if (/^\/(api|auth|account|login|register|forgot-password|reset-password|dashboard|onboarding|admin|expert|client|supplier)(\/|$)/.test(unlocalizedPath)) return;
  if (name === "contact_accepted" && unlocalizedPath !== "/contact") return;
  const props = name === "supplier_outbound_click" && supplier ? supplierClickProperties(supplier, path) : undefined;
  if (name === "supplier_outbound_click" && !props) return;
  // Direct browser request preserves real visitor IP/UA without a tracking script.
  // Queries, referrers, email, input values and account identifiers are never sent.
  void fetch("https://plausible.io/api/event", {
    method: "POST", headers: { "Content-Type": "text/plain" }, credentials: "omit", referrerPolicy: "no-referrer", keepalive: true,
    // Plausible timestamps event receipt; no additional visitor-level identifier is created.
    body: JSON.stringify({ name, domain, url: window.location.origin + path, ...(props ? { props } : {}) }),
  }).catch(() => {});
}
