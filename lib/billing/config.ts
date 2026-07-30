import type { PlanId } from "@/lib/billing/types";
export const plans: Record<PlanId, { name: string; price: string }> = { free: { name: "Free", price: "$0" }, "premium-monthly": { name: "Premium", price: "$5.99/month" }, "premium-yearly": { name: "Premium annual", price: "$49.99/year" }, professional: { name: "Professional", price: "Contact us" } };
