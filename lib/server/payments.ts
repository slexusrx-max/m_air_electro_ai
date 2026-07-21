import "server-only";

export type PaymentProviderId = "stripe-connect";

export type DepositWindow = {
  disputeWindowHours: number;
  requiresCompletionConfirmation: boolean;
};

export type MarketplaceDepositRequest = {
  amount: number;
  currency: string;
  jobId: string;
  providerAccountId: string;
};

export interface MarketplacePaymentAdapter {
  createDepositIntent(input: MarketplaceDepositRequest): Promise<{ checkoutReference: string }>;
  id: PaymentProviderId;
  openDisputeWindow(jobId: string, window: DepositWindow): Promise<void>;
  releasePayout(jobId: string): Promise<void>;
}

export function getPaymentRuntimeStatus() {
  const stripePublishableKeyPresent = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim());
  const stripeSecretKeyPresent = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const stripeWebhookSecretPresent = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
  const stripeConnectConfigured = Boolean(process.env.STRIPE_CONNECT_CLIENT_ID?.trim());

  return {
    provider: "stripe-connect" as const,
    publishableKeyPresent: stripePublishableKeyPresent,
    secretKeyPresent: stripeSecretKeyPresent,
    webhookSecretPresent: stripeWebhookSecretPresent,
    connectConfigured: stripeConnectConfigured,
    configured:
      stripePublishableKeyPresent &&
      stripeSecretKeyPresent &&
      stripeWebhookSecretPresent &&
      stripeConnectConfigured,
  };
}
