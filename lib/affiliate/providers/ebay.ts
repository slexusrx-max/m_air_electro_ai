import type { AffiliateProvider } from "@/lib/affiliate/types";
import { appendTrackingParameter } from "@/lib/affiliate/tracking";

export const ebay: AffiliateProvider = {
  id: "ebay", region: "UK", baseUrl: "https://www.ebay.co.uk", trackingEnvironmentVariable: "EBAY_CAMPAIGN_ID",
  buildAffiliateUrl: (productUrl) => appendTrackingParameter(productUrl, "campid", process.env.EBAY_CAMPAIGN_ID),
  disclosure: "Purchase is completed on the partner’s website. M Air Electro AI may earn a commission from qualifying purchases.",
};
