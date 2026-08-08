"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Dictionary, Locale } from "@/lib/i18n/types";
import type { UkraineEnergySnapshot } from "@/types/ukraine-energy";

const sourceUrl = "https://greendealukraina.org/gd-tracker/state-of-the-ukrainian-energy-system";

function formatValue(value: number | undefined, unit: string, t: Dictionary, locale: Locale) {
  return value === undefined
    ? t["common.notAvailable"]
    : `${value.toLocaleString(locale === "uk" ? "uk-UA" : "en-GB")}${unit ? ` ${unit}` : ""}`;
}

function download(snapshot: UkraineEnergySnapshot) {
  const rows = ["metric,value,status,source", ...snapshot.sources.map((item) => `source,,${item.status},${item.sourceName}`)];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "electro-ai-ukraine-energy-data.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function UkraineEnergyDashboard({ initialSnapshot, dictionary: t, locale }: { initialSnapshot: UkraineEnergySnapshot; dictionary: Dictionary; locale: Locale }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const ranges = [t["energy.range.today"], t["energy.range.week"], t["energy.range.month"], t["energy.range.quarter"], t["energy.range.year"], t["energy.range.since2022"]];
  const [range, setRange] = useState(ranges[0]);
  const [addressResult, setAddressResult] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timestamp = new Date(snapshot.generatedAt).toLocaleString(locale === "uk" ? "uk-UA" : "en-GB", { timeZone: "Europe/Kyiv" });
  const unavailableCount = useMemo(() => snapshot.sources.filter((item) => item.status === "unavailable" || item.status === "demo").length, [snapshot.sources]);
  const refresh = async () => { setIsRefreshing(true); try { const response = await fetch("/api/energy/ukraine", { cache: "no-store" }); if (response.ok) setSnapshot(await response.json()); } finally { setIsRefreshing(false); } };
  const share = async () => { await navigator.clipboard?.writeText(window.location.href); };
  const kpis = [
    [t["energy.kpi.system"], t["common.notAvailable"], t["energy.kpi.system.detail"], t["energy.kpi.system.source"]],
    [t["energy.kpi.flow"], formatValue(snapshot.flows.find((item) => item.valueMw !== undefined)?.valueMw, "MW", t, locale), t["energy.kpi.flow.detail"], t["energy.kpi.flow.source"]],
    [t["energy.kpi.generation"], formatValue(snapshot.capacity[0]?.operatingMw, "MW", t, locale), t["energy.kpi.generation.detail"], t["energy.kpi.generation.source"]],
    [t["energy.kpi.outages"], formatValue(snapshot.outages.filter((item) => item.plannedHours !== undefined).length, "", t, locale), t["energy.kpi.outages.detail"], t["energy.kpi.outages.source"]],
    [t["energy.kpi.gas"], formatValue(snapshot.gas[0]?.volumeMcm, "mcm", t, locale), t["energy.kpi.gas.detail"], t["energy.kpi.gas.source"]],
    [t["energy.kpi.price"], formatValue(snapshot.prices[0]?.uahPerMwh, "UAH/MWh", t, locale), t["energy.kpi.price.detail"], t["energy.kpi.price.source"]],
    [t["energy.kpi.sources"], `${snapshot.sources.length - unavailableCount}/${snapshot.sources.length}`, t["energy.kpi.sources.detail"], t["energy.kpi.sources.source"]],
    [t["energy.kpi.sync"], timestamp, t["energy.kpi.sync.detail"], t["energy.kpi.sync.source"]],
  ];

  return <div className="mx-auto w-full max-w-7xl space-y-6 text-slate-800">
    <section className="brand-glass-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start"><div><p className="eyebrow">{t["energy.eyebrow"]}</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">{t["energy.title"]}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{t["energy.description"]}</p><p className="mt-4 text-sm text-slate-600">{t["energy.status"]}: <b className="text-amber-800">{t["energy.demo"]}</b> · {t["energy.updated"]}: {timestamp} · Europe/Kyiv</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={refresh} className="button-primary">{isRefreshing ? t["energy.refreshing"] : t["energy.refresh"]}</button><button type="button" onClick={share} className="button-outline">{t["energy.share"]}</button><button type="button" onClick={() => download(snapshot)} className="button-outline">{t["energy.download"]}</button><Link className="button-outline" href="/methodology">{t["energy.methodology"]}</Link></div></div>
      <div className="mt-6 flex flex-wrap gap-2" aria-label={t["energy.range.label"]}>{ranges.map((item) => <button type="button" key={item} onClick={() => setRange(item)} aria-pressed={range === item} className={`rounded-full px-3 py-1.5 text-sm ${range === item ? "bg-teal-700 text-white" : "bg-white/70 text-slate-700"}`}>{item}</button>)}</div>
    </section>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value, detail, source]) => <article key={label} className="info-card rounded-2xl p-4"><p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p><p className="mt-2 text-xs text-slate-600">{detail}</p><p className="mt-1 text-xs text-slate-500">{t["energy.source"]}: {source}</p></article>)}</section>
    <section className="grid gap-6 lg:grid-cols-2"><Panel title={t["energy.trade.title"]} source={t["energy.trade.source"]} sourceLabel={t["energy.source"]}><p className="text-sm text-slate-600">{t["energy.trade.description"]} {range}.</p><FlowTable snapshot={snapshot} t={t} locale={locale} /></Panel><Panel title={t["energy.capacity.title"]} source={t["energy.capacity.source"]} sourceLabel={t["energy.source"]}><div className="space-y-3 text-sm"><Bar label={t["energy.capacity.operating"]} value={snapshot.capacity[0]?.operatingMw} tone="bg-emerald-500" t={t} locale={locale}/><Bar label={t["energy.capacity.damaged"]} value={snapshot.capacity[0]?.damagedMw} tone="bg-amber-500" t={t} locale={locale}/><Bar label={t["energy.capacity.offline"]} value={snapshot.capacity[0]?.offlineMw} tone="bg-slate-400" t={t} locale={locale}/><p className="text-slate-600">{t["energy.capacity.description"]}</p></div></Panel></section>
    <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Panel title={t["energy.outlook.title"]} source={t["energy.outlook.source"]} sourceLabel={t["energy.source"]}><div className="grid gap-2 sm:grid-cols-2">{snapshot.outages.map((outage) => <button type="button" key={outage.oblast} className="rounded-xl border border-teal-100 bg-white/75 p-3 text-left hover:border-teal-400"><b>{outage.oblast} {t["energy.oblast"]}</b><span className="mt-1 block text-sm text-slate-600">{t["common.notAvailable"]} — {outage.coverage}</span></button>)}</div><p className="mt-4 text-xs text-slate-600">{t["energy.outlook.note"]}</p></Panel><Panel title={t["energy.address.title"]} source={t["energy.address.source"]} sourceLabel={t["energy.source"]}><form onSubmit={(event) => { event.preventDefault(); setAddressResult(t["energy.address.result"]); }} className="grid gap-3"><select aria-label={t["energy.address.oblast"]} className="rounded-xl border border-slate-200 bg-white p-3"><option>{t["energy.address.choose"]}</option>{snapshot.outages.map((item) => <option key={item.oblast}>{item.oblast}</option>)}</select><input className="rounded-xl border border-slate-200 bg-white p-3" placeholder={t["energy.address.city"]}/><input className="rounded-xl border border-slate-200 bg-white p-3" placeholder={t["energy.address.street"]}/><button className="button-primary" type="submit">{t["energy.address.check"]}</button></form>{addressResult ? <p role="status" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{addressResult}</p> : null}</Panel></section>
    <section className="info-card rounded-3xl p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold text-slate-950">{t["energy.map.title"]}</h2><p className="mt-2 text-sm text-slate-600">{t["energy.map.description"]}</p></div><Link href="/map?country=UA" className="button-primary shrink-0">{t["energy.map.open"]}</Link></div></section>
    <section className="grid gap-6 lg:grid-cols-2"><Panel title={t["energy.gas.title"]} source={t["energy.gas.source"]} sourceLabel={t["energy.source"]}><p className="text-sm text-slate-600">{t["energy.gas.description"]}</p></Panel><Panel title={t["energy.market.title"]} source={t["energy.market.source"]} sourceLabel={t["energy.source"]}><p className="text-sm text-slate-600">{t["energy.market.description"]}</p></Panel></section>
    <p className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4 text-sm text-slate-700">{t["energy.disclaimer"]} <a className="font-semibold text-teal-800 underline" href={sourceUrl} target="_blank" rel="noreferrer">{t["energy.reference"]}</a>.</p>
  </div>;
}

