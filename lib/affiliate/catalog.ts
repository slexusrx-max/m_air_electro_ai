import { equipment } from '@/lib/marketplace/catalog-data';
import { legacyCategories, categoryByPath } from '@/lib/marketplace/content';
import type { MarketplaceRegion, ProductCategory } from '@/lib/affiliate/types';
export const catalog = equipment;
export const marketplaceCategories = Object.entries(legacyCategories).map(([slug, path]) => ({ slug: slug as ProductCategory, name: categoryByPath(path)!.title.en, summary: categoryByPath(path)!.summary.en, icon: '↗' }));
export function productsForCategory(category: string) { return catalog.filter(p => p.category === category); }
export function productsForRegion(region: MarketplaceRegion) { return catalog.filter(p => p.merchantRegion === region || (region === "RO" && p.merchantRegion === "EU")); }
export function productBySlug(slug: string) { return catalog.find(p => p.slug === slug); }
