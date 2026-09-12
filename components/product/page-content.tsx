import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/types";
import { commercialCopy } from "@/lib/marketplace/copy";
import { marketplaceCategories } from "@/lib/affiliate/catalog";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { EquipmentIllustration } from "@/components/marketplace/equipment-illustration";
export function ProductPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <section className="brand-glass-card rounded-3xl p-7">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold">{title}</h1>
        <p className="mt-4 leading-7">{description}</p>
      </section>
      {children}
    </main>
  );
}
export function HomeContent({ dictionary: t }: { dictionary: Dictionary }) {
  const c = commercialCopy(t);
  const steps = c.ro
    ? [
        ["01 · Necesar", "Alege aparatele esențiale și durata de funcționare."],
        [
          "02 · Calcul",
          "Vezi energia bateriei și puterea invertorului, cu ipotezele explicate.",
        ],
        [
          "03 · Comparare",
          "Înțelege tensiunile, limitele și componentele care trebuie să funcționeze împreună.",
        ],
        [
          "04 · Furnizor",
          "Consultă oferta actuală și cumpără direct de la comerciant.",
        ],
      ]
    : [
        [
          "01 · Requirements",
          "Choose essential appliances and their operating time.",
        ],
        [
          "02 · Calculation",
          "See battery energy and inverter power, with the assumptions explained.",
        ],
        [
          "03 · Comparison",
          "Understand voltages, limits and components that need to work together.",
        ],
        [
          "04 · Supplier",
          "Check the current offer and purchase directly from the merchant.",
        ],
      ];
  return (
    <main className="mx-auto max-w-6xl space-y-12">
      <section className="grid items-center gap-8 py-6 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="eyebrow">
            {c.ro
              ? "Energie de rezervă · România & UE"
              : "Backup power · Romania & EU"}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            {c.ro
              ? "Știi ce trebuie să rămână pornit. Află ce sistem îți trebuie."
              : "Know what must keep running. Find the system you need."}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            {c.ro
              ? "Calculează autonomia, compară baterii, invertoare și soluții solare, apoi consultă furnizorul ales. Ghid independent, fără stocuri sau plăți pe M Air."
              : "Calculate backup time, compare batteries, inverters and solar options, then visit your chosen supplier. Independent guidance, with no inventory or payments on M Air."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/marketplace/find-my-solution"
              className="button-primary"
            >
              {c.finder}
            </Link>
            <Link href="/marketplace" className="button-outline">
              {c.browse}
            </Link>
          </div>
        </div>
        <aside className="brand-glass-card rounded-3xl p-6">
          <EquipmentIllustration category="backup-power" />
          <h2 className="mt-5 text-xl font-bold">
            {c.ro
              ? "W pentru putere. Wh pentru autonomie."
              : "W for power. Wh for runtime."}
          </h2>
          <p className="mt-3 leading-7 text-slate-700">
            {c.ro
              ? "Exemplu: 500 W timp de 4 ore înseamnă 2 kWh la consumatori. La 80% descărcare utilă și 92% randament, necesarul nominal este aproximativ 2,72 kWh."
              : "Example: 500 W for 4 hours means 2 kWh at the loads. At 80% usable discharge and 92% efficiency, nominal battery demand is about 2.72 kWh."}
          </p>
          <Link
            href="/backup-calculator"
            className="mt-4 inline-block font-bold text-teal-800 underline"
          >
            {c.backup} →
          </Link>
        </aside>
      </section>
      <section>
        <h2 className="text-3xl font-bold">{c.categories}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {marketplaceCategories
            .filter((x) => x.primary)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/marketplace/category/${cat.slug}`}
                className="brand-glass-card rounded-2xl p-5 hover:border-teal-600"
              >
                <h3 className="font-bold">{c.ro ? cat.name : cat.nameEn}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {c.ro ? cat.summary : cat.summaryEn}
                </p>
              </Link>
            ))}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold">
          {c.ro
            ? "De la consum la o alegere informată"
            : "From demand to an informed choice"}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body]) => (
            <article key={title} className="info-card">
              <h3 className="font-bold">{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="grid gap-5 md:grid-cols-3">
        {(c.ro
          ? [
              [
                "Acasă, în timpul unei întreruperi",
                "Prioritizează iluminatul, routerul și comenzile centralei. Verifică separat pornirea frigiderului.",
              ],
              [
                "Rulotă și călătorii",
                "Combină necesarul zilnic cu încărcarea de la alternator și suprafața disponibilă pentru panouri.",
              ],
              [
                "Cabană fără rețea",
                "Ia în calcul zilele cu producție solară redusă. Puterea panourilor nu garantează autonomie iarna.",
              ],
            ]
          : [
              [
                "At home during an outage",
                "Prioritise lighting, router and boiler controls. Check refrigerator starting requirements separately.",
              ],
              [
                "Caravan and travel",
                "Combine daily demand with alternator charging and available panel area.",
              ],
              [
                "Off-grid cabin",
                "Allow for low-solar days. Panel wattage does not guarantee winter autonomy.",
              ],
            ]
        ).map(([title, body]) => (
          <article className="info-card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
            <Link
              href="/marketplace/find-my-solution"
              className="mt-4 inline-block font-bold text-teal-800"
            >
              {c.finder} →
            </Link>
          </article>
        ))}
      </section>
      <section className="brand-glass-card rounded-3xl p-7">
        <h2 className="text-3xl font-bold">
          {c.ro
            ? "Calcule pe care le poți verifica"
            : "Calculations you can verify"}
        </h2>
        <p className="mt-4 max-w-3xl leading-8">
          {c.ro
            ? "Recomandările sunt deterministe, nu generate de AI: energie = putere × timp. Arătăm pierderile, rezerva de descărcare și marjele de putere. Catalogul oferă exemple de analizat, nu promisiuni de compatibilitate."
            : "Recommendations are deterministic, not AI-generated: energy = power × time. We show losses, discharge reserve and power margins. The catalog offers examples to assess, not promises of compatibility."}
        </p>
        <p className="mt-4 rounded-xl bg-white/80 p-4 text-sm leading-7">
          {c.safety}
        </p>
      </section>
      <AffiliateDisclosure dictionary={t} />
      <section>
        <h2 className="text-3xl font-bold">
          {c.ro
            ? "Continuă cu un instrument util"
            : "Continue with a useful tool"}
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="button-primary" href="/backup-calculator">
            {c.backup}
          </Link>
          <Link className="button-outline" href="/calculators">
            {c.ro ? "Instrumente tehnice" : "Technical tools"}
          </Link>
          <Link className="button-outline" href="/knowledge-base">
            {c.ro ? "Ghiduri practice" : "Practical guides"}
          </Link>
        </div>
      </section>
    </main>
  );
}
