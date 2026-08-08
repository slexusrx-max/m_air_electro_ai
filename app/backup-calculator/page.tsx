import { PlatformShell } from "@/components/platform-shell";
import { BackupCalculator } from "@/components/product/backup-calculator";
import { ProductPage } from "@/components/product/page-content";
export default function BackupCalculatorPage() { return <PlatformShell><ProductPage eyebrow="Backup Calculator" title="Plan your essential power." description="Choose household loads and a desired outage duration for a preliminary, technically transparent battery and inverter estimate."><BackupCalculator /></ProductPage></PlatformShell>; }
