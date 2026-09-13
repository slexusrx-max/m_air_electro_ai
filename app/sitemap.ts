import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { publicRoutes } from '@/lib/marketplace/routes';
export default function sitemap():MetadataRoute.Sitemap{return [...new Set(publicRoutes)].map(route=>({url:absoluteUrl(route),changeFrequency:route==='/'?'weekly':'monthly',priority:route==='/'?1:route==='/marketplace'?0.9:0.7}));}
