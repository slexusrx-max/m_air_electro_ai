import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "../tests/helpers.mjs";
const { getDictionary } = load("lib/i18n/dictionaries.ts");
function files(d) {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? files(join(d, e.name))
      : /\.(ts|tsx)$/.test(e.name)
        ? [join(d, e.name)]
        : [],
  );
}
const keys = new Set(Object.keys(getDictionary("en")));
for (const f of ["app", "components"].flatMap(files))
  for (const m of readFileSync(f, "utf8").matchAll(/\bt\["([^"]+)"\]/g))
    if (m[1] !== "affiliate.active") keys.add(m[1]);
for (const locale of ["ro", "en", "uk"]) {
  const t = getDictionary(locale);
  for (const key of keys)
    if (typeof t[key] !== "string" || !t[key].trim())
      throw Error(locale + ": missing " + key);
}
console.log(
  "Runtime dictionaries verified: " + keys.size + " keys in ro/en/uk",
);
