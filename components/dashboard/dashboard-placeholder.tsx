import { PlatformShell } from "@/components/platform-shell";
import type { Dictionary } from "@/lib/i18n/types";
import type { Profile } from "@/lib/supabase/types";

export async function DashboardPlaceholder({ dictionary: t, profile, role }: { dictionary: Dictionary; profile: Profile; role: "client" | "expert" }) {
  return <PlatformShell><section className="mx-auto flex w-full max-w-5xl flex-1 items-center"><article className="glass-panel w-full rounded-[2rem] p-8 sm:p-12"><p className="text-sm font-medium uppercase tracking-[0.2em] text-lime-200">{t["dashboard.profile"]}</p><h1 className="mt-3 font-display text-4xl font-semibold">{t[`dashboard.${role}.title`]}</h1><dl className="mt-6 grid gap-3 text-sm text-white/75 sm:grid-cols-2"><div><dt className="text-white/50">{t["onboarding.fullName"]}</dt><dd className="mt-1 font-medium text-white">{profile.full_name ?? profile.email}</dd></div><div><dt className="text-white/50">{t["auth.role"]}</dt><dd className="mt-1 font-medium text-white">{t[`role.${role}`]}</dd></div><div><dt className="text-white/50">{t["onboarding.country"]}</dt><dd className="mt-1 font-medium text-white">{profile.country_code}</dd></div></dl><p className="mt-7 max-w-xl text-base leading-8 text-white/70">{t["dashboard.placeholder"]}</p></article></section></PlatformShell>;
}
