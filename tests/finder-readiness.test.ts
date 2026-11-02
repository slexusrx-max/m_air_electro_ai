import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SolutionFinder } from "../components/marketplace/solution-finder";
import { getDictionary } from "../lib/i18n/dictionaries";

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
