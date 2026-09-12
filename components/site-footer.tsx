import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/types";
import { commercialCopy } from "@/lib/marketplace/copy";
export function SiteFooter({ dictionary: t }: { dictionary: Dictionary }) {
  const c = commercialCopy(t);
  const groups = [
    {
      title: c.ro ? "Planifică" : "Plan",
      items: [
        ["/marketplace/find-my-solution", c.finder],
        ["/backup-calculator", c.backup],
        ["/calculators", c.ro ? "Instrumente tehnice" : "Technical tools"],
      ],
    },
    {
      title: c.ro ? "Informează-te" : "Explore",
      items: [
        ["/marketplace", c.marketplace],
        ["/knowledge-base", c.ro ? "Ghiduri practice" : "Practical guides"],
        ["/about", c.about],
        ["/contact", c.contact],
      ],
    },
    {
      title: c.ro ? "Transparență" : "Transparency",
      items: [
        ["/affiliate-disclosure", c.disclosure],
        ["/privacy", c.privacy],
        ["/terms", c.terms],
      ],
    },
  ];
  return (
    <footer className="mx-4 mb-4 mt-10 rounded-3xl border border-teal-900/15 bg-white/95 p-6 sm:mx-6 lg:mx-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="text-xl font-extrabold">M Air Electro AI</p>
          <p className="mt-3 max-w-md leading-7 text-slate-700">
            {c.ro
              ? "Instrumente și ghiduri independente pentru baterii, invertoare, energie solară și autonomie în România și UE."
              : "Independent tools and guidance for batteries, inverters, solar and backup power in Romania and the EU."}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {c.supplierNote}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="font-bold">{g.title}</h2>
              <ul className="mt-3 space-y-3">
                {g.items.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      className="text-sm text-slate-700 hover:underline"
                      href={href}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <p className="mt-8 border-t border-teal-900/15 pt-5 text-xs text-slate-600">
        © 2026 M Air Electro AI ·{" "}
        {c.ro
          ? "Informare și planificare. Achizițiile se fac la furnizori externi."
          : "Information and planning. Purchases are made with external suppliers."}
      </p>
    </footer>
  );
}