function Panel({ title, source, sourceLabel, children }: { title: string; source: string; sourceLabel: string; children: React.ReactNode }) { return <section className="info-card rounded-3xl p-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl font-bold text-slate-950">{title}</h2><span className="text-xs text-slate-500">{sourceLabel}: {source}</span></div><div className="mt-5">{children}</div></section>; }
function Bar({ label, value, tone, t, locale }: { label: string; value?: number; tone: string; t: Dictionary; locale: Locale }) { return <div><div className="flex justify-between text-sm"><span>{label}</span><b>{formatValue(value, "MW", t, locale)}</b></div><div className="mt-1 h-3 rounded-full bg-slate-100"><div className={`h-full rounded-full ${value === undefined ? "w-0" : tone}`} style={{ width: value === undefined ? "0%" : "100%" }} /></div></div>; }
function FlowTable({ snapshot, t, locale }: { snapshot: UkraineEnergySnapshot; t: Dictionary; locale: Locale }) { return <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-2">{t["energy.flow.direction"]}</th><th>{t["energy.flow.value"]}</th><th>{t["energy.flow.status"]}</th></tr></thead><tbody>{snapshot.flows.map((flow) => <tr key={flow.counterparty} className="border-b border-slate-100"><td className="py-2">{flow.counterparty}</td><td>{formatValue(flow.valueMw, "MW", t, locale)}</td><td>{flow.source.status === "demo" ? t["energy.demo"] : flow.source.status}</td></tr>)}</tbody></table></div>; }
