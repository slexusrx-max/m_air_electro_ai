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
  CalculatorValidationCard,
} from "@/components/calculators/calculator-primitives";
import { calculateBattery, formatElectricalNumber, getPositiveNumber } from "@/lib/electrical-calculations";
import { CalculatorRecommendation } from "@/components/marketplace/calculator-recommendation";

type FormState = {
  backupHours: string;
  inverterEfficiencyPercent: string;
  loadPowerWatts: string;
  maxDepthOfDischargePercent: string;
  systemVoltage: string;
};

type CalculationResult = ReturnType<typeof calculateBattery> | { error: string };

const defaultFormState: FormState = {
  loadPowerWatts: "1200",
  backupHours: "4",
  systemVoltage: "24",
  maxDepthOfDischargePercent: "80",
  inverterEfficiencyPercent: "92",
};

function resolveBattery(formState: FormState): CalculationResult {
  const loadPowerWatts = getPositiveNumber(formState.loadPowerWatts);
  const backupHours = getPositiveNumber(formState.backupHours);
  const systemVoltage = getPositiveNumber(formState.systemVoltage);
  const maxDepthOfDischargePercent = getPositiveNumber(formState.maxDepthOfDischargePercent);
  const inverterEfficiencyPercent = getPositiveNumber(formState.inverterEfficiencyPercent);

  if (!loadPowerWatts || !backupHours || !systemVoltage || !maxDepthOfDischargePercent || !inverterEfficiencyPercent) {
    return { error: "Enter valid positive numbers for load, backup time, voltage, efficiency, and depth of discharge." };
  }

  if (maxDepthOfDischargePercent >= 100 || inverterEfficiencyPercent > 100) {
    return { error: "Depth of discharge must stay below 100 and efficiency must stay between 0 and 100." };
  }

  return calculateBattery({
    loadPowerWatts,
    backupHours,
    systemVoltage,
    maxDepthOfDischargePercent,
    inverterEfficiencyPercent,
  });
}

export default function BatteryCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const result = resolveBattery(formState);

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
  }

  return (
    <CalculatorLayout>
      <CalculatorFormPanel>
        <CalculatorGrid>
          <CalculatorField label="Load power (W)">
            <CalculatorNumberInput min="1" step="1" value={formState.loadPowerWatts} onChange={(event) => updateField("loadPowerWatts", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Backup time (hours)">
            <CalculatorNumberInput min="0.1" step="0.1" value={formState.backupHours} onChange={(event) => updateField("backupHours", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Battery system voltage (V)">
            <CalculatorNumberInput min="1" step="0.1" value={formState.systemVoltage} onChange={(event) => updateField("systemVoltage", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Maximum depth of discharge (%)">
            <CalculatorNumberInput min="1" max="99" step="0.1" value={formState.maxDepthOfDischargePercent} onChange={(event) => updateField("maxDepthOfDischargePercent", event.target.value)} />
          </CalculatorField>
          <CalculatorField label="Inverter efficiency (%)">
            <CalculatorNumberInput min="1" max="100" step="0.1" value={formState.inverterEfficiencyPercent} onChange={(event) => updateField("inverterEfficiencyPercent", event.target.value)} />
          </CalculatorField>
        </CalculatorGrid>

        <CalculatorAssumptions>
          <ul className="list-disc space-y-2 pl-5">
            <li>Load energy is converted to required nominal battery energy using inverter efficiency and maximum depth of discharge.</li>
            <li>The recommended Ah value is rounded up to a common battery-bank capacity step for quick planning.</li>
            <li>Final battery design still requires chemistry, discharge-rate, temperature, charging, and lifecycle review.</li>
          </ul>
        </CalculatorAssumptions>
      </CalculatorFormPanel>

      <CalculatorResultsPanel>
        {"error" in result ? (
          <CalculatorValidationCard message={result.error} />
        ) : (
          <>
            <CalculatorResultCard
              label="Required load energy"
              value={`${formatElectricalNumber(result.requiredLoadEnergyWh)} Wh`}
              detail="Energy demanded by the connected load over the configured backup window."
            />
            <CalculatorResultCard
              label="Minimum nominal energy"
              value={`${formatElectricalNumber(result.minimumNominalWh)} Wh`}
              detail="Nominal battery energy required after accounting for efficiency and usable depth of discharge."
            />
            <CalculatorResultCard
              label="Minimum nominal capacity"
              value={`${formatElectricalNumber(result.minimumNominalAh)} Ah`}
              detail="Calculated minimum battery-bank ampere-hour requirement."
            />
            <CalculatorResultCard
              label="Recommended battery bank"
              value={`${formatElectricalNumber(result.recommendedBatteryAh)} Ah`}
              detail="Rounded planning value based on common battery-bank capacity steps."
            />
            <CalculatorRecommendation title="Review battery system categories" copy="Use the calculated capacity as a starting point for selecting a battery bank, inverter and charging components." category="lithium-batteries" />
          </>
        )}
      </CalculatorResultsPanel>
    </CalculatorLayout>
  );
}
