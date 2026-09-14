import { PlatformShell } from '@/components/platform-shell';
import { DiscoveryHome } from '@/components/marketplace/discovery-home';
import { buildMetadata } from '@/lib/metadata';
import { getRequestLocale } from '@/lib/i18n/request';
export async function generateMetadata(){const ro=await getRequestLocale()==='ro';return buildMetadata({title:ro?'Echipamente energetice: descoperire, calcule și comparații':'Independent energy equipment discovery, sizing and comparison',description:ro?'Descoperă baterii, panouri solare, invertoare și echipamente electrice pentru România și UE. Calculează, compară și vizitează furnizorul.':'Discover batteries, solar panels, inverters and electrical equipment for Romania and the EU. Calculate, compare and visit the supplier.',path:'/'});}
export default function Home(){return <PlatformShell><DiscoveryHome/></PlatformShell>;}
