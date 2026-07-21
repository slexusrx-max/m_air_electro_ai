import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import {
  moduleCardClassName,
} from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { calculatorItems } from "@/lib/site-navigation";

export const metadata = buildMetadata({
  title: "Electrical Calculators",
  description: "Deterministic electrical calculators for voltage drop, cable size, motor current, transformer, battery, generator, breaker, and fuse sizing.",
  path: "/calculators",
});

export default function CalculatorsPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
        <PageHero
          eyebrow="Electrical Calculators"
          title="Deterministic engineering tools for real electrical decisions."
          description="The MVP calculator suite now covers voltage drop, cable sizing, motor current, transformer loading, battery sizing, generator sizing, breaker selection, and fuse selection."
          actions={[
            { href: "/calculators/cable-sizing", label: "Open cable sizing" },
            { href: "/diagnostics", label: "Go to diagnostics", variant: "secondary" },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {calculatorItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${moduleCardClassName} transition duration-300 hover:-translate-y-1 hover:border-lime-100/30 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22),0_0_24px_rgba(163,230,53,0.16)]`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full border border-lime-100/20 bg-white/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-lime-100/82">
                    Ready
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-white/45">Open now</span>
                </div>
                <h2 className="text-lg font-semibold text-white/96">{item.label}</h2>
                <p className="mt-3 text-sm leading-7 text-white/76">{item.description}</p>
                <div className="mt-6 text-sm font-semibold text-lime-100/90">Launch calculator</div>
              </Link>
            );
          })}
        </section>
      </section>
    </PlatformShell>
  );
}
