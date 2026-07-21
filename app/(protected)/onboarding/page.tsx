import { completeOnboarding } from "@/app/(auth)/actions";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { PlatformShell } from "@/components/platform-shell";
import { getCountries } from "@/lib/i18n/countries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser, getCurrentProfile } from "@/lib/supabase/auth";
export default async function OnboardingPage() { await requireUser(); const profile = await getCurrentProfile(); const dictionary = getDictionary(); const initialRole = profile?.role === "expert" || profile?.role === "supplier" ? profile.role : "client"; return <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12"><OnboardingForm dictionary={dictionary} countries={getCountries()} initialRole={initialRole} action={completeOnboarding} /></PlatformShell>; }
