export type PublicLocale = "ro" | "en";
export const localeHeader = "x-mair-locale";
export function stripLocale(path: string) {
  return path.replace(/^\/en(?=\/|[?#]|$)/, "") || "/";
}
// Assets, API and account routes are not part of the public language tree.
export function isLocalizedPublicPath(path: string) {
  const pathname = stripLocale(path).split(/[?#]/)[0] || "/";
  return /^\/(?:marketplace|solutions|learn|calculators)(?:\/|$)/.test(pathname) ||
    ["/", "/search", "/compare", "/backup-calculator", "/renogy", "/renogy/catalog", "/waterdrop",
      "/faq", "/about", "/editorial-policy", "/author-policy", "/corrections-policy",
      "/ai-use-policy", "/partnerships", "/business", "/experts", "/contact",
      "/privacy", "/terms", "/affiliate-disclosure", "/methodology", "/photo-credits"].includes(pathname);
}
export function localizedPath(path: string, locale: string) {
  if (!path.startsWith("/") || path.startsWith("//") || !isLocalizedPublicPath(path)) return path;
  const base = stripLocale(path);
  const normalized = base.startsWith("/") ? base : `/${base}`;
  return locale === "en" ? `/en${normalized.replace(/^\/(?=[?#]|$)/, "")}` : normalized;
}
