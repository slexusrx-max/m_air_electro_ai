export type CableMaterial = "copper" | "aluminum";
export type SystemType = "single-phase" | "three-phase" | "dc";
export type MotorSystemType = "single-phase" | "three-phase";
export type ProtectionLoadType = "general" | "continuous" | "motor";
export type FuseApplicationType = "general-circuit" | "motor-circuit" | "semiconductor";
export type StartingMethod = "dol" | "soft-starter" | "vfd";

type CableAmpacityRow = {
  ampacity: number;
  size: number;
};

export type CableSizingCalculationInput = {
  current: number;
  length: number;
  material: CableMaterial;
  maxVoltageDropPercent: number;
  systemType: SystemType;
  voltage: number;
};

export type CableSizingCalculationResult = {
  actualVoltageDropPercent: number;
  actualVoltageDropVolts: number;
  ampacityLimitAmps: number;
  ampacityRequiredSize: number;
  governingConstraint: "ampacity" | "voltage-drop";
  recommendedSize: number;
  requiredVoltageDropSize: number;
};

export type VoltageDropCalculationInput = {
  cableSize: number;
  current: number;
  length: number;
  material: CableMaterial;
  maxVoltageDropPercent: number;
  systemType: SystemType;
  voltage: number;
};

export type VoltageDropCalculationResult = {
  actualVoltageDropPercent: number;
  actualVoltageDropVolts: number;
  allowedVoltageDropVolts: number;
  cableAmpacity: number | null;
  remainingVoltage: number;
  status: "within-limit" | "over-limit";
};

export type MotorCurrentCalculationInput = {
  efficiencyPercent: number;
  powerFactor: number;
  powerKw: number;
  startCurrentMultiplier: number;
  systemType: MotorSystemType;
  voltage: number;
};

export type MotorCurrentCalculationResult = {
  apparentPowerKva: number;
  fullLoadCurrent: number;
  inputPowerKw: number;
  startCurrent: number;
};

export type TransformerCalculationInput = {
  expectedLoadPercent: number;
  primaryVoltage: number;
  secondaryVoltage: number;
  systemType: MotorSystemType;
  transformerKva: number;
};

export type TransformerCalculationResult = {
  availableLoadKva: number;
  expectedPrimaryCurrent: number;
  expectedSecondaryCurrent: number;
  fullLoadPrimaryCurrent: number;
  fullLoadSecondaryCurrent: number;
};

export type BatteryCalculationInput = {
  backupHours: number;
  inverterEfficiencyPercent: number;
  loadPowerWatts: number;
  maxDepthOfDischargePercent: number;
  systemVoltage: number;
};

export type BatteryCalculationResult = {
  minimumNominalAh: number;
  minimumNominalWh: number;
  recommendedBatteryAh: number;
  requiredLoadEnergyWh: number;
};

export type GeneratorCalculationInput = {
  largestMotorKw: number;
  powerFactor: number;
  reservePercent: number;
  runningLoadKw: number;
  startingMethod: StartingMethod;
};

export type GeneratorCalculationResult = {
  motorStartAllowanceKva: number;
  recommendedGeneratorKva: number;
  reserveAdjustedRunningKva: number;
  runningLoadKva: number;
};

export type BreakerSelectionInput = {
  ambientDeratingPercent: number;
  designCurrent: number;
  inrushMultiplier: number;
  loadType: ProtectionLoadType;
  spareMarginPercent: number;
};

export type BreakerSelectionResult = {
  adjustedCurrent: number;
  advisory: string;
  minimumBreakerRating: number;
  recommendedBreakerRating: number;
};

export type FuseSelectionInput = {
  applicationType: FuseApplicationType;
  continuousLoad: boolean;
  designCurrent: number;
  spareMarginPercent: number;
};

export type FuseSelectionResult = {
  adjustedCurrent: number;
  advisory: string;
  fuseFamily: "aM" | "aR" | "gG";
  recommendedFuseRating: number;
};

