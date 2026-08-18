import { EnergyRecommendation } from "@/components/home-energy/energy-recommendation";
import { PlatformShell } from "@/components/platform-shell";
import { getHomeEnergyCopy } from "@/lib/i18n/home-energy";
import { getRequestLocale } from "@/lib/i18n/request";
export default async function EnergyAiPage() { const locale = await getRequestLocale(); const t = getHomeEnergyCopy(locale); return <PlatformShell><main className="mx-auto w-full max-w-6xl text-slate-800"><p className="eyebrow">Energy AI</p><h1 className="mt-3 text-4xl font-bold text-slate-950">{t.energyTitle}</h1><p className="mt-4 max-w-3xl text-slate-700">{t.energyDescription}</p><div className="mt-8"><EnergyRecommendation locale={locale}/></div></main></PlatformShell>; }
