export type AnalyticsEvent = "pageview" | "outbound_click" | "calculator_complete" | "comparison_view";
export const consentKey = "mair-analytics-consent-v1";
export function analyticsConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || "null");
    return saved && Date.now() - saved.at < 180 * 86400000 && ["accepted", "rejected"].includes(saved.choice) ? saved.choice as string : "unset";
  } catch { return "unset"; }
}
export function trackEvent(name: AnalyticsEvent) {
  if (typeof window === "undefined" || analyticsConsent() !== "accepted" || navigator.doNotTrack === "1" || navigator.webdriver) return;
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain || domain !== window.location.hostname || /^(localhost|127\.)/.test(domain)) return;
  const path = window.location.pathname;
  if (/^\/(api|auth|account|login|register|forgot-password|reset-password|dashboard|onboarding|admin|expert|client|supplier)(\/|$)/.test(path)) return;
  // Direct browser request preserves real visitor IP/UA without a tracking script.
  // Queries, referrers, email, input values and account identifiers are never sent.
  void fetch("https://plausible.io/api/event", {
    method: "POST", headers: { "Content-Type": "text/plain" }, credentials: "omit", referrerPolicy: "no-referrer", keepalive: true,
    body: JSON.stringify({ name, domain, url: window.location.origin + path }),
  }).catch(() => {});
}
