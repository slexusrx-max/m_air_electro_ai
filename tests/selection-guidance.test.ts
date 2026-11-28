import test from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../lib/affiliate/catalog";
import { estimateSystem } from "../lib/marketplace/recommendation";
import { starterScenarios, scenarioUrl, stationCandidates, batteryCandidates } from "../lib/marketplace/selection-guidance";

test("starter examples expose reproducible loads, assumptions and same-role alternatives", () => {
  const expected = [500, 1100, 900];
  starterScenarios.forEach((s, i) => {
    const requirements = estimateSystem(s.load, s.peak, s.hours)!;
    assert.equal(requirements.batteryWh, expected[i]);
    const candidates = stationCandidates(catalog, "EU", requirements);
    assert.equal(candidates.length, 4);
    assert.equal(new Set(candidates.map(p => p.brand)).size, 2);
    assert.ok(candidates.every(p => p.kind === "product" && p.category === "backup-power"));
    assert.ok(candidates.every(p => Number(p.facets.capacityWh) >= requirements.batteryWh && Number(p.facets.power) >= requirements.surgeW));
    assert.deepEqual(stationCandidates([...catalog].reverse(), "EU", requirements).map(p => p.id), candidates.map(p => p.id));
    const url = new URL(scenarioUrl(s), "https://mairelectroai.com");
    assert.equal(url.searchParams.get("load"), String(s.load));
    assert.equal(url.searchParams.get("hours"), String(s.hours));
  });
});

test("station screening excludes unknown power/energy, excessive starts and unsupported regions", () => {
  const need = { batteryWh: 500, loadWh: 300, inverterW: 100, surgeW: 5000 };
  assert.deepEqual(stationCandidates(catalog, "EU", need), []);
  assert.deepEqual(stationCandidates(catalog, "UK", { ...need, surgeW: 200 }), []);
  const p = catalog.find(p => p.category === "backup-power")!;
  assert.deepEqual(stationCandidates([{ ...p, facets: {} }], "EU", { ...need, surgeW: 200 }), []);
});

test("battery calculation candidates respect energy and voltage without inventing a bank", () => {
  assert.equal(batteryCandidates(catalog, 1000, 12).length, 3);
  assert.deepEqual(batteryCandidates(catalog, 1500, 12).map(p => p.id), ["renogy-mini-200", "renogy-pro-smart-200ah"]);
  assert.deepEqual(batteryCandidates(catalog, 1000, 12.8).map(p => p.id), ["renogy-mini-100", "renogy-pro-smart-200ah"]);
  assert.deepEqual(batteryCandidates(catalog, 1500, 12.8).map(p => p.id), ["renogy-pro-smart-200ah"]);
  for (const voltage of [12.7, 24, 25.6, 48, 51.2]) assert.deepEqual(batteryCandidates(catalog, 1000, voltage), []);
  for (const wh of [NaN, Infinity, -1, 3000]) assert.deepEqual(batteryCandidates(catalog, wh, 12), []);
  const extension = catalog.find(p => p.id === "pecron-ep3800-48v")!;
  const documentedExtension = {
    ...extension,
    facets: { ...extension.facets, capacityWh: "3840" },
    technicalSpecs: { ...extension.technicalSpecs, "Nominal voltage": "48 V" },
  };
  assert.deepEqual(batteryCandidates([documentedExtension], 1000, 48), []);
});
