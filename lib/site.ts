export const siteConfig = {
  name: "M Air Electro AI",
  shortName: "M Air Electro AI",
  description:
    "Platformă independentă de descoperire, comparație și dimensionare a echipamentelor energetice pentru România și UE.",
  tagline: "Calculate. Compare. Choose.",
  domainFocus:
    "Electrical engineering only. No general handyman services, no generic classifieds, no low-trust service sprawl.",
  contactEmail: verifiedMailbox(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  partnershipsEmail: verifiedMailbox(process.env.NEXT_PUBLIC_PARTNERSHIPS_EMAIL),
  privacyEmail: verifiedMailbox(process.env.NEXT_PUBLIC_PRIVACY_EMAIL),
  operatorName: process.env.NEXT_PUBLIC_OPERATOR_NAME?.trim() || undefined,
  editorName: process.env.NEXT_PUBLIC_EDITOR_NAME?.trim() || undefined,
  editorBio: process.env.NEXT_PUBLIC_EDITOR_BIO?.trim() || undefined,
  editorExpertise: process.env.NEXT_PUBLIC_EDITOR_EXPERTISE?.trim() || undefined,
  publisherProfile: safeProfile(process.env.NEXT_PUBLIC_EDITOR_PROFILE),
  publicContactUrl:
    "https://github.com/slexusrx-max/m_air_electro_ai/issues/new",
  defaultLocale: "ro-RO",
  primaryMarket: "Romania",
  launchMarkets: [
    "Romanian home energy resilience",
    "Solar, batteries and backup-power planning",
    "Electrical diagnostics and technical calculators",
    "Verified EU supplier research",
  ],
  keywords: [
    "energie de rezervă România",
    "baterii litiu",
    "panouri solare",
    "invertoare",
    "calculator autonomie",
    "echipamente energie",
  ],
} as const;

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const url = new URL(value || "https://mairelectroai.com");
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
      (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTPS origin (HTTP is allowed only for local development)");
  }
  // Old deployment settings must not leak the legacy host into public metadata.
  if (["www.mairelectroai.com", "m-air-electro-ai.vercel.app"].includes(url.hostname)) return "https://mairelectroai.com";
  return url.origin;
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

function safeProfile(value?: string) {
  try { const u = new URL(value || ""); return u.protocol === "https:" && !u.username && !u.password ? u.href : undefined; } catch { return undefined; }
}
export function verifiedMailbox(value?: string) {
  if (process.env.CONTACT_EMAIL_VERIFIED !== "true" || !value) return undefined;
  const email = value.trim();
  const host = new URL(getSiteUrl()).hostname.replace(/^www\./, "");
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || host.endsWith(".example") || host.endsWith(".vercel.app") || email.split("@")[1].toLowerCase() !== host) return undefined;
  return email;
}
