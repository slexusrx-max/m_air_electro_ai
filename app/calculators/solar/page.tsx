import { PlatformShell } from "@/components/platform-shell";
import { Intro } from "@/components/marketplace/shared";
import { SolarCalculator } from "@/components/marketplace/solar-calculator";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export const metadata=buildMetadata({title:"Dimensionare solară / Solar sizing",description:"Estimate solar array watts from daily energy, peak sun hours and an explicit yield factor.",path:"/calculators/solar"});
export default async function Page(){const ro=await getRequestLocale()==="ro";return <PlatformShell><main className="commerce-page"><Intro title={ro?"Dimensionare solară":"Solar array sizing"} description={ro?"Calcul determinist din consum zilnic și producție estimată. Nu este proiect certificat.":"A deterministic calculation from daily demand and expected yield. This is not a certified design."}/><SolarCalculator ro={ro}/></main></PlatformShell>;}
