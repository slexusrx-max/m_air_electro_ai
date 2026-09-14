const labels: Record<string, string> = {
  "Nominal voltage": "Tensiune nominală",
  "Voltage class": "Clasă de tensiune",
  "Battery voltage class": "Clasă tensiune baterie",
  "DC input class": "Clasă intrare DC",
  Capacity: "Capacitate",
  "Stored energy (V × Ah)": "Energie stocată (V × Ah)",
  "Continuous discharge": "Descărcare continuă",
  "Maximum discharge": "Curent maxim de descărcare",
  Chemistry: "Chimie",
  "Rated power (STC)": "Putere nominală (STC)",
  "Open-circuit voltage (STC)": "Tensiune în gol (STC)",
  "Operating voltage (STC)": "Tensiune de lucru (STC)",
  "Short-circuit current (STC)": "Curent de scurtcircuit (STC)",
  Weight: "Masă",
  Format: "Format",
  "Continuous output": "Putere continuă",
  Waveform: "Formă de undă",
  "Charge current class": "Clasă curent încărcare",
  "Solar control": "Reglare solară",
  Sources: "Surse",
  voltage: "Clasă tensiune (V)",
  capacityAh: "Capacitate (Ah)",
  chemistry: "Chimie",
  power: "Putere (W)",
  waveform: "Formă de undă",
  controllerType: "Tip regulator",
  format: "Format",
};
export const specificationLabel = (key: string, ro: boolean) => {
  if (key.includes(" / ")) return key.split(" / ")[ro ? 0 : 1];
  return ro ? labels[key] ?? key : key;
};
