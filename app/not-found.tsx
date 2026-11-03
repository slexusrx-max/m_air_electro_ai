import Link from "@/components/localized-link";
import { PlatformShell } from "@/components/platform-shell";
import { getRequestLocale } from "@/lib/i18n/request";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested M Air Electro AI page could not be found.",
  robots: { index: false, follow: false },
  alternates: {},
};

export default async function NotFound() {
  const ro = await getRequestLocale() === "ro";
  return <PlatformShell><main className="commerce-page content-panel"><p className="eyebrow">404</p><h1 className="finder-title">{ro ? "Pagina nu a fost găsită." : "Page not found."}</h1><p>{ro ? "Continuă cu o categorie, caută echipamentul sau alege o soluție." : "Continue with a category, search for equipment or choose a solution."}</p><div className="action-row"><Link className="button-primary" href="/marketplace">Marketplace</Link><Link href="/search">{ro ? "Caută" : "Search"}</Link><Link href="/solutions">{ro ? "Soluții" : "Solutions"}</Link></div></main></PlatformShell>;
}
