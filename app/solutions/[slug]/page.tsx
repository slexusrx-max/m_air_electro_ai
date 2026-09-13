import Link from "next/link";
import { notFound } from "next/navigation";
import { PlatformShell } from "@/components/platform-shell";
import {
  Breadcrumbs,
  Intro,
  LinkGrid,
  Faq,
} from "@/components/marketplace/shared";
import { solutions } from "@/lib/marketplace/solutions";
import { categoryByPath, local } from "@/lib/marketplace/content";
import { guides } from "@/lib/marketplace/guides";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const solution = solutions.find((s) => s.slug === slug);
  if (!solution) notFound();
  const locale = await getRequestLocale();
  return buildMetadata({
    title: local(solution.title, locale),
    description: local(solution.summary, locale),
    path: `/solutions/${slug}`,
  });
}
export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  const solution = solutions.find((s) => s.slug === slug);
  if (!solution) notFound();
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return (
    <PlatformShell>
      <main className="commerce-page">
        <Breadcrumbs
          items={[
            { name: ro ? "Soluții" : "Solutions", path: "/solutions" },
            { name: local(solution.title, locale), path: `/solutions/${slug}` },
          ]}
        />
        <Intro
          title={local(solution.title, locale)}
          description={local(solution.summary, locale)}
        />
        <div className="two-columns">
          {[
            [ro ? "Consumatori tipici" : "Typical loads", solution.loads],
            [
              ro ? "Arhitectura sistemului" : "System architecture",
              solution.architecture,
            ],
            [
              ro ? "Exemplu de dimensionare" : "Illustrative sizing",
              solution.example,
            ],
            [ro ? "Solar și generator" : "Solar and generator", solution.solar],
          ].map(([title, body]) => (
            <section key={title as string} className="content-panel">
              <h2>{title as string}</h2>
              <p>{local(body as typeof solution.loads, locale)}</p>
            </section>
          ))}
        </div>
        <aside className="safety-note">{local(solution.caution, locale)}</aside>
        <div className="action-row">
          <Link
            className="button-primary"
            href={`/marketplace/find-my-solution?application=${slug}&load=${solution.watts}&hours=${solution.hours}`}
          >
            {ro ? "Calculează sistemul meu" : "Calculate my system"}
          </Link>
          <Link className="button-outline" href="/marketplace">
            {ro ? "Explorează marketplace" : "Browse marketplace"}
          </Link>
        </div>
        <h2>
          {ro ? "Categorii recomandate" : "Recommended equipment categories"}
        </h2>
        <LinkGrid
          locale={locale}
          items={solution.categories.map((path) => ({
            href: `/marketplace/${path}`,
            title: categoryByPath(path)!.title,
            summary: categoryByPath(path)!.summary,
          }))}
        />
        <h2>
          {ro ? "Ghiduri pentru această soluție" : "Guides for this solution"}
        </h2>
        <LinkGrid
          locale={locale}
          items={solution.guides.map((slug) => ({
            href: `/learn/${slug}`,
            title: guides.find((g) => g.slug === slug)!.title,
          }))}
        />
        <Faq ro={ro} />
      </main>
    </PlatformShell>
  );
}
