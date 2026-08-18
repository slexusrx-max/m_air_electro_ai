import { HomeEnergyProfileForm } from "@/components/home-energy/home-energy-profile";
import { PlatformShell } from "@/components/platform-shell";
import { getHomeEnergyCopy } from "@/lib/i18n/home-energy";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
export default async function MyHomePage() { const [locale, dictionary] = await Promise.all([getRequestLocale(), getRequestDictionary()]); const t = getHomeEnergyCopy(locale); return <PlatformShell><main className="mx-auto w-full max-w-6xl text-slate-800"><p className="eyebrow">{t.eyebrow}</p><h1 className="mt-3 text-4xl font-bold text-slate-950">{t.title}</h1><p className="mt-4 max-w-3xl text-slate-700">{t.description}</p><div className="mt-8"><HomeEnergyProfileForm locale={locale} dictionary={dictionary}/></div></main></PlatformShell>; }
