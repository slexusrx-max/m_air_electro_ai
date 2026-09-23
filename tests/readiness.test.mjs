import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

const env = { NEXT_PUBLIC_SITE_URL: "https://energy.example.org", CONTACT_EMAIL_VERIFIED: "true", NEXT_PUBLIC_CONTACT_EMAIL: "contact@energy.example.org", CONTACT_FROM_EMAIL: "contact@energy.example.org", CONTACT_FORM_ENABLED: "true", RESEND_API_KEY: "dummy", NEXT_PUBLIC_TURNSTILE_SITE_KEY: "dummy", TURNSTILE_SECRET_KEY: "dummy" };
const config = (values = env) => load("lib/site.ts", {}, { process: { env: values } });
test("canonical origin is validated; only confirmed same-domain mailboxes are displayed", () => {
  assert.equal(config().getSiteUrl(), env.NEXT_PUBLIC_SITE_URL);
  assert.equal(config().siteConfig.contactEmail, env.NEXT_PUBLIC_CONTACT_EMAIL);
  assert.equal(config({ ...env, CONTACT_EMAIL_VERIFIED: "false" }).siteConfig.contactEmail, undefined);
  assert.equal(config({ ...env, NEXT_PUBLIC_CONTACT_EMAIL: "contact@elsewhere.org" }).siteConfig.contactEmail, undefined);
  for (const url of ["javascript:alert(1)", "https://user:pass@domain.org", "https://domain.org/path", "http://domain.org", "https://domain.org?x=1"]) {
    assert.throws(() => config({ ...env, NEXT_PUBLIC_SITE_URL: url }).getSiteUrl());
  }
  assert.equal(config({ VERCEL_PROJECT_PRODUCTION_URL: "preview.example.org" }).getSiteUrl(), "https://mairelectroai.com");
  for (const host of ["www.mairelectroai.com", "m-air-electro-ai.vercel.app"]) assert.equal(config({ NEXT_PUBLIC_SITE_URL: `https://${host}` }).getSiteUrl(), "https://mairelectroai.com");
  assert.equal(config({ NEXT_PUBLIC_SITE_URL: "http://localhost:3100" }).getSiteUrl(), "http://localhost:3100");
});
test("contact rejects invalid origin, disabled configuration, missing consent, honeypots and oversize bodies before network", async () => {
  const handler = load("lib/contact.ts", { "./site": config() }, { process: { env }, TextDecoder }).handleContact;
  const base = { name: "Test", email: "test@example.org", message: "A sufficiently detailed test message.", consent: true, website: "", token: "dummy" };
  let calls = 0;
  const noSend = async () => { calls++; throw Error("Unexpected network"); };
  const request = (data, origin = env.NEXT_PUBLIC_SITE_URL) => new Request(origin + "/api/contact", { method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(data) });
  assert.equal((await handler(request(base, "https://attacker.example"), noSend)).status, 403);
  for (const data of [{ ...base, consent: false }, { ...base, website: "spam" }, { ...base, email: "bad\r\nmail" }, { ...base, message: "x" }, { ...base, token: "" }, null]) assert.equal((await handler(request(data), noSend)).status, 400);
  assert.equal((await handler(request({ ...base, message: "x".repeat(20000) }), noSend)).status, 413);
  const disabled = load("lib/contact.ts", { "./site": config() }, { process: { env: {} }, TextDecoder }).handleContact;
  assert.equal((await disabled(request(base), noSend)).status, 503);
  assert.equal(calls, 0);
});
test("contact requires successful hostname/action challenge and reports provider acceptance honestly (mocked network only)", async () => {
  const handler = load("lib/contact.ts", { "./site": config() }, { process: { env }, TextDecoder }).handleContact;
  const request = () => new Request(env.NEXT_PUBLIC_SITE_URL + "/api/contact", { method: "POST", headers: { origin: env.NEXT_PUBLIC_SITE_URL, "Content-Type": "application/json" }, body: JSON.stringify({ name: "Test", email: "test@example.org", message: "A sufficiently detailed test message.", consent: true, website: "", token: "dummy" }) });
  for (const challenge of [{ success: false }, { success: true, hostname: "attacker.example", action: "contact" }, { success: true, hostname: "energy.example.org", action: "login" }]) {
    let calls = 0;
    assert.equal((await handler(request(), async () => { calls++; return Response.json(challenge); })).status, 403);
    assert.equal(calls, 1);
  }
  for (const status of [200, 500]) {
    const calls = [];
    const response = await handler(request(), async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return calls.length === 1 ? Response.json({ success: true, hostname: "energy.example.org", action: "contact" }) : Response.json(status === 200 ? { id: "mock-id" } : {}, { status });
    });
    assert.equal(response.status, status === 200 ? 200 : 502);
    assert.deepEqual(calls[1].body.to, [env.NEXT_PUBLIC_CONTACT_EMAIL]);
    assert.equal(calls[1].body.reply_to, "test@example.org");
    assert.equal((await response.json()).code, status === 200 ? "accepted" : "failed");
  }
});
test("analytics needs current consent, excludes private/query data, bots, local hosts and DNT", () => {
  let saved = null; const calls = [];
  const nav = { doNotTrack: "0", webdriver: false };
  const location = { hostname: "energy.example.org", origin: env.NEXT_PUBLIC_SITE_URL, pathname: "/compare", search: "?email=private" };
  const analytics = load("lib/analytics.ts", {}, { process: { env: { NEXT_PUBLIC_PLAUSIBLE_DOMAIN: location.hostname } }, window: { location }, navigator: nav, localStorage: { getItem: () => saved }, fetch: (...args) => { calls.push(args); return Promise.resolve(); } });
  analytics.trackEvent("comparison_view"); assert.equal(calls.length, 0);
  saved = JSON.stringify({ choice: "accepted", at: Date.now() });
  analytics.trackEvent("comparison_view"); assert.equal(calls.length, 1);
  assert.equal(JSON.parse(calls[0][1].body).url, env.NEXT_PUBLIC_SITE_URL + "/compare");
  nav.webdriver = true; analytics.trackEvent("pageview"); assert.equal(calls.length, 1);
  nav.webdriver = false; nav.doNotTrack = "1"; analytics.trackEvent("pageview"); assert.equal(calls.length, 1);
  nav.doNotTrack = "0"; location.pathname = "/dashboard/client"; analytics.trackEvent("pageview"); assert.equal(calls.length, 1);
  location.pathname = "/"; saved = JSON.stringify({ choice: "accepted", at: 0 }); analytics.trackEvent("pageview"); assert.equal(calls.length, 1);
});
