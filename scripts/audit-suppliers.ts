import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { catalog } from "../lib/affiliate/catalog";

export function validSupplierUrl(href: string) {
  try {
    const url = new URL(href);
    return (
      url.protocol === "https:" &&
      url.hostname === "eu.renogy.com" &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      /^\/products\/[^/]+\/?$/.test(url.pathname) &&
      !decodeURIComponent(url.pathname).includes("://")
    );
  } catch {
    return false;
  }
}

export function supplierOutcome(status: number, finalUrl: string) {
  if (!validSupplierUrl(finalUrl)) return "destination-needs-review";
  if ([401, 403, 429].includes(status)) return "automated-access-blocked";
  if (status >= 200 && status < 300) return "reachable";
  return "http-needs-review";
}

async function main() {
  const results: {
    href: string;
    valid: boolean;
    outcome: ReturnType<typeof supplierOutcome> | "invalid-url" | "network-unverified";
    status?: number;
    finalUrl?: string;
    regionalDestination?: boolean;
    error?: string;
    causeCode?: string;
  }[] = [];
  const urls = new Set(
    catalog.flatMap((p) => [p.productUrl, p.affiliateUrl, ...p.sourceUrls]).filter(Boolean),
  );
  for (const href of urls) {
    const valid = validSupplierUrl(href);
    if (!valid) {
      results.push({ href, valid, outcome: "invalid-url" });
      continue;
    }
    try {
      const response = await fetch(href, {
        signal: AbortSignal.timeout(30000),
        redirect: "follow",
      });
      results.push({
        href,
        valid,
        status: response.status,
        finalUrl: response.url,
        regionalDestination: new URL(response.url).hostname === "eu.renogy.com",
        outcome: supplierOutcome(response.status, response.url),
      });
      await response.body?.cancel();
    } catch (error) {
      const cause = error instanceof Error ? error.cause : undefined;
      const causeCode = cause && typeof cause === "object" && "code" in cause
        ? String(cause.code)
        : undefined;
      results.push({ href, valid, outcome: "network-unverified", error: String(error), causeCode });
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
