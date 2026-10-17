import test from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";
const { localizedPath } = load("lib/i18n/routing.ts");
const { exampleEnergy, energyExamples } = load("lib/marketplace/energy-examples.ts");

test("public language paths are stable, preserve query/hash, and leave private/external URLs alone", () => {
  for (const [input, en, ro] of [
    ["/", "/en", "/"], ["/?q=a#b", "/en?q=a#b", "/?q=a#b"],
    ["/en/learn/a?x=1#part", "/en/learn/a?x=1#part", "/learn/a?x=1#part"],
    ["/experts", "/en/experts", "/experts"],
    ["/expert", "/expert", "/expert"], ["/login?next=/expert", "/login?next=/expert", "/login?next=/expert"],
    ["https://example.org/x", "https://example.org/x", "https://example.org/x"],
    ["//example.org", "//example.org", "//example.org"], ["#section", "#section", "#section"],
  ]) {
    assert.equal(localizedPath(input, "en"), en);
    assert.equal(localizedPath(input, "ro"), ro);
    assert.equal(localizedPath(en, "en"), en);
  }
});

test("mixed AC/DC examples apply conversion losses only to AC and never round the design inputs", () => {
  const apartment = exampleEnergy(energyExamples.apartment);
  assert.equal(apartment.loadWh, 288);
  assert.ok(Math.abs(apartment.nominalWh - 391.304347826) < 1e-6);
  const rv = exampleEnergy(energyExamples.rv);
  assert.equal(rv.dc, 435); assert.equal(rv.ac, 180);
  assert.ok(Math.abs(rv.nominalWh - 788.315217391) < 1e-6);
  assert.equal(exampleEnergy([{ en: "DC", ro: "DC", watts: 100, hours: 1, circuit: "DC" }], 1, 0.5).nominalWh, 100);
  assert.throws(() => exampleEnergy(energyExamples.rv, 0), /Invalid/);
});
