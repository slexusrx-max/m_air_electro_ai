"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRequestLocale, localeCookieName } from "@/lib/i18n/request";
import { authMessages, authErrorKey } from "@/lib/auth-messages";
import { absoluteUrl } from "@/lib/site";
import { roles, type RegistrationRole } from "@/lib/i18n/types";
import { createActionClient } from "@/lib/supabase/server";
import { getCurrentProfile, rolePath } from "@/lib/supabase/auth";

export type ActionState = { error?: string; message?: string };
async function message(key: keyof typeof authMessages) { return authMessages[key][await getRequestLocale() === "ro" ? "ro" : "en"]; }
async function error(key: keyof typeof authMessages): Promise<ActionState> { return { error: await message(key) }; }
async function client() { try { return await createActionClient(); } catch { return null; } }
function passwordValue(formData: FormData, key: string) { return String(formData.get(key) ?? ""); }
function validEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254; }
function value(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function validRole(input: string): input is RegistrationRole { return (roles as readonly string[]).includes(input); }

export async function signIn(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); const password = passwordValue(formData, "password");
  if (!validEmail(email) || !password) return error("required");
  const supabase = await client(); if (!supabase) return error("unavailable"); const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) return error(authErrorKey(authError.code));
  const profile = await getCurrentProfile();
  if (profile?.account_status === "blocked") { await supabase.auth.signOut(); return error("blocked"); }
  redirect(profile ? rolePath[profile.role] : "/dashboard");
}

export async function signUp(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); const password = passwordValue(formData, "password"); const confirmation = passwordValue(formData, "confirmation"); const role = value(formData, "role");
  if (!validEmail(email)) return error("required");
  if (password.length < 8) return error("password"); if (password !== confirmation) return error("mismatch"); if (!validRole(role)) return error("role");
  const supabase = await client(); if (!supabase) return error("unavailable"); const { error: authError } = await supabase.auth.signUp({ email, password, options: { data: { role }, emailRedirectTo: absoluteUrl(`/auth/callback?next=${rolePath[role]}`) } });
  if (authError) return error(authErrorKey(authError.code)); return { message: await message("verify") };
}

export async function requestPasswordReset(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = value(formData, "email"); if (!validEmail(email)) return error("required");
  const supabase = await client(); if (!supabase) return error("unavailable"); const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: absoluteUrl("/auth/callback?next=/reset-password") });
  if (authError) return error(authErrorKey(authError.code)); return { message: await message("reset") };
}

export async function updatePassword(_: ActionState, formData: FormData): Promise<ActionState> {
  const password = passwordValue(formData, "password"); const confirmation = passwordValue(formData, "confirmation"); if (password.length < 8) return error("password"); if (password !== confirmation) return error("mismatch");
  const supabase = await client(); if (!supabase) return error("unavailable"); const { error: authError } = await supabase.auth.updateUser({ password }); if (authError) return error(authErrorKey(authError.code)); redirect("/dashboard");
}

export async function completeOnboarding(_: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile(); if (!profile) redirect("/login");
  const countryCode = value(formData, "country_code"); const language = value(formData, "preferred_language"); const fullName = value(formData, "full_name");
  if (!fullName || !/^[A-Z]{2}$/.test(countryCode) || !/^(ro|en)$/.test(language)) return error("fields");
  const supabase = await client(); if (!supabase) return error("unavailable"); const { error: updateError } = await supabase.rpc("complete_user_onboarding", {
    p_full_name: fullName, p_country_code: countryCode, p_preferred_language: language,
    p_company_name: value(formData, "company_name") || null, p_company_description: value(formData, "company_description") || null,
    p_assistance_type: value(formData, "assistance_type") || null,
    p_professional_title: value(formData, "professional_title") || null,
    p_specializations: formData.getAll("specializations").map(String).filter(Boolean),
    p_years_experience: value(formData, "years_experience") === "" ? null : Number(value(formData, "years_experience")),
    p_professional_description: value(formData, "professional_description") || null,
  });
  if (updateError) return error("failed");
  (await cookies()).set(localeCookieName, language, { path: "/", maxAge: 31536000, sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  revalidatePath("/", "layout"); redirect(rolePath[profile.role]);
}

export async function signOut() { const supabase = await client(); if (supabase) await supabase.auth.signOut(); revalidatePath("/", "layout"); redirect("/"); }
