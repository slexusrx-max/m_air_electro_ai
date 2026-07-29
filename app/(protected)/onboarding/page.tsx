import { redirect } from "next/navigation";

import { getCurrentProfile, requireUser, rolePath } from "@/lib/supabase/auth";

export default async function OnboardingPage() {
  await requireUser();
  const profile = await getCurrentProfile();
  redirect(profile ? rolePath[profile.role] : "/dashboard");
}
