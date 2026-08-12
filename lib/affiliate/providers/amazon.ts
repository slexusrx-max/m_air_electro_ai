import type { AffiliateProvider } from "@/lib/affiliate/types";
import { appendTrackingParameter } from "@/lib/affiliate/tracking";
export const amazon: AffiliateProvider = { id: "amazon", region: "US", baseUrl: "https://www.amazon.com", trackingEnvironmentVariable: "AMAZON_ASSOCIATE_ID", buildAffiliateUrl: (productUrl) => appendTrackingParameter(productUrl, "tag", process.env.AMAZON_ASSOCIATE_ID), disclosure: "Purchase is completed on the partner’s website. M Air Electro AI may earn a commission from qualifying purchases." };
