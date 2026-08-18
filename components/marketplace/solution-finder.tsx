"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/marketplace/product-card";
import { catalog } from "@/lib/affiliate/catalog";
import type { MarketplaceRegion, ProductCategory } from "@/lib/affiliate/types";
import { calculateHomeEnergy, loadHomeEnergyProfile } from "@/lib/home-energy/profile";
import type { Dictionary } from "@/lib/i18n/types";

type Application = "Home" | "RV / Caravan" | "Boat" | "Off-grid cabin" | "Industrial" | "Other";
type FormState = { application: Application; load: string; peakLoad: string; hours: string; region: MarketplaceRegion; budget: string; solar: "yes" | "no" | "unknown"; battery: "yes" | "no" | "unknown"; generator: "yes" | "no" | "unknown"; installation: "fixed" | "mobile" | "unknown" };
const initialForm: FormState = { application: "Home", load: "1200", peakLoad: "1800", hours: "4", region: "EU", budget: "", solar: "no", battery: "no", generator: "no", installation: "fixed" };

function categoryPlan(application: Application, hasSolar: boolean): ProductCategory[] {
  if (application === "Boat") return ["marine-electrical", "lithium-batteries", "charge-controllers", "electrical-accessories"];
  if (application === "Industrial") return ["backup-power", "inverters", "industrial-electrical", "electrical-accessories"];
  if (application === "RV / Caravan" || application === "Off-grid cabin") return hasSolar ? ["lithium-batteries", "inverters", "charge-controllers", "electrical-accessories"] : ["solar-kits", "lithium-batteries", "inverters", "charge-controllers"];
  return ["backup-power", "lithium-batteries", "inverters", "electrical-accessories"];
}

