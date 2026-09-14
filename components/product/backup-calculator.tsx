"use client";
import { CalculationAnalytics } from "@/components/calculation-analytics";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import { commercialCopy } from "@/lib/marketplace/copy";
import {
  calculateAppliances,
  requirementsUrl,
  requiredBatteryKwh,
  type Appliance,
} from "@/lib/marketplace/planning";
export function BackupCalculator({
  dictionary: t,
}: {
  dictionary: Dictionary;
}) {
  const c = commercialCopy(t),
    ro = c.ro,
    tx = (a: string, b: string) => (ro ? a : b);
  const [loads, setLoads] = useState<Appliance[]>([
    {
      id: "router",
      name: "Router Wi-Fi",
      watts: 15,
      quantity: 1,
      hours: 8,
      surge: 1,
      enabled: true,
    },
    {
      id: "fridge",
      name: ro ? "Frigider" : "Refrigerator",
      watts: 150,
      quantity: 1,
      hours: 4,
      surge: 3,
      enabled: true,
    },
    {
      id: "lighting",
      name: ro ? "Iluminat" : "Lighting",
      watts: 80,
      quantity: 1,
      hours: 6,
      surge: 1,
      enabled: true,
    },
    {
      id: "laptop",
      name: "Laptop",
      watts: 90,
      quantity: 1,
      hours: 4,
      surge: 1,
      enabled: false,
    },
    {
      id: "boiler",
      name: ro ? "Comenzi centrală" : "Boiler controls",
      watts: 120,
      quantity: 1,
      hours: 4,
      surge: 1.5,
      enabled: false,
    },
  ]);
  const [hours, setHours] = useState(8),
    [dod, setDod] = useState(80),
    [efficiency, setEfficiency] = useState(92);
  const update = (
    id: string,
    key: keyof Appliance,
    value: string | number | boolean,
  ) =>
    setLoads((ls) => ls.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  let result: ReturnType<typeof calculateAppliances> | null = null,
    error = "";
  try {
    result = calculateAppliances(loads, hours, dod, efficiency);
  } catch (e) {
    error = e instanceof Error ? e.message : "invalid-load";
  }
  const errors: Record<string, string> = {
    "empty-loads": tx(
      "Activează cel puțin un aparat.",
      "Enable at least one appliance.",
    ),
    "invalid-settings": tx(
      "Autonomie: 0,1–168 ore; descărcare utilă: 1–99%; randament: 1–100%.",
      "Backup: 0.1–168 hours; usable discharge: 1–99%; efficiency: 1–100%.",
    ),
    "invalid-load": tx(
      "Verifică aparatele active: nume, 1–100.000 W, cantitate întreagă 1–100, 0,1–168 ore și multiplicator 1–10.",
      "Check enabled appliances: name, 1–100,000 W, whole quantity 1–100, 0.1–168 hours and multiplier 1–10.",
    ),
    "invalid-total": tx(
      "Sarcina totală depășește 100 kW. Solicită un calcul pentru instalația ta.",
      "Total load exceeds 100 kW. Request a site-specific calculation.",
    ),
  };
  const fmt = (n: number) =>
    n.toLocaleString(c.locale, { maximumFractionDigits: 2 });
  const metrics = result
    ? ([
        [
          tx("Sarcină continuă", "Continuous load"),
          result.continuousW,
          "W",
          "continuous",
        ],
        [
          tx("Vârf estimat al consumatorilor", "Estimated load surge"),
          result.peakW,
          "W",
          "peak",
        ],
        [
          tx("Energia consumatorilor", "Load energy"),
          result.energyWh / 1000,
          "kWh",
          "energy",
        ],
        [
          tx(
            "Baterie — energie utilă necesară",
            "Battery — required usable energy",
          ),
          result.usableWh / 1000,
          "kWh",
          "usable",
        ],
        [
          tx("Baterie — energie nominală", "Battery — nominal energy"),
          requiredBatteryKwh(result.nominalWh),
          "kWh",
          "nominal",
        ],
        [
          tx("Invertor — putere continuă", "Inverter — continuous output"),
          result.inverterW,
          "W",
          "inverter",
        ],
        [
          tx("Invertor — putere de vârf", "Inverter — surge output"),
          result.surgeW,
          "W",
          "surge",
        ],
      ] as const)
    : [];
  return (
    <section className="space-y-7">
      <CalculationAnalytics signature={JSON.stringify([loads,hours,dod,efficiency])} valid={Boolean(result)} />
      <div className="grid gap-4">
        {loads.map((load, index) => (
          <fieldset key={load.id} className="info-card" data-testid="appliance">
            <legend className="px-2 font-bold">
              {tx("Aparat", "Appliance")} {index + 1}
            </legend>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3 font-semibold">
                <input
                  type="checkbox"
                  checked={load.enabled}
                  onChange={(e) => update(load.id, "enabled", e.target.checked)}
                  className="h-5 w-5"
                />
                {tx("Inclus în calcul", "Include in calculation")}
              </label>
              {load.id.startsWith("custom-") ? (
                <button
                  type="button"
                  className="text-sm font-bold underline"
                  onClick={() =>
                    setLoads((ls) => ls.filter((x) => x.id !== load.id))
                  }
                >
                  {tx("Elimină", "Remove")}
                </button>
              ) : null}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <label>
                {tx("Denumire", "Name")}
                <input
                  className="form-control"
                  value={load.name}
                  onChange={(e) => update(load.id, "name", e.target.value)}
                />
              </label>
              {(
                [
                  ["watts", tx("Putere (W)", "Power (W)")],
                  ["quantity", tx("Cantitate", "Quantity")],
                  ["hours", tx("Ore de funcționare", "Operating hours")],
                  ["surge", tx("Multiplicator pornire", "Starting multiplier")],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    className="form-control"
                    type="number"
                    step={key === "quantity" ? "1" : "any"}
                    disabled={!load.enabled}
                    value={Number.isNaN(load[key]) ? "" : load[key]}
                    onChange={(e) =>
                      update(
                        load.id,
                        key,
                        e.target.value === "" ? NaN : Number(e.target.value),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <button
        type="button"
        className="button-outline"
        onClick={() =>
          setLoads((ls) => [
            ...ls,
            {
              id: "custom-" + crypto.randomUUID(),
              name: tx("Aparat personalizat", "Custom device"),
              watts: 100,
              quantity: 1,
              hours: Math.max(0.1, hours || 1),
              surge: 1,
              enabled: true,
            },
          ])
        }
      >
        {tx("Adaugă aparat", "Add custom device")}
      </button>
      <section className="brand-glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold">
          {tx("Ipotezele sistemului", "System assumptions")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            [
              tx("Autonomie dorită (ore)", "Backup duration (hours)"),
              hours,
              setHours,
            ],
            [tx("Descărcare utilă (%)", "Usable discharge (%)"), dod, setDod],
            [
              tx("Randament invertor (%)", "Inverter efficiency (%)"),
              efficiency,
              setEfficiency,
            ],
          ].map(([label, value, setter]) => (
            <label key={String(label)}>
              {String(label)}
              <input
                className="form-control"
                type="number"
                step="any"
                value={Number.isNaN(value) ? "" : Number(value)}
                onChange={(e) =>
                  (setter as (n: number) => void)(
                    e.target.value === "" ? NaN : Number(e.target.value),
                  )
                }
              />
            </label>
          ))}
        </div>
      </section>
      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-900">
          {errors[error] ?? errors["invalid-load"]}
        </p>
      ) : null}
      {result ? (
        <section
          aria-label={tx("Rezultate calcul", "Calculation results")}
          data-testid="backup-results"
          className="space-y-5"
        >
          <p role="status" aria-live="polite" className="text-sm font-semibold">
            {tx(
              "Rezultate actualizate automat",
              "Results update automatically",
            )}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map(([label, value, unit, id]) => (
              <article key={id} className="info-card">
                <h3 className="font-semibold">{label}</h3>
                <p
                  data-testid={`backup-${id}`}
                  className="!text-2xl !font-bold !text-teal-950"
                >
                  {fmt(value)} {unit}
                </p>
              </article>
            ))}
          </div>
          <Link
            href={requirementsUrl(
              result.nominalWh,
              result.inverterW,
              result.surgeW,
            )}
            className="button-primary"
          >
            {tx("Găsește echipamente potrivite", "Find Matching Equipment")}
          </Link>
        </section>
      ) : null}
      <section className="info-card">
        <h2>{tx("Cum se calculează", "How this is calculated")}</h2>
        <p>
          {tx(
            "Adunăm puterea × cantitatea × orele fiecărui aparat, limitate la durata de autonomie. Energia utilă a bateriei include pierderile invertorului; energia nominală include și rezerva de descărcare. Puterea invertorului include 25% marjă, iar vârful 10%.",
            "We sum power × quantity × each appliance’s operating hours, capped at the backup duration. Usable battery energy accounts for inverter losses; nominal energy also includes discharge reserve. Inverter continuous output includes 25% margin and surge 10%.",
          )}
        </p>
        <p>
          {tx(
            "Puterea continuă presupune aparatele active simultan; vârful adună pornirile simultane, un scenariu conservator. Pentru frigider, orele se referă la timpul efectiv al compresorului. Folosește măsurători și datele producătorului.",
            "Continuous load assumes enabled appliances run together; surge adds simultaneous starts, a conservative scenario. Refrigerator hours mean actual compressor operating time. Use measurements and manufacturer data.",
          )}
        </p>
      </section>
      <p className="rounded-2xl bg-amber-50 p-5 text-sm leading-7 text-amber-950">
        {c.safety}
      </p>
    </section>
  );
}
