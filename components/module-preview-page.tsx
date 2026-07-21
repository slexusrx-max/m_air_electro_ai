import Link from "next/link";

import { PlatformShell } from "@/components/platform-shell";
import {
  glassPanelClassName,
  liquidGlassButtonClassName,
  liquidGlassPrimaryButtonClassName,
  moduleCardClassName,
} from "@/components/ui/glass";

type Action = {
  href: string;
  label: string;
};

type ModulePreviewPageProps = {
  description: string;
  eyebrow: string;
  highlights: string[];
  primaryAction?: Action;
  secondaryAction?: Action;
  title: string;
};

export function ModulePreviewPage({
  description,
  eyebrow,
  highlights,
  primaryAction,
  secondaryAction,
  title,
}: ModulePreviewPageProps) {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8">
        <div className={`${glassPanelClassName} p-6 sm:p-8 lg:p-10`}>
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-lime-100/82">
            {eyebrow}
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/82 sm:text-lg">
            {description}
          </p>

          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className={`${liquidGlassPrimaryButtonClassName} px-5 py-3 text-sm font-semibold`}
                >
                  {primaryAction.label}
                </Link>
              ) : null}
              {secondaryAction ? (
                <Link
                  href={secondaryAction.href}
                  className={`${liquidGlassButtonClassName} px-5 py-3 text-sm font-semibold`}
                >
                  {secondaryAction.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <article key={highlight} className={moduleCardClassName}>
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex rounded-full border border-lime-100/20 bg-white/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-lime-100/82">
                  0{index + 1}
                </span>
                <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(190,242,100,0.4),transparent)]" />
              </div>
              <p className="text-sm leading-7 text-white/80">{highlight}</p>
            </article>
          ))}
        </section>
      </section>
    </PlatformShell>
  );
}
