"use client";

import Link from "next/link";

import { DataConfidenceBadge, DemoDataBadge, PowerPlantStatusBadge } from "@/components/power/power-badges";
import type { PowerPlant } from "@/types/power";

function valueOrUnavailable(value?: string | number | null) {
  return value === undefined || value === null || value === "" ? "Not available" : value;
}

export function PlantDetailsPanel({ plant, onClose }: { plant: PowerPlant; onClose: () => void }) {
  const share = () => {
    const url = `${window.location.origin}/map?plant=${encodeURIComponent(plant.id)}`;
    void navigator.clipboard?.writeText(url).catch(() => undefined);
  };

  return (
    <aside className="info-card rounded-3xl p-5 text-slate-800" aria-label="Power plant details">
      <div className="flex justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2"><DemoDataBadge /><PowerPlantStatusBadge status={plant.status} /></div>
          <h2 className="mt-3 text-xl font-bold text-slate-950">{plant.name}</h2>
          <p className="text-sm text-slate-600">{[plant.city, plant.region, plant.country].filter(Boolean).join(" · ")}</p>
        </div>
        <button onClick={onClose} aria-label="Close plant details" className="h-8 w-8 rounded-lg text-xl text-slate-500 hover:bg-slate-100">×</button>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div><dt>Generation source</dt><dd className="font-bold capitalize text-slate-950">{plant.source}</dd></div>
        <div><dt>Status</dt><dd className="font-bold capitalize text-slate-950">{plant.status.replaceAll("_", " ")}</dd></div>
        <div><dt>Installed capacity</dt><dd className="font-bold text-slate-950">{plant.installedCapacityMw?.toLocaleString() ?? "Not available"} MW</dd></div>
        <div><dt>Operator</dt><dd className="font-bold text-slate-950">{valueOrUnavailable(plant.operator)}</dd></div>
        <div><dt>Last update</dt><dd className="font-bold text-slate-950">{valueOrUnavailable(plant.lastUpdatedAt ? new Date(plant.lastUpdatedAt).toLocaleDateString() : null)}</dd></div>
        <div><dt>Confidence</dt><dd className="mt-1"><DataConfidenceBadge confidence={plant.confidence} /></dd></div>
        <div className="col-span-2"><dt>Coordinates</dt><dd className="font-bold text-slate-950">{plant.latitude.toFixed(4)}, {plant.longitude.toFixed(4)}</dd></div>
        <div className="col-span-2"><dt>Data source</dt><dd className="font-bold text-slate-950">{plant.dataSources[0]?.name ?? "Not available"}</dd></div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
        <button onClick={share} className="button-outline">Share link</button>
        <Link href={`/map?plant=${encodeURIComponent(plant.id)}`} className="button-primary">View details</Link>
        <Link href="/methodology" className="button-outline">View methodology</Link>
      </div>
    </aside>
  );
}
