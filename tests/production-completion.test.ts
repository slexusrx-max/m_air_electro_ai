import assert from "node:assert/strict";
import test from "node:test";
import { searchContent } from "../lib/marketplace/search";
import { filterEquipment, solarEstimate } from "../lib/marketplace/query";
import { catalog } from "../lib/affiliate/catalog";
import { visualFamily } from "../lib/visual-system";
import { navigation } from "../lib/marketplace/navigation";
import { calculateMotorCurrent, calculateTransformer, calculateVoltageDrop, resolveCalculation } from "../lib/electrical-calculations";
import { calculatorRomanian } from "../lib/i18n/calculator-copy";
import { readFileSync } from "node:fs";
import ts from "typescript";

test("requested searches discover real equipment and related bilingual content", () => {
  for (const q of ["battery", "12v", "100ah", "2000w", "solar", "inverter", "backup", "RV", "marine", "generator", "MPPT"]) {
    assert.ok(filterEquipment(catalog, { q }).length, `equipment: ${q}`);
    assert.ok(searchContent(q).length, `content: ${q}`);
  }
  assert.ok(searchContent("baterie").every(r => r.title.en && r.title.ro));
  assert.equal(searchContent("impossible987654").length, 0);
  assert.equal(searchContent("").length, 0);
  assert.deepEqual(searchContent("100 Ah"), searchContent("100ah"));
});
test("visual families stay distinct, including nested categories and products", () => {
  const paths = ["/", "/marketplace", "/marketplace/solar/panels", "/marketplace/batteries/100ah", "/marketplace/inverters/2000w", "/marketplace/chargers", "/marketplace/backup-power", "/marketplace/generators", "/marketplace/ev-charging", "/marketplace/marine", "/marketplace/industrial", "/solutions", "/calculators/solar", "/learn/solar", "/experts", "/business"];
  assert.equal(new Set(paths.map(visualFamily)).size, paths.length);
  assert.equal(visualFamily("/marketplace/products/renogy-core-mini-100ah"), "batteries");
  assert.equal(visualFamily("/marketplace/products/renogy-n-type-200w"), "solar");
  assert.equal(visualFamily("/about"), "brand");
  for (const locale of ["ro", "en"] as const) assert.deepEqual(navigation(locale).map(g => g.href), ["/marketplace", "/solutions", "/calculators", "/learn", "/experts", "/business"]);
});
test("solar calculator rejects overflow and unsafe numeric precision", () => {
  assert.equal(solarEstimate(Number.MAX_VALUE, .1, .01), null);
  assert.equal(solarEstimate(3000, Number.MIN_VALUE, .75), null);
  assert.equal(solarEstimate(3000, 3.5, .75), 1143);
});

test("engineering calculators reject overflowing results and impossible negative voltage", () => {
  for (const run of [
    () => calculateMotorCurrent({ efficiencyPercent: 92, powerFactor: .8, powerKw: 1e308, startCurrentMultiplier: 6, systemType: "three-phase", voltage: 400 }),
    () => calculateTransformer({ expectedLoadPercent: 50, primaryVoltage: 400, secondaryVoltage: 230, systemType: "three-phase", transformerKva: 1e308 }),
    () => calculateVoltageDrop({ cableSize: 1.5, current: 1000, length: 1000, material: "copper", maxVoltageDropPercent: 3, systemType: "single-phase", voltage: 230 }),
  ]) assert.ok("error" in resolveCalculation(() => run()));
});

test("all static engineering calculator interface copy has Romanian translations", () => {
  const missing = new Set<string>();
  const units = new Set(["DC", "VFD", "mm^2"]);
  for (const slug of ["generator", "transformer", "motor-current", "cable-sizing", "voltage-drop", "fuse-selection", "breaker-selection"]) {
    const file = `app/calculators/${slug}/${slug}-calculator.tsx`;
    const tree = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const check = (value: string) => { if (!calculatorRomanian[value] && !units.has(value)) missing.add(value); };
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && node.expression.getText(tree) === "l" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) check(node.arguments[0].text);
      if (ts.isJsxAttribute(node) && ["label", "detail", "title", "copy"].includes(node.name.getText(tree)) && node.initializer && ts.isStringLiteral(node.initializer)) check(node.initializer.text);
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }
  assert.deepEqual([...missing], []);
});
