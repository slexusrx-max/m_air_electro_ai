import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { StatusPill } from "@/components/status-pill";
import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import { expertProfiles, getExpertProfileBySlug } from "@/lib/experts";
import { buildMetadata } from "@/lib/metadata";

type ExpertPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ExpertPageProps) {
  const { slug } = await params;
  const profile = getExpertProfileBySlug(slug);

  if (!profile) {
    return buildMetadata({
      title: "Expert Not Found",
      path: "/experts",
    });
  }

  return buildMetadata({
    title: profile.title,
    description: profile.description,
    path: `/experts/${profile.slug}`,
  });
}

export function generateStaticParams() {
  return expertProfiles.map((profile) => ({ slug: profile.slug }));
}

export default async function ExpertDetailPage({ params }: ExpertPageProps) {
  const { slug } = await params;
  const profile = getExpertProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8">
        <PageHero
          eyebrow="Verified Expert Profile"
          title={profile.title}
          description={profile.description}
          actions={[
            { href: "/contact", label: "Request onboarding" },
            { href: "/experts", label: "Back to experts", variant: "secondary" },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className={moduleCardClassName}>
            <p className="text-xs uppercase tracking-[0.26em] text-lime-100/76">Track</p>
            <div className="mt-4">
              <StatusPill label={profile.premium ? "Premium" : "Core"} tone={profile.premium ? "success" : "neutral"} />
            </div>
          </article>
          <article className={moduleCardClassName}>
            <p className="text-xs uppercase tracking-[0.26em] text-lime-100/76">Response</p>
            <p className="mt-4 text-lg font-semibold text-white">{profile.responseWindow}</p>
          </article>
          <article className={moduleCardClassName}>
            <p className="text-xs uppercase tracking-[0.26em] text-lime-100/76">Regions</p>
            <p className="mt-4 text-sm leading-7 text-white/76">{profile.regions.join(", ")}</p>
          </article>
          <article className={moduleCardClassName}>
            <p className="text-xs uppercase tracking-[0.26em] text-lime-100/76">Delivery</p>
            <p className="mt-4 text-sm leading-7 text-white/76">{profile.serviceModes.join(", ")}</p>
          </article>
        </section>

        <div className={`${glassPanelClassName} grid gap-8 p-6 sm:p-8 lg:grid-cols-3`}>
          <section>
            <h2 className="text-lg font-semibold text-white">Verification signals</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/78">
              {profile.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">Typical cases</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/78">
              {profile.useCases.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white">Primary audience</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/78">
              {profile.audience.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </PlatformShell>
  );
}
