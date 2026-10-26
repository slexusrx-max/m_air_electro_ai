import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { guides } from "../lib/marketplace/guides";

test("homepage exposes structured buying content and decision links", () => {
  const source = readFileSync("components/marketplace/home-buying-guide.tsx", "utf8");
  for (const phrase of [
    "Cum alegi stația sau sistemul solar",
    "Calculul puterii și autonomiei",
    "Tipuri de acumulatoare",
    "Exemple de calcul reproductibile",
  ]) assert.match(source, new RegExp(phrase));

  for (const href of [
    "/learn/how-to-choose-portable-power-station",
    "/learn/solar-system-payback",
    "/faq",
  ]) assert.match(source, new RegExp(href));

  assert.match(source, /nu proiecte executate/);
});

test("new selection and payback guides are sourced and calculator-linked", () => {
  const station = guides.find(guide => guide.slug === "how-to-choose-portable-power-station");
  const payback = guides.find(guide => guide.slug === "solar-system-payback");

  assert.ok(station);
  assert.equal(station.calculator, "/marketplace/find-my-solution");
  assert.ok(station.sections.length >= 4);

  assert.ok(payback);
  assert.equal(payback.calculator, "/calculators/solar");
  assert.ok(payback.sources.some(source => source.includes("europa.eu")));
  assert.match(payback.sections.at(-1)?.body.ro ?? "", /nu o garanție/);
});
