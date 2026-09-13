import { calculateBattery } from "@/lib/electrical-calculations";
export function estimateSystem(load: number, peak: number, hours: number) {
 if (![load,peak,hours].every(Number.isFinite) || load<=0 || peak<load || hours<=0 || hours>168 || load>100000 || peak>500000) return null;
 const battery=calculateBattery({loadPowerWatts:load,backupHours:hours,systemVoltage:48,maxDepthOfDischargePercent:80,inverterEfficiencyPercent:92});
 return { batteryWh:Math.ceil(battery.minimumNominalWh/100)*100, loadWh:load*hours, inverterW:Math.ceil(load*1.25/100)*100, surgeW:Math.ceil(peak*1.1/100)*100 };
}
