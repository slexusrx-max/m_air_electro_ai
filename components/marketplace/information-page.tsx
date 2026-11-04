import { PublisherDetails } from "@/components/publisher-details";
import { BrandArtwork } from "@/components/brand-artwork";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
import { siteConfig } from "@/lib/site";
import Link from "@/components/localized-link";
import { PlatformShell } from "@/components/platform-shell";
import { Intro, Breadcrumbs } from "./shared";
import { information } from "@/lib/marketplace/information";
import { local } from "@/lib/marketplace/content";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
import { contactReady } from "@/lib/contact";
import { analyticsProvider } from "@/lib/analytics";
export async function informationMetadata(slug: string) {
  const locale = await getRequestLocale();
  const p = information[slug];
  return buildMetadata({
    locale,
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
  const measurementProvider = analyticsProvider();
  const sections = active && slug !== "affiliate-disclosure"
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
        {slug === "about" && <BrandArtwork />}
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
            ? (ro ? "Formularul folosește Brevo SMTP pentru trimitere și Cloudflare Turnstile pentru protecție anti-spam. Numele, adresa și mesajul sunt folosite pentru răspuns. Nu stocăm mesajele într-o bază de date a site-ului." : "The form uses Brevo SMTP for sending and Cloudflare Turnstile for spam protection. Your name, email and message are used to answer your enquiry. We do not store messages in a website database.")
            : (ro ? "Formularul de pe site este dezactivat și nu colectează mesaje. Linkurile de email deschid propria ta aplicație de email." : "The website form is disabled and does not collect messages. Email links open your own email application.")}</p>
          <p>{measurementProvider === "plausible"
            ? (ro ? "Analiza Plausible este opțională și pornește numai după acord. Trimitem ruta publică și tipul acțiunii. Pentru clicuri către furnizori includem identificatorii publici ai produsului, furnizorului și categoriei, plus limba. Plausible înregistrează momentul evenimentului. Nu trimitem căutări, date din formular, calcule sau identificatori de cont. Furnizorul primește adresa IP și agentul browserului pentru procesare." : "Plausible analytics is optional and starts only after consent. We send the public route and action type. Supplier clicks also include public product, supplier and category identifiers, plus language. Plausible records the event time. We never send searches, form contents, calculation inputs or account identifiers. The provider receives the IP address and browser user agent for processing.")
            : measurementProvider === "ga4"
              ? (ro ? "Google Analytics 4 (GA4) este configurat pentru analiza opțională. Scriptul Google și evenimentele de măsurare pornesc numai după acordul tău. Google poate folosi cookie-uri pentru a distinge vizitele și sesiunile și primește date tehnice, inclusiv adresa IP și informații despre browser/dispozitiv. Acestea pot fi folosite pentru statistici geografice aproximative; nu solicităm localizarea precisă. Configurarea nu garantează că Google a primit fiecare eveniment." : "Google Analytics 4 (GA4) is configured for optional analytics. The Google script and measurement events start only after your consent. Google may use cookies to distinguish visits and sessions and receives technical data, including your IP address and browser/device information. These may be used for approximate geographic statistics; we do not request precise location. Configuration does not guarantee that Google received every event.")
              : (ro ? "Analiza opțională nu este configurată în această versiune: nu încărcăm scriptul GA4 și nu trimitem evenimente către GA4 sau Plausible." : "Optional analytics is not configured in this version: we do not load the GA4 script or send events to GA4 or Plausible.")}</p>
          <p>{ro ? "Acordul pentru analiză nu activează măsurarea Google Ads, Google Signals sau personalizarea reclamelor. Nu trimitem evenimente de cumpărare sau venituri: comenzile și comisioanele afiliate sunt confirmate separat de Impact și comerciant." : "Analytics consent does not enable Google Ads measurement, Google Signals or ad personalization. We do not send purchase or revenue events: affiliate orders and commissions are confirmed separately by Impact and the merchant."}</p>
          <p>{ro ? "Alegerea din setările de analiză este păstrată local pentru 180 de zile și poate fi modificată oricând. Refuzul nu limitează instrumentele." : "Your Analytics settings choice is stored locally for 180 days and can be changed at any time. Refusal does not limit the tools."}</p>
          <p>{ro ? "Poți retrage acordul din Setări analiză, în subsolul oricărei pagini. Oprim colectarea opțională ulterioară; retragerea nu șterge automat datele deja primite de furnizor. Un acord mai vechi pentru alt furnizor nu activează GA4. Nu măsurăm paginile private ale contului sau browserele automatizate și respectăm Do Not Track și Global Privacy Control." : "You can withdraw consent in Analytics settings in the footer of any page. We stop subsequent optional collection; withdrawal does not automatically delete data already received by the provider. An earlier consent for another provider does not activate GA4. We exclude private account pages and automated browsers and respect Do Not Track and Global Privacy Control."}</p>
          {measurementProvider === "ga4" && <p>{ro ? "Trimitem numai rute publice fără parametri sau fragmente și identificatori publici de catalog, inclusiv marca și SKU când sunt documentate. Nu trimitem nume, emailuri, date din cont, căutări, valori introduse în calculatoare sau URL-uri complete de afiliere. Pentru surse de trafic recunoscute păstrăm numai originea dintr-o listă fixă de motoare de căutare și platforme sociale; eliminăm calea și parametrii. Alte surse și parametrii campaniilor sunt omiși, deci atribuirea canalelor este limitată." : "We send only public paths without query strings or fragments and public catalog identifiers, including brand and SKU when documented. We do not send names, emails, account data, searches, calculator inputs or full affiliate URLs. For recognized traffic sources, we retain only the origin from a fixed list of search engines and social platforms, removing paths and parameters. Other sources and campaign parameters are omitted, so channel attribution is limited."}</p>}
          {measurementProvider === "ga4" && <p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{ro ? "Politica de confidențialitate Google" : "Google Privacy Policy"}</a>{" · "}<a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">{ro ? "Prelucrarea și protecția datelor în Google Analytics" : "Google Analytics data processing and safeguards"}</a></p>}
          <p>{ro ? "Cu acordul pentru analiză, măsurăm vizualizări de produse, adăugări și eliminări din comparație, începutul și finalizarea calculelor și a ghidului de selecție. Folosim identificatorii publici ai produsului, limba și ruta paginii; includem furnizorul și categoria când sunt disponibile. Măsurăm separat clicurile afiliate și toate ieșirile către furnizori; acestea nu reprezintă cumpărări. Măsurăm și acceptarea unui mesaj de către server pentru livrare, fără conținutul formularului. Acceptarea nu dovedește primirea în inbox sau o vânzare. Respectăm Do Not Track și Global Privacy Control." : "With analytics consent, we measure product views, comparison additions and removals, and starts and completions of calculators and the selection finder. We use public product identifiers, language and page path, with supplier and category where available. Affiliate clicks and all supplier departures are measured separately; these are not purchases. We also measure server acceptance of a message for delivery, without form contents. Acceptance does not prove inbox receipt or a sale. We respect Do Not Track and Global Privacy Control."}</p>
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
