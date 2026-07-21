import "server-only";

import { getPaymentRuntimeStatus } from "@/lib/server/payments";

export type MarketplaceVertical =
  | "home-electrical"
  | "electrical-parts"
  | "marine-electrical"
  | "industrial-electrical";

export type MarketplaceRequestType = "expert-service" | "part-request" | "job-request" | "consultation";

export interface VerificationPolicy {
  evidenceRequired: string[];
  role: string;
}

export const marketplaceProtectionSteps = [
  "Customer opens a service or parts request with fault context, documents, and evidence.",
  "Platform verifies category fit, specialist role, and job type before routing or listing.",
  "Payment provider handles deposit and authorization. Platform does not custody funds independently.",
  "Completion confirmation and a defined dispute window gate payout release.",
  "Evidence, messaging, and timeline events support moderation and dispute review.",
] as const;

export const verificationPolicies: VerificationPolicy[] = [
  {
    role: "expert",
    evidenceRequired: ["Identity", "Trade credentials", "Portfolio or experience proof"],
  },
  {
    role: "seller",
    evidenceRequired: ["Identity", "Business verification", "Parts condition and traceability evidence"],
  },
  {
    role: "company",
    evidenceRequired: ["Legal entity", "Operational contact", "Service coverage details"],
  },
];

export function getMarketplaceRuntimeStatus() {
  const payment = getPaymentRuntimeStatus();

  return {
    requestTypes: ["expert-service", "part-request", "job-request", "consultation"] as MarketplaceRequestType[],
    verticals: [
      "home-electrical",
      "electrical-parts",
      "marine-electrical",
      "industrial-electrical",
    ] as MarketplaceVertical[],
    protectionFlowReady: true,
    paymentProviderConfigured: payment.configured,
    verificationPolicies,
  };
}
