import { rootCategories, categories, local, bilingual as b } from "./content";
import { solutions } from "./solutions";
import { learnHubs } from "./guides";
import type { Locale } from "@/lib/i18n/types";
export type NavigationLink = {
  label: string;
  href: string;
  children?: NavigationLink[];
};
export type NavigationGroup = NavigationLink & { children: NavigationLink[] };
export function navigation(locale: Locale): NavigationGroup[] {
  const l = (en: string, ro: string) => local(b(en, ro), locale);
  return [
    {
      label: "Marketplace",
      href: "/marketplace",
      children: rootCategories.map((c) => ({
        label: local(c.title, locale),
        href: `/marketplace/${c.path}`,
        children: categories
          .filter((n) => n.path.startsWith(c.path + "/"))
          .map((n) => ({
            label: local(n.title, locale),
            href: `/marketplace/${n.path}`,
          })),
      })),
    },
    {
      label: l("Solutions", "Soluții"),
      href: "/solutions",
      children: solutions.map((s) => ({
        label: local(s.title, locale),
        href: `/solutions/${s.slug}`,
      })),
    },
    {
      label: l("Tools", "Instrumente"),
      href: "/calculators",
      children: [
        [
          "/marketplace/find-my-solution",
          "Find My Solution",
          "Găsește soluția",
        ],
        ["/backup-calculator", "Backup calculator", "Calculator rezervă"],
        ["/calculators/battery", "Battery calculator", "Calculator baterie"],
        ["/calculators/solar", "Solar sizing", "Dimensionare solară"],
        ["/calculators/cable-sizing", "Cable sizing", "Dimensionare cabluri"],
        ["/calculators/voltage-drop", "Voltage drop", "Cădere de tensiune"],
        ["/calculators/generator", "Generator", "Generator"],
        ["/calculators/motor-current", "Motor current", "Curent motor"],
        [
          "/calculators/breaker-selection",
          "Breaker selection",
          "Alegere disjunctor",
        ],
        ["/calculators/fuse-selection", "Fuse selection", "Alegere siguranță"],
        ["/calculators/transformer", "Transformer", "Transformator"],
      ].map(([href, en, ro]) => ({ href, label: l(en, ro) })),
    },
    {
      label: l("Learn", "Ghiduri"),
      href: "/learn",
      children: [
        ...learnHubs.map((h) => ({
          label: local(h.title, locale),
          href: `/learn/${h.slug}`,
        })),
        { label: "FAQ", href: "/faq" },
      ],
    },
    { label: l("Experts", "Experți"), href: "/experts", children: [] },
    {
      label: l("For business", "Pentru afaceri"),
      href: "/business",
      children: [],
    },
  ];
}
