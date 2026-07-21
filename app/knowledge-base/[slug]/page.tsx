import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { StatusPill } from "@/components/status-pill";
import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import { getKnowledgeArticleBySlug, knowledgeArticles } from "@/lib/knowledge-base";
import { buildMetadata } from "@/lib/metadata";

type KnowledgePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: KnowledgePageProps) {
  const { slug } = await params;
  const article = getKnowledgeArticleBySlug(slug);

  if (!article) {
    return buildMetadata({
      title: "Article Not Found",
      path: "/knowledge-base",
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/knowledge-base/${article.slug}`,
  });
}

export function generateStaticParams() {
  return knowledgeArticles.map((article) => ({ slug: article.slug }));
}

export default async function KnowledgeArticlePage({ params }: KnowledgePageProps) {
  const { slug } = await params;
  const article = getKnowledgeArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <PageHero
          eyebrow="Knowledge Article"
          title={article.title}
          description={article.excerpt}
          actions={[
            { href: "/knowledge-base", label: "Back to knowledge base", variant: "secondary" },
            { href: "/calculators", label: "Open calculators" },
          ]}
        />

        <section className="flex flex-wrap gap-3">
          <StatusPill label={article.category} />
          <StatusPill label={article.readTime} />
          {article.audience.map((audience) => (
            <StatusPill key={audience} label={audience} />
          ))}
        </section>

        <div className={`${glassPanelClassName} space-y-8 p-6 sm:p-8 lg:p-10`}>
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-white/78 sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {article.highlights.map((highlight) => (
            <article key={highlight} className={moduleCardClassName}>
              <p className="text-sm leading-7 text-white/78">{highlight}</p>
            </article>
          ))}
        </section>
      </section>
    </PlatformShell>
  );
}
