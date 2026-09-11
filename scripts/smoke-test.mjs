const baseUrl = (process.env.SMOKE_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const routes = ["/", "/marketplace", "/marketplace?batteryKwh=5.4&inverterKw=2&surgeKw=3&region=RO", "/marketplace/find-my-solution", "/marketplace/category/lithium-batteries", "/marketplace/products/lfp-battery-12v-100ah", "/backup-calculator", "/calculators", "/about", "/contact", "/terms", "/privacy", "/affiliate-disclosure"];
let failed = false;
for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  if (response.status !== 200) { failed = true; console.error(`FAIL ${response.status} ${route}`); } else console.log(`OK ${route}`);
}
if (failed) process.exit(1);
