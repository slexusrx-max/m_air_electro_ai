"use client";

import { useState } from "react";

import {
  CalculatorAssumptions,
  CalculatorField,
  CalculatorFormPanel,
  CalculatorGrid,
  CalculatorLayout,
  CalculatorNumberInput,
  CalculatorResultCard,
  CalculatorResultsPanel,
  CalculatorSelect,
  CalculatorValidationCard,
} from "@/components/calculators/calculator-primitives";
import {
  calculateGenerator,
  formatElectricalNumber,
  getPositiveNumber,
  type StartingMethod,
} from "@/lib/electrical-calculations";
import { CalculatorRecommendation } from "@/components/marketplace/calculator-recommendation";

type FormState = {
  largestMotorKw: string;
  powerFactor: string;
  reservePercent: string;
  runningLoadKw: string;
  startingMethod: StartingMethod;
};

type CalculationResult = ReturnType<typeof calculateGenerator> | { error: string };

const defaultFormState: FormState = {
  runningLoadKw: "180",
  powerFactor: "0.85",
  largestMotorKw: "30",
  reservePercent: "20",
  startingMethod: "dol",
};

function resolveGenerator(formState: FormState): CalculationResult {
  const runningLoadKw = getPositiveNumber(formState.runningLoadKw);
  const powerFactor = getPositiveNumber(formState.powerFactor);
  const largestMotorKw = getPositiveNumber(formState.largestMotorKw);
  const reservePercent = getPositiveNumber(formState.reservePercent);

  if (!runningLoadKw || !powerFactor || !largestMotorKw || !reservePercent) {
    return { error: "Enter valid positive numbers for load, power factor, largest motor, and reserve." };
  }

  if (powerFactor > 1) {
    return { error: "Power factor must stay between 0 and 1." };
  }

  return calculateGenerator({
    runningLoadKw,
    powerFactor,
    largestMotorKw,
    reservePercent,
    startingMethod: formState.startingMethod,
  });
}

export default function GeneratorCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const result = resolveGenerator(formState);

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
  }

  return (
    <CalculatorLayout>
      <CalculatorFormPanel>
        <CalculatorGrid>
          <CalculatorField label="Running load (kW)">
            <CalculatorNumberInput min="0.1" step="0.1" value={formState.runningLoadKw} onChange={(event) => updateField("runningLoadKw", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Power factor">
            <CalculatorNumberInput min="0.01" max="1" step="0.01" value={formState.powerFactor} onChange={(event) => updateField("powerFactor", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Largest motor (kW)">
            <CalculatorNumberInput min="0.1" step="0.1" value={formState.largestMotorKw} onChange={(event) => updateField("largestMotorKw", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Starting method">
            <CalculatorSelect value={formState.startingMethod} onChange={(event) => updateField("startingMethod", event.target.value as StartingMethod)}>
              <option value="dol">Direct-on-line</option>
              <option value="soft-starter">Soft starter</option>
              <option value="vfd">VFD</option>
            </CalculatorSelect>
          </CalculatorField>
          <CalculatorField label="Operating reserve (%)">
            <CalculatorNumberInput min="0" step="0.1" value={formState.reservePercent} onChange={(event) => updateField("reservePercent", event.target.value)} />
          </CalculatorField>
        </CalculatorGrid>

        <CalculatorAssumptions>
          <ul className="list-disc space-y-2 pl-5">
            <li>Running kVA is estimated from running kW and power factor.</li>
            <li>Largest motor start allowance uses a simplified multiplier based on starting method.</li>
            <li>Use this as a planning figure only. Final generator selection still requires transient, harmonic, and manufacturer-specific review.</li>
          </ul>
        </CalculatorAssumptions>
      </CalculatorFormPanel>

      <CalculatorResultsPanel>
        {"error" in result ? (
          <CalculatorValidationCard message={result.error} />
        ) : (
          <>
            <CalculatorResultCard
              label="Running demand"
              value={`${formatElectricalNumber(result.runningLoadKva)} kVA`}
              detail="Estimated apparent power based on configured steady-state load and power factor."
            />
            <CalculatorResultCard
              label="Reserve-adjusted demand"
              value={`${formatElectricalNumber(result.reserveAdjustedRunningKva)} kVA`}
              detail="Running demand after applying the configured operating reserve."
            />
            <CalculatorResultCard
              label="Motor-start allowance"
              value={`${formatElectricalNumber(result.motorStartAllowanceKva)} kVA`}
              detail="Simplified additional allowance for the largest motor-start event."
            />
            <CalculatorResultCard
              label="Recommended generator"
              value={`${formatElectricalNumber(result.recommendedGeneratorKva)} kVA`}
              detail="Rounded preliminary generator rating from the governing running or start case."
            />
            <CalculatorRecommendation title="Explore backup-system components" copy="Compare inverter, battery and protection categories after confirming the load profile with a qualified professional." category="backup-power" />
          </>
        )}
      </CalculatorResultsPanel>
    </CalculatorLayout>
  );
}
