"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { ProductCard } from "./product-card";
import { catalog } from "@/lib/affiliate/catalog";
import { estimateSystem } from "@/lib/marketplace/recommendation";
import {
  loadHomeEnergyProfile,
  calculateHomeEnergy,
} from "@/lib/home-energy/profile";
import type { Dictionary } from "@/lib/i18n/types";
const applications = [
  ["apartment-backup", "Apartment", "Apartament"],
  ["home-backup", "House", "Casă"],
  ["rv-caravan", "RV / caravan", "Rulotă"],
  ["marine", "Marine", "Ambarcațiune"],
  ["off-grid-cabin", "Cabin", "Cabană"],
  ["workshop", "Workshop", "Atelier"],
  ["business-backup", "Business", "Afacere"],
];
export function SolutionFinder({
  dictionary: t,
  initial = {},
}: {
  dictionary: Dictionary;
  initial?: Record<string, string | undefined>;
}) {
  const ro = t["locale.code"] === "ro";
  const l = (en: string, translated: string) => (ro ? translated : en);
  const resultRef = useRef<HTMLElement>(null);
  const [revision, setRevision] = useState(0);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    application: applications.some((a) => a[0] === initial.application)
      ? initial.application!
      : "apartment-backup",
    load: initial.load ?? "250",
    peak: initial.load ? String(Number(initial.load) * 1.5) : "500",
    hours: initial.hours ?? "4",
    region: "EU",
    budget: "",
    battery: "no",
    solar: "no",
    generator: "no",
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setReady(false);
    setError("");
  }
  const result = estimateSystem(
    Number(form.load),
    Number(form.peak),
    Number(form.hours),
  );
  const paths =
    form.application === "marine"
      ? ["marine", "batteries", "chargers"]
      : form.application === "rv-caravan"
        ? ["batteries", "inverters", "chargers/dc-dc", "solar/kits"]
        : form.application === "workshop"
          ? ["industrial", "inverters", "electrical-components"]
          : [
              "backup-power",
              "batteries",
              "inverters",
              ...(form.solar === "yes" || form.application === "off-grid-cabin"
                ? ["solar"]
                : []),
            ];
  const matches = catalog
    .filter(
      (p) =>
        form.region === "EU" &&
        p.paths.some((path) => paths.includes(path)) &&
        (p.kind === "equipment-class" ||
          ((!p.facets.capacityWh ||
            Number(p.facets.capacityWh) >= (result?.batteryWh ?? Infinity)) &&
            (!p.facets.power ||
              p.category !== "inverters" ||
              Number(p.facets.power) >= (result?.inverterW ?? Infinity)))),
    )
    .slice(0, 6);
  function next() {
    if (step === 2 && !result) {
      setError(
        l(
          "Enter a positive load and duration (up to 168 h), with peak at least equal to running load.",
          "Introdu consum și durată pozitive (maximum 168 h), cu vârf cel puțin egal consumului.",
        ),
      );
      return;
    }
    setStep((s) => s + 1);
  }
  function calculate() {
    if (!result) {
      setError(
        l(
          "Correct the load and duration in step 2.",
          "Corectează consumul și durata la pasul 2.",
        ),
      );
      return;
    }
    setReady(true);
    setRevision((n) => n + 1);
    setTimeout(() => resultRef.current?.focus(), 0);
  }
  function importProfile() {
    const profile = loadHomeEnergyProfile();
    const calculation = calculateHomeEnergy(profile);
    setForm((f) => ({
      ...f,
      load: String(calculation.continuousLoad),
      peak: String(calculation.peakLoad),
      hours: String(profile.desiredBackupHours),
      region: profile.location.region === "RO" ? "EU" : profile.location.region,
      battery: profile.existingBattery ? "yes" : "no",
      solar: profile.existingSolar ? "yes" : "no",
      generator: profile.existingGenerator ? "yes" : "no",
    }));
    setReady(false);
  }
  return (
    <main className="commerce-page">
      <section className="content-panel">
        <p className="eyebrow">
          {l("Find My Solution", "Găsește soluția")} · {l("Step", "Pasul")}{" "}
          {step}/3
        </p>
        <h1 className="finder-title">
          {l(
            "Build your system requirements.",
            "Definește cerințele sistemului.",
          )}
        </h1>
        <p>
          {l(
            "A deterministic starting estimate. Equipment classes guide procurement; compatibility requires the exact model and installation checks.",
            "Estimare deterministă inițială. Clasele ghidează achiziția; compatibilitatea cere verificarea modelului și instalației.",
          )}
        </p>
        {step === 1 && (
          <div className="compare-selectors">
            <label>
              {l("Application", "Aplicație")}
              <select
                value={form.application}
                onChange={(e) => update("application", e.target.value)}
              >
                {applications.map(([value, en, translated]) => (
                  <option key={value} value={value}>
                    {l(en, translated)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {l("Region", "Regiune")}
              <select
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
              >
                <option value="EU">România / EU</option>
                <option value="UK">UK</option>
                <option value="US">US</option>
              </select>
            </label>
            <button onClick={importProfile} className="button-outline">
              {l(
                "Use my saved home profile",
                "Folosește profilul casei salvat",
              )}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="compare-selectors">
            {(
              [
                ["load", "Running load (W)", "Consum simultan (W)"],
                ["peak", "Starting peak (W)", "Vârf de pornire (W)"],
                ["hours", "Backup hours", "Ore de rezervă"],
                [
                  "budget",
                  "Planning budget (EUR, optional)",
                  "Buget orientativ (EUR, opțional)",
                ],
              ] as const
            ).map(([key, en, translated]) => (
              <label key={key}>
                {l(en, translated)}
                <input
                  type="number"
                  min={key === "budget" ? 0 : 0.1}
                  step="any"
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                />
              </label>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="compare-selectors">
            {(["battery", "solar", "generator"] as const).map((key) => (
              <label key={key}>
                {l("Existing ", "Există ")}
                {key === "battery"
                  ? l("battery", "baterie")
                  : key === "solar"
                    ? l("solar", "solar")
                    : l("generator", "generator")}
                <select
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                >
                  <option value="no">{l("No", "Nu")}</option>
                  <option value="yes">{l("Yes", "Da")}</option>
                  <option value="unknown">{l("Not sure", "Nu știu")}</option>
                </select>
              </label>
            ))}
          </div>
        )}
        {error && (
          <p role="alert" className="safety-note">
            {error}
          </p>
        )}
        <div className="action-row">
          {step > 1 && (
            <button
              className="button-outline"
              onClick={() => setStep((s) => s - 1)}
            >
              {l("Back", "Înapoi")}
            </button>
          )}
          {step < 3 ? (
            <button className="button-primary" onClick={next}>
              {l("Continue", "Continuă")}
            </button>
          ) : (
            <button className="button-primary" onClick={calculate}>
              {l("Calculate system", "Calculează sistemul")}
            </button>
          )}
        </div>
      </section>
      {ready && result && (
        <section
          ref={resultRef}
          tabIndex={-1}
          className="finder-results"
          aria-live="polite"
        >
          <p role="status">
            {l("Calculation revision", "Revizia calculului")} {revision}
          </p>
          <h2>
            {l(
              "Recommended system envelope",
              "Cerințe orientative pentru sistem",
            )}
          </h2>
          <div className="discovery-grid">
            {[
              [
                l("Nominal battery", "Baterie nominală"),
                `${result.batteryWh} Wh`,
              ],
              [
                l("Continuous inverter", "Invertor continuu"),
                `${result.inverterW} W`,
              ],
              [
                l("Starting requirement", "Necesar la pornire"),
                `${result.surgeW} W`,
              ],
            ].map(([title, value]) => (
              <div className="content-panel" key={title}>
                <p>{title}</p>
                <h3>{value}</h3>
              </div>
            ))}
          </div>
          <p className="content-panel">
            {l(
              "Assumptions: 80% usable battery depth, 92% inverter efficiency, 25% continuous-power margin and 10% starting margin. Surge duration is not inferred. Existing equipment is not subtracted because its ratings and condition are unknown.",
              "Ipoteze: 80% utilizare baterie, 92% randament invertor, rezervă de putere continuă 25% și pornire 10%. Durata vârfului nu este dedusă. Echipamentul existent nu se scade deoarece valorile și starea nu sunt cunoscute.",
            )}{" "}
            {form.budget &&
              l(
                `Budget recorded: €${form.budget}. No price filtering is applied because supplier prices are not verified.`,
                `Buget notat: €${form.budget}. Nu filtrăm după preț deoarece prețurile furnizorului nu sunt verificate.`,
              )}
          </p>
          {form.battery === "yes" && (
            <p className="safety-note">
              {l(
                "Existing battery: confirm usable capacity, BMS limits and permission to expand before adding storage.",
                "Baterie existentă: confirmă energia utilă, limitele BMS și permisiunea extinderii înainte de adăugare.",
              )}
            </p>
          )}
          {form.generator === "yes" && (
            <p className="safety-note">
              {l(
                "Existing generator: verify charger input compatibility, outdoor siting and safe transfer.",
                "Generator existent: verifică intrarea încărcătorului, amplasarea în exterior și transferul sigur.",
              )}
            </p>
          )}
          {(form.solar === "yes" ||
            form.application === "rv-caravan" ||
            form.application === "off-grid-cabin") && (
            <p className="content-panel">
              {l(
                "Size solar from daily energy and the design month, not from battery capacity alone.",
                "Dimensionează solarul după energia zilnică și luna de proiect, nu doar capacitatea bateriei.",
              )}{" "}
              <Link href="/calculators/solar">
                {l("Solar calculator", "Calculator solar")} →
              </Link>
            </p>
          )}
          <h2>
            {l(
              "Equipment classes to review",
              "Clase de echipamente de verificat",
            )}
          </h2>
          <div className="action-row">
            {paths.map((path) => (
              <Link
                className="button-outline"
                key={path}
                href={`/marketplace/${path}`}
              >
                {path.replaceAll("-", " ")} →
              </Link>
            ))}
          </div>
          <h2>
            {l(
              "Catalog candidates — verify the complete system",
              "Opțiuni din catalog — verifică sistemul complet",
            )}
          </h2>
          <p>
            {l(
              "Known insufficient standalone energy or inverter ratings are excluded. Unknown ratings and equipment classes require manual checking; these are not certified matches.",
              "Valorile cunoscute insuficiente pentru energia individuală sau invertor sunt excluse. Câmpurile necunoscute și clasele cer verificare manuală; nu sunt potriviri certificate.",
            )}
          </p>
          {matches.length ? (
            <div className="product-grid">
              {matches.map((p) => (
                <ProductCard key={p.id} product={p} dictionary={t} />
              ))}
            </div>
          ) : (
            <p className="content-panel">
              {l(
                "No supplier catalog for this region. Continue with the category requirements and a local installer.",
                "Nu există catalog de furnizor pentru această regiune. Continuă cu cerințele categoriei și un instalator local.",
              )}
            </p>
          )}
          <div className="action-row">
            <Link
              className="button-primary"
              href={`/compare?ids=${encodeURIComponent(
                matches
                  .slice(0, 2)
                  .map((p) => p.id)
                  .join(","),
              )}`}
            >
              {l("Compare candidates", "Compară opțiunile")}
            </Link>
            <Link href={`/solutions/${form.application}`}>
              {l("Read the solution guide", "Citește soluția")} →
            </Link>
            <Link href="/calculators/battery">
              {l("Detailed battery calculation", "Calcul detaliat baterie")} →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
