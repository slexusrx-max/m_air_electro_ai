"use client";

import { useState } from "react";
import Link from "@/components/localized-link";
import { estimateSystem } from "@/lib/marketplace/recommendation";
import { starterScenarios } from "@/lib/marketplace/selection-guidance";

export function QuickSolutionStarter({ ro }: { ro: boolean }) {
  const [selectedId, setSelectedId] = useState<(typeof starterScenarios)[number]["id"]>(starterScenarios[0].id);
  const selected = starterScenarios.find((scenario) => scenario.id === selectedId) ?? starterScenarios[0];
  const [load, setLoad] = useState(String(selected.load));
  const [peak, setPeak] = useState(String(selected.peak));
  const [hours, setHours] = useState(String(selected.hours));
  const result = estimateSystem(Number(load), Number(peak), Number(hours));

  function chooseScenario(id: (typeof starterScenarios)[number]["id"]) {
    const scenario = starterScenarios.find((item) => item.id === id) ?? starterScenarios[0];
    setSelectedId(scenario.id);
    setLoad(String(scenario.load));
    setPeak(String(scenario.peak));
    setHours(String(scenario.hours));
  }

  const finderHref = result
    ? `/marketplace/find-my-solution?${new URLSearchParams({
        application: selected.application,
        load,
        peak,
        hours,
        region: "EU",
        step: "3",
      })}`
    : "/marketplace/find-my-solution";

  return <div className="quick-solution" data-testid="quick-solution-starter">
    <div className="quick-solution-scenarios" role="group" aria-label={ro ? "Alege un scenariu de pornire" : "Choose a starting scenario"}>
      {starterScenarios.map((scenario) => <button
        key={scenario.id}
        type="button"
        className={scenario.id === selected.id ? "is-active" : ""}
        aria-pressed={scenario.id === selected.id}
        onClick={() => chooseScenario(scenario.id)}
      >
        <strong>{scenario.title[ro ? "ro" : "en"]}</strong>
        <span>{scenario.load} W · {scenario.hours} h</span>
      </button>)}
    </div>

    <div className="quick-solution-workspace">
      <div className="quick-solution-inputs">
        <p className="quick-solution-label">{ro ? "AJUSTEAZĂ PENTRU APARATELE TALE" : "ADJUST FOR YOUR DEVICES"}</p>
        <p>{selected.loads[ro ? "ro" : "en"]}. {selected.limit[ro ? "ro" : "en"]}</p>
        <div className="quick-solution-fields">
          <label>{ro ? "Consum simultan" : "Running load"}<span><input aria-label={ro ? "Consum simultan în wați" : "Running load in watts"} type="number" min="1" step="1" inputMode="decimal" value={load} onChange={(event) => setLoad(event.target.value)} /> W</span></label>
          <label>{ro ? "Vârf la pornire" : "Starting peak"}<span><input aria-label={ro ? "Vârf la pornire în wați" : "Starting peak in watts"} type="number" min="1" step="1" inputMode="decimal" value={peak} onChange={(event) => setPeak(event.target.value)} /> W</span></label>
          <label>{ro ? "Autonomie dorită" : "Backup time"}<span><input aria-label={ro ? "Autonomie dorită în ore" : "Backup time in hours"} type="number" min="0.1" max="168" step="0.5" inputMode="decimal" value={hours} onChange={(event) => setHours(event.target.value)} /> h</span></label>
        </div>
      </div>

      <div className="quick-solution-result" aria-live="polite">
        {result ? <>
          <p className="quick-solution-label">{ro ? "ESTIMARE INSTANTANEE" : "INSTANT ESTIMATE"}</p>
          <strong>{result.loadWh} Wh</strong>
          <span>{ro ? "energie pentru consumatori" : "energy used by your devices"}</span>
          <dl>
            <div><dt>{ro ? "Baterie nominală" : "Nominal battery"}</dt><dd>{result.batteryWh} Wh</dd></div>
            <div><dt>{ro ? "Invertor continuu" : "Continuous inverter"}</dt><dd>{result.inverterW} W</dd></div>
            <div><dt>{ro ? "Capacitate la pornire" : "Starting capability"}</dt><dd>{result.surgeW} W</dd></div>
          </dl>
          <Link className="button-primary" href={finderHref}>{ro ? "Vezi modelele potrivite" : "See suitable models"} →</Link>
        </> : <>
          <p className="quick-solution-label">{ro ? "VERIFICĂ DATELE" : "CHECK YOUR INPUTS"}</p>
          <p>{ro ? "Introdu valori pozitive; vârful trebuie să fie cel puțin egal cu sarcina continuă." : "Enter positive values; starting peak must be at least the running load."}</p>
          <Link className="button-outline" href="/marketplace/find-my-solution">{ro ? "Deschide calculatorul complet" : "Open the full calculator"} →</Link>
        </>}
      </div>
    </div>
    <p className="quick-solution-note">{ro ? "Estimare de planificare pentru consumatori AC. Confirmă tensiunea, conectorii, durata vârfului și instalarea înainte de cumpărare." : "Planning estimate for AC loads. Confirm voltage, connectors, surge duration and installation before purchase."}</p>
  </div>;
}
