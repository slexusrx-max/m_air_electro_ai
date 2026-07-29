import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MarketplaceRole } from "@/lib/i18n/types";
import type { Profile } from "@/lib/supabase/types";

export const rolePath: Record<MarketplaceRole, string> = { client: "/dashboard/client", expert: "/dashboard/expert", admin: "/admin" };
export async function getCurrentUser() { try { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); return user; } catch { return null; } }
export async function getCurrentProfile(): Promise<Profile | null> { const user = await getCurrentUser(); if (!user) return null; const supabase = await createClient(); const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(); return data; }
export async function requireUser() { const user = await getCurrentUser(); if (!user) redirect("/login"); return user; }
export async function requireCompletedProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.account_status === "blocked") redirect("/login?error=account-blocked");
  return profile;
}
