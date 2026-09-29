import { PlatformShell } from '@/components/platform-shell';
import { Intro, LinkGrid } from '@/components/marketplace/shared';
import { getRequestLocale } from '@/lib/i18n/request';
import { navigation } from '@/lib/marketplace/navigation';
import { bilingual } from '@/lib/marketplace/content';
import { buildMetadata } from '@/lib/metadata';
export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculatoare electrice" : "Engineering calculators",
    description: ro
      ? "Calcule pentru baterii, rezervă, panouri solare, cabluri, cădere de tensiune, generatoare, motoare și protecții."
      : "Battery, backup, solar, cable, voltage drop, generator, motor and protection calculations for equipment planning.",
    path: "/calculators",
  });
}
export default async function Page(){const locale=await getRequestLocale();const ro=locale==='ro';const items=navigation(locale)[2].children;return <PlatformShell><main className="commerce-page"><Intro title={ro?'Calculează înainte de alegere.':'Calculate before choosing.'} description={ro?'Instrumente deterministe cu ipoteze explicite. Rezultatele susțin selecția, nu înlocuiesc proiectarea calificată.':'Deterministic tools with explicit assumptions. Results support selection and do not replace qualified design.'}/><LinkGrid locale={locale} items={items.map(i=>({href:i.href,title:bilingual(i.label,i.label)}))}/></main></PlatformShell>;}
