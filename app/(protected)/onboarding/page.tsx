import { redirect } from "next/navigation";
import { requireCompletedProfile, rolePath, getAccountDetails } from "@/lib/supabase/auth";
import { getRequestLocale, getRequestDictionary } from "@/lib/i18n/request";
import { getCountries } from "@/lib/i18n/countries";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { PlatformShell } from "@/components/platform-shell";
import { completeOnboarding } from "@/app/(auth)/actions";
export default async function OnboardingPage() {
 const profile = await requireCompletedProfile();
 if (profile.role !== "client" && profile.role !== "expert") redirect(rolePath[profile.role]);
 const locale = await getRequestLocale();
 return <PlatformShell><OnboardingForm action={completeOnboarding} countries={getCountries(locale)} dictionary={await getRequestDictionary()} profile={await getAccountDetails(profile)} ro={locale === "ro"}/></PlatformShell>;
}
