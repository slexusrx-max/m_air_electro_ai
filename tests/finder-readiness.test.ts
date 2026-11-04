import test, { before } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getDictionary } from "../lib/i18n/dictionaries";

let SolutionFinder: typeof import("../components/marketplace/solution-finder").SolutionFinder;
before(async () => {
  // This SSR assertion tests hydration readiness. Next.js handles CSS Modules in
  // production; their actual appearance is checked by browser tests.
  const require = createRequire(import.meta.url);
  const previous = require.extensions[".css"];
  require.extensions[".css"] = (module, filename) => {
    if (filename.endsWith(".module.css")) module.exports = {};
    else if (previous) previous(module, filename);
    else throw new Error(`Unexpected stylesheet in SSR unit test: ${filename}`);
  };
  try {
    ({ SolutionFinder } = await import("../components/marketplace/solution-finder"));
  } finally {
    if (previous) require.extensions[".css"] = previous;
    else delete require.extensions[".css"];
  }
});

for (const locale of ["ro", "en"] as const) {
  test(`finder server controls wait for client handlers: ${locale}`, () => {
    const html = renderToStaticMarkup(createElement(SolutionFinder, {
      dictionary: getDictionary(locale),
      initial: { step: "3", load: "300", peak: "600", hours: "4" },
    }));
    assert.match(html, /<fieldset[^>]*disabled=""[^>]*aria-busy="true"[^>]*data-testid="finder-controls"/);
    assert.match(html, locale === "ro" ? /Calculează sistemul/ : /Calculate system/);
  });
}
