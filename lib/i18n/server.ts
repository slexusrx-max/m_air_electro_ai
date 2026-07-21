import "server-only";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";
import { getCurrentProfile } from "@/lib/supabase/auth";

export async function getUserDictionary() {
  const profile = await getCurrentProfile();
  const locale: Locale = profile?.preferred_language === "ru" || profile?.preferred_language === "ro" ? profile.preferred_language : "en";
  return getDictionary(locale);
}
