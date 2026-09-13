import { categories } from "./content";
import { solutions } from "./solutions";
import { guides, learnHubs } from "./guides";
import { equipment } from "./catalog-data";
export const publicRoutes = [
  "/",
  "/marketplace",
  "/marketplace/find-my-solution",
  "/solutions",
  "/learn",
  "/faq",
  "/about",
  "/business",
  "/experts",
  "/contact",
  "/privacy",
  "/terms",
  "/affiliate-disclosure",
  "/methodology",
  "/calculators",
  "/backup-calculator",
  ...categories.map((c) => `/marketplace/${c.path}`),
  ...solutions.map((s) => `/solutions/${s.slug}`),
  ...guides.map((g) => `/learn/${g.slug}`),
  ...learnHubs.map((h) => `/learn/${h.slug}`),
  ...equipment.map((p) => `/marketplace/products/${p.slug}`),
  ...[
    "battery",
    "solar",
    "cable-sizing",
    "voltage-drop",
    "generator",
    "motor-current",
    "breaker-selection",
    "fuse-selection",
    "transformer",
  ].map((s) => `/calculators/${s}`),
];
export { legacyRedirects } from "./legacy";
