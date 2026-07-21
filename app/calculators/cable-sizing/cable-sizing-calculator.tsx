"use client";

import { useState } from "react";

import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import {
  calculateCableSizing,
  formatElectricalNumber,
  getPositiveNumber,
  type CableMaterial,
  type SystemType,
} from "@/lib/electrical-calculations";

type FormState = {
  current: string;
  length: string;
  material: CableMaterial;
  maxVoltageDropPercent: string;
  systemType: SystemType;
  voltage: string;
};

type CalculationResult = ReturnType<typeof calculateCableSizing> | { error: string };

const defaultFormState: FormState = {
  material: "copper",
  systemType: "three-phase",
  voltage: "400",
  current: "32",
  length: "45",
  maxVoltageDropPercent: "3",
};

function resolveCableSizing(formState: FormState): CalculationResult {
  const voltage = getPositiveNumber(formState.voltage);
  const current = getPositiveNumber(formState.current);
  const length = getPositiveNumber(formState.length);
  const maxVoltageDropPercent = getPositiveNumber(formState.maxVoltageDropPercent);

  if (!voltage || !current || !length || !maxVoltageDropPercent) {
    return {
      error: "Enter valid positive numbers for voltage, current, cable length, and max voltage drop.",
    };
  }

  try {
    return calculateCableSizing({
      current,
      length,
      material: formState.material,
      maxVoltageDropPercent,
      systemType: formState.systemType,
      voltage,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to calculate cable size.",
    };
  }
}

function ResultCard({
  label,
  value,
  detail,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <article className={moduleCardClassName}>
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-lime-100/75">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-7 text-white/72">{detail}</p>
    </article>
  );
}

export default function CableSizingCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const result = resolveCableSizing(formState);

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <section className={`${glassPanelClassName} p-6 sm:p-8`}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">System type</span>
            <select
              value={formState.systemType}
              onChange={(event) => updateField("systemType", event.target.value as SystemType)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            >
              <option value="three-phase">Three-phase AC</option>
              <option value="single-phase">Single-phase AC</option>
              <option value="dc">DC</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Conductor material</span>
            <select
              value={formState.material}
              onChange={(event) => updateField("material", event.target.value as CableMaterial)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            >
              <option value="copper">Copper</option>
              <option value="aluminum">Aluminum</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">System voltage (V)</span>
            <input
              type="number"
              min="1"
              step="0.1"
              value={formState.voltage}
              onChange={(event) => updateField("voltage", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Load current (A)</span>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={formState.current}
              onChange={(event) => updateField("current", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Cable length, one-way (m)</span>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={formState.length}
              onChange={(event) => updateField("length", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Max voltage drop (%)</span>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={formState.maxVoltageDropPercent}
              onChange={(event) => updateField("maxVoltageDropPercent", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-lime-100/16 bg-lime-100/[0.06] p-4 text-sm leading-7 text-white/78">
          <p className="font-semibold text-lime-50">Assumptions used by this MVP calculator</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Preliminary sizing only, based on ampacity lookup and resistive voltage-drop estimate.</li>
            <li>Length is one-way route length. Single-phase and DC use the round-trip factor automatically.</li>
            <li>Final design still needs checks for installation method, ambient temperature, grouping, insulation, short circuit, and applicable code.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 content-start">
        {"error" in result ? (
          <article className={`${glassPanelClassName} p-6`}>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-amber-200/80">
              Validation
            </p>
            <p className="mt-4 text-base leading-8 text-white/82">{result.error}</p>
          </article>
        ) : (
          <>
            <ResultCard
              label="Recommended size"
              value={`${formatElectricalNumber(result.recommendedSize, 1)} mm^2`}
              detail="This is the first standard conductor size that satisfies both the ampacity check and the voltage-drop target."
            />
            <ResultCard
              label="Governing constraint"
              value={result.governingConstraint === "voltage-drop" ? "Voltage drop" : "Ampacity"}
              detail={
                result.governingConstraint === "voltage-drop"
                  ? "The voltage-drop requirement drives the final cable size."
                  : "The current-carrying requirement drives the final cable size."
              }
            />
            <ResultCard
              label="Voltage drop"
              value={`${formatElectricalNumber(result.actualVoltageDropPercent)}%`}
              detail={`${formatElectricalNumber(result.actualVoltageDropVolts)} V estimated drop at the recommended size.`}
            />
            <ResultCard
              label="Ampacity check"
              value={`${formatElectricalNumber(result.ampacityLimitAmps)} A`}
              detail="Estimated current capacity of the recommended cable size under the baseline table assumptions."
            />
            <ResultCard
              label="Size by ampacity"
              value={`${formatElectricalNumber(result.ampacityRequiredSize, 1)} mm^2`}
              detail="Minimum standard size needed to pass the simplified current-carrying check."
            />
            <ResultCard
              label="Size by voltage drop"
              value={`${formatElectricalNumber(result.requiredVoltageDropSize)} mm^2`}
              detail="Calculated minimum cross-sectional area before rounding up to the nearest standard size."
            />
          </>
        )}
      </section>
    </div>
  );
}
