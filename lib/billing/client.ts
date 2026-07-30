import type { PlanId } from "@/lib/billing/types";
import { plans } from "@/lib/billing/config";
export async function startCheckout(planId: string): Promise<void> { if (!(planId in plans) || planId === "free") throw new Error("Choose a valid paid plan."); throw new Error(`Billing integration is being configured for ${(plans[planId as PlanId]).name}. No subscription has been created.`); }
