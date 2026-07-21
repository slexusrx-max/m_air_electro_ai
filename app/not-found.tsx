import Link from "next/link";

import { PlatformShell } from "@/components/platform-shell";
import { glassPanelClassName, liquidGlassButtonClassName, liquidGlassPrimaryButtonClassName } from "@/components/ui/glass";

export default function NotFound() {
  return (
    <PlatformShell contentClassName="flex flex-1 items-center px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl">
        <div className={`${glassPanelClassName} p-8 text-center sm:p-10`}>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-lime-100/78">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            This route does not exist in the current platform map.
          </h1>
          <p className="mt-5 text-base leading-8 text-white/76 sm:text-lg">
            Head back to the production MVP surface and continue through calculators, assistant,
            experts, or marketplace workflows.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className={`${liquidGlassPrimaryButtonClassName} px-5 py-3 text-sm font-semibold`}>
              Go to homepage
            </Link>
            <Link href="/calculators" className={`${liquidGlassButtonClassName} px-5 py-3 text-sm font-semibold`}>
              Open calculators
            </Link>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
}
