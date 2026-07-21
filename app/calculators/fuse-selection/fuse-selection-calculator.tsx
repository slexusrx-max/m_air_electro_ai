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
  calculateFuseSelection,
  formatElectricalNumber,
  getPositiveNumber,
  type FuseApplicationType,
} from "@/lib/electrical-calculations";

type FormState = {
  applicationType: FuseApplicationType;
  continuousLoad: "yes" | "no";
  designCurrent: string;
  spareMarginPercent: string;
};

type CalculationResult = ReturnType<typeof calculateFuseSelection> | { error: string };

const defaultFormState: FormState = {
  designCurrent: "32",
  applicationType: "general-circuit",
  continuousLoad: "yes",
  spareMarginPercent: "10",
};

function resolveFuse(formState: FormState): CalculationResult {
  const designCurrent = getPositiveNumber(formState.designCurrent);
  const spareMarginPercent = getPositiveNumber(formState.spareMarginPercent);

  if (!designCurrent || !spareMarginPercent) {
    return { error: "Enter valid positive numbers for current and spare margin." };
  }

  return calculateFuseSelection({
    designCurrent,
    spareMarginPercent,
    applicationType: formState.applicationType,
    continuousLoad: formState.continuousLoad === "yes",
  });
}

export default function FuseSelectionCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const result = resolveFuse(formState);

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
          <CalculatorField label="Application type">
            <CalculatorSelect value={formState.applicationType} onChange={(event) => updateField("applicationType", event.target.value as FuseApplicationType)}>
              <option value="general-circuit">General circuit</option>
              <option value="motor-circuit">Motor circuit</option>
              <option value="semiconductor">Semiconductor protection</option>
            </CalculatorSelect>
          </CalculatorField>
          <CalculatorField label="Continuous load">
            <CalculatorSelect value={formState.continuousLoad} onChange={(event) => updateField("continuousLoad", event.target.value as "yes" | "no")}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </CalculatorSelect>
          </CalculatorField>
          <CalculatorField label="Spare margin (%)">
            <CalculatorNumberInput min="0" step="0.1" value={formState.spareMarginPercent} onChange={(event) => updateField("spareMarginPercent", event.target.value)} />
          </CalculatorField>
        </CalculatorGrid>

        <CalculatorAssumptions>
          <ul className="list-disc space-y-2 pl-5">
            <li>Fuse family is selected from application class: gG for general, aM for motor, and aR for semiconductor-focused protection.</li>
            <li>Continuous-load and application multipliers are used for planning only and do not replace manufacturer coordination curves.</li>
            <li>Fault duty, I2t behavior, and upstream/downstream coordination must still be checked before final issue of materials.</li>
          </ul>
        </CalculatorAssumptions>
      </CalculatorFormPanel>

      <CalculatorResultsPanel>
        {"error" in result ? (
          <CalculatorValidationCard message={result.error} />
        ) : (
          <>
            <CalculatorResultCard
              label="Adjusted current"
              value={`${formatElectricalNumber(result.adjustedCurrent)} A`}
              detail="Current after application and spare-margin multipliers."
            />
            <CalculatorResultCard
              label="Fuse family"
              value={result.fuseFamily}
              detail="Preliminary fuse family selected from the configured application type."
            />
            <CalculatorResultCard
              label="Recommended fuse"
              value={`${formatElectricalNumber(result.recommendedFuseRating)} A`}
              detail="Rounded preliminary fuse size from the adjusted design current."
            />
            <CalculatorResultCard label="Engineering note" value="Review" detail={result.advisory} />
          </>
        )}
      </CalculatorResultsPanel>
    </CalculatorLayout>
  );
}
