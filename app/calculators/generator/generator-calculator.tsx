"use client";
import { useCalculatorCopy } from "@/components/calculators/calculator-locale";
import { CalculationAnalytics } from "@/components/calculation-analytics";

import { useState } from "react";
import { resolveCalculation } from "@/lib/electrical-calculations";

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
  getNonNegativeNumber,
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
  const largestMotorKw = getNonNegativeNumber(formState.largestMotorKw);
  const reservePercent = getNonNegativeNumber(formState.reservePercent);

  if (!runningLoadKw || !powerFactor || largestMotorKw === null || reservePercent === null) {
    return { error: "Enter positive load and power factor, and zero or positive values for motor load and reserve." };
  }

  if (powerFactor > 1) {
    return { error: "Power factor must stay between 0 and 1." };
  }

  return resolveCalculation(() => calculateGenerator({
    runningLoadKw,
    powerFactor,
    largestMotorKw,
    reservePercent,
    startingMethod: formState.startingMethod,
  }));
}

export default function GeneratorCalculator({ ro = false }: { ro?: boolean }) {
  const l = useCalculatorCopy();
  const text = (en: string, translated: string) => ro ? translated : en;
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const result = resolveGenerator(formState);

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
  }

  return (
    <CalculatorLayout>
      <CalculationAnalytics signature={JSON.stringify(formState)} valid={!("error" in result)} />
      <CalculatorFormPanel>
        <CalculatorGrid>
          <CalculatorField label="Running load (kW)">
            <CalculatorNumberInput min="0.1" step="0.1" value={formState.runningLoadKw} onChange={(event) => updateField("runningLoadKw", event.target.value)} />
            <span className="text-xs leading-6">{text("Total simultaneous electrical input, including the motor below.", "Puterea electrică totală simultană, inclusiv motorul de mai jos.")}</span>
          </CalculatorField>
          <CalculatorField label="Power factor">
            <CalculatorNumberInput min="0.01" max="1" step="0.01" value={formState.powerFactor} onChange={(event) => updateField("powerFactor", event.target.value)} />
          </CalculatorField>
          <CalculatorField label={text("Largest motor electrical input (kW)", "Puterea electrică a motorului cel mai mare (kW)")}>
            <CalculatorNumberInput min="0" step="0.1" value={formState.largestMotorKw} onChange={(event) => updateField("largestMotorKw", event.target.value)} />
            <span className="text-xs leading-6">{text("Use 0 for no motor. Shaft-output kW must first be divided by motor efficiency.", "Folosește 0 fără motor. Împarte mai întâi puterea mecanică în kW la randamentul motorului.")}</span>
          </CalculatorField>
          <CalculatorField label="Starting method">
            <CalculatorSelect value={formState.startingMethod} onChange={(event) => updateField("startingMethod", event.target.value as StartingMethod)}>
              <option value="dol">{l("Direct-on-line")}</option>
              <option value="soft-starter">{l("Soft starter")}</option>
              <option value="vfd">{l("VFD")}</option>
            </CalculatorSelect>
          </CalculatorField>
          <CalculatorField label="Operating reserve (%)">
            <CalculatorNumberInput min="0" step="0.1" value={formState.reservePercent} onChange={(event) => updateField("reservePercent", event.target.value)} />
          </CalculatorField>
        </CalculatorGrid>

        <CalculatorAssumptions>
          <ul className="list-disc space-y-2 pl-5">
            <li>{l("Running kVA is estimated from running kW and power factor.")}</li>
            <li>{text("The additional startup budget is 4.5 / 2.2 / 1.2 kVA per motor-input kW for DOL / soft starter / VFD. These are illustrative planning factors, not measured starting-current ratios or manufacturer limits.", "Bugetul suplimentar de pornire este 4,5 / 2,2 / 1,2 kVA per kW electric al motorului pentru pornire directă / soft starter / VFD. Sunt factori ilustrativi de planificare, nu rapoarte de curent măsurate sau limite ale producătorului.")}</li>
            <li>{l("Use this as a planning figure only. Final generator selection still requires transient, harmonic, and manufacturer-specific review.")}</li>
          </ul>
        </CalculatorAssumptions>
      </CalculatorFormPanel>

      <CalculatorResultsPanel>
        {"error" in result ? (
          <CalculatorValidationCard message={result.error === "Largest motor electrical input must be included in total running load."
            ? text("Largest motor electrical input must be included in total running load.", "Puterea electrică a motorului trebuie inclusă în sarcina totală de funcționare.")
            : l(result.error)} />
        ) : (
          <>
            <CalculatorResultCard
              label="Running demand"
              value={`${formatElectricalNumber(result.runningLoadKva)} kVA`}
              detail="Estimated apparent power based on configured steady-state load and power factor."
            />
            <div data-testid="generator-real-power"><CalculatorResultCard
              label={text("Continuous real-power requirement", "Necesar continuu de putere activă")}
              value={`${formatElectricalNumber(result.reserveAdjustedRunningKw)} kW`}
              detail={text("Running electrical input plus the configured reserve. Check this against the generator's usable kW rating independently of its kVA rating.", "Puterea electrică de funcționare plus rezerva configurată. Verifică separat puterea utilă în kW a generatorului și limita sa în kVA.")}
            /></div>
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
            <div data-testid="generator-apparent-power"><CalculatorResultCard
              label={text("Preliminary apparent-power budget", "Buget preliminar de putere aparentă")}
              value={`${formatElectricalNumber(result.requiredGeneratorKva)} kVA`}
              detail={text("The larger of reserve-adjusted running demand and the simplified start case. This is a screening figure, not an available generator size or a guarantee that a motor will start.", "Maximul dintre sarcina cu rezervă și cazul simplificat de pornire. Este un reper preliminar, nu o mărime comercială de generator sau o garanție de pornire a motorului.")}
            /></div>
            <CalculatorRecommendation title={text("Continue generator selection", "Continuă alegerea generatorului")} copy={text("Review generator planning, starting capability and installation constraints. Battery power stations are a separate backup option, not combustion generators.", "Verifică planificarea generatorului, capacitatea de pornire și condițiile de instalare. Stațiile cu baterii sunt o alternativă separată, nu generatoare cu ardere.")} category="generators" />
          </>
        )}
      </CalculatorResultsPanel>
    </CalculatorLayout>
  );
}
