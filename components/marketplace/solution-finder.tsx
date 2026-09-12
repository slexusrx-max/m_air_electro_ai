"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import { commercialCopy } from "@/lib/marketplace/copy";
import {
  calculatePlan,
  requirementsUrl,
  requiredBatteryKwh,
} from "@/lib/marketplace/planning";
import { catalog, marketplaceCategories } from "@/lib/affiliate/catalog";
import { ProductCard } from "./product-card";
const defaults = {
  application: "home",
  region: "RO",
  installation: "fixed",
  load: "1200",
  peak: "1800",
  hours: "4",
  budget: "",
  solar: "no",
  battery: "no",
  generator: "no",
};
export function SolutionFinder({ dictionary: t }: { dictionary: Dictionary }) {
  const c = commercialCopy(t),
    ro = c.ro;
  const [form, setForm] = useState(defaults),
    [step, setStep] = useState(1),
    [error, setError] = useState(""),
    [result, setResult] = useState<ReturnType<typeof calculatePlan> | null>(
      null,
    ),
    [count, setCount] = useState(0);
  const resultRef = useRef<HTMLElement>(null);
  const text = (a: string, b: string) => (ro ? a : b);
  const number = (v: number) =>
    v.toLocaleString(c.locale, { maximumFractionDigits: 2 });
  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setResult(null);
    setError("");
  }
  function validate() {
    const load = Number(form.load),
      peak = Number(form.peak),
      hours = Number(form.hours);
    if (
      !form.load.trim() ||
      !form.peak.trim() ||
      !form.hours.trim() ||
      !Number.isFinite(load) ||
      load < 1 ||
      load > 100000 ||
      !Number.isFinite(peak) ||
      peak < load ||
      peak > 1000000 ||
      !Number.isFinite(hours) ||
      hours < 0.1 ||
      hours > 168
    ) {
      setError(
        text(
          "Introdu o sarcină între 1 și 100.000 W, un vârf cel puțin egal cu sarcina (maximum 1.000.000 W) și o durată între 0,1 și 168 ore.",
          "Enter a load from 1 to 100,000 W, a peak at least equal to the load (up to 1,000,000 W), and 0.1 to 168 hours.",
        ),
      );
      return false;
    }
    if (
      form.budget !== "" &&
      (!Number.isFinite(Number(form.budget)) || Number(form.budget) <= 0)
    ) {
      setError(
        text(
          "Bugetul opțional trebuie să fie un număr pozitiv, în EUR.",
          "Optional budget must be a positive number in EUR.",
        ),
      );
      return false;
    }
    return true;
  }
  function calculate() {
    if (!validate()) {
      setStep(2);
      return;
    }
    const solar =
      form.solar === "yes" || ["rv", "cabin"].includes(form.application);
    setResult(
      calculatePlan({
        load: Number(form.load),
        peak: Number(form.peak),
        hours: Number(form.hours),
        solar,
        application: form.application,
      }),
    );
    setCount((n) => n + 1);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRef.current?.focus({ preventScroll: true });
    });
  }
  const applications = [
    ["home", text("Locuință", "Home")],
    ["rv", text("Rulotă", "RV / Caravan")],
    ["boat", text("Ambarcațiune", "Boat")],
    ["cabin", text("Cabană fără rețea", "Off-grid cabin")],
    ["industrial", text("Industrial", "Industrial")],
    ["other", text("Altă aplicație", "Other")],
  ];
  return (
    <main className="mx-auto max-w-5xl space-y-7">
      <section className="brand-glass-card rounded-3xl p-6 sm:p-9">
        <p className="eyebrow">
          {text("Configurare în 3 pași", "Plan in 3 steps")}
        </p>
        <h1 className="mt-3 text-4xl font-bold">{c.finder}</h1>
        <p className="mt-4 leading-7">
          {text(
            "Obține o estimare explicată a bateriei, invertorului și componentelor solare. Nu ai nevoie de cont, adresă sau date de plată.",
            "Get an explained estimate for battery, inverter and solar components. No account, address or payment details needed.",
          )}
        </p>
        <p className="mt-5 font-bold" aria-live="polite">
          {text("Pasul", "Step")} {step} / 3
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 3) calculate();
            else if (step === 1 || validate()) setStep((s) => s + 1);
          }}
          noValidate
        >
          {step === 1 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label>
                {text("Aplicație", "Application")}
                <select
                  className="form-control"
                  value={form.application}
                  onChange={(e) => update("application", e.target.value)}
                >
                  {applications.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {text("Regiune", "Region")}
                <select
                  className="form-control"
                  value={form.region}
                  onChange={(e) => update("region", e.target.value)}
                >
                  <option value="RO">România</option>
                  <option value="EU">
                    {text("Uniunea Europeană", "European Union")}
                  </option>
                </select>
              </label>
              <label>
                {text("Tipul instalației", "Installation type")}
                <select
                  className="form-control"
                  value={form.installation}
                  onChange={(e) => update("installation", e.target.value)}
                >
                  <option value="fixed">{text("Fixă", "Fixed")}</option>
                  <option value="mobile">{text("Mobilă", "Mobile")}</option>
                  <option value="unknown">
                    {text("Nu știu încă", "Not sure yet")}
                  </option>
                </select>
              </label>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {(
                [
                  ["load", text("Sarcină continuă (W)", "Continuous load (W)")],
                  ["peak", text("Putere de vârf (W)", "Peak / surge (W)")],
                  [
                    "hours",
                    text("Autonomie dorită (ore)", "Backup duration (hours)"),
                  ],
                  [
                    "budget",
                    text("Buget opțional (EUR)", "Optional budget (EUR)"),
                  ],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? "finder-error" : undefined}
                  />
                </label>
              ))}
            </div>
          ) : null}
          {step === 3 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {(
                [
                  ["solar", text("Ai panouri solare?", "Existing solar?")],
                  ["battery", text("Ai deja o baterie?", "Existing battery?")],
                  [
                    "generator",
                    text("Ai un generator?", "Existing generator?"),
                  ],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <select
                    className="form-control"
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                  >
                    <option value="no">{text("Nu", "No")}</option>
                    <option value="yes">{text("Da", "Yes")}</option>
                    <option value="unknown">
                      {text("Nu sunt sigur", "Not sure")}
                    </option>
                  </select>
                </label>
              ))}
            </div>
          ) : null}
          {error ? (
            <p
              id="finder-error"
              role="alert"
              className="mt-5 rounded-xl bg-red-50 p-4 text-red-900"
            >
              {error}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            {step > 1 ? (
              <button
                type="button"
                className="button-outline"
                onClick={() => {
                  setStep((s) => s - 1);
                  setResult(null);
                }}
              >
                {text("Înapoi", "Back")}
              </button>
            ) : null}
            <button type="submit" className="button-primary">
              {step === 3
                ? text("Calculează soluția", "Calculate solution")
                : text("Continuă", "Continue")}
            </button>
          </div>
        </form>
      </section>
      <p role="status" aria-live="polite" className="sr-only">
        {result
          ? text(
              `Calcul finalizat, revizia ${count}. Rezultatele sunt disponibile.`,
              `Calculation completed, revision ${count}. Results are available.`,
            )
          : ""}
      </p>
      {result ? (
        <section
          ref={resultRef}
          tabIndex={-1}
          data-testid="finder-results"
          className="scroll-mt-6 space-y-6"
        >
          <h2 className="text-3xl font-bold">
            {text(
              "Calcul finalizat — punctul tău de pornire",
              "Calculation complete — your starting point",
            )}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [
                text("Baterie nominală", "Nominal battery"),
                `${number(requiredBatteryKwh(result.nominalWh))} kWh`,
                "battery",
              ],
              [
                text(
                  "Invertor — putere continuă",
                  "Inverter — continuous output",
                ),
                `${number(result.continuousW)} W`,
                "inverter",
              ],
              [
                text("Invertor — putere de vârf", "Inverter — surge output"),
                `${number(result.surgeW)} W`,
                "surge",
              ],
              [
                text("Panouri solare — reper", "Solar array — reference"),
                result.solarW
                  ? `${number(result.solarW)} W`
                  : text(
                      "Nu sunt necesare pentru estimarea autonomiei",
                      "Not needed for this backup estimate",
                    ),
                "solar",
              ],
            ].map(([label, value, id]) => (
              <article className="info-card" key={id}>
                <h3 className="font-semibold">{label}</h3>
                <p
                  data-testid={`result-${id}`}
                  className="!text-2xl !font-bold !text-teal-950"
                >
                  {value}
                </p>
              </article>
            ))}
          </div>
          <div className="info-card">
            <h3 className="font-bold">
              {text(
                "De ce sunt sugerate aceste valori",
                "Why these values are suggested",
              )}
            </h3>
            <p>
              {text(
                "Bateria: sarcină × ore ÷ 0,80 ÷ 0,92. Folosim 80% descărcare utilă și 92% randament al invertorului. Puterea continuă include 25% rezervă; vârful are 10% marjă.",
                "Battery: load × hours ÷ 0.80 ÷ 0.92. We assume 80% usable discharge and 92% inverter efficiency. Continuous output includes 25% reserve; surge includes 10% margin.",
              )}
            </p>
            {result.solarW ? (
              <p>
                {text(
                  "Panourile: energia zilnică ÷ 0,92 ÷ 3,5 ore solare echivalente ÷ 0,80 pierderi de sistem. Este un scenariu de planificare, nu o prognoză pentru România; iarna poate necesita mult mai multă putere sau încărcare alternativă.",
                  "Solar: daily energy ÷ 0.92 ÷ 3.5 equivalent sun hours ÷ 0.80 system derating. This is a planning scenario, not a Romania yield forecast; winter can need far more array power or alternative charging.",
                )}
              </p>
            ) : null}
            <p>
              {form.installation === "mobile"
                ? text(
                    "Pentru montaj mobil, verifică fixarea, vibrațiile și încărcarea de la vehicul.",
                    "For mobile installation, check mounting, vibration and vehicle charging.",
                  )
                : text(
                    "Pentru instalații fixe, verifică separarea de rețea, comutarea și legarea la pământ cu un electrician.",
                    "For fixed installations, have an electrician check grid isolation, transfer switching and earthing.",
                  )}
            </p>
            {form.battery !== "no" ? (
              <p>
                {text(
                  "Nu scădem bateria existentă fără capacitatea și starea ei confirmate. Rezultatul reprezintă necesarul total.",
                  "We do not subtract an existing battery without confirmed capacity and condition. The result is the total requirement.",
                )}
              </p>
            ) : null}
            {form.generator !== "no" ? (
              <p>
                {text(
                  "Generatorul poate reîncărca printr-un echipament compatibil; nu reduce automat bateria calculată.",
                  "A generator may recharge through compatible equipment; it does not automatically reduce the calculated battery size.",
                )}
              </p>
            ) : null}
            {form.budget ? (
              <p>
                {text("Buget de discuție", "Planning budget")}:{" "}
                {Number(form.budget).toLocaleString(c.locale)} EUR.{" "}
                {text(
                  "Nu promitem încadrarea în buget: compară costul complet la furnizor.",
                  "No budget-fit promise: compare the complete system cost at the supplier.",
                )}
              </p>
            ) : null}
          </div>
          <p className="rounded-xl bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            {c.safety}
          </p>
          <Link
            href={requirementsUrl(
              result.nominalWh,
              result.continuousW,
              result.surgeW,
              form.region,
            )}
            className="button-primary"
          >
            {text(
              "Găsește echipamente pentru acest necesar",
              "Find equipment for these requirements",
            )}
          </Link>
          <section>
            <h2 className="text-2xl font-bold">{c.categories}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {result.categories.map((slug) => {
                const cat = marketplaceCategories.find((x) => x.slug === slug)!;
                return (
                  <Link
                    className="button-outline"
                    key={slug}
                    href={`/marketplace/category/${slug}`}
                  >
                    {ro ? cat.name : cat.nameEn}
                  </Link>
                );
              })}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold">
              {text("Exemple pentru comparație", "Examples to compare")}
            </h2>
            <p className="mt-3 leading-7">
              {text(
                "Aceste exemple ilustrează componentele. Nu toate ating necesarul calculat; verifică energia întregului banc, tensiunea și limitele fiecărui model.",
                "These examples illustrate components. Not all meet your calculated demand; check total bank energy, voltage and each model’s limits.",
              )}
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {catalog
                .filter((p) => result.categories.includes(p.category))
                .slice(0, 3)
                .map((p) => (
                  <ProductCard key={p.id} product={p} dictionary={t} />
                ))}
            </div>
          </section>
        </section>
      ) : null}
    </main>
  );
}
