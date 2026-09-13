import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/auth/','/dashboard','/admin','/client','/expert','/supplier','/onboarding']},sitemap:absoluteUrl('/sitemap.xml'),host:absoluteUrl()};}
