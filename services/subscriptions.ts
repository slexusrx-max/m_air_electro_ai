import type { SubscriptionState } from "@/lib/billing/types";
export async function getSubscription(userId?: string): Promise<SubscriptionState> { void userId; return { planId: "free", status: "free", isDemo: true }; }
