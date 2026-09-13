import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { Intro, LinkGrid } from "@/components/marketplace/shared";
import { guides, learnHubs } from "@/lib/marketplace/guides";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export async function generateMetadata() {
  const ro = (await getRequestLocale()) === "ro";
  return buildMetadata({
    title: ro
      ? "Ghiduri energetice și electrice"
      : "Energy and electrical learning centre",
    description: ro
      ? "Ghiduri pentru baterii, invertoare, solar și instalații: formule, exemple și verificări înainte de cumpărare."
      : "Battery, inverter, solar and installation guides with formulas, examples and checks before buying.",
    path: "/learn",
  });
}
export default async function Page() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return (
    <PlatformShell>
      <main className="commerce-page">
        <Intro
          eyebrow={ro ? "Învață înainte să cumperi" : "Learn before you buy"}
          title={
            ro
              ? "Decizii bune, de la primele calcule."
              : "Better decisions begin with the basics."
          }
          description={
            ro
              ? "18 ghiduri independente despre energie, putere, compatibilitate și alegerea echipamentelor."
              : "18 independent guides to energy, power, compatibility and equipment selection."
          }
        />
        <LinkGrid
          locale={locale}
          items={learnHubs.map((h) => ({
            href: `/learn/${h.slug}`,
            title: h.title,
          }))}
        />
        <div className="action-row">
          <Link href="/calculators">
            {ro ? "Calculatoare" : "Calculators"} →
          </Link>
          <Link href="/faq">FAQ →</Link>
        </div>
        <h2>{ro ? "Toate ghidurile" : "All guides"}</h2>
        <LinkGrid
          locale={locale}
          items={guides.map((g) => ({
            href: `/learn/${g.slug}`,
            title: g.title,
            intro: g.intro,
            summary: g.intro,
          }))}
        />
      </main>
    </PlatformShell>
  );
}
