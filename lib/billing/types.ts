export type PlanId = "free" | "premium-monthly" | "premium-yearly" | "professional";
export type SubscriptionState = { planId: PlanId; status: "free" | "active" | "configuration_required"; isDemo?: boolean };
