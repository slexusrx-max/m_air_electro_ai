import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
import { calculatorItems } from "@/lib/site-navigation";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Calculatoare electrice",
  description:
    "Calcul de autonomie și instrumente tehnice pentru baterii, cabluri, generatoare și protecții.",
  path: "/calculators",
});
export default async function Page() {
  const c = commercialCopy(await getRequestDictionary());
  const names = [
    "Dimensionarea cablurilor",
    "Căderea de tensiune",
    "Curentul motorului",
    "Transformator",
    "Baterie",
    "Generator",
    "Întreruptor automat",
    "Siguranță fuzibilă",
  ];
  return (
    <PlatformShell>
      <main className="mx-auto max-w-6xl space-y-7">
        <section className="brand-glass-card rounded-3xl p-7">
          <p className="eyebrow">
            {c.ro
              ? "Formule și ipoteze explicate"
              : "Explained formulas and assumptions"}
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            {c.ro ? "Calculatoare electrice" : "Electrical calculators"}
          </h1>
          <p className="mt-4 leading-7">
            {c.ro
              ? "Începe cu autonomia aparatelor sau cu configuratorul în trei pași. Instrumentele tehnice detaliate de mai jos sunt disponibile în engleză."
              : "Start with appliance backup time or the three-step system planner. Detailed technical tools below are available in English."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/backup-calculator">
              {c.backup}
            </Link>
            <Link
              className="button-outline"
              href="/marketplace/find-my-solution"
            >
              {c.finder}
            </Link>
          </div>
        </section>
        <p className="rounded-xl bg-amber-50 p-5 leading-7">{c.safety}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calculatorItems.map((x, i) => (
            <Link href={x.href} className="info-card" key={x.href}>
              <h2>{c.ro ? names[i] : x.label}</h2>
              <p lang="en">{x.description}</p>
              <span className="mt-5 block font-bold">
                {c.ro
                  ? "Deschide instrumentul (EN)"
                  : "Open technical tool (EN)"}{" "}
                →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </PlatformShell>
  );
}
