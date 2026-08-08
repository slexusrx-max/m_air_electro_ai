import "server-only";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export const localeCookieName = "mr-electro-locale";
export async function getRequestLocale(): Promise<Locale> { const value = (await cookies()).get(localeCookieName)?.value; return value === "en" || value === "uk" ? value : "uk"; }
export async function getRequestDictionary(): Promise<Dictionary> { return getDictionary(await getRequestLocale()); }
