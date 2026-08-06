"use client";

import dynamic from "next/dynamic";
import type { PowerPlant } from "@/types/power";

const PowerMap = dynamic(() => import("@/components/map/PowerMap").then((module) => module.PowerMap), {
  ssr: false,
  loading: () => <div className="map-grid flex min-h-[520px] items-center justify-center rounded-[2rem] px-6 text-center text-sm font-medium text-slate-700">Loading energy infrastructure data…</div>,
});

export function PowerMapClient({ plants }: { plants: PowerPlant[] }) { return <PowerMap plants={plants} />; }
