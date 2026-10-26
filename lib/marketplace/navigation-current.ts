import type { NavigationGroup, NavigationLink } from './navigation';
import { stripLocale } from '../i18n/routing';

// The most specific destination owns the section, including shortcuts outside
// its URL tree. Water and the solution finder override Marketplace's prefix.
export function currentNavigationSection(path: string, groups: NavigationGroup[]): string | undefined {
  const pathname = stripLocale(path).split(/[?#]/)[0].replace(/\/$/, '') || '/';
  const matches = (href: string) => pathname === href || pathname.startsWith(href + '/');
  if (matches('/partnerships')) return '/about';
  if (matches('/marketplace/water') || matches('/waterdrop') || pathname.startsWith('/marketplace/products/waterdrop-')) return '/marketplace';
  const destinations = (items: NavigationLink[]): string[] => items.flatMap(item => [item.href, ...destinations(item.children ?? [])]);
  let selected: string | undefined;
  let score = -1;
  for (const group of groups) {
    for (const href of [group.href, ...destinations(group.children)]) {
      const specificity = href.length * 2 + Number(href === group.href);
      if (matches(href) && specificity > score) { selected = group.href; score = specificity; }
    }
  }
  return selected ?? (pathname === '/search' ? '/marketplace' : undefined);
}

