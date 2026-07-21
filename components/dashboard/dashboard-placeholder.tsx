import { PlatformShell } from "@/components/platform-shell";
import type { Dictionary } from "@/lib/i18n/types";

export async function DashboardPlaceholder({ dictionary: t, role }: { dictionary: Dictionary; role: "client" | "expert" | "supplier" }) {
  return <PlatformShell><section className="mx-auto flex w-full max-w-5xl flex-1 items-center"><article className="glass-panel w-full rounded-[2rem] p-8 sm:p-12"><p className="text-sm font-medium uppercase tracking-[0.2em] text-lime-200">{t["dashboard.profile"]}</p><h1 className="mt-3 font-display text-4xl font-semibold">{t[`dashboard.${role}.title`]}</h1><p className="mt-5 max-w-xl text-base leading-8 text-white/70">{t["dashboard.placeholder"]}</p></article></section></PlatformShell>;
}
