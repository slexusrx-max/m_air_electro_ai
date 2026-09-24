import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateBattery, calculateBreakerSelection, calculateCableSizing,
  calculateFuseSelection, calculateGenerator, calculateMotorCurrent,
  calculateTransformer, calculateVoltageDrop, getNonNegativeNumber,
  resolveCalculation,
} from "../lib/electrical-calculations";
import { calculateAppliances, calculatePlan, type Appliance } from "../lib/marketplace/planning";
import { cleanQuery, filterEquipment, normalizeSearch, parseComparison, solarEstimate } from "../lib/marketplace/query";
import { estimateSystem, matchingSystemCandidates } from "../lib/marketplace/recommendation";
import { searchContent } from "../lib/marketplace/search";
import { catalog } from "../lib/affiliate/catalog";
import type { Equipment } from "../lib/marketplace/catalog-data";

const cable = { current: 32, length: 45, material: "copper" as const, maxVoltageDropPercent: 3, systemType: "three-phase" as const, voltage: 400 };
const cases: { name: string; values: Record<string, number>; zero: string[]; run: (values: Record<string, number>) => object }[] = [
  { name: "cable", values: { current: 32, length: 45, maxVoltageDropPercent: 3, voltage: 400 }, zero: [], run: (v: Record<string, number>) => calculateCableSizing({ ...cable, ...v }) },
  { name: "voltage drop", values: { current: 32, length: 45, maxVoltageDropPercent: 3, voltage: 400, cableSize: 16 }, zero: [], run: (v: Record<string, number>) => calculateVoltageDrop({ ...cable, cableSize: 16, ...v }) },
  { name: "motor", values: { efficiencyPercent: 92, powerFactor: .86, powerKw: 15, startCurrentMultiplier: 6, voltage: 400 }, zero: [], run: (v: Record<string, number>) => calculateMotorCurrent({ efficiencyPercent: 92, powerFactor: .86, powerKw: 15, startCurrentMultiplier: 6, voltage: 400, systemType: "three-phase", ...v }) },
  { name: "transformer", values: { expectedLoadPercent: 78, primaryVoltage: 11000, secondaryVoltage: 400, transformerKva: 250 }, zero: ["expectedLoadPercent"], run: (v: Record<string, number>) => calculateTransformer({ expectedLoadPercent: 78, primaryVoltage: 11000, secondaryVoltage: 400, transformerKva: 250, systemType: "three-phase", ...v }) },
  { name: "battery", values: { backupHours: 4, inverterEfficiencyPercent: 92, loadPowerWatts: 1200, maxDepthOfDischargePercent: 80, systemVoltage: 24 }, zero: [], run: (v: Record<string, number>) => calculateBattery({ backupHours: 4, inverterEfficiencyPercent: 92, loadPowerWatts: 1200, maxDepthOfDischargePercent: 80, systemVoltage: 24, ...v }) },
  { name: "generator", values: { largestMotorKw: 30, powerFactor: .85, reservePercent: 20, runningLoadKw: 180 }, zero: ["largestMotorKw", "reservePercent"], run: (v: Record<string, number>) => calculateGenerator({ largestMotorKw: 30, powerFactor: .85, reservePercent: 20, runningLoadKw: 180, startingMethod: "dol", ...v }) },
  { name: "breaker", values: { ambientDeratingPercent: 100, designCurrent: 48, inrushMultiplier: 3, spareMarginPercent: 10 }, zero: ["spareMarginPercent"], run: (v: Record<string, number>) => calculateBreakerSelection({ ambientDeratingPercent: 100, designCurrent: 48, inrushMultiplier: 3, spareMarginPercent: 10, loadType: "continuous", ...v }) },
  { name: "fuse", values: { designCurrent: 32, spareMarginPercent: 10 }, zero: ["spareMarginPercent"], run: (v: Record<string, number>) => calculateFuseSelection({ designCurrent: 32, spareMarginPercent: 10, applicationType: "general-circuit", continuousLoad: true, ...v }) },
];

for (const scenario of cases) {
  test(`${scenario.name}: every numeric input rejects negative, non-finite and unsafe values`, () => {
    assert.ok(!("error" in resolveCalculation(() => scenario.run({}))));
    for (const field of Object.keys(scenario.values)) {
      for (const value of [-1, NaN, Infinity, -Infinity, Number.MAX_VALUE]) {
        assert.ok("error" in resolveCalculation(() => scenario.run({ [field]: value })), `${field}=${value}`);
      }
      const zero = resolveCalculation(() => scenario.run({ [field]: 0 }));
      assert.equal("error" in zero, !scenario.zero.includes(field), `${field}=0`);
    }
  });
}

test("zero is accepted only where meaningful and blank is never interpreted as zero", () => {
  assert.equal(getNonNegativeNumber("0"), 0);
  assert.equal(getNonNegativeNumber("0.5"), .5);
  for (const value of ["", " ", "NaN", "Infinity", "-1"]) assert.equal(getNonNegativeNumber(value), null);
  const generator = calculateGenerator({ largestMotorKw: 0, powerFactor: 1, reservePercent: 0, runningLoadKw: 10, startingMethod: "dol" });
  assert.equal(generator.motorStartAllowanceKva, 0);
  assert.equal(generator.recommendedGeneratorKva, 10);
  const transformer = calculateTransformer({ expectedLoadPercent: 0, primaryVoltage: 11000, secondaryVoltage: 400, transformerKva: 250, systemType: "three-phase" });
  assert.equal(transformer.expectedSecondaryCurrent, 0);
  assert.ok(transformer.fullLoadSecondaryCurrent > 0);
});

