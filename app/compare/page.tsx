import { cleanQuery } from '@/lib/marketplace/query';
import { PlatformShell } from '@/components/platform-shell';
import { Intro } from '@/components/marketplace/shared';
import { Comparison } from '@/components/marketplace/compare-page';
import { getRequestLocale } from '@/lib/i18n/request';
import { buildMetadata } from '@/lib/metadata';
export const metadata={...buildMetadata({title:'Compară echipamente / Compare equipment',description:'Compare 2–4 curated products or equipment classes using documented fields and explicit limitations.',path:'/compare'}),robots:{index:false,follow:true}};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){const q=cleanQuery(await searchParams);const ids=q.ids??[q.item1,q.item2,q.item3,q.item4].filter(Boolean).join(',');const ro=await getRequestLocale()==='ro';return <PlatformShell><main className="commerce-page"><Intro title={ro?'Compară înainte să alegi.':'Compare before choosing.'} description={ro?'Putere, capacitate, utilizare și limite — numai din datele disponibile.':'Power, capacity, use and limitations — only from the available data.'}/><Comparison ids={ids} ro={ro}/></main></PlatformShell>;}
