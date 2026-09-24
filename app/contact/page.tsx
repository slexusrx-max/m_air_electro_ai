import { ContactForm } from "@/components/contact-form";
import { contactReady } from "@/lib/contact";
import { PublisherDetails } from "@/components/publisher-details";
import { PlatformShell } from "@/components/platform-shell";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Contact M Air Electro AI",
  description:
    "Întrebări despre calcule, conținut editorial și selecția echipamentelor pentru România.",
  path: "/contact",
});
export default async function ContactPage() {
  const t = await getRequestDictionary(),
    c = commercialCopy(t),
    contactEmail = siteConfig.contactEmail ?? siteConfig.publicEmailAddresses.contact,
    mailto = `mailto:${contactEmail}?subject=${encodeURIComponent("M Air Electro AI enquiry")}`;
  return (
    <PlatformShell>
      <main className="commerce-page">
        <section className="brand-glass-card rounded-3xl p-7">
          <p className="eyebrow">M Air Electro AI</p>
          <h1 className="mt-3 text-4xl font-bold">
            {c.ro
              ? "Ai o întrebare despre planul tău energetic?"
              : "A question about your energy plan?"}
          </h1>
          <p className="mt-5 text-lg leading-8">
            {c.ro
              ? "Scrie pentru clarificări despre formule, corecturi ale ghidurilor sau informații despre legăturile către furnizori."
              : "Write for clarification about formulas, corrections to guides or information about supplier links."}
          </p>
        </section>
        <section className="info-card">
          <h2>{c.ro ? "Email și canal public suplimentar" : "Email and supplementary public channel"}</h2>
          <a
            className="mt-4 inline-block break-all text-xl font-bold text-teal-800 underline"
            href={mailto}
          >
            {contactEmail}
          </a>
          <p>
            {c.ro
                ? "Butonul deschide aplicația ta de email. Mesajul este trimis numai după ce îl trimiți din acea aplicație."
                : "The button opens your email application. Your message is sent only when you submit it there."}
          </p>
          <a href={mailto} className="button-primary mt-5">
            {c.ro ? "Scrie un email" : "Write an email"}
          </a>
          <p className="mt-5">{c.ro ? "Primirea mesajelor la contact@mairelectroai.com a fost verificată printr-un test real de livrare." : "Incoming email to contact@mairelectroai.com has been verified with a real delivery test."}</p>
          <dl className="mt-5 grid gap-2">
            <dt>{c.ro ? "Parteneriate" : "Partnerships"}</dt><dd><a className="break-all underline" href={`mailto:${siteConfig.partnershipsEmail ?? siteConfig.publicEmailAddresses.partnerships}`}>{siteConfig.partnershipsEmail ?? siteConfig.publicEmailAddresses.partnerships}</a></dd>
            <dt>{c.ro ? "Confidențialitate" : "Privacy"}</dt><dd><a className="break-all underline" href={`mailto:${siteConfig.privacyEmail ?? siteConfig.publicEmailAddresses.privacy}`}>{siteConfig.privacyEmail ?? siteConfig.publicEmailAddresses.privacy}</a></dd>
          </dl>
          <p><a href={siteConfig.publicContactUrl} className="underline">{c.ro ? "Raportează o problemă publică pe GitHub" : "Report a public issue on GitHub"}</a>. {c.ro ? "Nu publica date personale, parole sau documente." : "Do not post personal data, passwords or documents."}</p>
        </section>
        <ContactForm ro={c.ro} enabled={contactReady()} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        <PublisherDetails ro={c.ro} />
        <section className="info-card">
          <h2>
            {c.ro
              ? "Întrebări despre o comandă?"
              : "A question about an order?"}
          </h2>
          <p>
            {c.ro
              ? "Pentru plată, livrare, garanție sau retur, contactează comerciantul de la care ai cumpărat. M Air Electro AI nu primește comenzile și nu are acces la contul tău de client la furnizor."
              : "For payment, delivery, warranty or returns, contact the merchant you bought from. M Air does not receive orders or access your supplier customer account."}
          </p>
        </section>
        <p className="rounded-2xl bg-amber-50 p-5 text-sm leading-7">
          {c.safety}
        </p>
      </main>
    </PlatformShell>
  );
}
