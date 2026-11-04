import test from "node:test";
import assert from "node:assert/strict";
import { calculateGenerator, resolveCalculation } from "../lib/electrical-calculations";

test("generator sizing keeps engine kW and alternator kVA requirements separate", () => {
  const result = calculateGenerator({ runningLoadKw: 200, powerFactor: 0.8, reservePercent: 20, largestMotorKw: 0, startingMethod: "dol" });
  assert.equal(result.runningLoadKva, 250);
  assert.equal(result.reserveAdjustedRunningKw, 240);
  assert.equal(result.reserveAdjustedRunningKva, 300);
  assert.equal(result.requiredGeneratorKva, 300);
  assert.ok(result.recommendedGeneratorKva >= result.requiredGeneratorKva);
});

test("small resistive loads retain their actual demand instead of presenting a protection-number tier as equipment capacity", () => {
  const result = calculateGenerator({ runningLoadKw: 2, powerFactor: 1, reservePercent: 25, largestMotorKw: 0, startingMethod: "dol" });
  assert.equal(result.requiredGeneratorKva, 2.5);
  assert.equal(result.reserveAdjustedRunningKw, 2.5);
  assert.equal(result.motorStartAllowanceKva, 0);
});

test("largest motor is an electrical-input subset of the total, not an extra omitted load", () => {
  const input = { runningLoadKw: 5, powerFactor: 0.8, reservePercent: 20, largestMotorKw: 6, startingMethod: "dol" as const };
  assert.throws(() => calculateGenerator(input), /must be included in total running load/);
  assert.ok("error" in resolveCalculation(() => calculateGenerator(input)));
  assert.doesNotThrow(() => calculateGenerator({ ...input, largestMotorKw: 5 }));
});

test("worked motor example follows the disclosed additive heuristic and the governing case", () => {
  const input = { runningLoadKw: 6, powerFactor: 0.8, reservePercent: 20, largestMotorKw: 1, startingMethod: "dol" as const };
  const direct = calculateGenerator(input);
  assert.equal(direct.runningLoadKva, 7.5);
  assert.equal(direct.reserveAdjustedRunningKva, 9);
  assert.equal(direct.motorStartAllowanceKva, 4.5);
  assert.equal(direct.requiredGeneratorKva, 12);
  const drive = calculateGenerator({ ...input, startingMethod: "vfd" });
  assert.equal(drive.requiredGeneratorKva, 9);
  assert.equal(drive.motorStartAllowanceKva, 1.2);
});

test("lower load PF raises apparent demand without silently increasing real load power", () => {
  const input = { runningLoadKw: 8, powerFactor: 1, reservePercent: 0, largestMotorKw: 0, startingMethod: "dol" as const };
  const unity = calculateGenerator(input);
  const lagging = calculateGenerator({ ...input, powerFactor: 0.8 });
  assert.equal(unity.requiredGeneratorKva, 8);
  assert.equal(lagging.requiredGeneratorKva, 10);
  assert.equal(unity.reserveAdjustedRunningKw, lagging.reserveAdjustedRunningKw);
});
