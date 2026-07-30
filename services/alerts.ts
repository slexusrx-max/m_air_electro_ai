import type { PowerAlert } from "@/types/power";
export async function getAlerts(userId?: string): Promise<PowerAlert[]> { return userId ? [] : []; }
export async function createAlert(userId: string, input: Omit<PowerAlert, "id" | "createdAt">) { if (!userId) throw new Error("Sign in is required to create an alert."); return { id: crypto.randomUUID(), ...input, createdAt: new Date().toISOString() }; }
export async function deleteAlert(userId: string, id: string) { void userId; void id; return undefined; }
