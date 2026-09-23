export const plannedEmailAddresses = {
  contact: "contact@mairelectroai.com",
  partnerships: "partnerships@mairelectroai.com",
  privacy: "privacy@mairelectroai.com",
} as const;

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
  // Owner-confirmed public identity. It is not a company or an editorial sign-off.
  operatorName: "Stanislav Zavizion",
  operatingCountry: "Romania",
  commercialRegion: "Romania / European Union",
  publisherStatus: "Individual / independent publisher",
  plannedEmailAddresses,
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

export function publisherStructuredData() {
  return {
    "@type": "Person",
    "@id": absoluteUrl("/#publisher"),
    name: siteConfig.operatorName,
    url: absoluteUrl("/about"),
    description: `Independent publisher operating in ${siteConfig.operatingCountry}.`,
    brand: { "@id": absoluteUrl("/#brand") },
  };
}

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      publisherStructuredData(),
      { "@type": "Brand", "@id": absoluteUrl("/#brand"), name: siteConfig.name, url: absoluteUrl() },
      {
        "@type": "WebSite", "@id": absoluteUrl("/#website"), name: siteConfig.name,
        url: absoluteUrl(), description: siteConfig.description, inLanguage: ["ro", "en"],
        publisher: { "@id": absoluteUrl("/#publisher") },
      },
    ],
  };
}

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
  const value = path.trim();
  const url = new URL(value, `${getSiteUrl()}/`);
  if (value.startsWith("//") || !["https:", "http:"].includes(url.protocol) ||
      url.username || url.password || isMalformedHttpUrl(url.href)) {
    throw new Error("Expected a relative path or a valid HTTP(S) URL without an embedded origin");
  }
  return url.href;
}

/** Inspect the path only: a URL inside search parameters is not a navigation origin. */
export function isMalformedHttpUrl(value: string, base = "https://url-check.invalid") {
  try {
    const url = new URL(value, base);
    let path = url.pathname;
    for (let i = 0; i < 3; i++) {
      const decoded = decodeURIComponent(path);
      if (decoded === path) break;
      path = decoded;
    }
    return /(?:^|[\/\\])https?:[\/\\]/i.test(path) ||
      path.toLowerCase().split(/[\/\\]/).includes(url.host.toLowerCase());
  } catch {
    return true;
  }
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
