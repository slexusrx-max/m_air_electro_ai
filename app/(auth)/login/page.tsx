import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { signIn } from "@/app/(auth)/actions";
import { getRequestDictionary } from "@/lib/i18n/request";
import { PlatformShell } from "@/components/platform-shell";
import { getCurrentProfile, getCurrentUser, rolePath } from "@/lib/supabase/auth";
import { authMessages } from "@/lib/auth-messages";
import { getRequestLocale } from "@/lib/i18n/request";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (user) {
    const profile = await getCurrentProfile();
    if (profile?.account_status !== "blocked") redirect(profile ? rolePath[profile.role] : "/dashboard");
  }

  const issue = (await searchParams).error;
  const locale = await getRequestLocale() === "ro" ? "ro" : "en";
  return <PlatformShell contentClassName="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">{issue && <p role="alert" className="content-panel max-w-md">{authMessages[issue === "account-blocked" ? "blocked" : "expired"][locale]}</p>}<AuthForm dictionary={await getRequestDictionary()} action={signIn} mode="login" /></PlatformShell>;
}
