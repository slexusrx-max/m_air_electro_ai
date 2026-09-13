import { PlatformShell } from "@/components/platform-shell";
import { Intro, LinkGrid } from "@/components/marketplace/shared";
import { solutions } from "@/lib/marketplace/solutions";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export async function generateMetadata() {
  const ro = (await getRequestLocale()) === "ro";
  return buildMetadata({
    title: ro ? "Soluții energetice" : "Energy solutions",
    description: ro
      ? "Opt scenarii pentru alegerea stocării, invertorului, solarului și rezervei."
      : "Eight application paths for selecting storage, inverters, solar and backup equipment.",
    path: "/solutions",
  });
}
export default async function Page() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return (
    <PlatformShell>
      <main className="commerce-page">
        <Intro
          eyebrow="România / EU"
          title={
            ro
              ? "Începe cu ce vrei să alimentezi."
              : "Start with what you need to power."
          }
          description={
            ro
              ? "Alege scenariul, verifică sarcinile și înțelege componentele înainte de cumpărare."
              : "Choose the setting, check the loads and understand the components before buying."
          }
        />
        <LinkGrid
          locale={locale}
          items={solutions.map((s) => ({
            href: `/solutions/${s.slug}`,
            title: s.title,
            summary: s.summary,
          }))}
        />
      </main>
    </PlatformShell>
  );
}
