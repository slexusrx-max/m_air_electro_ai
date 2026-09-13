import { PlatformShell } from '@/components/platform-shell';
import { SolutionFinder } from '@/components/marketplace/solution-finder';
import { getRequestDictionary } from '@/lib/i18n/request';
import { buildMetadata } from '@/lib/metadata';
export const metadata=buildMetadata({title:'Găsește soluția / Find My Solution',description:'Size an energy system from load, starting power, runtime and existing equipment, then compare catalog candidates.',path:'/marketplace/find-my-solution'});
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){return <PlatformShell><SolutionFinder dictionary={await getRequestDictionary()} initial={await searchParams}/></PlatformShell>;}
