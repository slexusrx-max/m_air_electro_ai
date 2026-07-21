"use client";

import { useState } from "react";

import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";
import {
  calculateVoltageDrop,
  formatElectricalNumber,
  getPositiveNumber,
  standardCableSizes,
  type CableMaterial,
  type SystemType,
} from "@/lib/electrical-calculations";

type FormState = {
  cableSize: string;
  current: string;
  length: string;
  material: CableMaterial;
  maxVoltageDropPercent: string;
  systemType: SystemType;
  voltage: string;
};

type CalculationResult =
  | ReturnType<typeof calculateVoltageDrop>
  | {
      error: string;
    };

const defaultFormState: FormState = {
  cableSize: "16",
  current: "40",
  length: "55",
  material: "copper",
  maxVoltageDropPercent: "3",
  systemType: "three-phase",
  voltage: "400",
};

function resolveVoltageDrop(formState: FormState): CalculationResult {
  const voltage = getPositiveNumber(formState.voltage);
  const current = getPositiveNumber(formState.current);
  const length = getPositiveNumber(formState.length);
  const maxVoltageDropPercent = getPositiveNumber(formState.maxVoltageDropPercent);
  const cableSize = getPositiveNumber(formState.cableSize);

  if (!voltage || !current || !length || !maxVoltageDropPercent || !cableSize) {
    return {
      error: "Enter valid positive numbers for voltage, current, cable size, cable length, and max voltage drop.",
    };
  }

  return calculateVoltageDrop({
    cableSize,
    current,
    length,
    material: formState.material,
    maxVoltageDropPercent,
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

export default function VoltageDropCalculator() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const result = resolveVoltageDrop(formState);

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
            <span className="mb-2 block text-sm font-medium text-white/84">Cable size (mm^2)</span>
            <select
              value={formState.cableSize}
              onChange={(event) => updateField("cableSize", event.target.value)}
              className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
            >
              {standardCableSizes.map((size) => (
                <option key={size} value={String(size)}>
                  {size} mm^2
                </option>
              ))}
            </select>
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

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-white/84">Target maximum voltage drop (%)</span>
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
          <p className="font-semibold text-lime-50">How to use this calculator</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Enter one-way route length. AC and DC return-path factors are handled automatically.</li>
            <li>This is a simplified resistive estimate intended for fast engineering checks and concept validation.</li>
            <li>Final design still needs code-specific checks for installation method, temperature correction, harmonics, grouping, and fault duty.</li>
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
              label="Voltage drop status"
              value={result.status === "within-limit" ? "Within limit" : "Over limit"}
              detail={
                result.status === "within-limit"
                  ? "The selected cable size stays within the configured voltage-drop target."
                  : "The selected cable size exceeds the configured voltage-drop target."
              }
            />
            <ResultCard
              label="Voltage drop"
              value={`${formatElectricalNumber(result.actualVoltageDropPercent)}%`}
              detail={`${formatElectricalNumber(result.actualVoltageDropVolts)} V estimated drop over the selected route.`}
            />
            <ResultCard
              label="Allowed drop"
              value={`${formatElectricalNumber(result.allowedVoltageDropVolts)} V`}
              detail="Maximum drop allowed by your target percentage."
            />
            <ResultCard
              label="Remaining voltage"
              value={`${formatElectricalNumber(result.remainingVoltage)} V`}
              detail="Estimated voltage available at the load after the cable drop."
            />
            <ResultCard
              label="Cable ampacity"
              value={result.cableAmpacity ? `${formatElectricalNumber(result.cableAmpacity)} A` : "N/A"}
              detail="Reference ampacity from the simplified baseline table for the selected cable size."
            />
          </>
        )}
      </section>
    </div>
  );
}
