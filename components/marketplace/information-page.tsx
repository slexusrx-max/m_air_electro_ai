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
import { contactReady } from "@/lib/contact";
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
  const contactKind = slug === "privacy" ? "privacy" : slug === "partnerships" ? "partnerships" : "contact";
  const contactEmail = siteConfig[`${contactKind}Email`] ?? siteConfig.publicEmailAddresses[contactKind];
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
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
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
        {slug === "partnerships" && <section className="content-panel"><h2>{ro ? "Exemple de conținut" : "Content examples"}</h2><ul><li><Link href="/learn/how-to-size-backup-battery">{ro ? "Dimensionarea bateriei de rezervă" : "Backup battery sizing guide"}</Link></li><li><Link href="/compare?ids=renogy-mini-100,renogy-mini-200">{ro ? "Comparație Core Mini" : "Core Mini comparison"}</Link></li><li><Link href="/marketplace/find-my-solution">{ro ? "Dimensionarea sistemului" : "System sizing"}</Link></li></ul><p><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p></section>}
        {slug === "privacy" && <section className="content-panel">
          <h2>{ro ? "Email, formular și analiză opțională" : "Email, contact form and optional analytics"}</h2>
          <p>{ro ? "Emailurile trimise adreselor domeniului sunt redirecționate prin Cloudflare Email Routing către căsuța poștală a editorului, găzduită de Google. Adresa expeditorului și mesajul sunt prelucrate pentru gestionarea solicitării, fără abonare la marketing. Pentru acces, corectare sau ștergere, scrie la adresa de confidențialitate de mai sus." : "Emails sent to our domain addresses are forwarded through Cloudflare Email Routing to the publisher's Google-hosted inbox. Your sender address and message are processed to handle your enquiry, without a marketing subscription. For access, correction or deletion requests, use the privacy address above."}</p>
          <p>{contactReady()
            ? (ro ? "Formularul folosește Resend pentru trimitere și Cloudflare Turnstile pentru protecție anti-spam. Numele, adresa și mesajul sunt folosite pentru răspuns. Nu stocăm mesajele într-o bază de date a site-ului." : "The form uses Resend for sending and Cloudflare Turnstile for spam protection. Your name, email and message are used to answer your enquiry. We do not store messages in a website database.")
            : (ro ? "Formularul de pe site este dezactivat și nu colectează mesaje. Linkurile de email deschid propria ta aplicație de email." : "The website form is disabled and does not collect messages. Email links open your own email application.")}</p>
          <p>{process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
            ? (ro ? "Analiza Plausible este opțională și pornește numai după acord. Trimitem numai ruta publică și tipul acțiunii, fără căutări, date din formular sau calcule. Furnizorul primește adresa IP și agentul browserului pentru procesare." : "Plausible analytics is optional and starts only after consent. We send only the public route and action type, never searches, form contents or calculation inputs. The provider receives the IP address and browser user agent for processing.")
            : (ro ? "Analiza opțională Plausible nu este activată în această versiune a site-ului; nu sunt trimise evenimente de analiză." : "Optional Plausible analytics is not enabled on this version of the website; no analytics events are sent.")}</p>
          <p>{ro ? "Alegerea din setările de analiză este păstrată local pentru 180 de zile și poate fi modificată oricând. Refuzul nu limitează instrumentele." : "Your Analytics settings choice is stored locally for 180 days and can be changed at any time. Refusal does not limit the tools."}</p>
        </section>}
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
