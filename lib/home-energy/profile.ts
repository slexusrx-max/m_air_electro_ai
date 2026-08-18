export type HomeAppliance = { id: string; name: string; watts: number; quantity: number; hours: number; surgeMultiplier: number; essential: boolean };
export type HomeEnergyProfile = { location: { city: string; street: string; house: string; apartment: string; region: "EU" | "US" | "UK" }; propertyType: "apartment" | "house"; residents: number; appliances: HomeAppliance[]; desiredBackupHours: number; existingBattery: boolean; existingInverter: boolean; existingGenerator: boolean; existingSolar: boolean };
export type HomeEnergyRecommendation = { continuousLoad: number; peakLoad: number; backupEnergyWh: number; usableBatteryWh: number; nominalBatteryWh: number; inverterWatts: number; surgeWatts: number; estimatedRuntimeHours: number };

export const homeEnergyStorageKey = "electro-ai-home-energy-profile";
export const defaultHomeEnergyProfile: HomeEnergyProfile = { location: { city: "", street: "", house: "", apartment: "", region: "EU" }, propertyType: "apartment", residents: 2, desiredBackupHours: 8, existingBattery: false, existingInverter: false, existingGenerator: false, existingSolar: false, appliances: [{ id: "fridge", name: "Refrigerator", watts: 150, quantity: 1, hours: 8, surgeMultiplier: 3, essential: true }, { id: "router", name: "Wi-Fi router", watts: 20, quantity: 1, hours: 8, surgeMultiplier: 1, essential: true }, { id: "boiler", name: "Gas boiler", watts: 120, quantity: 1, hours: 8, surgeMultiplier: 1.5, essential: true }, { id: "lighting", name: "Lighting", watts: 100, quantity: 1, hours: 8, surgeMultiplier: 1, essential: true }, { id: "laptop", name: "Laptop", watts: 90, quantity: 1, hours: 6, surgeMultiplier: 1, essential: false }] };

export function calculateHomeEnergy(profile: HomeEnergyProfile): HomeEnergyRecommendation {
  const essential = profile.appliances.filter((item) => item.essential && item.watts > 0 && item.quantity > 0);
  const continuousLoad = essential.reduce((total, item) => total + item.watts * item.quantity, 0);
  const peakLoad = essential.reduce((total, item) => total + item.watts * item.quantity * Math.max(1, item.surgeMultiplier), 0);
  const backupEnergyWh = essential.reduce((total, item) => total + item.watts * item.quantity * Math.min(profile.desiredBackupHours, Math.max(0, item.hours)), 0);
  const usableBatteryWh = Math.ceil((backupEnergyWh / 0.92) / 100) * 100;
  const nominalBatteryWh = Math.ceil((usableBatteryWh / 0.8) / 100) * 100;
  const inverterWatts = Math.ceil((continuousLoad * 1.25) / 100) * 100;
  const surgeWatts = Math.ceil((peakLoad * 1.1) / 100) * 100;
  const estimatedRuntimeHours = continuousLoad ? Math.round((usableBatteryWh * 0.92 / continuousLoad) * 10) / 10 : 0;
  return { continuousLoad, peakLoad, backupEnergyWh, usableBatteryWh, nominalBatteryWh, inverterWatts, surgeWatts, estimatedRuntimeHours };
}

export function loadHomeEnergyProfile() { if (typeof window === "undefined") return defaultHomeEnergyProfile; try { const saved = window.localStorage.getItem(homeEnergyStorageKey); return saved ? { ...defaultHomeEnergyProfile, ...JSON.parse(saved), location: { ...defaultHomeEnergyProfile.location, ...JSON.parse(saved).location } } as HomeEnergyProfile : defaultHomeEnergyProfile; } catch { return defaultHomeEnergyProfile; } }
export function saveHomeEnergyProfile(profile: HomeEnergyProfile) { window.localStorage.setItem(homeEnergyStorageKey, JSON.stringify(profile)); }
