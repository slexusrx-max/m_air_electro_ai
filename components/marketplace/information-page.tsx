import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
import { siteConfig } from "@/lib/site";
import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { Intro } from "./shared";
import { information } from "@/lib/marketplace/information";
import { local } from "@/lib/marketplace/content";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export async function informationMetadata(slug: string) {
  const locale = await getRequestLocale();
  const p = information[slug];
  return buildMetadata({
    title: local(p.title, locale),
    description: local(p.intro, locale),
    path: `/${slug}`,
  });
}
export async function InformationPage({ slug }: { slug: string }) {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  const p = information[slug];
  const t = await getRequestDictionary();
  const active = t["affiliate.active"] === "true";
  const sections = active
    ? p.sections.map((s) =>
        ["Current status", "Commercial role", "After approval", "External sites and requests"].includes(
          s.title.en,
        )
          ? {
              ...s,
              body: {
                en: commercialCopy({ ...t, locale: "en" }).supplierNote,
                ro: commercialCopy({ ...t, locale: "ro" }).supplierNote,
              },
            }
          : s,
      )
    : p.sections;
  return (
    <PlatformShell>
      <main className="commerce-page">
        <Intro
          title={local(p.title, locale)}
          description={local(p.intro, locale)}
        />
        {sections.map((s) => (
          <section className="content-panel" key={s.title.en}>
            <h2>{local(s.title, locale)}</h2>
            <p>{local(s.body, locale)}</p>
          </section>
        ))}
        <section className="content-panel">
          <h2>{ro ? "Editor și contact" : "Publisher and contact"}</h2>
          <p>
            {siteConfig.operatorName ?? "M Air Electro AI"} ·{" "}
            <a href={siteConfig.publisherProfile}>
              {ro ? "Profil public" : "Public profile"}
            </a>
          </p>
          <p>
            <a
              href={
                siteConfig.contactEmail
                  ? `mailto:${siteConfig.contactEmail}`
                  : siteConfig.publicContactUrl
              }
            >
              {siteConfig.contactEmail ??
                (ro
                  ? "Contact prin pagina publică GitHub"
                  : "Contact through the public GitHub page")}
            </a>
          </p>
          {slug === "privacy" && (
            <>
              <p>
                {ro
                  ? "Pentru solicitări privind datele, folosește contactul de mai sus. Nu trimite date personale în mesaje publice. Poți contacta autoritatea română de supraveghere."
                  : "Use the contact above for data requests. Do not include personal data in public messages. You may contact the Romanian supervisory authority."}
              </p>
              <a
                href="https://www.dataprotection.ro/"
                rel="noopener noreferrer"
                target="_blank"
              >
                ANSPDCP ↗
              </a>
              {active && (
                <p>
                  {ro
                    ? "Linkurile afiliate marcate pot trece prin Impact pentru atribuire; Impact și comerciantul aplică propriile politici. Nu instalăm un pixel de afiliere în paginile site-ului."
                    : "Marked affiliate links may pass through Impact for attribution; Impact and the merchant apply their own policies. We do not install an affiliate pixel on site pages."}
                </p>
              )}
            </>
          )}
        </section>
        <div className="action-row">
          <Link className="button-primary" href="/marketplace">
            Marketplace
          </Link>
          <Link
            href={
              slug === "business"
                ? "/solutions/business-backup"
                : "/marketplace/find-my-solution"
            }
          >
            {ro ? "Planifică sistemul" : "Plan a system"} →
          </Link>
          <Link href="/contact">Contact →</Link>
        </div>
      </main>
    </PlatformShell>
  );
}
