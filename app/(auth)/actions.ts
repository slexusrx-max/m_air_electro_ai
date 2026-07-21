"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { absoluteUrl } from "@/lib/site";
import { roles, type RegistrationRole } from "@/lib/i18n/types";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, rolePath } from "@/lib/supabase/auth";

export type ActionState = { error?: string; message?: string };
const error = (message: string): ActionState => ({ error: message });
function value(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function validRole(input: string): input is RegistrationRole { return (roles as readonly string[]).includes(input); }

export async function signIn(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); const password = value(formData, "password");
  if (!email || !password) return error("Email and password are required.");
  const supabase = await createClient(); const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) return error(authError.message);
  const profile = await getCurrentProfile();
  redirect(profile?.onboarding_completed_at ? rolePath[profile.role] : "/onboarding");
}

export async function signUp(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); const password = value(formData, "password"); const confirmation = value(formData, "confirmation"); const role = value(formData, "role");
  if (!email || password.length < 8) return error("Enter a valid email and a password of at least 8 characters.");
  if (password !== confirmation) return error("Passwords do not match."); if (!validRole(role)) return error("Choose a valid role.");
  const supabase = await createClient(); const { error: authError } = await supabase.auth.signUp({ email, password, options: { data: { role }, emailRedirectTo: absoluteUrl("/auth/callback?next=/onboarding") } });
  if (authError) return error(authError.message); return { message: "Check your email to verify your account." };
}

export async function requestPasswordReset(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); if (!email) return error("Email is required.");
  const supabase = await createClient(); const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: absoluteUrl("/auth/callback?next=/reset-password") });
  if (authError) return error(authError.message); return { message: "If an account exists for this address, a reset link has been sent." };
}

export async function updatePassword(_: ActionState, formData: FormData): Promise<ActionState> {
  const password = value(formData, "password"); const confirmation = value(formData, "confirmation"); if (password.length < 8) return error("Password must be at least 8 characters."); if (password !== confirmation) return error("Passwords do not match.");
  const supabase = await createClient(); const { error: authError } = await supabase.auth.updateUser({ password }); if (authError) return error(authError.message); redirect("/dashboard");
}

export async function completeOnboarding(_: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile(); if (!profile) redirect("/login");
  const role = value(formData, "role"); const countryCode = value(formData, "country_code"); const language = value(formData, "preferred_language");
  if (!validRole(role) || !/^[A-Z]{2}$/.test(countryCode) || !/^(en|ru|ro)$/.test(language)) return error("Please complete all required fields.");
  const spokenLanguages = formData.getAll("spoken_languages").map(String).filter((item) => /^(en|ru|ro)$/.test(item));
  const remote = value(formData, "remote_available"); const city = value(formData, "city"); const timezone = value(formData, "timezone"); const currency = value(formData, "currency").toUpperCase();
  if (role === "expert" && (!spokenLanguages.length || !["yes", "no"].includes(remote) || !city || !timezone || !/^[A-Z]{3}$/.test(currency))) return error("Please complete the expert details.");
  const supabase = await createClient(); const { error: updateError } = await supabase.from("profiles").update({ role, country_code: countryCode, preferred_language: language, spoken_languages: role === "expert" ? spokenLanguages : [], remote_available: role === "expert" ? remote === "yes" : null, city: role === "expert" ? city : null, timezone: role === "expert" ? timezone : null, currency: role === "expert" ? currency : null, onboarding_completed_at: new Date().toISOString() }).eq("id", profile.id);
  if (updateError) return error(updateError.message); revalidatePath("/"); redirect(rolePath[role]);
}

export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); revalidatePath("/", "layout"); redirect("/"); }
