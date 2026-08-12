import type { AffiliateProvider } from "@/lib/affiliate/types";
import { appendTrackingParameter } from "@/lib/affiliate/tracking";
export const renogyEu: AffiliateProvider = { id: "renogy", region: "EU", baseUrl: "https://eu.renogy.com", trackingEnvironmentVariable: "RENOGY_AFFILIATE_ID", buildAffiliateUrl: (productUrl) => appendTrackingParameter(productUrl, "ref", process.env.RENOGY_AFFILIATE_ID), disclosure: "Purchase is completed on the partner’s website. M Air Electro AI may earn a commission from qualifying purchases." };
