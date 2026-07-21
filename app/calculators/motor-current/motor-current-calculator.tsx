"use client";

import { useState } from "react";

import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import {
  calculateMotorCurrent,
  formatElectricalNumber,
  getPositiveNumber,
  type MotorSystemType,
} from "@/lib/electrical-calculations";

type FormState = {
  efficiencyPercent: string;
  powerFactor: string;
  powerKw: string;
  startCurrentMultiplier: string;
  systemType: MotorSystemType;
  voltage: string;
};

type CalculationResult =
  | ReturnType<typeof calculateMotorCurrent>
  | {
      error: string;
    };

const defaultFormState: FormState = {
  systemType: "three-phase",
  voltage: "400",
  powerKw: "15",
  powerFactor: "0.86",
  efficiencyPercent: "92",
  startCurrentMultiplier: "6",
};

function resolveMotorCurrent(formState: FormState): CalculationResult {
  const voltage = getPositiveNumber(formState.voltage);
  const powerKw = getPositiveNumber(formState.powerKw);
  const powerFactor = getPositiveNumber(formState.powerFactor);
  const efficiencyPercent = getPositiveNumber(formState.efficiencyPercent);
  const startCurrentMultiplier = getPositiveNumber(formState.startCurrentMultiplier);

  if (!voltage || !powerKw || !powerFactor || !efficiencyPercent || !startCurrentMultiplier) {
    return {
      error: "Enter valid positive numbers for voltage, motor power, power factor, efficiency, and start multiplier.",
    };
  }

  if (powerFactor > 1) {
    return {
      error: "Power factor must stay between 0 and 1.",
    };
  }

  if (efficiencyPercent > 100) {
    return {
      error: "Efficiency must stay between 0 and 100 percent.",
    };
  }

  return calculateMotorCurrent({
    efficiencyPercent,
    powerFactor,
    powerKw,
    startCurrentMultiplier,
    systemType: formState.systemType,
    voltage,
  });
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

export default function MotorCurrentCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const result = resolveMotorCurrent(formState);

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
            <span className="mb-2 block text-sm font-medium text-white/84">Motor system type</span>
            <select
              value={formState.systemType}
              onChange={(event) => updateField("systemType", event.target.value as MotorSystemType)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            >
              <option value="three-phase">Three-phase AC motor</option>
              <option value="single-phase">Single-phase AC motor</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Rated voltage (V)</span>
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
            <span className="mb-2 block text-sm font-medium text-white/84">Motor output power (kW)</span>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={formState.powerKw}
              onChange={(event) => updateField("powerKw", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Power factor</span>
            <input
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              value={formState.powerFactor}
              onChange={(event) => updateField("powerFactor", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Efficiency (%)</span>
            <input
              type="number"
              min="1"
              max="100"
              step="0.1"
              value={formState.efficiencyPercent}
              onChange={(event) => updateField("efficiencyPercent", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/84">Starting current multiplier</span>
            <input
              type="number"
              min="1"
              step="0.1"
              value={formState.startCurrentMultiplier}
              onChange={(event) => updateField("startCurrentMultiplier", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            />
          </label>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-lime-100/16 bg-lime-100/[0.06] p-4 text-sm leading-7 text-white/78">
          <p className="font-semibold text-lime-50">Assumptions used by this MVP calculator</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Motor power is treated as shaft output power, then converted to estimated electrical input using efficiency.</li>
            <li>Power factor and efficiency are assumed constant at rated load.</li>
            <li>Starting current multiplier is a planning estimate only. Soft starters and VFD systems can be much lower than direct-on-line starting.</li>
            <li>Final cable, breaker, overload, and starter decisions should still be checked against the motor nameplate and applicable code.</li>
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
              label="Full-load current"
              value={`${formatElectricalNumber(result.fullLoadCurrent)} A`}
              detail="Estimated running current at rated output power, rated voltage, configured power factor, and efficiency."
            />
            <ResultCard
              label="Starting current"
              value={`${formatElectricalNumber(result.startCurrent)} A`}
              detail="Estimated inrush current based on the configured starting-current multiplier."
            />
            <ResultCard
              label="Electrical input"
              value={`${formatElectricalNumber(result.inputPowerKw)} kW`}
              detail="Approximate electrical input power required to deliver the configured motor output."
            />
            <ResultCard
              label="Apparent power"
              value={`${formatElectricalNumber(result.apparentPowerKva)} kVA`}
              detail="Estimated apparent power demand using the configured power factor."
            />
          </>
        )}
      </section>
    </div>
  );
}
