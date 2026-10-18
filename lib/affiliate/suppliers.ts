import { waterSuppliers } from "./providers/water";

const waterdrop = waterSuppliers.find(supplier => supplier.id === "waterdrop-eu")!;

/** Editorial identities, not evidence of an approved commercial relationship. */
export const suppliers = {
  renogy: { name: "Renogy EU", brand: "Renogy", origin: "https://eu.renogy.com", region: "EU" },
  "waterdrop-eu": { name: waterdrop.name, brand: "Waterdrop", origin: new URL(waterdrop.url!).origin, region: "EU" },
  "pecron-eu": { name: "PECRON EU", brand: "PECRON", origin: "https://eu.pecron.com", region: "EU" },
  "bluetti-eu": { name: "BLUETTI EU", brand: "BLUETTI", origin: "https://www.bluettipower.eu", region: "EU" },
} as const;
export type SupplierId = keyof typeof suppliers;
export function isSupplierId(value: string): value is SupplierId {
  return Object.hasOwn(suppliers, value);
}

// Reviewed base selections: merchant defaults can select a multi-pack or accessory bundle.
const reviewedRenogyVariants: Record<string, string> = {
  "/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery": "46545423761665",
  "/products/core-mini-12-8v-200ah-lifepo4-battery-w-low-temperature-protection": "46720406716673",
  "/products/dcc50s-12v-50a-dc-dc-on-board-battery-charger-with-mppt-new-version": "46740803715329",
  "/products/12v-20a-dc-to-dc-battery-charger": "46435562684673",
};

/** Canonical, untracked European model URLs, with explicitly reviewed variant selectors. */
export function validSupplierUrl(href: string, provider?: string): boolean {
  try {
    const url = new URL(href);
    if (href !== url.href || url.protocol !== "https:" || url.port || url.username || url.password || url.hash) return false;
    if (url.search && !(url.origin === suppliers.renogy.origin &&
      Object.hasOwn(reviewedRenogyVariants, url.pathname) &&
      url.search === `?variant=${reviewedRenogyVariants[url.pathname]}`)) return false;
    const supplier = provider === undefined
      ? Object.values(suppliers).find(entry => entry.origin === url.origin)
      : isSupplierId(provider) ? suppliers[provider] : undefined;
    return Boolean(supplier && supplier.origin === url.origin &&
      /^\/(?:en\/)?products\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(url.pathname) &&
      !/(?:^|-)(?:uk|ukraine|us|usa|au|canada)(?:-|\/?$)/i.test(url.pathname));
  } catch { return false; }
}

export function assertSupplierUrl(provider: string, href: string) {
  if (!validSupplierUrl(href, provider)) throw new Error(`Invalid ordinary EU product URL for supplier ${provider}`);
}
