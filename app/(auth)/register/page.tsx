import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { signUp } from "@/app/(auth)/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PlatformShell } from "@/components/platform-shell";
import { getCurrentProfile, rolePath } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(rolePath[profile.role]);

  return <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12"><AuthForm dictionary={getDictionary()} action={signUp} mode="register" /></PlatformShell>;
}
