export type VisualFamily =
  | "brand" | "marketplace" | "solar" | "batteries" | "inverters"
  | "chargers" | "backup" | "generators" | "ev" | "electrical"
  | "marine" | "industrial" | "solutions" | "tools" | "learn"
  | "experts" | "business";

/** Small routing rules only: never ship the catalog just to choose decoration. */
export function visualFamily(pathname: string): VisualFamily {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/" || path === "/about") return "brand";
  if (path.startsWith("/learn")) return "learn";
  if (path.startsWith("/solutions")) return "solutions";
  if (path.startsWith("/calculators") || path === "/backup-calculator" || path.endsWith("/find-my-solution")) return "tools";
  if (path === "/experts") return "experts";
  if (path === "/business" || path === "/partnerships") return "business";
  if (/marine/.test(path)) return "marine";
  if (/industrial/.test(path)) return "industrial";
  if (/generator/.test(path)) return "generators";
  if (/ev-charging/.test(path)) return "ev";
  if (/chargers|dc-dc|dcc50|mppt/.test(path)) return "chargers";
  if (/solar|panel|n-type/.test(path)) return "solar";
  if (/batter|core-mini/.test(path)) return "batteries";
  if (/inverter|pure-sine/.test(path)) return "inverters";
  if (/backup/.test(path)) return "backup";
  if (/electrical-components|wiring|protection/.test(path)) return "electrical";
  return "marketplace";
}
