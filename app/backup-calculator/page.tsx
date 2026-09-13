import { PlatformShell } from '@/components/platform-shell';
import { BackupCalculator } from '@/components/product/backup-calculator';
import { Intro } from '@/components/marketplace/shared';
import { getRequestDictionary, getRequestLocale } from '@/lib/i18n/request';
import { buildMetadata } from '@/lib/metadata';
export const metadata=buildMetadata({title:'Calculator rezervă / Backup calculator',description:'Size battery energy and inverter power from essential loads, individual operating hours and starting demand.',path:'/backup-calculator'});
export default async function Page(){const ro=await getRequestLocale()==='ro';return <PlatformShell><main className="commerce-page"><Intro title={ro?'Calculator de energie de rezervă':'Backup energy calculator'} description={ro?'Alege consumatorii esențiali și orele lor. Energia și vârful de pornire sunt verificate separat.':'Choose essential loads and their operating hours. Energy and starting demand are checked separately.'}/><BackupCalculator dictionary={await getRequestDictionary()}/></main></PlatformShell>;}
