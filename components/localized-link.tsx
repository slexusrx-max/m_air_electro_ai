"use client";
import NextLink from "next/link";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { localizedPath, type PublicLocale } from "@/lib/i18n/routing";
const LocaleContext = createContext<PublicLocale>("ro");
export function PublicLocaleProvider({ locale, children }: { locale: PublicLocale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export default function LocalizedLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useContext(LocaleContext);
  const target = typeof href === "string" ? localizedPath(href, locale)
    : { ...href, pathname: href.pathname ? localizedPath(href.pathname, locale) : href.pathname };
  return <NextLink {...props} href={target} />;
}
