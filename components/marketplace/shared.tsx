import Link from "next/link";
import { BreadcrumbStructuredData } from "./structured-data";
import { local, type LocalText } from "@/lib/marketplace/content";
import type { Locale } from "@/lib/i18n/types";
export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[{ name: "M Air Electro AI", path: "/" }, ...items]}
      />
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link href="/">M Air</Link>
        {items.map((i, index) => (
          <span key={i.path}>
            {" "}
            /{" "}
            {index === items.length - 1 ? (
              <span aria-current="page">{i.name}</span>
            ) : (
              <Link href={i.path}>{i.name}</Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
export function Intro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
export function LinkGrid({
  items,
  locale,
}: {
  items: { href: string; title: LocalText; summary?: LocalText }[];
  locale: Locale;
}) {
  return (
    <div className="discovery-grid">
      {items.map((i) => (
        <Link href={i.href} key={i.href} className="discovery-card">
          <h3>
            {local(i.title, locale)} <span aria-hidden="true">↗</span>
          </h3>
          {i.summary && <p>{local(i.summary, locale)}</p>}
        </Link>
      ))}
    </div>
  );
}
export function Faq({
  ro,
  question,
  answer,
}: {
  ro: boolean;
  question?: string;
  answer?: string;
}) {
  return (
    <section className="content-panel">
      <h2>{ro ? "Întrebări frecvente" : "Frequently asked questions"}</h2>
      <details>
        <summary>
          {question ??
            (ro
              ? "Este aceasta o recomandare finală de instalare?"
              : "Is this a final installation recommendation?")}
        </summary>
        <p>
          {answer ??
            (ro
              ? "Nu. Verifică manualele modelelor, sarcina reală, protecțiile și condițiile instalației cu un profesionist calificat. Calculele și clasele de echipamente sunt orientative."
              : "No. Verify model manuals, actual loads, protection and site conditions with a qualified professional. Calculations and equipment classes are preliminary planning aids.")}
        </p>
      </details>
      <details>
        <summary>
          {ro
            ? "De unde cumpăr și cine stabilește prețul?"
            : "Where do I buy and who sets the price?"}
        </summary>
        <p>
          {ro
            ? "Achiziția se face la furnizorul extern, care stabilește prețul, livrarea, stocul și retururile. Verifică livrarea în România înainte de comandă."
            : "Purchase is with the external supplier, who controls price, delivery, inventory and returns. Confirm delivery to Romania before ordering."}{" "}
          <Link href="/affiliate-disclosure">
            {ro ? "Transparență comercială" : "Commercial disclosure"} →
          </Link>
        </p>
      </details>
    </section>
  );
}
