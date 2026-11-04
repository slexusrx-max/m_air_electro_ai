// Legacy names remain accepted for older callers; UI integrations emit one canonical event per action.
export type AnalyticsEvent = "pageview" | "outbound_click" | "supplier_outbound_click" | "calculator_complete" | "comparison_view" | "comparison_add" | "finder_start" | "finder_result" | "contact_accepted"
  | "product_view" | "product_compare_add" | "product_compare_remove" | "calculator_start" | "finder_complete" | "affiliate_click" | "supplier_outbound";
export type SupplierClick = { product: string; supplier: string; category: string; language: string };
export type AnalyticsProperties = { product: string; language: string; supplier?: string; category?: string; kind?: "product" | "equipment-class"; brand?: string; sku?: string; tracking?: "active" | "ordinary" };
const publicId = /^[a-z0-9][a-z0-9-]{0,99}$/;
const isPublicId = (value: unknown): value is string => typeof value === "string" && publicId.test(value);

/** Allowlist the fields sent for product views and comparisons, including partial comparison context. */
export function productEventProperties(input: AnalyticsProperties, pathname: string) {
  if (!isPublicId(input.product) || !["ro", "en"].includes(input.language)) return undefined;
  if ([input.supplier, input.category].some(value => value !== undefined && !isPublicId(value))) return undefined;
  if (input.kind !== undefined && !["product", "equipment-class"].includes(input.kind)) return undefined;
  if (input.brand !== undefined && !["Renogy", "Waterdrop", "PECRON", "BLUETTI"].includes(input.brand)) return undefined;
  if (input.sku !== undefined && !/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(input.sku)) return undefined;
  if (input.tracking !== undefined && !["active", "ordinary"].includes(input.tracking)) return undefined;
  const source = pathname.split(/[?#]/)[0];
  if (!/^\/[a-z0-9/-]*$/.test(source) || source.length > 250) return undefined;
  return { product: input.product, ...(input.supplier ? { supplier: input.supplier } : {}), ...(input.category ? { category: input.category } : {}),
    ...(input.kind ? { kind: input.kind } : {}), ...(input.brand ? { brand: input.brand } : {}), ...(input.sku ? { sku: input.sku } : {}), ...(input.tracking ? { tracking: input.tracking } : {}),
    language: input.language, source_page: source };
}

/** Public catalog identifiers only. Never send query strings, destination URLs or visitor IDs. */
export function supplierClickProperties(input: SupplierClick, pathname: string) {
  if (!isPublicId(input.supplier) || !isPublicId(input.category)) return undefined;
  return productEventProperties(input, pathname);
}
// v2 disclosed Ads/Plausible, not GA4. Never silently migrate its acceptance.
export const consentKey = "mair-analytics-consent-v3";
let consentBlockedInDocument = false;
export function gaMeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id && /^G-[A-Z0-9]{10}$/.test(id) && !["G-XXXXXXXXXX", "G-0000000000"].includes(id) ? id : null;
}
export function analyticsProvider(): "ga4" | "plausible" | null {
  if (gaMeasurementId()) return "ga4";
  return process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN === "mairelectroai.com" ? "plausible" : null;
}
const acquisitionHosts = new Set([
  "google.com", "www.google.com", "google.ro", "www.google.ro", "google.de", "www.google.de", "google.hu", "www.google.hu", "google.co.uk", "www.google.co.uk",
  "bing.com", "www.bing.com", "duckduckgo.com", "www.duckduckgo.com", "facebook.com", "www.facebook.com", "m.facebook.com", "l.facebook.com", "lm.facebook.com",
  "instagram.com", "www.instagram.com", "l.instagram.com", "youtube.com", "www.youtube.com", "t.co",
]);
/** Recognized acquisition origin only; no arbitrary referrer paths, identifiers or UTM values. */
export function safeAcquisitionReferrer(value?: string) {
  try {
    if (!value) return "";
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port && acquisitionHosts.has(url.hostname) ? `${url.origin}/` : "";
  } catch { return ""; }
}
/** Apply the same private-route exclusion to every optional measurement provider. */
export function isPublicMeasurementPath(pathname: string) {
  const path = pathname.split(/[?#]/)[0].replace(/^\/(en|ro)(?=\/|$)/, "") || "/";
  return !/^\/(api|auth|account|login|register|forgot-password|reset-password|dashboard|onboarding|admin|expert|client|supplier|documents|assistant|diagnostics|energy-ai|my-home)(\/|$)/.test(path);
}
export function analyticsConsent() {
  if (consentBlockedInDocument) return "rejected";
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || "null");
    const age = saved && Date.now() - saved.at;
    if (!saved || !Number.isFinite(saved.at) || age < 0 || age >= 180 * 86400000) return "unset";
    if (saved.choice === "rejected") return "rejected";
    const provider = analyticsProvider();
    return saved.choice === "accepted" && provider && saved.provider === provider ? "accepted" : "unset";
  } catch { return "unset"; }
}
/** A failed persistence write must never leave an earlier acceptance active in this tab. */
export function saveAnalyticsConsent(choice: "accepted" | "rejected") {
  const provider = analyticsProvider();
  if (choice === "accepted" && !provider) return "unset";
  try {
    localStorage.setItem(consentKey, JSON.stringify({ choice, at: Date.now(), ...(choice === "accepted" ? { provider } : {}) }));
    consentBlockedInDocument = false;
  } catch {
    consentBlockedInDocument = true;
    // Best effort: remove an older acceptance so a reload cannot restore it.
    try { localStorage.removeItem(consentKey); } catch { /* The in-document denial still applies. */ }
  }
  return analyticsConsent();
}

function measurementAllowed() {
  return typeof window !== "undefined" && analyticsConsent() === "accepted" && window.location.origin === "https://mairelectroai.com"
    && navigator.doNotTrack !== "1" && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl && !navigator.webdriver;
}
function publicPage(pathname: string) {
  const path = pathname.split(/[?#]/)[0];
  return /^\/[a-z0-9/-]*$/.test(path) && path.length <= 250 && isPublicMeasurementPath(path) ? { path, url: `https://mairelectroai.com${path}` } : null;
}
type MeasurementWindow = Window & { dataLayer?: unknown[] };
function googleCommand(...args: unknown[]) {
  void args;
  const target = window as MeasurementWindow;
  // Google's command queue consumes Arguments objects, not data-layer event arrays.
  // eslint-disable-next-line prefer-rest-params -- Match the documented gtag queue protocol.
  (target.dataLayer ||= []).push(arguments);
}
const deniedConsent = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" };
function discardQueuedGaEvents(id: string) {
  const queue = (window as MeasurementWindow).dataLayer;
  if (!queue) return;
  for (let i = queue.length - 1; i >= 0; i--) {
    const command = queue[i] as { 0?: unknown; 2?: { send_to?: unknown } } | null;
    if (command?.[0] === "event" && command[2]?.send_to === id) queue.splice(i, 1);
  }
}
/** One GA4-only loader. Missing/invalid IDs never load Google through this consent control. */
export function syncGoogleMeasurement(pathname?: string, choice = analyticsConsent()): boolean {
  try { return synchronizeGoogleMeasurement(pathname, choice); }
  catch { return false; } // Optional measurement must never break discovery or account UI.
}
function synchronizeGoogleMeasurement(pathname: string | undefined, choice: string): boolean {
  if (typeof window === "undefined") return false;
  const id = gaMeasurementId();
  if (!id) return false;
  const target = window as MeasurementWindow;
  const page = publicPage(pathname ?? window.location.pathname);
  if (choice !== "accepted" || !measurementAllowed() || !page) {
    Reflect.set(target, `ga-disable-${id}`, true);
    discardQueuedGaEvents(id);
    const existing = document.querySelector<HTMLScriptElement>("script[data-mair-ga4]");
    if (target.dataLayer && existing?.dataset.mairGaConsent !== "denied") googleCommand("consent", "update", { ...deniedConsent });
    if (existing) existing.dataset.mairGaConsent = "denied";
    return false;
  }
  Reflect.set(target, `ga-disable-${id}`, false);
  let script = document.querySelector<HTMLScriptElement>("script[data-mair-ga4]");
  if (script) {
    if (script.dataset.mairGaConsent !== "granted") googleCommand("consent", "update", { ...deniedConsent, analytics_storage: "granted" });
    script.dataset.mairGaConsent = "granted";
    return true;
  }
  googleCommand("consent", "default", { ...deniedConsent });
  googleCommand("consent", "update", { ...deniedConsent, analytics_storage: "granted" });
  googleCommand("js", new Date());
  googleCommand("config", id, { send_page_view: false, page_location: page.url, page_referrer: safeAcquisitionReferrer(document.referrer), page_title: page.path,
    allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 180 * 86400, cookie_update: false });
  script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.dataset.mairGa4 = id;
  script.dataset.mairGaConsent = "granted";
  document.head.appendChild(script);
  return true;
}
export function trackEvent(name: AnalyticsEvent, properties?: AnalyticsProperties): boolean {
  if (!measurementAllowed()) { syncGoogleMeasurement(undefined, "rejected"); return false; }
  const page = publicPage(window.location.pathname);
  if (!page) { syncGoogleMeasurement(undefined, "rejected"); return false; }
  const path = page.path;
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
  const id = gaMeasurementId();
  if (id) {
    if (!syncGoogleMeasurement(path)) return false;
    const details = props && "product" in props ? props : undefined;
    const eventName = name === "pageview" ? "page_view" : name === "product_view" && details?.kind === "product" ? "view_item"
      : name === "product_view" && details?.kind === "equipment-class" ? "equipment_class_view" : name;
    try { googleCommand("event", eventName, {
      send_to: id, page_location: page.url, page_referrer: safeAcquisitionReferrer(document.referrer), page_title: path,
      source_page: path, site_locale: details?.language ?? (/^\/en(?:\/|$)/.test(path) ? "en" : "ro"),
      ...(details ? { product_id: details.product, ...(details.supplier ? { supplier: details.supplier } : {}), ...(details.category ? { category: details.category } : {}),
        ...(details.kind ? { item_type: details.kind } : {}), ...(details.brand ? { brand: details.brand } : {}), ...(details.sku ? { public_sku: details.sku } : {}), ...(details.tracking ? { tracking_status: details.tracking } : {}) } : {}),
      ...(eventName === "view_item" && details ? { items: [{ item_id: details.product, ...(details.brand ? { item_brand: details.brand } : {}), ...(details.category ? { item_category: details.category } : {}), ...(details.sku ? { public_sku: details.sku } : {}) }] } : {}),
    }); } catch { return false; }
    return true;
  }
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (domain !== window.location.hostname || analyticsProvider() !== "plausible") return false;
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
