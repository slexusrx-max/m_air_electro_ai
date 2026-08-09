import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(new URL("../lib/i18n/dictionaries.ts", import.meta.url), "utf8");

// Ukrainian intentionally inherits the complete English dictionary and overrides
// localized entries. Check that this inheritance remains in place and that every
// key referenced through `t["…"]` exists in the base dictionary.
if (!/const uk: Dictionary = \{\s*\.\.\.en,/.test(source)) {
  console.error("i18n check failed: Ukrainian dictionary must inherit the English base dictionary.");
  process.exit(1);
}

const dictionaryKeys = new Set([...source.matchAll(/"([^"\n]+)"\s*:/g)].map((match) => match[1]));

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:ts|tsx|js|jsx)$/.test(entry.name) ? [path] : [];
  });
}

const missingReferences = [];
for (const file of ["app", "components"].flatMap(sourceFiles)) {
  const contents = readFileSync(file, "utf8");
  for (const match of contents.matchAll(/\bt\["([^"]+)"\]/g)) {
    if (!dictionaryKeys.has(match[1])) missingReferences.push(`${file}: ${match[1]}`);
  }
}

if (missingReferences.length) {
  console.error(`i18n check failed: unknown translation keys\n${missingReferences.join("\n")}`);
  process.exit(1);
}

// The dictionary is the source of truth; report its size while keeping the
// validation deterministic and independent from object-literal formatting.
console.log(`i18n inheritance check passed (${dictionaryKeys.size} declared keys)`);
