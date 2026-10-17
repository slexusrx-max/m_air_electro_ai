import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { publicRoutes } from '@/lib/marketplace/routes';
import { localizedPath } from '@/lib/i18n/routing';
export default function sitemap(): MetadataRoute.Sitemap {
  return [...new Set(publicRoutes)].flatMap(path => (["ro", "en"] as const).map(locale => ({
    url: absoluteUrl(localizedPath(path, locale)),
    alternates: { languages: { ro: absoluteUrl(localizedPath(path, "ro")), en: absoluteUrl(localizedPath(path, "en")) } },
  })));
}
