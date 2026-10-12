import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { catalog } from "../lib/affiliate/catalog";
import { validSupplierUrl } from "../lib/affiliate/suppliers";
export { validSupplierUrl } from "../lib/affiliate/suppliers";

export function supplierOutcome(status: number, finalUrl: string, provider?: string) {
  if (!validSupplierUrl(finalUrl, provider)) return "destination-needs-review";
  if ([401, 403, 429].includes(status)) return "automated-access-blocked";
  if (status >= 200 && status < 300) return "reachable";
  return "http-needs-review";
}

async function main() {
  const results: {
    provider: string;
    href: string;
    valid: boolean;
    outcome: ReturnType<typeof supplierOutcome> | "invalid-url" | "network-unverified";
    status?: number;
    finalUrl?: string;
    regionalDestination?: boolean;
    error?: string;
    causeCode?: string;
  }[] = [];
  const urls = new Map(catalog.flatMap(p =>
    [p.productUrl, p.affiliateUrl, ...p.sourceUrls].filter(Boolean)
      .map(href => [`${p.provider}:${href}`, { href, provider: p.provider }] as const)));
  for (const { href, provider } of urls.values()) {
    const valid = validSupplierUrl(href, provider);
    if (!valid) {
      results.push({ href, provider, valid, outcome: "invalid-url" });
      continue;
    }
    try {
      let finalUrl = href;
      let response: Response;
      for (let hop = 0; ; hop++) {
        response = await fetch(finalUrl, { signal: AbortSignal.timeout(30000), redirect: "manual" });
        const location = response.headers.get("location");
        if (response.status < 300 || response.status >= 400 || !location) break;
        const next = new URL(location, finalUrl).href;
        await response.body?.cancel();
        finalUrl = next;
        // Never follow redirects to another merchant, region or tracking service.
        if (!validSupplierUrl(next, provider) || hop >= 4) break;
      }
      results.push({
        href,
        provider,
        valid,
        status: response.status,
        finalUrl,
        regionalDestination: validSupplierUrl(finalUrl, provider),
        outcome: supplierOutcome(response.status, finalUrl, provider),
      });
      await response.body?.cancel();
    } catch (error) {
      const cause = error instanceof Error ? error.cause : undefined;
      const causeCode = cause && typeof cause === "object" && "code" in cause
        ? String(cause.code)
        : undefined;
      results.push({ href, provider, valid, outcome: "network-unverified", error: String(error), causeCode });
    }
  }
  const outcomes = (outcome: string) => results.filter((r) => r.outcome === outcome).length;
  const summary = {
    total: results.length,
    reachable: outcomes("reachable"),
    invalidUrls: outcomes("invalid-url"),
    destinationIssues: outcomes("destination-needs-review"),
    httpIssues: outcomes("http-needs-review"),
    automatedAccessBlocked: outcomes("automated-access-blocked"),
    networkUnverified: outcomes("network-unverified"),
  };
  const report = { checkedAt: new Date().toISOString(), scope: "All published catalog supplier and source URLs", summary, results };
  mkdirSync(".task-work", { recursive: true });
  writeFileSync(".task-work/supplier-audit.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  // Merchant blocks and local network limitations need a separate verification
  // route; they must not be reported as internal-site failures.
  if (summary.invalidUrls || summary.destinationIssues || summary.httpIssues) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
