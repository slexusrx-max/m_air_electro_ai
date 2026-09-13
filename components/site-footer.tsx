import { DeepFooter } from './marketplace/deep-footer';
import type { Dictionary } from '@/lib/i18n/types';
export function SiteFooter({dictionary}:{dictionary:Dictionary}) { return <DeepFooter locale={dictionary['locale.code']==='ro'?'ro':'en'}/>; }
