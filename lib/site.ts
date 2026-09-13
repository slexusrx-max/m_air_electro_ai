export const siteConfig = {
  name: "M Air Electro AI",
  shortName: "M Air Electro AI",
  description:
    "Marketplace de echipamente energetice și electrice pentru România și UE: dimensionare, descoperire, comparație și ghiduri de achiziție.",
  tagline: "Calculate. Compare. Choose.",
  domainFocus:
    "Electrical engineering only. No general handyman services, no generic classifieds, no low-trust service sprawl.",
  contactEmail:
    process.env.CONTACT_EMAIL_VERIFIED === "true"
      ? process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()
      : undefined,
  operatorName: process.env.NEXT_PUBLIC_OPERATOR_NAME?.trim(),
  publisherProfile: "https://github.com/slexusrx-max",
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
  return value
    ? value.replace(/\/+$/, "")
    : "https://m-air-electro-ai.vercel.app";
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
