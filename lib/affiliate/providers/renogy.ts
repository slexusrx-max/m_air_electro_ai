import "server-only";
import { catalog } from "@/lib/affiliate/catalog";
import { configuredSupplierLink, parseApprovedLinks, type AffiliateConfiguration } from "@/lib/affiliate/configuration";
import type { AffiliateProvider } from "@/lib/affiliate/types";
export const renogyEu: AffiliateProvider = {
  id: "renogy",
  region: "EU",
  baseUrl: "https://eu.renogy.com/",
  trackingEnvironmentVariable: "RENOGY_IMPACT_LINKS_JSON",
  buildAffiliateUrl: (productUrl) => renogyLink(productUrl).href,
  disclosure:
    "Ordinary supplier links until an approved relationship is activated.",
};
export function renogyConfiguration(): AffiliateConfiguration {
  return {
    provider: "renogy", network: "impact",
    programId: process.env.RENOGY_IMPACT_PROGRAM_ID?.trim() || null,
    approved: process.env.RENOGY_AFFILIATE_APPROVED === "true",
    trackingEnabled: process.env.AFFILIATE_TRACKING_ENABLED === "true",
    affiliateDisclosureRequired: true,
    links: parseApprovedLinks(process.env.RENOGY_IMPACT_LINKS_JSON),
  };
}
export function renogyLink(productUrl: string) {
  return configuredSupplierLink(renogyConfiguration(), productUrl);
}

export function affiliateTrackingActive() {
  return catalog.some(
    (product) =>
      product.provider === "renogy" && renogyLink(product.productUrl).tracked,
  );
}
