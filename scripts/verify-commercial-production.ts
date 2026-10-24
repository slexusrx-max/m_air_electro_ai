import { chromium, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { catalog } from "../lib/affiliate/catalog";
import { expectSupplierCta } from "../tests/supplier-link-expectations";

async function main() {
  const browser = await chromium.launch();
  const records: object[] = [];
  const failures: string[] = [];
  try {
    const page = await browser.newPage();
    for (const product of catalog.filter(product => product.kind === "product")) {
      try {
        const response = await page.goto(`https://mairelectroai.com/en/marketplace/products/${product.slug}`, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBe(200);
        if (process.env.EXPECTED_DEPLOYMENT_SHA) await expect(page.locator('meta[name="deployment-commit"]')).toHaveAttribute("content", process.env.EXPECTED_DEPLOYMENT_SHA);
        await expect(page.locator("h1")).toHaveText(product.name);
        const cta = page.locator(`.product-detail [data-supplier-product="${product.id}"]`);
        await expectSupplierCta(cta, product, true);
        const href = (await cta.getAttribute("href"))!;
        const tracked = await cta.getAttribute("data-tracking-status") === "active";
        let landing: object | undefined;
        // Explicit opt-in: a real network handoff is a test click, never a purchase.
        if (tracked && process.env.VERIFY_AFFILIATE_REDIRECTS === "true") {
          const result = await fetch(href, { signal: AbortSignal.timeout(30000) });
          const destination = new URL(result.url), source = new URL(product.productUrl);
          await result.body?.cancel();
          expect(result.status).toBe(200);
          expect(destination.origin).toBe(source.origin);
          expect(destination.pathname.replace(/\/$/, "")).toBe(source.pathname.replace(/\/$/, ""));
          if (source.searchParams.has("variant")) expect(destination.searchParams.get("variant")).toBe(source.searchParams.get("variant"));
          if (product.provider === "renogy") expect(destination.searchParams.get("mpid")).toBe("7767803");
          landing = { status: result.status, origin: destination.origin, path: destination.pathname, exactVariant: source.searchParams.get("variant"), parameterNames: [...destination.searchParams.keys()] };
        }
        records.push({ id: product.id, provider: product.provider, tracked, exactIssuedUrl: tracked, landing });
      } catch (error) { failures.push(`${product.id}: ${error instanceof Error ? error.message : String(error)}`); }
    }
  } finally { await browser.close(); }
  const report = { checkedAt: new Date().toISOString(), expectedSha: process.env.EXPECTED_DEPLOYMENT_SHA ?? null, networkRecordingVerified: false, note: "Redirects and issued URL preservation do not prove network reporting, commission eligibility or a sale.", verifiedModels: records.length, failures, records };
  mkdirSync(".task-work", { recursive: true });
  writeFileSync(".task-work/commercial-production.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ verifiedModels: records.length, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
