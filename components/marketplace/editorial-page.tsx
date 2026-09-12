import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { getRequestDictionary } from "@/lib/i18n/request";
import { editorial } from "@/lib/marketplace/editorial";
import { commercialCopy } from "@/lib/marketplace/copy";
import { siteConfig } from "@/lib/site";
export async function EditorialPage({
  page,
}: {
  page: keyof typeof editorial;
}) {
  const t = await getRequestDictionary(),
    c = commercialCopy(t),
    [title, intro, original] = editorial[page][c.ro ? "ro" : "en"];
  const active = t["affiliate.active"] === "true";
  let sections: ReadonlyArray<readonly [string, string]> = original;
  if (active && page === "affiliate-disclosure")
    sections = [
      [c.ro ? "Legături afiliate" : "Affiliate links", c.supplierNote],
      [
        c.ro ? "Cum sunt identificate" : "How links are identified",
        c.ro
          ? "Legăturile urmărite sunt marcate lângă buton. Alte trimiteri pot rămâne legături obișnuite, fără comision. Nu suntem distribuitor autorizat."
          : "Tracked links are marked beside the button. Other links may remain ordinary links without commission. We are not an authorised dealer.",
      ],
      ...original.slice(3),
    ];
  if (active && page === "about")
    sections = original.map(([h, b]) => [
      h,
      h === "Independență" || h === "Independence" ? c.supplierNote : b,
    ]);
  if (active && page === "privacy")
    sections = original.map(([h, b]) => [
      h,
      h === "Furnizori externi" || h === "External suppliers"
        ? c.ro
          ? "Legăturile afiliate marcate pot trece prin Impact pentru atribuirea achiziției. Impact și comerciantul aplică propriile politici privind datele și consimțământul. M Air nu instalează un pixel de afiliere în paginile sale."
          : "Marked affiliate links may pass through Impact for purchase attribution. Impact and the merchant apply their own data and consent policies. M Air does not install an affiliate pixel on its pages."
        : b,
    ]);
  return (
    <PlatformShell>
      <main className="mx-auto max-w-4xl space-y-7">
        <section className="brand-glass-card rounded-3xl p-7">
          <p className="eyebrow">M Air Electro AI</p>
          <h1 className="mt-3 text-4xl font-bold">{title}</h1>
          <p className="mt-4 text-lg leading-8">
            {page === "affiliate-disclosure" && t["affiliate.active"] === "true"
              ? c.supplierNote
              : intro}
          </p>
          <p className="mt-3 text-sm text-slate-600">
            {c.ro ? "Actualizat" : "Updated"}: 12.09.2026
          </p>
        </section>
        <div className="space-y-6 rounded-3xl border border-teal-900/15 bg-white/95 p-6 sm:p-9">
          {page === "about" || page === "privacy" ? (
            <section>
              <h2 className="text-xl font-bold">
                {c.ro ? "Editorul proiectului" : "Project publisher"}
              </h2>
              <p className="mt-3 leading-8">
                {siteConfig.operatorName ??
                  (c.ro
                    ? "Proiectul este publicat prin contul GitHub slexusrx-max."
                    : "The project is published through the GitHub account slexusrx-max.")}{" "}
                <a className="underline" href={siteConfig.publisherProfile}>
                  GitHub ↗
                </a>
              </p>
            </section>
          ) : null}
          {sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-xl font-bold">{heading}</h2>
              <p className="mt-3 leading-8 text-slate-700">{body}</p>
            </section>
          ))}
          <p className="border-t border-teal-900/15 pt-5 leading-7">
            {c.ro ? "Contact editorial" : "Editorial contact"}:{" "}
            <a
              className="break-all font-bold underline"
              href={
                siteConfig.contactEmail
                  ? `mailto:${siteConfig.contactEmail}`
                  : siteConfig.publicContactUrl
              }
            >
              {siteConfig.contactEmail ??
                (c.ro ? "Pagina publică a proiectului" : "Public project page")}
            </a>
            .
          </p>
          {page === "privacy" ? (
            <a
              className="block underline"
              href="https://www.dataprotection.ro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ANSPDCP ↗
            </a>
          ) : null}
        </div>
        <nav
          aria-label={c.ro ? "Pagini utile" : "Related pages"}
          className="flex flex-wrap gap-3"
        >
          <Link className="button-outline" href="/contact">
            {c.contact}
          </Link>
          <Link className="button-outline" href="/marketplace/find-my-solution">
            {c.finder}
          </Link>
          {page !== "affiliate-disclosure" ? (
            <Link className="button-outline" href="/affiliate-disclosure">
              {c.disclosure}
            </Link>
          ) : null}
        </nav>
      </main>
    </PlatformShell>
  );
}
