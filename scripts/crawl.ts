import { writeFileSync, mkdirSync } from "node:fs";
import { publicRoutes } from "../lib/marketplace/routes";
import { isMalformedHttpUrl } from "../lib/site";
async function main() {
  const base = (process.env.TEST_BASE_URL ?? "http://localhost:3100").replace(
    /\/$/,
    "",
  );
  const queue = ["/"];
  const seen = new Set<string>();
  const failures: string[] = [];
  const redirects: string[] = [];
  const details: { path: string; status: number; links: number }[] = [];
  const decode = (s: string) =>
    s
      .replaceAll("&amp;", "&")
      .replaceAll("&#x27;", "'")
      .replaceAll("&quot;", '"');
  while (queue.length && seen.size < 250) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    try {
      const response = await fetch(new URL(path, `${base}/`), {
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
      });
      const html = await response.text();
      if (isMalformedHttpUrl(response.url)) failures.push(`Malformed redirect destination ${path}: ${response.url}`);
      if (response.status !== 200) failures.push(`${response.status} ${path}`);
      if (response.redirected)
        redirects.push(`${path} -> ${new URL(response.url).pathname}`);
      let count = 0;
      for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
        const href = decode(match[1]);
        if (!href || href === "#" || href.startsWith("javascript:")) {
          failures.push(`Dead link ${path}: ${href}`);
          continue;
        }
        if (/^(mailto:|tel:)/.test(href)) continue;
        const url = new URL(href, new URL(path, `${base}/`));
        if (isMalformedHttpUrl(url.href)) {
          failures.push(`Embedded origin in link ${path}: ${href}`);
          continue;
        }
        if (url.origin !== new URL(base).origin) continue;
        if (url.pathname.includes("//") || url.pathname.includes("undefined"))
          failures.push(`Malformed ${path}: ${href}`);
        if (
          url.hash &&
          url.pathname === path &&
          !html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)
        )
          failures.push(`Missing anchor ${path}: ${href}`);
        if (
          !/\.[a-z0-9]+$/i.test(url.pathname) &&
          !url.pathname.startsWith("/api/") &&
          !seen.has(url.pathname)
        ) {
          queue.push(url.pathname);
          count++;
        }
      }
      details.push({ path, status: response.status, links: count });
    } catch (e) {
      failures.push(`${path}: ${String(e)}`);
    }
  }
  const orphans = publicRoutes.filter((path) => !seen.has(path));
  const report = {
    base,
    checkedAt: new Date().toISOString(),
    visited: seen.size,
    failures,
    orphans,
    redirects,
    details,
  };
  mkdirSync("test-results", { recursive: true });
  writeFileSync(
    `test-results/crawl-${base.includes("localhost") ? "local" : "production"}.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      { base, visited: seen.size, failures, orphans, redirects },
      null,
      2,
    ),
  );
  if (failures.length || orphans.length) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
