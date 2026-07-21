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
  calculateBreakerSelection,
  formatElectricalNumber,
  getPositiveNumber,
  type ProtectionLoadType,
} from "@/lib/electrical-calculations";

type FormState = {
  ambientDeratingPercent: string;
  designCurrent: string;
  inrushMultiplier: string;
  loadType: ProtectionLoadType;
  spareMarginPercent: string;
};

type CalculationResult = ReturnType<typeof calculateBreakerSelection> | { error: string };

const defaultFormState: FormState = {
  designCurrent: "48",
  loadType: "continuous",
  ambientDeratingPercent: "100",
  spareMarginPercent: "10",
  inrushMultiplier: "3",
};

function resolveBreaker(formState: FormState): CalculationResult {
  const designCurrent = getPositiveNumber(formState.designCurrent);
  const ambientDeratingPercent = getPositiveNumber(formState.ambientDeratingPercent);
  const spareMarginPercent = getPositiveNumber(formState.spareMarginPercent);
  const inrushMultiplier = getPositiveNumber(formState.inrushMultiplier);

  if (!designCurrent || !ambientDeratingPercent || !spareMarginPercent || !inrushMultiplier) {
    return { error: "Enter valid positive numbers for design current, derating, spare margin, and inrush." };
  }

  if (ambientDeratingPercent > 100) {
    return { error: "Ambient derating should be expressed as a percent up to 100." };
  }

  return calculateBreakerSelection({
    designCurrent,
    ambientDeratingPercent,
    spareMarginPercent,
    inrushMultiplier,
    loadType: formState.loadType,
  });
}

export default function BreakerSelectionCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const result = resolveBreaker(formState);

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
  }

  return (
    <CalculatorLayout>
      <CalculatorFormPanel>
        <CalculatorGrid>
          <CalculatorField label="Design current (A)">
            <CalculatorNumberInput min="0.1" step="0.1" value={formState.designCurrent} onChange={(event) => updateField("designCurrent", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Load profile">
            <CalculatorSelect value={formState.loadType} onChange={(event) => updateField("loadType", event.target.value as ProtectionLoadType)}>
              <option value="general">General load</option>
              <option value="continuous">Continuous load</option>
              <option value="motor">Motor load</option>
            </CalculatorSelect>
          </CalculatorField>
          <CalculatorField label="Ambient derating available (%)">
            <CalculatorNumberInput min="1" max="100" step="0.1" value={formState.ambientDeratingPercent} onChange={(event) => updateField("ambientDeratingPercent", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Spare margin (%)">
            <CalculatorNumberInput min="0" step="0.1" value={formState.spareMarginPercent} onChange={(event) => updateField("spareMarginPercent", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Inrush multiplier">
            <CalculatorNumberInput min="1" step="0.1" value={formState.inrushMultiplier} onChange={(event) => updateField("inrushMultiplier", event.target.value)} />
          </CalculatorField>
        </CalculatorGrid>

        <CalculatorAssumptions>
          <ul className="list-disc space-y-2 pl-5">
            <li>This is a preliminary breaker-rating workflow and does not replace code-specific protection coordination.</li>
            <li>Continuous and motor duty use a basic planning multiplier before rounding to the next standard rating.</li>
            <li>High inrush loads still require curve and settings verification before procurement or energization.</li>
          </ul>
        </CalculatorAssumptions>
      </CalculatorFormPanel>

      <CalculatorResultsPanel>
        {"error" in result ? (
          <CalculatorValidationCard message={result.error} />
        ) : (
          <>
            <CalculatorResultCard
              label="Adjusted design current"
              value={`${formatElectricalNumber(result.adjustedCurrent)} A`}
              detail="Design current after applying duty assumptions, spare margin, and derating."
            />
            <CalculatorResultCard
              label="Minimum standard breaker"
              value={`${formatElectricalNumber(result.minimumBreakerRating)} A`}
              detail="Smallest standard breaker at or above the entered design current."
            />
            <CalculatorResultCard
              label="Recommended breaker"
              value={`${formatElectricalNumber(result.recommendedBreakerRating)} A`}
              detail="Rounded preliminary breaker rating from the adjusted design current."
            />
            <CalculatorResultCard
              label="Engineering note"
              value="Review"
              detail={result.advisory}
            />
          </>
        )}
      </CalculatorResultsPanel>
    </CalculatorLayout>
  );
}
