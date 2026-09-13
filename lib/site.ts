export const siteConfig = {
  name: "M Air Electro AI",
  shortName: "M Air Electro AI",
  description:
    "Marketplace-first energy and electrical equipment discovery, system sizing, product comparison and buying guides for Romania and the EU.",
  tagline: "Calculate. Compare. Choose.",
  domainFocus:
    "Electrical engineering only. No general handyman services, no generic classifieds, no low-trust service sprawl.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@mairelectro.ai",
  defaultLocale: "ro-RO",
  primaryMarket: "Romania / EU",
  launchMarkets: [
    "Romania / EU energy equipment",
    "Industrial electrical and automation",
    "Marine and offshore electrical systems",
    "Independent product discovery and system sizing",
  ],
  keywords: [
    "energy marketplace", "solar equipment", "inverters", "Romania", "EU", "product comparison",
    "electrical calculators",
    "marine electrical",
    "offshore electrical",
    "technical buying guides",
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
  return value ? value.replace(/\/+$/, "") : "https://m-air-electro-ai.vercel.app";
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
