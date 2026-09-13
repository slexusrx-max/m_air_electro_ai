import { notFound, permanentRedirect } from 'next/navigation';
import { legacyRedirects } from '@/lib/marketplace/routes';
export default async function Page({params}:{params:Promise<{slug:string}>}) { const path=legacyRedirects[`/knowledge-base/${(await params).slug}`];if(!path)notFound();permanentRedirect(path); }
