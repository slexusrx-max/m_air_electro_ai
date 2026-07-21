import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { liquidGlassButtonClassName, moduleCardClassName } from "@/components/ui/glass";
import { knowledgeArticles } from "@/lib/knowledge-base";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Knowledge Base",
  description: "Technical articles, troubleshooting guidance, and electrical engineering playbooks.",
  path: "/knowledge-base",
});

export default function KnowledgeBasePage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <PageHero
          eyebrow="Knowledge Base"
          title="Technical guidance that sits between theory, troubleshooting, and execution."
          description="The first knowledge base is curated around electrical diagnostics, instrumentation, calculation logic, and specialist operating patterns that reinforce the rest of the platform."
          actions={[
            { href: "/calculators", label: "Use calculators" },
            { href: "/assistant", label: "Open AI Assistant", variant: "secondary" },
          ]}
        />

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Articles"
            title="Launch collection"
            description="Static content today, with room for future search, tagging, AI retrieval, and linked workflows."
          />
          <div className="grid gap-4 xl:grid-cols-3">
            {knowledgeArticles.map((article) => (
              <article key={article.slug} className={moduleCardClassName}>
                <div className="flex items-center justify-between gap-3">
                  <StatusPill label={article.category} />
                  <span className="text-xs uppercase tracking-[0.24em] text-white/48">{article.readTime}</span>
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{article.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/76">{article.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {article.audience.map((item) => (
                    <span key={item} className="rounded-full border border-white/14 bg-white/[0.05] px-3 py-1 text-xs text-white/62">
                      {item}
                    </span>
                  ))}
                </div>
                <Link href={`/knowledge-base/${article.slug}`} className={`${liquidGlassButtonClassName} mt-6 px-4 py-2 text-sm font-semibold`}>
                  Read article
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PlatformShell>
  );
}
