import type { SavedLocation } from "@/types/power";
export async function getSavedLocations(userId?: string): Promise<SavedLocation[]> { return userId ? [] : []; }
export async function saveLocation(userId: string, input: Omit<SavedLocation, "id" | "createdAt">) { if (!userId) throw new Error("Sign in is required to save a location."); return { id: crypto.randomUUID(), ...input, createdAt: new Date().toISOString() }; }
export async function removeSavedLocation(userId: string, id: string) { void userId; void id; return undefined; }
