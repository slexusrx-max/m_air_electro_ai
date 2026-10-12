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

/** Only canonical, untracked EU model URLs; region-specific variants need review. */
export function validSupplierUrl(href: string, provider?: string): boolean {
  try {
    const url = new URL(href);
    if (href !== url.href || url.protocol !== "https:" || url.port || url.username || url.password || url.search || url.hash) return false;
    const supplier = provider === undefined
      ? Object.values(suppliers).find(entry => entry.origin === url.origin)
      : isSupplierId(provider) ? suppliers[provider] : undefined;
    return Boolean(supplier && supplier.origin === url.origin &&
      /^\/products\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(url.pathname) &&
      !/(?:^|-)(?:uk|ukraine|us|usa|au|canada)(?:-|\/?$)/i.test(url.pathname));
  } catch { return false; }
}

export function assertSupplierUrl(provider: string, href: string) {
  if (!validSupplierUrl(href, provider)) throw new Error(`Invalid ordinary EU product URL for supplier ${provider}`);
}
