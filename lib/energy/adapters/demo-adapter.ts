import { ukraineEnergyDemo } from "@/data/ukraine-energy-demo";
import type { UkraineEnergyAdapter } from "@/lib/energy/adapters/types";
export const demoUkraineEnergyAdapter: UkraineEnergyAdapter = { async getSnapshot() { return ukraineEnergyDemo; } };
