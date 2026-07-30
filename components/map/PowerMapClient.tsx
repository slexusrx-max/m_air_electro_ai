"use client";

import dynamic from "next/dynamic";
import type { PowerPlant } from "@/types/power";

const PowerMap = dynamic(() => import("@/components/map/PowerMap").then((module) => module.PowerMap), {
  ssr: false,
  loading: () => <div className="map-grid min-h-[520px] rounded-[2rem]" />,
});

export function PowerMapClient({ plants }: { plants: PowerPlant[] }) { return <PowerMap plants={plants} />; }
