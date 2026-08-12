const baseUrl = (process.env.SMOKE_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const routes = ["/", "/marketplace", "/marketplace?batteryKwh=5.4&inverterKw=2&surgeKw=3&region=EU", "/marketplace/find-my-solution", "/marketplace/category/lithium-batteries", "/marketplace/products/lfp-battery-12v-100ah", "/backup-calculator", "/assistant", "/installers", "/experts", "/calculators", "/my-home", "/energy-ai"];
let failed = false;
for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  if (response.status !== 200) { failed = true; console.error(`FAIL ${response.status} ${route}`); } else console.log(`OK ${route}`);
}
const status = await fetch(`${baseUrl}/api/address?mode=status`);
const payload = await status.json();
if (status.status !== 200 || typeof payload.configured !== "boolean") { failed = true; console.error("FAIL address status endpoint"); } else console.log(`OK address status configured=${payload.configured}`);
if (failed) process.exit(1);
