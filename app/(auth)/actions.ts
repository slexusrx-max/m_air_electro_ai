"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { absoluteUrl } from "@/lib/site";
import { roles, type RegistrationRole } from "@/lib/i18n/types";
import { createActionClient } from "@/lib/supabase/server";
import { getCurrentProfile, rolePath } from "@/lib/supabase/auth";

export type ActionState = { error?: string; message?: string };
const error = (message: string): ActionState => ({ error: message });
function value(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function validRole(input: string): input is RegistrationRole { return (roles as readonly string[]).includes(input); }

export async function signIn(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); const password = value(formData, "password");
  if (!email || !password) return error("Email and password are required.");
  const supabase = await createActionClient(); const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) return error(authError.message);
  const profile = await getCurrentProfile();
  if (profile?.account_status === "blocked") { await supabase.auth.signOut(); return error("This account is blocked."); }
  redirect(profile ? rolePath[profile.role] : "/dashboard");
}

export async function signUp(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); const password = value(formData, "password"); const confirmation = value(formData, "confirmation"); const role = value(formData, "role");
  if (!email || password.length < 8) return error("Enter a valid email and a password of at least 8 characters.");
  if (password !== confirmation) return error("Passwords do not match."); if (!validRole(role)) return error("Choose a valid role.");
  const supabase = await createActionClient(); const { error: authError } = await supabase.auth.signUp({ email, password, options: { data: { role }, emailRedirectTo: absoluteUrl(`/auth/callback?next=${rolePath[role]}`) } });
  if (authError) return error(authError.message); return { message: "Check your email to verify your account." };
}

export async function requestPasswordReset(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); if (!email) return error("Email is required.");
  const supabase = await createActionClient(); const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: absoluteUrl("/auth/callback?next=/reset-password") });
  if (authError) return error(authError.message); return { message: "If an account exists for this address, a reset link has been sent." };
}

export async function updatePassword(_: ActionState, formData: FormData): Promise<ActionState> {
  const password = value(formData, "password"); const confirmation = value(formData, "confirmation"); if (password.length < 8) return error("Password must be at least 8 characters."); if (password !== confirmation) return error("Passwords do not match.");
  const supabase = await createActionClient(); const { error: authError } = await supabase.auth.updateUser({ password }); if (authError) return error(authError.message); redirect("/dashboard");
}

export async function completeOnboarding(_: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile(); if (!profile) redirect("/login");
  const countryCode = value(formData, "country_code"); const language = value(formData, "preferred_language"); const fullName = value(formData, "full_name");
  if (!fullName || !/^[A-Z]{2}$/.test(countryCode) || !/^(en|ru|ro)$/.test(language)) return error("Please complete all required fields.");
  const supabase = await createActionClient(); const { error: updateError } = await supabase.rpc("complete_user_onboarding", {
    p_full_name: fullName, p_country_code: countryCode, p_preferred_language: language,
    p_company_name: value(formData, "company_name") || null, p_company_description: value(formData, "company_description") || null,
    p_assistance_type: value(formData, "assistance_type") || null,
    p_professional_title: value(formData, "professional_title") || null,
    p_specializations: formData.getAll("specializations").map(String).filter(Boolean),
    p_years_experience: Number.parseInt(value(formData, "years_experience"), 10) || null,
    p_professional_description: value(formData, "professional_description") || null,
  });
  if (updateError) return error(updateError.message); revalidatePath("/"); redirect(rolePath[profile.role]);
}

export async function signOut() { const supabase = await createActionClient(); await supabase.auth.signOut(); revalidatePath("/", "layout"); redirect("/"); }
