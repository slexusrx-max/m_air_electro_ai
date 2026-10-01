import { test } from "node:test";
import assert from "node:assert/strict";
import config from "../next.config";

test("document CSP allows Turnstile scripts and frames without allowing arbitrary scripts", async () => {
  const rules = await config.headers!();
  const csp = rules.find(rule => rule.source === "/(.*)")!.headers.find(header => header.key === "Content-Security-Policy")!.value;
  const directives = new Map(csp.split(";").filter(value => value.trim()).map(value => {
    const [name, ...sources] = value.trim().split(/\s+/);
    return [name, sources];
  }));
  assert.ok(directives.get("script-src")!.includes("https://challenges.cloudflare.com"));
  assert.deepEqual(directives.get("frame-src"), ["'self'", "https://challenges.cloudflare.com"]);
  assert.ok(!directives.get("script-src")!.includes("https:"));
  assert.deepEqual(directives.get("frame-ancestors"), ["'none'"]);
  assert.deepEqual(directives.get("object-src"), ["'none'"]);
});
