import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { signIn } from "@/app/(auth)/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PlatformShell } from "@/components/platform-shell";
import { getCurrentProfile, rolePath } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(profile.onboarding_completed ? rolePath[profile.role] : "/onboarding");

  return <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12"><AuthForm dictionary={getDictionary()} action={signIn} mode="login" /></PlatformShell>;
}
