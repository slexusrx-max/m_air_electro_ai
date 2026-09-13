import "server-only";
import type { AffiliateProvider } from "@/lib/affiliate/types";
import { appendTrackingParameter } from "@/lib/affiliate/tracking";

export const ebay: AffiliateProvider = {
  id: "ebay",
  region: "UK",
  baseUrl: "https://www.ebay.co.uk",
  trackingEnvironmentVariable: "EBAY_CAMPAIGN_ID",
  buildAffiliateUrl: (productUrl) =>
    appendTrackingParameter(
      productUrl,
      "campid",
      process.env.AFFILIATE_TRACKING_ENABLED === "true" &&
        process.env.EBAY_AFFILIATE_APPROVED === "true"
        ? process.env.EBAY_CAMPAIGN_ID
        : undefined,
    ),
  disclosure:
    "Purchase is completed on the partner’s website. M Air Electro AI may earn a commission from qualifying purchases.",
};
