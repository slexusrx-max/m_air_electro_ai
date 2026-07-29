import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { MarketplaceRole } from "@/lib/i18n/types";
import type { Profile } from "@/lib/supabase/types";

export const rolePath: Record<MarketplaceRole, string> = { client: "/dashboard/client", expert: "/dashboard/expert", admin: "/admin" };
export async function getCurrentUser() { try { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); return user; } catch { return null; } }
function sessionProfile(user: User): Profile {
  const now = new Date().toISOString();
  const role: MarketplaceRole = user.user_metadata.role === "expert" ? "expert" : "client";
  return {
    id: user.id, email: user.email ?? "", full_name: null, role, account_status: "active",
    onboarding_completed: true, onboarding_completed_at: now, country_code: null, preferred_language: null,
    spoken_languages: [], city: null, timezone: null, currency: null, remote_available: null,
    company_name: null, assistance_type: null, professional_title: null, specializations: [],
    years_experience: null, professional_description: null, contact_person: null,
    supplied_product_categories: [], company_description: null, created_at: user.created_at ?? now, updated_at: now,
  };
}
export async function ensureProfileForUser(user: User): Promise<Profile | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const role: MarketplaceRole = user.user_metadata.role === "expert" ? "expert" : "client";
  const { data } = await admin
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? "",
      role,
      account_status: "active",
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    }, { onConflict: "id", ignoreDuplicates: true })
    .select("*")
    .maybeSingle();
  return data;
}
export async function getCurrentProfile(): Promise<Profile | null> { const user = await getCurrentUser(); if (!user) return null; const supabase = await createClient(); const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(); return data ?? await ensureProfileForUser(user) ?? sessionProfile(user); }
export async function requireUser() { const user = await getCurrentUser(); if (!user) redirect("/login"); return user; }
export async function requireCompletedProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.account_status === "blocked") redirect("/login?error=account-blocked");
  return profile;
}
