import { PublisherDetails } from "@/components/publisher-details";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
import { siteConfig } from "@/lib/site";
import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { Intro, Breadcrumbs } from "./shared";
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
        <Breadcrumbs items={[{name: local(p.title, locale), path: `/${slug}`}]} />
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
          <PublisherDetails ro={ro} />
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
        {slug === "partnerships" && <section className="content-panel"><h2>{ro ? "Exemple de conținut" : "Content examples"}</h2><ul><li><Link href="/learn/how-to-size-backup-battery">{ro ? "Dimensionarea bateriei de rezervă" : "Backup battery sizing guide"}</Link></li><li><Link href="/compare?ids=renogy-mini-100,renogy-mini-200">{ro ? "Comparație Core Mini" : "Core Mini comparison"}</Link></li><li><Link href="/marketplace/find-my-solution">{ro ? "Dimensionarea sistemului" : "System sizing"}</Link></li></ul><p>{siteConfig.partnershipsEmail ? <a href={`mailto:${siteConfig.partnershipsEmail}`}>{siteConfig.partnershipsEmail}</a> : (ro ? "Contactul privat pentru parteneriate nu este încă confirmat." : "Private partnership contact is not yet confirmed.")}</p></section>}
        {slug === "privacy" && <section className="content-panel"><h2>{ro ? "Formular și analiză opțională" : "Contact form and optional analytics"}</h2><p>{ro ? "Formularul configurat folosește Resend pentru email și Cloudflare Turnstile pentru protecție. Numele, adresa și mesajul sunt folosite pentru răspuns, nu abonare. Nu stocăm mesajele într-o bază de date a site-ului. Operatorul trebuie să confirme perioada de păstrare în căsuța poștală și contractele furnizorilor înainte de activare." : "The configured form uses Resend for email and Cloudflare Turnstile for abuse protection. Name, email and message are used to reply, not subscribe you. We do not store messages in a site database. The operator must confirm mailbox retention and provider agreements before activation."}</p><p>{ro ? "Analiza Plausible este opțională și dezactivată până la acord. Alegerea este păstrată local pentru 180 de zile și poate fi modificată din setările de analiză. Trimitem numai ruta publică și tipul acțiunii; nu trimitem căutări, date din formular sau calcule. Furnizorul primește adresa IP și agentul browserului pentru procesare. Refuzul nu limitează instrumentele." : "Plausible analytics is optional and disabled until consent. Your choice is stored locally for 180 days and can be changed in Analytics settings. We send only the public route and action type, never searches, form contents or calculation inputs. The provider receives IP address and browser user agent for processing. Refusal does not limit the tools."}</p><p>{siteConfig.privacyEmail ? <a href={`mailto:${siteConfig.privacyEmail}`}>{siteConfig.privacyEmail}</a> : (ro ? "Contactul privat pentru date personale nu este încă confirmat." : "Private data protection contact is not yet confirmed.")}</p></section>}
        <div className="action-row">
          <Link className="button-primary" href="/marketplace">
            {ro ? "Echipamente" : "Equipment"}
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
