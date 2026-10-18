"use client";
import Link from "@/components/localized-link";
import { trackEvent } from "@/lib/analytics";
import { useState, useRef, useEffect } from "react";
import { ProductCard } from "./product-card";
import { catalog } from "@/lib/affiliate/catalog";
import { estimateSystem } from "@/lib/marketplace/recommendation";
import { starterScenarios, stationCandidates } from "@/lib/marketplace/selection-guidance";
import { SelectionHelp } from "./selection-help";
import { categoryByPath, local } from "@/lib/marketplace/content";
import {
  loadHomeEnergyProfile,
  calculateHomeEnergy,
  homeEnergyStorageKey,
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
  const started = useRef(false);
  function start() {
    if (!started.current) { trackEvent("finder_start"); started.current = true; }
  }
  const [revision, setRevision] = useState(0);
  const [step, setStep] = useState(["1", "2", "3"].includes(initial.step ?? "") ? Number(initial.step) : 1);
  const [form, setForm] = useState({
    application: applications.some((a) => a[0] === initial.application)
      ? initial.application!
      : "apartment-backup",
    load: initial.load ?? "250",
    peak: initial.peak ?? (initial.load ? String(Number(initial.load) * 1.5) : "500"),
    hours: initial.hours ?? "4",
    region: ["EU", "UK", "US"].includes(initial.region ?? "") ? initial.region! : "EU",
    budget: initial.budget ?? "",
    battery: initial.battery === "yes" ? "yes" : "no",
    solar: initial.solar === "yes" ? "yes" : "no",
    generator: initial.generator === "yes" ? "yes" : "no",
  });
  // Keep non-sensitive planning inputs in the URL so a language reload preserves the draft.
  useEffect(() => {
    const params = new URLSearchParams({ ...form, step: String(step) });
    window.history.replaceState(null, "", `${window.location.pathname}?${params}${window.location.hash}`);
  }, [form, step]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  function update(key: keyof typeof form, value: string) {
    start();
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
  const matches = result ? stationCandidates(catalog, form.region, result) : [];
  function next() {
    start();
    if (step === 2 && form.budget && (!Number.isFinite(Number(form.budget)) || Number(form.budget) < 0)) {
      setError(l("Budget must be a finite, non-negative amount.", "Bugetul trebuie să fie o valoare finită, fără semn negativ."));
      return;
    }
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
    trackEvent("calculator_complete");
    trackEvent("finder_result");
    setReady(true);
    setRevision((n) => n + 1);
    setTimeout(() => {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }, 0);
  }
  function importProfile() {
    start();
    try {
      const raw = localStorage.getItem(homeEnergyStorageKey);
      const saved = raw ? JSON.parse(raw) : null;
      if (!saved || !Array.isArray(saved.appliances) || !Number.isFinite(saved.desiredBackupHours)) throw Error();
      if (!saved.appliances.every((a: { watts?: number; quantity?: number; hours?: number; surgeMultiplier?: number }) => a && [a.watts,a.quantity,a.hours,a.surgeMultiplier].every(Number.isFinite))) throw Error();
    } catch {
      setError(l("No valid saved energy profile was found in this browser. Enter your requirements below.", "Nu există un profil energetic salvat valid în acest browser. Introdu cerințele mai jos."));
      return;
    }
    setError("");
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
        {step === 1 && <section className="starter-scenarios" aria-label={l("Calculated examples", "Exemple calculate")}>
          <h2>{l("Start with an everyday task", "Începe cu o nevoie de zi cu zi")}</h2>
          <p>{l("Editorial examples, not customer cases or factory kits. All listed loads run together for the stated time through 230 V AC outlets/adapters. Edit the assumed loads and startup peak for your devices.", "Exemple editoriale, nu cazuri de clienți sau kituri de fabrică. Toți consumatorii funcționează simultan pe durata indicată, prin prize/adaptoare de 230 V AC. Modifică puterile și vârful de pornire presupuse pentru aparatele tale.")}</p>
          <div className="discovery-grid">{starterScenarios.map(s => <article className="content-panel" key={s.id}>
            <h3>{s.title[ro ? "ro" : "en"]}</h3>
            <p>{s.loads[ro ? "ro" : "en"]} = {s.load} W × {s.hours} h.</p>
            <p>{l("Assumed startup", "Pornire presupusă")}: {s.peak} W. {s.limit[ro ? "ro" : "en"]}</p>
            <button className="button-outline" data-scenario={s.id} onClick={() => {
              start(); setForm(f => ({ ...f, application: s.application, load: String(s.load), peak: String(s.peak), hours: String(s.hours), region: "EU" })); setReady(false); setError(""); setStep(2);
            }}>{l("Use this example", "Folosește acest exemplu")}</button>
          </article>)}</div>
        </section>}
        <SelectionHelp ro={ro} />
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
          <p>{l("Your inputs", "Datele tale")}: {form.load} W × {form.hours} h = {result.loadWh} Wh; {l("startup peak", "vârf la pornire")}: {form.peak} W. {l("AC load estimate; actual runtime depends on temperature, ageing and device consumption.", "Estimare pentru consumatori AC; autonomia reală depinde de temperatură, uzură și consumul aparatelor.")}</p>
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
          <h2>{l("Portable stations to check for these AC loads", "Stații portabile de verificat pentru acești consumatori AC")}</h2>
          <p>{l("These complete stations meet the estimated energy and power thresholds in the documented data. Ordered by nominal energy, then power; commission does not affect selection. An undocumented surge rating is not assumed: continuous output must cover the starting requirement. This does not confirm UPS operation, connector compatibility, delivery to Romania or suitability for fixed wiring.", "Aceste stații complete ating pragurile estimate de energie și putere în datele documentate. Ordine după energia nominală, apoi putere; comisionul nu influențează selecția. Nu presupunem un vârf nedocumentat: puterea continuă trebuie să acopere necesarul de pornire. Nu confirmă funcționarea UPS, conectorii, livrarea în România sau utilizarea în instalația fixă.")}</p>
          <p><Link href="/methodology">{l("How the estimate and selection work", "Cum funcționează calculul și selecția")}</Link> · {l("Prices and availability: check the seller. Confirm 230 V AC output and your delivery postcode before buying.", "Prețuri și disponibilitate: verifică la vânzător. Confirmă ieșirea de 230 V AC și codul poștal de livrare înainte de cumpărare.")}</p>
          {matches.length ? (
            <div className="product-grid">
              {matches.map((p) => (
                <ProductCard key={p.id} product={p} dictionary={t} />
              ))}
            </div>
          ) : (
            <p className="content-panel">
              {l(
                "No documented station in this region meets all these thresholds. Reduce loads only if appropriate, or review a separately designed system; no compatible kit is inferred.",
                "Nicio stație documentată din această regiune nu atinge toate pragurile. Redu consumatorii doar dacă este potrivit sau verifică un sistem proiectat separat; nu presupunem un kit compatibil.",
              )}
            </p>
          )}
          <details className="content-panel component-guidance">
            <summary>{l("Building a system from separate components?", "Construiești un sistem din componente separate?")}</summary>
            <p>{l("Batteries, panels, inverters and chargers are not alternatives to a complete station. These category guides require voltage, BMS, current, protection and charging checks; they are not a matched shopping list.", "Bateriile, panourile, invertoarele și încărcătoarele nu înlocuiesc individual o stație completă. Aceste ghiduri cer verificarea tensiunii, BMS, curentului, protecțiilor și încărcării; nu formează o listă de cumpărături compatibilă.")}</p>
            <div className="action-row">{paths.map(path => <Link className="button-outline" key={path} href={`/marketplace/${path}`}>{categoryByPath(path) ? local(categoryByPath(path)!.title, ro ? "ro" : "en") : path}</Link>)}</div>
          </details>
          <div className="action-row">
            {matches.length >= 2 && <Link
              className="button-primary"
              href={`/compare?ids=${encodeURIComponent(
                matches
                  .slice(0, 4)
                  .map((p) => p.id)
                  .join(","),
              )}`}
            >
              {l("Compare candidates", "Compară opțiunile")}
            </Link>}
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
