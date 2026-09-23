"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { visualFamily } from "@/lib/visual-system";
import { EnergySchematic } from "./energy-schematic";

export function PageBackground() {
  const family = visualFamily(usePathname());
  return (
    <div
      aria-hidden="true"
      data-visual-family={family}
      className="marketing-page-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {family === "brand" ? <Image
        src="/hero.png"
        alt=""
        fill
        preload
        sizes="100vw"
        className="brand-background-art"
      /> : <EnergySchematic family={family} className="family-schematic" />}
      <div className="background-grid" />
      <div className="background-veil" />
    </div>
  );
}
