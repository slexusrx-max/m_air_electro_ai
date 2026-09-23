import { categories, type LocalText } from "./content";
import { solutions } from "./solutions";
import { guides } from "./guides";
import { normalizeSearch } from "./query";

type ContentResult = { href: string; title: LocalText; summary: LocalText; kind: "category" | "solution" | "guide" };
const index: (ContentResult & { text: string })[] = [
  ...categories.map(c => ({ href: `/marketplace/${c.path}`, title: c.title, summary: c.summary, kind: "category" as const, text: JSON.stringify(c) })),
  ...solutions.map(s => ({ href: `/solutions/${s.slug}`, title: s.title, summary: s.summary, kind: "solution" as const, text: JSON.stringify(s) })),
  ...guides.map(g => ({ href: `/learn/${g.slug}`, title: g.title, summary: g.intro, kind: "guide" as const, text: JSON.stringify(g) })),
].map(item => ({ ...item, text: normalizeSearch(item.text) }));

export function searchContent(query: string): ContentResult[] {
  const terms = normalizeSearch(query.slice(0, 150)).replace(/(\d)\s*(v|ah|wh|w)\b/g, "$1$2").split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return index.filter(item => {
    const text = item.text.replace(/(\d)\s*(v|ah|wh|w)\b/g, "$1$2");
    return terms.every(term => text.includes(term));
  }).map(({ href, title, summary, kind }) => ({ href, title, summary, kind }));
}
