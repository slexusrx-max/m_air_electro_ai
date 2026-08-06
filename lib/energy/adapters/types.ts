import type { UkraineEnergySnapshot } from "@/types/ukraine-energy";
export interface UkraineEnergyAdapter { getSnapshot(): Promise<UkraineEnergySnapshot> }
