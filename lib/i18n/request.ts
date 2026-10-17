import "server-only";
import { catalog } from "@/lib/affiliate/catalog";
import { supplierLink } from "@/lib/affiliate/providers";
import { cookies, headers } from "next/headers";
import { localeHeader } from "./routing";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export const localeCookieName = "mr-electro-locale";
export async function getRequestLocale(): Promise<Locale> {
  const routeLocale = (await headers()).get(localeHeader);
  if (routeLocale === "ro" || routeLocale === "en") return routeLocale;
  const value = (await cookies()).get(localeCookieName)?.value;
  return value === "en" || value === "ro" ? value : "ro";
}
export async function getRequestDictionary(): Promise<Dictionary> {
  const affiliateTrackingActive = catalog
    .filter((product) => product.productUrl)
    .some((product) => supplierLink(product).tracked);
  return {
    ...getDictionary(await getRequestLocale()),
    "affiliate.active": String(affiliateTrackingActive),
  };
}