export const standardCableSizes = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630,
];

export const standardProtectionRatings = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800,
  1000, 1250, 1600, 2000, 2500, 3200,
];

export const standardFuseRatings = [
  2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 355, 400, 500,
  630, 800, 1000, 1250, 1600,
];

export const standardBatteryCapacitiesAh = [35, 50, 75, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200];

export const resistivityByMaterial: Record<CableMaterial, number> = {
  copper: 0.0175,
  aluminum: 0.0282,
};

export const ampacityByMaterial: Record<CableMaterial, CableAmpacityRow[]> = {
  copper: [
    { size: 1.5, ampacity: 18 },
    { size: 2.5, ampacity: 24 },
    { size: 4, ampacity: 32 },
    { size: 6, ampacity: 41 },
    { size: 10, ampacity: 57 },
    { size: 16, ampacity: 76 },
    { size: 25, ampacity: 101 },
    { size: 35, ampacity: 125 },
    { size: 50, ampacity: 151 },
    { size: 70, ampacity: 192 },
    { size: 95, ampacity: 232 },
    { size: 120, ampacity: 269 },
    { size: 150, ampacity: 309 },
    { size: 185, ampacity: 353 },
    { size: 240, ampacity: 415 },
    { size: 300, ampacity: 477 },
    { size: 400, ampacity: 545 },
    { size: 500, ampacity: 620 },
    { size: 630, ampacity: 710 },
  ],
  aluminum: [
    { size: 1.5, ampacity: 14 },
    { size: 2.5, ampacity: 19 },
    { size: 4, ampacity: 25 },
    { size: 6, ampacity: 32 },
    { size: 10, ampacity: 45 },
    { size: 16, ampacity: 61 },
    { size: 25, ampacity: 80 },
    { size: 35, ampacity: 99 },
    { size: 50, ampacity: 119 },
    { size: 70, ampacity: 151 },
    { size: 95, ampacity: 182 },
    { size: 120, ampacity: 210 },
    { size: 150, ampacity: 241 },
    { size: 185, ampacity: 275 },
    { size: 240, ampacity: 323 },
    { size: 300, ampacity: 371 },
    { size: 400, ampacity: 424 },
    { size: 500, ampacity: 483 },
    { size: 630, ampacity: 553 },
  ],
};

export function getPositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function formatElectricalNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function getVoltageDropSystemFactor(systemType: SystemType) {
  return systemType === "three-phase" ? Math.sqrt(3) : 2;
}

export function getMotorCurrentSystemFactor(systemType: MotorSystemType) {
  return systemType === "three-phase" ? Math.sqrt(3) : 1;
}

export function getNextStandardValue(standards: number[], value: number) {
  return standards.find((entry) => entry >= value) ?? standards[standards.length - 1];
}

export function getCableAmpacity(material: CableMaterial, cableSize: number) {
  return ampacityByMaterial[material].find((entry) => entry.size === cableSize)?.ampacity ?? null;
}

export function calculateCableSizing({
  current,
  length,
  material,
  maxVoltageDropPercent,
  systemType,
  voltage,
}: CableSizingCalculationInput): CableSizingCalculationResult {
  const allowedVoltageDropVolts = voltage * (maxVoltageDropPercent / 100);
  const systemFactor = getVoltageDropSystemFactor(systemType);
  const resistivity = resistivityByMaterial[material];
  const requiredVoltageDropSize =
    (systemFactor * resistivity * length * current) / allowedVoltageDropVolts;

  const ampacityTable = ampacityByMaterial[material];
  const ampacityMatch = ampacityTable.find((entry) => entry.ampacity >= current);

  if (!ampacityMatch) {
    throw new Error("The requested current exceeds the supported range of this preliminary calculator.");
  }

  const roundedVoltageDropSize =
    standardCableSizes.find((size) => size >= requiredVoltageDropSize) ??
    standardCableSizes[standardCableSizes.length - 1];
  const recommendedSize =
    standardCableSizes.find((size) => size >= Math.max(roundedVoltageDropSize, ampacityMatch.size)) ??
    standardCableSizes[standardCableSizes.length - 1];

  const recommendedAmpacity =
    ampacityTable.find((entry) => entry.size === recommendedSize)?.ampacity ?? ampacityMatch.ampacity;
  const actualVoltageDropVolts = (systemFactor * resistivity * length * current) / recommendedSize;
  const actualVoltageDropPercent = (actualVoltageDropVolts / voltage) * 100;

  return {
    recommendedSize,
    ampacityRequiredSize: ampacityMatch.size,
    ampacityLimitAmps: recommendedAmpacity,
    requiredVoltageDropSize,
    actualVoltageDropVolts,
    actualVoltageDropPercent,
    governingConstraint: roundedVoltageDropSize >= ampacityMatch.size ? "voltage-drop" : "ampacity",
  };
}

