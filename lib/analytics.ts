// Legacy names remain accepted for older callers; UI integrations emit one canonical event per action.
export type AnalyticsEvent = "pageview" | "outbound_click" | "supplier_outbound_click" | "calculator_complete" | "comparison_view" | "comparison_add" | "finder_start" | "finder_result" | "contact_accepted"
  | "product_view" | "product_compare_add" | "product_compare_remove" | "calculator_start" | "finder_complete" | "affiliate_click" | "supplier_outbound";
export type SupplierClick = { product: string; supplier: string; category: string; language: string };
export type AnalyticsProperties = { product: string; language: string; supplier?: string; category?: string };
const publicId = /^[a-z0-9][a-z0-9-]{0,99}$/;
const isPublicId = (value: unknown): value is string => typeof value === "string" && publicId.test(value);

/** Allowlist the fields sent for product views and comparisons, including partial comparison context. */
export function productEventProperties(input: AnalyticsProperties, pathname: string) {
  if (!isPublicId(input.product) || !["ro", "en"].includes(input.language)) return undefined;
  if ([input.supplier, input.category].some(value => value !== undefined && !isPublicId(value))) return undefined;
  const source = pathname.split(/[?#]/)[0];
  if (!/^\/[a-z0-9/-]*$/.test(source) || source.length > 250) return undefined;
  return { product: input.product, ...(input.supplier ? { supplier: input.supplier } : {}), ...(input.category ? { category: input.category } : {}), language: input.language, source_page: source };
}

/** Public catalog identifiers only. Never send query strings, destination URLs or visitor IDs. */
export function supplierClickProperties(input: SupplierClick, pathname: string) {
  if (!isPublicId(input.supplier) || !isPublicId(input.category)) return undefined;
  return productEventProperties(input, pathname);
}
export const consentKey = "mair-analytics-consent-v2";
/** Apply the same private-route exclusion to every optional measurement provider. */
export function isPublicMeasurementPath(pathname: string) {
  const path = pathname.split(/[?#]/)[0].replace(/^\/(en|ro)(?=\/|$)/, "") || "/";
  return !/^\/(api|auth|account|login|register|forgot-password|reset-password|dashboard|onboarding|admin|expert|client|supplier)(\/|$)/.test(path);
}
export function analyticsConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || "null");
    const age = saved && Date.now() - saved.at;
    return saved && Number.isFinite(saved.at) && age >= 0 && age < 180 * 86400000 && ["accepted", "rejected"].includes(saved.choice) ? saved.choice as string : "unset";
  } catch { return "unset"; }
}
export function trackEvent(name: AnalyticsEvent, properties?: AnalyticsProperties): boolean {
  if (typeof window === "undefined" || analyticsConsent() !== "accepted" || navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl || navigator.webdriver) return false;
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain || domain !== window.location.hostname || /^(localhost|127\.)/.test(domain)) return false;
  const path = window.location.pathname.split(/[?#]/)[0];
  const unlocalizedPath = path.replace(/^\/(en|ro)(?=\/|$)/, "") || "/";
  if (!isPublicMeasurementPath(path)) return false;
  if (name === "contact_accepted" && unlocalizedPath !== "/contact") return false;
  const supplierEvent = ["supplier_outbound_click", "supplier_outbound", "affiliate_click"].includes(name);
  const productEvent = ["product_view", "product_compare_add", "product_compare_remove"].includes(name);
  const contextEvent = ["calculator_start", "calculator_complete", "finder_start", "finder_complete"].includes(name);
  const props = supplierEvent && properties
    ? supplierClickProperties(properties as SupplierClick, path)
    : productEvent && properties ? productEventProperties(properties, path)
      : contextEvent ? { language: /^\/en(?:\/|$)/.test(path) ? "en" : "ro", source_page: path } : undefined;
  if ((supplierEvent || productEvent) && !props) return false;
  // Direct browser request preserves real visitor IP/UA without a tracking script.
  // Queries, referrers, email, input values and account identifiers are never sent.
  void fetch("https://plausible.io/api/event", {
    method: "POST", headers: { "Content-Type": "text/plain" }, credentials: "omit", referrerPolicy: "no-referrer", keepalive: true,
    // Plausible timestamps event receipt; no additional visitor-level identifier is created.
    body: JSON.stringify({ name, domain, url: window.location.origin + path, ...(props ? { props } : {}) }),
  }).catch(() => {});
  // Means a request was queued, not that the provider received or attributed it.
  return true;
}
