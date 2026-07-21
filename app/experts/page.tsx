import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { liquidGlassButtonClassName, moduleCardClassName } from "@/components/ui/glass";
import { expertProfiles } from "@/lib/experts";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Experts",
  description:
    "Verified expert tracks for residential, industrial, marine, and offshore electrical work on M Air Electro AI.",
  path: "/experts",
});

export default function ExpertsPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Expert Profiles"
          title="Verified expert tracks designed around electrical specialties instead of generic gig profiles."
          description="The MVP expert layer is structured around specialist roles, verification evidence, response expectations, and high-value problem categories."
          actions={[
            { href: "/marketplace", label: "See marketplace workflow" },
            { href: "/contact", label: "Apply for verification", variant: "secondary" },
          ]}
        />

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Profiles"
            title="Expert tracks for launch"
            description="Each profile emphasizes technical fit, verification signals, and case types that align with the electrical focus of the platform."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {expertProfiles.map((profile) => (
              <article key={profile.slug} className={moduleCardClassName}>
                <div className="flex items-center justify-between gap-3">
                  <StatusPill label={profile.premium ? "Premium vertical" : "Core vertical"} tone={profile.premium ? "success" : "neutral"} />
                  <span className="text-xs uppercase tracking-[0.24em] text-white/48">{profile.responseWindow}</span>
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{profile.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/76">{profile.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.audience.map((item) => (
                    <span key={item} className="rounded-full border border-white/14 bg-white/[0.05] px-3 py-1 text-xs text-white/62">
                      {item}
                    </span>
                  ))}
                </div>
                <Link href={`/experts/${profile.slug}`} className={`${liquidGlassButtonClassName} mt-6 px-4 py-2 text-sm font-semibold`}>
                  View profile
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PlatformShell>
  );
}