export function calculateVoltageDrop({
  cableSize,
  current,
  length,
  material,
  maxVoltageDropPercent,
  systemType,
  voltage,
}: VoltageDropCalculationInput): VoltageDropCalculationResult {
  const resistivity = resistivityByMaterial[material];
  const systemFactor = getVoltageDropSystemFactor(systemType);
  const actualVoltageDropVolts = (systemFactor * resistivity * length * current) / cableSize;
  const actualVoltageDropPercent = (actualVoltageDropVolts / voltage) * 100;
  const allowedVoltageDropVolts = voltage * (maxVoltageDropPercent / 100);

  return {
    actualVoltageDropVolts,
    actualVoltageDropPercent,
    allowedVoltageDropVolts,
    cableAmpacity: getCableAmpacity(material, cableSize),
    remainingVoltage: voltage - actualVoltageDropVolts,
    status: actualVoltageDropPercent <= maxVoltageDropPercent ? "within-limit" : "over-limit",
  };
}

export function calculateMotorCurrent({
  efficiencyPercent,
  powerFactor,
  powerKw,
  startCurrentMultiplier,
  systemType,
  voltage,
}: MotorCurrentCalculationInput): MotorCurrentCalculationResult {
  const efficiency = efficiencyPercent / 100;
  const inputPowerKw = powerKw / efficiency;
  const apparentPowerKva = inputPowerKw / powerFactor;
  const systemFactor = getMotorCurrentSystemFactor(systemType);
  const fullLoadCurrent = (apparentPowerKva * 1000) / (voltage * systemFactor);

  return {
    inputPowerKw,
    apparentPowerKva,
    fullLoadCurrent,
    startCurrent: fullLoadCurrent * startCurrentMultiplier,
  };
}

export function calculateTransformer({
  expectedLoadPercent,
  primaryVoltage,
  secondaryVoltage,
  systemType,
  transformerKva,
}: TransformerCalculationInput): TransformerCalculationResult {
  const factor = getMotorCurrentSystemFactor(systemType);
  const fullLoadPrimaryCurrent = (transformerKva * 1000) / (primaryVoltage * factor);
  const fullLoadSecondaryCurrent = (transformerKva * 1000) / (secondaryVoltage * factor);
  const loadFraction = expectedLoadPercent / 100;
  const availableLoadKva = transformerKva * loadFraction;

  return {
    fullLoadPrimaryCurrent,
    fullLoadSecondaryCurrent,
    availableLoadKva,
    expectedPrimaryCurrent: fullLoadPrimaryCurrent * loadFraction,
    expectedSecondaryCurrent: fullLoadSecondaryCurrent * loadFraction,
  };
}

