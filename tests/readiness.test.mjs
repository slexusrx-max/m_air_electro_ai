import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

const env = { NEXT_PUBLIC_SITE_URL: "https://energy.example.org", CONTACT_EMAIL_VERIFIED: "true", NEXT_PUBLIC_CONTACT_EMAIL: "contact@energy.example.org", CONTACT_FROM_EMAIL: "contact@energy.example.org", CONTACT_FORM_ENABLED: "true", BREVO_SMTP_LOGIN: "test-login", BREVO_SMTP_KEY: "dummy", NEXT_PUBLIC_TURNSTILE_SITE_KEY: "dummy", TURNSTILE_SECRET_KEY: "dummy" };
const config = (values = env) => load("lib/site.ts", {}, { process: { env: values } });

test("absolute URL resolution is idempotent and never prefixes an existing origin", () => {
  const site = config({ NEXT_PUBLIC_SITE_URL: "https://mairelectroai.com" });
  for (const value of ["/", "https://mairelectroai.com/"]) {
    assert.equal(site.absoluteUrl(value), "https://mairelectroai.com/");
  }
  for (const value of ["/marketplace", "marketplace", "https://mairelectroai.com/marketplace"]) {
    assert.equal(site.absoluteUrl(value), "https://mairelectroai.com/marketplace");
    assert.equal(site.absoluteUrl(site.absoluteUrl(value)), site.absoluteUrl(value));
  }
  assert.equal(site.absoluteUrl("/search?q=100ah#results"), "https://mairelectroai.com/search?q=100ah#results");
  assert.equal(site.absoluteUrl("https://images.example.org/card.png"), "https://images.example.org/card.png");
});

test("URL validation rejects nested schemes and repeated hosts without rejecting query values", () => {
  const site = config();
  for (const value of [
    "/https://mairelectroai.com/", "/http://mairelectroai.com/", "/https:/mairelectroai.com/",
    "https://mairelectroai.com/https://mairelectroai.com/",
    "/https%3A%2F%2Fmairelectroai.com/", "/https%253A%252F%252Fmairelectroai.com/",
    "https://mairelectroai.com/mairelectroai.com/",
  ]) {
    assert.equal(site.isMalformedHttpUrl(value, "https://mairelectroai.com"), true, value);
    assert.throws(() => config({ NEXT_PUBLIC_SITE_URL: "https://mairelectroai.com" }).absoluteUrl(value), undefined, value);
  }
  for (const value of ["/", "/marketplace", "https://mairelectroai.com/", "/search?q=https%3A%2F%2Fmairelectroai.com", "/auth/callback?next=/reset-password"]) {
    assert.equal(site.isMalformedHttpUrl(value, "https://mairelectroai.com"), false, value);
  }
  for (const value of ["javascript:alert(1)", "data:text/html,test", "//elsewhere.org", "https://user:pass@example.org/"]) {
    assert.throws(() => site.absoluteUrl(value), undefined, value);
  }
});
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
  for (const accepted of [true, false]) {
    const calls = [];
    const response = await handler(request(), async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return Response.json({ success: true, hostname: "energy.example.org", action: "contact" });
    }, async (mail) => { calls.push(mail); return accepted; });
    assert.equal(response.status, accepted ? 200 : 502);
    assert.equal(calls[1].email, "test@example.org");
    assert.equal(calls[1].message, "A sufficiently detailed test message.");
    assert.equal((await response.json()).code, accepted ? "accepted" : "failed");
  }
  assert.equal((await handler(request(), async () => Response.json({ success: true, hostname: "energy.example.org", action: "contact" }), async () => { throw Error("SMTP unavailable"); })).status, 502);
});
test("Brevo transport uses STARTTLS and the verified sender without exposing a visitor as From", async () => {
  let transportOptions, mailOptions;
  const mailer = { createTransport(options) {
    transportOptions = options;
    return { async sendMail(options) { mailOptions = options; return { accepted: [env.NEXT_PUBLIC_CONTACT_EMAIL] }; } };
  } };
  const contact = load("lib/contact.ts", { "./site": config(), nodemailer: { default: mailer } }, { process: { env } });
  assert.equal(await contact.deliverContactMail({ name: "Test", email: "visitor@example.org", message: "A test enquiry." }), true);
  assert.equal(transportOptions.host, "smtp-relay.brevo.com");
  assert.equal(transportOptions.port, 587);
  assert.equal(transportOptions.requireTLS, true);
  assert.equal(transportOptions.auth.user, env.BREVO_SMTP_LOGIN);
  assert.equal(mailOptions.from.address, env.CONTACT_FROM_EMAIL);
  assert.equal(mailOptions.to.address, env.NEXT_PUBLIC_CONTACT_EMAIL);
  assert.equal(mailOptions.replyTo.address, "visitor@example.org");
  assert.equal(mailOptions.html, undefined);
  assert.equal(transportOptions.secure, false);
  assert.equal(transportOptions.connectionTimeout, 10000);
  assert.equal(transportOptions.greetingTimeout, 10000);
  assert.equal(transportOptions.socketTimeout, 15000);
});

test("contact rejects address lists, header injection, malformed JSON and excessive inputs without delivery", async () => {
  const site = config();
  const handler = load("lib/contact.ts", { "./site": site }, { process: { env }, TextDecoder }).handleContact;
  const base = { name: "Audit", email: "audit@example.org", message: "An isolated, mock-only test message.", consent: true, website: "", token: "dummy" };
  let calls = 0;
  const noNetwork = async () => { calls++; throw Error("Unexpected network"); };
  const request = (body, type = "application/json") => new Request(env.NEXT_PUBLIC_SITE_URL + "/api/contact", { method: "POST", headers: { origin: env.NEXT_PUBLIC_SITE_URL, "Content-Type": type }, body });
  for (const email of ["a,b@example.org", "a;Bcc:x@example.org", "a\r\nBcc:x@example.org", '"a"@example.org', "a(comment)@example.org", "a@bad..org"]) {
    assert.equal(site.isSingleMailbox(email), false);
    assert.equal((await handler(request(JSON.stringify({ ...base, email })), noNetwork, noNetwork)).status, 400);
    assert.equal(config({ ...env, CONTACT_FROM_EMAIL: email }).verifiedMailbox(email), undefined);
  }
  for (const data of [{ ...base, name: "x".repeat(101) }, { ...base, message: "x".repeat(4001) }, { ...base, token: "x".repeat(2049) }, []]) {
    assert.equal((await handler(request(JSON.stringify(data)), noNetwork, noNetwork)).status, 400);
  }
  assert.equal((await handler(request("{"), noNetwork, noNetwork)).status, 400);
  assert.equal((await handler(request(JSON.stringify(base), "text/plain"), noNetwork, noNetwork)).status, 415);
  assert.equal(calls, 0);
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
