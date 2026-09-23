import { mkdirSync, writeFileSync } from "node:fs";
import { catalog } from "../lib/affiliate/catalog";

async function main() {
  const results = [];
  for (const href of new Set(catalog.map(p => p.productUrl).filter(Boolean))) {
    const url = new URL(href);
    const valid = url.protocol === "https:" && url.hostname === "eu.renogy.com" && !url.username && !url.password && !url.search;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: "follow" });
      const final = new URL(response.url);
      results.push({ href, valid, status: response.status, finalUrl: response.url, regionalDestination: final.hostname === "eu.renogy.com", outcome: response.ok ? "reachable" : [401, 403, 429].includes(response.status) ? "automated-access-blocked" : "needs-review" });
      await response.body?.cancel();
    } catch (error) {
      results.push({ href, valid, outcome: "network-unverified", error: String(error) });
    }
  }
  const report = { checkedAt: new Date().toISOString(), results };
  mkdirSync(".task-work", { recursive: true });
  writeFileSync(".task-work/supplier-audit.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (results.some(r => !r.valid)) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