export function calculateBattery({
  backupHours,
  inverterEfficiencyPercent,
  loadPowerWatts,
  maxDepthOfDischargePercent,
  systemVoltage,
}: BatteryCalculationInput): BatteryCalculationResult {
  const requiredLoadEnergyWh = loadPowerWatts * backupHours;
  const inverterEfficiency = inverterEfficiencyPercent / 100;
  const usableFraction = maxDepthOfDischargePercent / 100;
  const minimumNominalWh = requiredLoadEnergyWh / (inverterEfficiency * usableFraction);
  const minimumNominalAh = minimumNominalWh / systemVoltage;

  return {
    requiredLoadEnergyWh,
    minimumNominalWh,
    minimumNominalAh,
    recommendedBatteryAh: getNextStandardValue(standardBatteryCapacitiesAh, minimumNominalAh),
  };
}

function getStartingMethodKvaMultiplier(startingMethod: StartingMethod) {
  switch (startingMethod) {
    case "dol":
      return 4.5;
    case "soft-starter":
      return 2.2;
    case "vfd":
      return 1.2;
    default:
      return 4.5;
  }
}

export function calculateGenerator({
  largestMotorKw,
  powerFactor,
  reservePercent,
  runningLoadKw,
  startingMethod,
}: GeneratorCalculationInput): GeneratorCalculationResult {
  const runningLoadKva = runningLoadKw / powerFactor;
  const reserveAdjustedRunningKva = runningLoadKva * (1 + reservePercent / 100);
  const motorStartAllowanceKva = largestMotorKw * getStartingMethodKvaMultiplier(startingMethod);

  return {
    runningLoadKva,
    reserveAdjustedRunningKva,
    motorStartAllowanceKva,
    recommendedGeneratorKva: getNextStandardValue(
      standardProtectionRatings,
      Math.max(reserveAdjustedRunningKva, runningLoadKva + motorStartAllowanceKva),
    ),
  };
}

function getBreakerLoadMultiplier(loadType: ProtectionLoadType) {
  switch (loadType) {
    case "continuous":
      return 1.25;
    case "motor":
      return 1.25;
    case "general":
    default:
      return 1;
  }
}

export function calculateBreakerSelection({
  ambientDeratingPercent,
  designCurrent,
  inrushMultiplier,
  loadType,
  spareMarginPercent,
}: BreakerSelectionInput): BreakerSelectionResult {
  const adjustedCurrent =
    (designCurrent * getBreakerLoadMultiplier(loadType) * (1 + spareMarginPercent / 100)) /
    (ambientDeratingPercent / 100);
  const recommendedBreakerRating = getNextStandardValue(standardProtectionRatings, adjustedCurrent);
  const minimumBreakerRating = getNextStandardValue(standardProtectionRatings, designCurrent);
  const highInrush = designCurrent * inrushMultiplier > recommendedBreakerRating * 5;

  return {
    adjustedCurrent,
    minimumBreakerRating,
    recommendedBreakerRating,
    advisory: highInrush
      ? "High inrush is indicated. Verify breaker curve, short-time settings, and motor-start behavior before final selection."
      : "Use this as a preliminary rating only. Final coordination and code checks are still required.",
  };
}

export function calculateFuseSelection({
  applicationType,
  continuousLoad,
  designCurrent,
  spareMarginPercent,
}: FuseSelectionInput): FuseSelectionResult {
  const applicationMultiplier =
    applicationType === "motor-circuit" ? 1.5 : applicationType === "semiconductor" ? 1.25 : 1;
  const continuousMultiplier = continuousLoad ? 1.25 : 1;
  const adjustedCurrent = designCurrent * applicationMultiplier * continuousMultiplier * (1 + spareMarginPercent / 100);
  const fuseFamily = applicationType === "motor-circuit" ? "aM" : applicationType === "semiconductor" ? "aR" : "gG";

  return {
    adjustedCurrent,
    fuseFamily,
    recommendedFuseRating: getNextStandardValue(standardFuseRatings, adjustedCurrent),
    advisory:
      applicationType === "semiconductor"
        ? "Semiconductor protection requires manufacturer-specific I2t and coordination review."
        : "Use this as a preliminary fuse selection only. Final coordination and fault-duty checks remain mandatory.",
  };
}
