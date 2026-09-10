export const siteConfig = {
  name: "M Air Electro AI",
  shortName: "M Air Electro AI",
  description:
    "AI-first electrical engineering platform for diagnostics, calculators, technical document analysis, verified experts, and protected electrical marketplace workflows.",
  tagline: "Intelligence. Energy. Future.",
  domainFocus:
    "Electrical engineering only. No general handyman services, no generic classifieds, no low-trust service sprawl.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@mairelectro.ai",
  defaultLocale: "ro-RO",
  primaryMarket: "Romania",
  launchMarkets: [
    "Romanian home energy resilience",
    "Solar, batteries and backup-power planning",
    "Electrical diagnostics and technical calculators",
    "Verified EU supplier research",
  ],
  keywords: [
    "electrical diagnostics",
    "electrical calculators",
    "marine electrical",
    "offshore electrical",
    "verified electrical experts",
    "electrical marketplace",
    "voltage drop calculator",
    "cable sizing calculator",
    "motor current calculator",
    "generator sizing",
    "battery sizing",
    "breaker selection",
    "fuse selection",
  ],
} as const;

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return value ? value.replace(/\/+$/, "") : "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
