import test from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../lib/affiliate/catalog";
import { comparisonSpecifications } from "../lib/marketplace/comparison-specifications";
const product = (id: string) => catalog.find(product => product.id === id)!;

test("battery comparison separates nominal voltage from voltage class and keeps energy qualifiers", () => {
  const rows = comparisonSpecifications([product("renogy-mini-100"), product("renogy-mini-200")], false);
  assert.deepEqual(rows.slice(0, 5).map(row => row.id), ["nominal-voltage", "voltage-class", "capacity", "energy", "chemistry"]);
  assert.equal(rows.find(row => row.id === "nominal-voltage")!.values[0], "12.8 V");
  assert.equal(rows.find(row => row.id === "voltage-class")!.values[0], "12 V");
  assert.match(rows.find(row => row.id === "energy")!.values[0]!, /1280 Wh/);
  assert.equal(rows.filter(row => /energy|Stored energy/.test(row.id)).length, 1);
  for (const key of ["weight", "dimensions", "cycle-life"]) assert.deepEqual(rows.find(row => row.id === key)!.values, [null, null]);
});

test("AC station comparison puts stored energy and continuous output ahead of unknown surge data", () => {
  const rows = comparisonSpecifications([product("pecron-e1500lfp"), product("bluetti-elite-100-v2")], true);
  assert.deepEqual(rows.slice(0, 3).map(row => row.id), ["energy", "continuous-output", "surge-output"]);
  assert.deepEqual(rows.find(row => row.id === "continuous-output")!.values, ["2200 W", "1800 W"]);
  assert.deepEqual(rows.find(row => row.id === "surge-output")!.values, [null, null]);
  assert.equal(rows.find(row => row.id === "energy")!.label, "Energie stocată");
  assert.ok(!rows.some(row => row.id === "source-Rated AC output"));
});

test("panel measurements retain STC and never invent efficiency from a model name", () => {
  const rows = comparisonSpecifications([product("renogy-panel-200"), product("renogy-flexible-175w")], false);
  assert.deepEqual(rows.find(row => row.id === "panel-power")!.values, ["200 W (STC)", "175 W (STC)"]);
  assert.deepEqual(rows.find(row => row.id === "efficiency")!.values, [null, null]);
  assert.deepEqual(rows.find(row => row.id === "cell-technology")!.values, [null, null]);
});

test("inverter AC voltage is not normalized into an output-power cell", () => {
  const inverter = product("renogy-pure-sine-2000w");
  const rows = comparisonSpecifications([inverter, product("renogy-pure-sine-3000w")], false);
  assert.deepEqual(rows.find(row => row.id === "continuous-output")!.values, ["2000 W", "3000 W"]);
  assert.match(rows.find(row => row.id === "source-Rated AC output")!.values[0]!, /V AC/);
});

test("water rows keep production and installation separate from undocumented filter life and claims", () => {
  const rows = comparisonSpecifications([product("waterdrop-g3p600"), product("waterdrop-g3p800")], false);
  assert.deepEqual(rows.find(row => row.id === "production")!.values, ["600 GPD", "800 GPD"]);
  assert.deepEqual(rows.find(row => row.id === "technology")!.values, ["RO", "RO"]);
  for (const key of ["filter-replacement", "contaminant-reduction"]) assert.deepEqual(rows.find(row => row.id === key)!.values, [null, null]);
  assert.ok(!rows.some(row => ["energy", "continuous-output", "voltage-class"].includes(row.id)));
});

test("conflicting aliases and other documented fields stay visible without modifying records", () => {
  const source = product("renogy-mini-100");
  const changed = { ...source, technicalSpecs: { ...source.technicalSpecs, "Stored energy": "1000 Wh", "Stored energy (V × Ah)": "1280 Wh", "Source-only field": "Retain this condition" } };
  const before = JSON.stringify(changed);
  const rows = comparisonSpecifications([changed, product("renogy-mini-200")], false);
  const value = rows.find(row => row.id === "energy")!.values[0]!;
  assert.match(value, /1000 Wh/);
  assert.match(value, /1280 Wh/);
  assert.equal(rows.find(row => row.id === "source-Source-only field")!.values[0], "Retain this condition");
  assert.equal(JSON.stringify(changed), before);
  assert.deepEqual(comparisonSpecifications([source, product("pecron-e1500lfp")], false), []);
  assert.deepEqual(comparisonSpecifications([product("pecron-d77"), product("pecron-e600lfp")], false), []);
});
