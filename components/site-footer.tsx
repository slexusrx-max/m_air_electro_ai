import Link from "next/link";

import { glassPanelClassName } from "@/components/ui/glass";
import { footerNavGroups } from "@/lib/site-navigation";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mx-4 mb-4 mt-10 sm:mx-6 lg:mx-8">
      <div className={`${glassPanelClassName} overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-lime-100/80">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[0.7rem] tracking-[0.2em] text-white">
                MA
              </span>
              <span>M Air Electro AI</span>
            </div>
            <h2 className="mt-5 max-w-md text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Built for electrical trust, not generic service noise.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74 sm:text-base">
              AI diagnostics, deterministic calculators, expert verification, protected electrical
              transactions, and premium marine and industrial workflows.
            </p>
            <p className="mt-5 text-sm text-white/56">
              Primary commercial focus: {siteConfig.primaryMarket}. International technical
              operations ready.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {footerNavGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-lime-100/78">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group block rounded-2xl border border-transparent bg-white/[0.03] px-3 py-3 transition hover:border-white/12 hover:bg-white/[0.06]"
                      >
                        <span className="block text-sm font-medium text-white/92 transition group-hover:text-lime-50">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs leading-6 text-white/50">
                          {item.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 {siteConfig.name}. Electrical engineering only.</p>
          <p>Payments should be handled by marketplace providers such as Stripe Connect.</p>
        </div>
      </div>
    </footer>
  );
}
