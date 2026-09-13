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
    mailto = siteConfig.contactEmail
      ? `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("M Air Electro AI enquiry")}`
      : siteConfig.publicContactUrl;
  return (
    <PlatformShell>
      <main className="mx-auto max-w-4xl space-y-7">
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
          <h2>{c.ro ? "Contact direct" : "Direct contact"}</h2>
          <a
            className="mt-4 inline-block break-all text-xl font-bold text-teal-800 underline"
            href={mailto}
          >
            {siteConfig.contactEmail ??
              (c.ro
                ? "Contactează proiectul pe GitHub"
                : "Contact the project on GitHub")}
          </a>
          <p>
            {siteConfig.contactEmail
              ? c.ro
                ? "Butonul deschide aplicația ta de email. Mesajul este trimis numai după ce îl trimiți din acea aplicație."
                : "The button opens your email application. Your message is sent only when you submit it there."
              : c.ro
                ? "Poți trimite întrebări și corecturi prin pagina publică a proiectului. Ai nevoie de un cont GitHub; mesajul va fi public. Nu include date personale, parole sau documente."
                : "Send questions and corrections through the public project page. A GitHub account is required and your message will be public. Do not include personal data, passwords or documents."}
          </p>
          <a href={mailto} className="button-primary mt-5">
            {siteConfig.contactEmail
              ? c.ro
                ? "Scrie un email"
                : "Write an email"
              : c.ro
                ? "Deschide pagina de contact"
                : "Open contact page"}
          </a>
        </section>
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
