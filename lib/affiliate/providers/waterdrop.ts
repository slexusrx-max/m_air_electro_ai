import reviewed from "@/data/waterdrop-reviewed-expansion.json";
import "server-only";
import { configuredSupplierLink, parseApprovedLinks, type AffiliateConfiguration } from "@/lib/affiliate/configuration";
import type { AffiliateProvider } from "@/lib/affiliate/types";
import { assertSupplierUrl } from "../suppliers";

export const waterdropEu: AffiliateProvider = {
  id: "waterdrop-eu",
  region: "EU",
  baseUrl: "https://www.waterdropfilter.de/",
  trackingEnvironmentVariable: "WATERDROP_IMPACT_LINKS_JSON",
  buildAffiliateUrl: (productUrl) => waterdropLink(productUrl).href,
  disclosure:
    "M Air Electro AI may earn a commission from qualifying purchases made through marked Waterdrop affiliate links.",
};

export function waterdropConfiguration(): AffiliateConfiguration {
  return {
    provider: "waterdrop-eu",
    network: "impact",
    programId: process.env.WATERDROP_IMPACT_PROGRAM_ID?.trim() || null,
    approved: process.env.WATERDROP_AFFILIATE_APPROVED === "true",
    trackingEnabled: process.env.AFFILIATE_TRACKING_ENABLED === "true",
    affiliateDisclosureRequired: true,
    links: { ...Object.fromEntries(reviewed.map(r=>[r.url,r.issued])), ...parseApprovedLinks(process.env.WATERDROP_IMPACT_LINKS_JSON) },
  };
}

export function waterdropLink(productUrl: string) {
  assertSupplierUrl("waterdrop-eu", productUrl);
  return configuredSupplierLink(waterdropConfiguration(), productUrl);
}
