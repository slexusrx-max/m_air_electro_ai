import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { StatusPill } from "@/components/status-pill";
import { moduleCardClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";
import { getAuthRuntimeStatus } from "@/lib/server/auth";
import { getDatabaseRuntimeStatus } from "@/lib/server/database";

export const metadata = buildMetadata({
  title: "Access",
  description: "Authentication architecture status for users, experts, sellers, companies, support, and administrators.",
  path: "/sign-in",
});

export default function SignInPage() {
  const auth = getAuthRuntimeStatus();
  const database = getDatabaseRuntimeStatus();

  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Access Architecture"
          title="Authentication is prepared for real role-based rollout."
          description="The MVP does not ship fake sign-in flows. Instead, the production architecture is prepared for real session handling, role checks, database-backed identities, and future OAuth expansion."
          actions={[
            { href: "/contact", label: "Request pilot access" },
            { href: "/about", label: "Review product direction", variant: "secondary" },
          ]}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className={moduleCardClassName}>
            <StatusPill label={auth.configured ? "Auth configured" : "Auth not configured"} tone={auth.configured ? "success" : "warning"} />
            <p className="mt-4 text-sm leading-7 text-white/76">AUTH_SECRET present: {auth.hasAuthSecret ? "yes" : "no"}</p>
          </article>
          <article className={moduleCardClassName}>
            <StatusPill label={database.configured ? "Database configured" : "Database missing"} tone={database.configured ? "success" : "warning"} />
            <p className="mt-4 text-sm leading-7 text-white/76">Dialect: {database.dialect}</p>
          </article>
          <article className={moduleCardClassName}>
            <StatusPill label="Supported strategies" />
            <p className="mt-4 text-sm leading-7 text-white/76">{auth.supportedStrategies.join(", ")}</p>
          </article>
          <article className={moduleCardClassName}>
            <StatusPill label="Roles" />
            <p className="mt-4 text-sm leading-7 text-white/76">{auth.roles.join(", ")}</p>
          </article>
        </section>
      </section>
    </PlatformShell>
  );
}
