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
  calculateTransformer,
  formatElectricalNumber,
  getPositiveNumber,
  type MotorSystemType,
} from "@/lib/electrical-calculations";

type FormState = {
  expectedLoadPercent: string;
  primaryVoltage: string;
  secondaryVoltage: string;
  systemType: MotorSystemType;
  transformerKva: string;
};

type CalculationResult = ReturnType<typeof calculateTransformer> | { error: string };

const defaultFormState: FormState = {
  transformerKva: "250",
  primaryVoltage: "11000",
  secondaryVoltage: "400",
  expectedLoadPercent: "78",
  systemType: "three-phase",
};

function resolveTransformer(formState: FormState): CalculationResult {
  const transformerKva = getPositiveNumber(formState.transformerKva);
  const primaryVoltage = getPositiveNumber(formState.primaryVoltage);
  const secondaryVoltage = getPositiveNumber(formState.secondaryVoltage);
  const expectedLoadPercent = getPositiveNumber(formState.expectedLoadPercent);

  if (!transformerKva || !primaryVoltage || !secondaryVoltage || !expectedLoadPercent) {
    return { error: "Enter valid positive numbers for transformer size, voltages, and expected load." };
  }

  if (expectedLoadPercent > 100) {
    return { error: "Expected load percent must stay between 0 and 100." };
  }

  return calculateTransformer({
    transformerKva,
    primaryVoltage,
    secondaryVoltage,
    expectedLoadPercent,
    systemType: formState.systemType,
  });
}

export default function TransformerCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const result = resolveTransformer(formState);

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
  }

  return (
    <CalculatorLayout>
      <CalculatorFormPanel>
        <CalculatorGrid>
          <CalculatorField label="System type">
            <CalculatorSelect
              value={formState.systemType}
              onChange={(event) => updateField("systemType", event.target.value as MotorSystemType)}
            >
              <option value="three-phase">Three-phase transformer</option>
              <option value="single-phase">Single-phase transformer</option>
            </CalculatorSelect>
          </CalculatorField>
          <CalculatorField label="Transformer rating (kVA)">
            <CalculatorNumberInput
              min="0.1"
              step="0.1"
              value={formState.transformerKva}
              onChange={(event) => updateField("transformerKva", event.target.value)}
            />
          </CalculatorField>
          <CalculatorField label="Primary voltage (V)">
            <CalculatorNumberInput
              min="1"
              step="0.1"
              value={formState.primaryVoltage}
              onChange={(event) => updateField("primaryVoltage", event.target.value)}
            />
          </CalculatorField>
          <CalculatorField label="Secondary voltage (V)">
            <CalculatorNumberInput
              min="1"
              step="0.1"
              value={formState.secondaryVoltage}
              onChange={(event) => updateField("secondaryVoltage", event.target.value)}
            />
          </CalculatorField>
          <CalculatorField label="Expected operating load (%)">
            <CalculatorNumberInput
              min="1"
              max="100"
              step="0.1"
              value={formState.expectedLoadPercent}
              onChange={(event) => updateField("expectedLoadPercent", event.target.value)}
            />
          </CalculatorField>
        </CalculatorGrid>

        <CalculatorAssumptions>
          <ul className="list-disc space-y-2 pl-5">
            <li>This is a loading and current estimator only; it does not replace thermal, impedance, or fault-duty review.</li>
            <li>Expected load percent is used to scale operating current from transformer full-load current.</li>
            <li>Final design still needs protection, voltage regulation, impedance, cooling, and installation checks.</li>
          </ul>
        </CalculatorAssumptions>
      </CalculatorFormPanel>

      <CalculatorResultsPanel>
        {"error" in result ? (
          <CalculatorValidationCard message={result.error} />
        ) : (
          <>
            <CalculatorResultCard
              label="Available load"
              value={`${formatElectricalNumber(result.availableLoadKva)} kVA`}
              detail="Estimated working load at the configured operating percentage."
            />
            <CalculatorResultCard
              label="Primary current"
              value={`${formatElectricalNumber(result.fullLoadPrimaryCurrent)} A`}
              detail="Full-load primary current at transformer rated kVA."
            />
            <CalculatorResultCard
              label="Secondary current"
              value={`${formatElectricalNumber(result.fullLoadSecondaryCurrent)} A`}
              detail="Full-load secondary current at transformer rated kVA."
            />
            <CalculatorResultCard
              label="Expected primary current"
              value={`${formatElectricalNumber(result.expectedPrimaryCurrent)} A`}
              detail="Primary current at the configured expected load percentage."
            />
            <CalculatorResultCard
              label="Expected secondary current"
              value={`${formatElectricalNumber(result.expectedSecondaryCurrent)} A`}
              detail="Secondary current at the configured expected load percentage."
            />
          </>
        )}
      </CalculatorResultsPanel>
    </CalculatorLayout>
  );
}