test("percentages and starting multipliers cannot silently yield impossible ratings", () => {
  for (const name of ["cable", "voltage drop"]) assert.ok("error" in resolveCalculation(() => cases.find(c => c.name === name)!.run({ maxVoltageDropPercent: 100 })));
  for (const [name, values] of [
    ["motor", { efficiencyPercent: 101 }], ["motor", { powerFactor: 1.1 }],
    ["motor", { startCurrentMultiplier: .5 }], ["breaker", { inrushMultiplier: .5 }],
    ["breaker", { ambientDeratingPercent: 101 }], ["transformer", { expectedLoadPercent: 101 }],
    ["battery", { maxDepthOfDischargePercent: 100 }], ["battery", { inverterEfficiencyPercent: 101 }],
    ["generator", { powerFactor: 1.1 }],
  ] as [string, Record<string, number>][]) assert.ok("error" in resolveCalculation(() => cases.find(c => c.name === name)!.run(values)), name);
});

test("backup quantities, custom loads and all numeric settings reject invalid values", () => {
  const device: Appliance = { id: "custom-1", name: "Custom load", watts: 100, quantity: 2, hours: 4, surge: 2, enabled: true };
  for (const field of ["watts", "quantity", "hours", "surge"]) {
    for (const value of [0, -1, NaN, Infinity, Number.MAX_VALUE]) assert.throws(() => calculateAppliances([{ ...device, [field]: value }], 8, 80, 92), `${field}=${value}`);
  }
  for (const index of [0, 1, 2]) for (const value of [0, -1, NaN, Infinity, Number.MAX_VALUE]) {
    const settings: [number, number, number] = [8, 80, 92];
    settings[index] = value;
    assert.throws(() => calculateAppliances([device], ...settings));
  }
  assert.throws(() => calculateAppliances([{ ...device, name: " " }], 8, 80, 92));
  assert.throws(() => calculateAppliances([{ ...device, quantity: 1.5 }], 8, 80, 92));
  assert.throws(() => calculateAppliances([{ ...device, enabled: false }], 8, 80, 92));
  const result = calculateAppliances([device], 2, 80, 100);
  assert.equal(result.energyWh, 400);
  assert.equal(result.nominalWh, 500);
});

test("solar and finder reject every invalid input before producing recommendations", () => {
  for (const index of [0, 1, 2]) for (const value of [0, -1, NaN, Infinity, Number.MAX_VALUE]) {
    const values: [number, number, number] = [3000, 3.5, .75];
    values[index] = value;
    assert.equal(solarEstimate(...values), null);
  }
  for (const field of ["load", "peak", "hours"]) for (const value of [0, -1, NaN, Infinity, Number.MAX_VALUE]) {
    assert.throws(() => calculatePlan({ load: 250, peak: 500, hours: 4, application: "home", solar: false, [field]: value }));
  }
});

test("finder excludes known undersized surge ratings without inventing unknown specifications", () => {
  const inverter = catalog.find(p => p.kind === "product" && p.category === "inverters")!;
  const requirements = estimateSystem(250, 2500, 4)!;
  const products: Equipment[] = [
    { ...inverter, id: "too-small", facets: { power: "1000", surgePower: "2000" } },
    { ...inverter, id: "enough", facets: { power: "1000", surgePower: "3000" } },
    { ...inverter, id: "unknown", facets: { power: "1000" } },
  ];
  assert.deepEqual(matchingSystemCandidates(products, ["inverters"], "EU", requirements).map(p => p.id), ["enough", "unknown"]);
  assert.equal(matchingSystemCandidates(products, ["inverters"], "US", requirements).length, 0);
  assert.equal(matchingSystemCandidates(products, ["solar"], "EU", requirements).length, 0);
});

test("all requested search terms and Romanian diacritics retain equivalent useful results", () => {
  for (const q of ["battery", "12v", "100ah", "2000w", "solar", "inverter", "backup", "rv", "marine", "generator", "mppt", "renogy"]) assert.ok(filterEquipment(catalog, { q }).length, q);
  for (const [left, right] of [["100 Ah", "100ah"], ["2000 W", "2000w"], ["12 V", "12v"], ["încărcare", "incarcare"], ["protecție", "protectie"], ["12,8 V", "12.8v"]]) {
    assert.equal(normalizeSearch(left), normalizeSearch(right));
    assert.deepEqual(filterEquipment(catalog, { q: left }), filterEquipment(catalog, { q: right }));
    assert.deepEqual(searchContent(left), searchContent(right));
  }
  assert.equal(filterEquipment(catalog, { q: '<script>alert("missing-123456789")</script>' }).length, 0);
  assert.equal(cleanQuery({ q: ["solar", "battery"] }).q, "solar");
  assert.equal(cleanQuery({ q: "a".repeat(1000) }).q?.length, 150);
});

test("every published set of four longest comparison IDs survives shareable query parsing", () => {
  const longest = [...catalog].sort((a, b) => b.id.length - a.id.length).slice(0, 4);
  const ids = longest.map(p => p.id).join(",");
  assert.deepEqual(parseComparison(cleanQuery({ ids }).ids, catalog).map(p => p.id), longest.map(p => p.id));
});
