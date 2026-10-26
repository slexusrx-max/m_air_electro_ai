import { PlatformShell } from '@/components/platform-shell';
import { DiscoveryHome } from '@/components/marketplace/discovery-home';
import { buildMetadata } from '@/lib/metadata';
import { getRequestLocale } from '@/lib/i18n/request';
export async function generateMetadata(){const ro=await getRequestLocale()==='ro';return buildMetadata({locale: ro ? "ro" : "en",title:ro?'Sisteme solare și energie de rezervă':'Solar and backup power sizing',description:ro?'Alege panouri, baterii, invertoare și stații de energie. Calculează puterea și autonomia, compară modele și consultă ghiduri documentate.':'Choose solar panels, batteries, inverters, and power stations. Calculate power and runtime, compare models, and read sourced guides.',path:'/'});}
export default function Home(){return <PlatformShell mobileBrandIntro><DiscoveryHome/></PlatformShell>;}
