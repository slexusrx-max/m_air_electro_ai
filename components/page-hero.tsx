import Link from "next/link";


type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type PageHeroProps = {
  actions?: HeroAction[];
  description: string;
  eyebrow: string;
  title: string;
};

export function PageHero({ eyebrow, title, description, actions = [] }: PageHeroProps) {
  return (
    <section className="brand-light-panel overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="inline-flex rounded-full border border-teal-800/15 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-800">
        {eyebrow}
      </div>
      <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">{description}</p>

      {actions.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`px-5 py-3 text-sm font-semibold ${action.variant === "secondary" ? "button-outline" : "button-primary"}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