const applicationKeys: Record<Application, string> = { "Home": "marketplace.finder.app.home", "RV / Caravan": "marketplace.finder.app.rv", "Boat": "marketplace.finder.app.boat", "Off-grid cabin": "marketplace.finder.app.offgrid", "Industrial": "marketplace.finder.app.industrial", "Other": "marketplace.finder.app.other" };
export function SolutionFinder({ dictionary: t }: { dictionary: Dictionary }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [ready, setReady] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { const profile = loadHomeEnergyProfile(); const calculated = calculateHomeEnergy(profile); if (calculated.continuousLoad > 0) setForm((current) => ({ ...current, application: "Home", load: String(calculated.continuousLoad), peakLoad: String(calculated.peakLoad), hours: String(profile.desiredBackupHours), region: profile.location.region, solar: profile.existingSolar ? "yes" : "no", battery: profile.existingBattery ? "yes" : "no", generator: profile.existingGenerator ? "yes" : "no" })); }, 0); return () => window.clearTimeout(timer); }, []);
  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => setForm((current) => ({ ...current, [key]: value }));
  const recommendation = useMemo(() => {
    const load = Math.max(0, Number(form.load) || 0);
    const peak = Math.max(load, Number(form.peakLoad) || load);
    const hours = Math.max(0, Number(form.hours) || 0);
    const batteryWh = Math.ceil((load * hours) / 0.8 / 0.92 / 100) * 100;
    const inverter = Math.ceil((peak * 1.25) / 100) * 100;
    const needsSolar = form.application === "RV / Caravan" || form.application === "Off-grid cabin" || form.solar === "yes";
    const solar = needsSolar ? Math.ceil((batteryWh / 3.5) / 100) * 100 : null;
    const categories = categoryPlan(form.application, needsSolar);
    return { batteryWh, inverter, solar, categories };
  }, [form]);
  const matches = catalog.filter((product) => product.merchantRegion === form.region && recommendation.categories.includes(product.category)).slice(0, 3);

  return <section className="mx-auto max-w-5xl">
    <div className="brand-glass-card rounded-[2rem] p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">{t["marketplace.finder.eyebrow"]}</p><h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{t["marketplace.finder.title"]}</h1></div><p className="text-sm text-lime-100">{t["marketplace.finder.step"].replace("{step}", String(step))}</p></div>
      <p className="mt-4 max-w-2xl text-white/72">{t["marketplace.finder.description"]}</p>
      {step === 1 ? <div className="mt-8 grid gap-4 sm:grid-cols-2"><label className="text-sm text-white/80">{t["marketplace.finder.application"]}<select value={form.application} onChange={(event) => update("application", event.target.value as Application)} className="form-control">{(Object.keys(applicationKeys) as Application[]).map((application) => <option key={application} value={application}>{t[applicationKeys[application]]}</option>)}</select></label><label className="text-sm text-white/80">{t["marketplace.finder.region"]}<select value={form.region} onChange={(event) => update("region", event.target.value as MarketplaceRegion)} className="form-control"><option value="EU">EU</option><option value="US">US</option><option value="UK">UK</option></select></label><label className="text-sm text-white/80">{t["marketplace.finder.installation"]}<select value={form.installation} onChange={(event) => update("installation", event.target.value as FormState["installation"])} className="form-control"><option value="fixed">{t["marketplace.finder.fixed"]}</option><option value="mobile">{t["marketplace.finder.mobile"]}</option><option value="unknown">{t["marketplace.finder.unknown"]}</option></select></label></div> : null}
      {step === 2 ? <div className="mt-8 grid gap-4 sm:grid-cols-2"><label className="text-sm text-white/80">{t["marketplace.finder.load"]}<input value={form.load} onChange={(event) => update("load", event.target.value)} className="form-control" type="number" min="0" /></label><label className="text-sm text-white/80">{t["marketplace.finder.peak"]}<input value={form.peakLoad} onChange={(event) => update("peakLoad", event.target.value)} className="form-control" type="number" min="0" /></label><label className="text-sm text-white/80">{t["marketplace.finder.hours"]}<input value={form.hours} onChange={(event) => update("hours", event.target.value)} className="form-control" type="number" min="0" step="0.5" /></label><label className="text-sm text-white/80">{t["marketplace.finder.budget"]}<input value={form.budget} onChange={(event) => update("budget", event.target.value)} className="form-control" type="number" min="0" placeholder={t["marketplace.finder.currency"]} /></label></div> : null}
      {step === 3 ? <div className="mt-8 grid gap-4 sm:grid-cols-3">{(["solar", "battery", "generator"] as const).map((field) => <label key={field} className="text-sm text-white/80">{t[`marketplace.finder.existing${field[0].toUpperCase()}${field.slice(1)}`]}<select value={form[field]} onChange={(event) => update(field, event.target.value as FormState[typeof field])} className="form-control"><option value="no">{t["marketplace.finder.no"]}</option><option value="yes">{t["marketplace.finder.yes"]}</option><option value="unknown">{t["marketplace.finder.notSure"]}</option></select></label>)}</div> : null}
      <div className="mt-7 flex gap-3">{step > 1 ? <button onClick={() => setStep((value) => value - 1)} className="button-outline">{t["marketplace.finder.back"]}</button> : null}{step < 3 ? <button onClick={() => setStep((value) => value + 1)} className="button-primary">{t["marketplace.finder.continue"]}</button> : <button onClick={() => setReady(true)} className="button-primary">{t["marketplace.finder.calculate"]}</button>}</div>
    </div>
    {ready ? <div className="mt-7 grid gap-5"><section className="grid gap-4 sm:grid-cols-3">{[[t["marketplace.finder.battery"], `${recommendation.batteryWh.toLocaleString()} Wh`], [t["marketplace.finder.inverter"], `${recommendation.inverter.toLocaleString()} W+`], [t["marketplace.finder.solar"], recommendation.solar ? `${recommendation.solar.toLocaleString()} W` : t["marketplace.finder.solarNotPrimary"]]].map(([label, value]) => <article key={label} className="info-card"><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p></article>)}</section><p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{t["marketplace.finder.warning"]}</p><section><h2 className="text-2xl font-bold text-white">{t["marketplace.finder.categories"]}</h2><div className="mt-3 flex flex-wrap gap-2">{recommendation.categories.map((category) => <Link key={category} href={`/marketplace/category/${category}`} className="rounded-full border border-lime-100/30 px-4 py-2 text-sm text-lime-100">{category.replaceAll("-", " ")}</Link>)}</div></section><h2 className="text-2xl font-bold text-white">{t["marketplace.finder.records"].replace("{region}", form.region)}</h2>{matches.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{matches.map((product) => <ProductCard key={product.id} product={product} dictionary={t}/>)}</div> : <p className="rounded-2xl border border-white/15 bg-white/[.04] p-5 text-white/72">{t["marketplace.finder.empty"]}</p>}<Link href="/calculators/battery" className="text-sm font-semibold text-lime-100">{t["marketplace.finder.detailed"]}</Link></div> : null}
  </section>;
}
