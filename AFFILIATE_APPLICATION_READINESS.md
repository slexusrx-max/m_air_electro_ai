# Renogy EU / Impact application readiness

## Current authoritative status — 1 October 2026

**NOT READY TO APPLY.** The authorized production contact submission returned HTTP 400 before SMTP. Turnstile completion, Brevo acceptance and recipient inbox receipt remain unverified. The 24 September READY result is historical and is not evidence for this release.

This is the single authoritative release/contact status. Configuration guides describe procedures; dated audit documents are historical snapshots.

## Narrow contact follow-up — 1 October 2026

Owner scope: diagnose the HTTP 400 / Turnstile failure, correct its cause, perform exactly one real retry, independently verify Brevo acceptance and recipient receipt, and update this report. No other site behavior or affiliate configuration is in scope. The owner retains the Renogy GO decision.

- Starting follow-up production/main: `4bdfbbcdc78d7727e8e7ef284430efcb6a7311b4`.
- The failed attempt had no completed Turnstile token. The client previously permitted submission with an empty token, which the server correctly rejected with HTTP 400 before SMTP. A rendered widget did not establish successful challenge completion.
- Contact-only correction: keep submission unavailable until the success callback supplies a token; guard submission itself; invalidate tokens on expiry, timeout and error; remove/reset the widget after an attempt. Display the check's state without exposing its token. Server-side hostname/action/token verification and SMTP settings are unchanged.
- Verification before deployment: 67 unit tests passed; lint, typecheck and build passed; isolated browser regression passed for empty-token prevention, expiry/error/timeout invalidation, fresh-token retry, failure retention and honest acceptance messaging. The fixture sends no live messages and mocks every network route.
- One real retry is authorized but **has not been sent**. Production challenge completion, Brevo acceptance and inbox receipt remain pending. The correction does not itself prove the challenge can be completed in the audit browser.
- Follow-up deployment identity and live-test evidence are maintained in ignored `.task-work/contact-followup/`. The earlier full audit below is baseline evidence, not a claim that its full suite was repeated for this focused change.

## Prior full-audit source and deployment

- Initial local checkout: `50b8722261b79af7a59f664ca9687dd56af34907`, branch `main`, behind remote by three commits. No tracked local modifications; unrelated `tmp/pdfs/member-deal/` preserved.
- Starting audited GitHub/main SHA: `eeef5bc30c42673755d57384bf503ce00e4ee4cd`. Local main was fast-forwarded to it.
- Starting Vercel Production: `Gk8NSuwTbHwCSJNVyvn2KUzR4QHj`, Ready / Current, official domain attached, source equals that complete SHA.
- Audited application release: `5e651870102f36e13c86ff944bc4e243fa89397c`, pushed to GitHub main and deployed as Vercel `2MhPKuu5Axmk4iEHXvT54L3bXNhg`, Ready / Current Production, with the official apex attached. GitHub and Vercel source SHAs matched.
- Prior audit closeout: `4bdfbbcdc78d7727e8e7ef284430efcb6a7311b4`; only this report and `.env.example` comments changed from the fully tested application release. Its deployment identity was verified in ignored `.task-work/release-audit/release-final.json`. The newer contact follow-up is recorded above.

## Identity, domain and commercial facts

M Air Electro AI is a brand/platform owned and published by **Stanislav Zavizion**, an **individual / independent publisher** in **Romania**, serving **Romania / European Union**. There is no incorporated company. Ownership does not establish article authorship, credentials, product testing or human technical review.

The official public domain is **https://mairelectroai.com**. The apex returned 200, www returned permanent 308 to the apex, and robots/sitemap returned 200 with apex URLs. A stale Vercel `NEXT_PUBLIC_SITE_URL` value was corrected to the official apex; application normalization already protected public canonicals.

Renogy approval remains unconfirmed. Tracking is inactive; no Impact link/ID or dealer/reseller relationship is invented. The two activation flags are absent in the inspected project environment and therefore fail closed, equivalent to false. Ordinary exact Renogy EU supplier URLs remain published. Absence of affiliate approval or historical audience data is not a blocker to applying.

## Contact and provider state

- Cloudflare Email Routing is owner-confirmed active for `contact@mairelectroai.com`, `partnerships@mairelectroai.com` and `privacy@mairelectroai.com`. Actual external inbound receipt is confirmed for contact only.
- Supabase auth-email receipt was separately confirmed on 30 September. It does not prove contact-form receipt.
- The website currently implements Brevo SMTP, `smtp-relay.brevo.com:587`, required STARTTLS, fixed verified sender/recipient, and visitor address in Reply-To only. SMTP acceptance is not inbox delivery.
- The production form is enabled (`CONTACT_FORM_ENABLED=true`, `CONTACT_EMAIL_VERIFIED=true`). It is not accurate to describe it as disabled. The sender and three public mailbox values match the intended domain addresses. All required Brevo and Turnstile variables were present with Production scope. No credential values were printed.
- Public DNS shows Cloudflare MX/SPF, Brevo domain verification, both Brevo DKIM CNAMEs with resolvable public keys, and DMARC. Current Brevo dashboard authentication status and actual delivered-message authentication remain unverified because the dashboard requires sign-in. DNS presence alone does not prove provider acceptance or delivery.
- Turnstile scripts/frames load and the real widget displays “Verify you are human” at desktop and mobile sizes. No first-party hydration/runtime or CSP errors were observed. The automated browser did not obtain a completed token; third-party challenge warnings and a `brunhild.challenges.cloudflare.com` DNS failure were observed. That network failure is not established as the root cause. Production keys/security were preserved.
- **Authorized real form test: exactly one submission at 13:41:37 Europe/Bucharest on 1 October 2026; `/api/contact` returned HTTP 400.** The UI correctly said the message was not sent and retained the email fallback. No completed Turnstile token was observed; the request was rejected before SMTP. Brevo acceptance and inbox receipt are **not confirmed**. No retry has been performed; CAPTCHA action confirmation/user completion and provider/inbox verification remain outstanding.
- The test used the clearly labelled “M Air Production Test” identity and public contact mailbox, with the owner's authorized production-verification message. No purchase, account creation or other live message was submitted.

## Vercel Production environment inventory (no secrets)

| Variable | Presence |
| --- | --- |
| NEXT_PUBLIC_SITE_URL | PRESENT; official apex correction deployed |
| NEXT_PUBLIC_CONTACT_EMAIL | PRESENT |
| NEXT_PUBLIC_PARTNERSHIPS_EMAIL | PRESENT |
| NEXT_PUBLIC_PRIVACY_EMAIL | PRESENT |
| CONTACT_EMAIL_VERIFIED | PRESENT |
| CONTACT_FORM_ENABLED | PRESENT; enabled production form observed |
| CONTACT_FROM_EMAIL | PRESENT |
| BREVO_SMTP_LOGIN | PRESENT |
| BREVO_SMTP_KEY | PRESENT (Secret) |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | PRESENT |
| TURNSTILE_SECRET_KEY | PRESENT (Secret) |
| RENOGY_AFFILIATE_APPROVED | MISSING; effective false |
| AFFILIATE_TRACKING_ENABLED | MISSING; effective false |
| RENOGY_IMPACT_LINKS_JSON | MISSING; ordinary supplier links |

## Audit findings and corrections

- Fixed the CSP regression test's incorrect `/s+/` whitespace split; baseline was 65 passing / 1 failing.
- Corrected the public privacy page and current operations guides from Resend to Brevo SMTP; marked superseded reports as historical.
- Updated browser tests to assert the explicit production-enabled/local-disabled contact state, retaining disabled-state coverage and blocking test submissions where applicable.
- Rejected mailbox lists/header syntax and passed structured single-address recipient/Reply-To objects to Nodemailer. Sender remains configured and visitor-independent; content remains plain text.
- Patched lockfile dependencies from Next.js 16.3.5 to 16.3.8 and vulnerable brace-expansion versions. Initial audit: one critical / one high; after compatible updates: zero vulnerabilities.

## Prior full-audit verification results

- Unit tests: 67 passed / 0 failed; i18n: 419 declared keys; lint, typecheck and production build passed.
- Local crawl: 114 routes, zero failures, zero orphans, zero redirects.
- Full local Playwright: 105 passed / 0 failed (6.9 minutes). Full production Playwright: 105 passed / 0 failed (20.4 minutes), without reducing coverage. Automated WCAG 2.2 AA axe checks passed on all seven covered pages with zero violations; this is bounded automated coverage, not a claim of universal accessibility certification.
- Supplier audit: 7 exact official EU URLs, all HTTP 200, no non-EU redirects, malformed URLs or failures. Current official product titles match the seven published models. Prices, stock, ratings and shipping promises remain unknown/unpublished.
- [Renogy EU shipping policy](https://eu.renogy.com/pages/shipping-policy) lists Romania; product/order-specific availability and charges must be confirmed with the merchant. This is not a platform shipping promise.
- Production crawl: 114 routes visited, zero internal HTTP failures, zero orphan public routes, zero redirects/redirect loops, zero unvisited public routes; no malformed internal URLs found.
- Additional real Turnstile/contact rendering checks at 390, 430, 768, 1366 and 1440px: readable form/widget and no horizontal overflow. These read-only checks blocked contact POSTs and did not send additional messages.
- Production functional coverage includes homepage, marketplace, desktop/mega/mobile menus, categories/subcategories/products, ordinary supplier links, search, comparison, solutions, Learn, FAQ, About, Contact, privacy/terms/disclosure/partnerships and RO/EN navigation. Backup, battery, solar and all other engineering calculators respond to valid and invalid input in both languages.
- Historical Find My Solution regression passed at 390px: full wizard, visible/focused result, back/forward step navigation, changing backup hours and recalculating from 1400 Wh to 2800 Wh, validation and unsupported-region empty state.
- Canonical/domain, structured data, robots/manifest consistency, RO/EN metadata, safe navigation and factual publisher identity checks passed. No invented company, technical reviewer, reviews or affiliate approval is added by the factual model.
- Responsive checks cover 390, 430, 768, 1366 and 1440px, plus additional small/tablet widths. Keyboard menus/FAQ, focus, forms, tables, calculators, footer, reduced motion and layout overflow checks passed. Mobile homepage, marketplace, product, finder and contact screenshots were inspected; the original artwork and route-family visual system remain intact.
- Prior documentation deployment identity and subsequent production smoke evidence are recorded in the separate closeout evidence described above. That documentation closeout changed no application behavior from the fully tested application SHA; the newer contact correction is recorded separately above.

## Security and application review

The endpoint requires the exact canonical Origin, JSON content, a streamed body of at most 16,000 bytes, bounded input lengths, explicit consent and an empty honeypot. It verifies every Turnstile token server-side with success, hostname and `contact` action checks; tokens are not cached or bypassed. Cloudflare's single-use/expiry rules remain authoritative. Visitor input never controls From or subject and is sent as plain text, preventing HTML-body injection. Single-mailbox validation and structured addresses reject header/list injection. SMTP uses required STARTTLS with normal certificate verification, 10-second connection/greeting and 15-second socket timeouts; Turnstile verification has a 10-second timeout. Provider failures return generic errors, and application code does not log credentials or message payloads.

- Renogy affiliate-manager view: marketplace-first RO/EU discovery, comparison, calculations and source links remain intact; no approval, audience, sales or supplier inventory is invented.
- Impact reviewer view: individual publisher identity, merchant responsibility, privacy and disclosures are clear. The stale privacy-provider reference was corrected. Contact delivery is the remaining material verification gap.
- Romanian customer view: Romanian remains primary with English switching; email fallback is usable. The form's failed live attempt is explicitly recorded rather than presented as successful delivery.

## Application decision boundary

Do not submit the Renogy application during this audit. A GO requires current main deployed, clean production regression, usable truthful contact, working commercial flows, correct canonical/domain, safely inactive tracking and accurate current documentation. Contact-provider acceptance and inbox receipt must be reported separately, without fabrication.

Concrete contact blocker: complete the real Turnstile challenge and, after addressing the failed attempt, verify one authorized retry succeeds through API acceptance, Brevo SMTP acceptance and the destination inbox. Confirm current Brevo authentication in the provider dashboard or authenticated delivery evidence. The existing successful inbound-email test and DNS records do not substitute for this contact-form test. Lack of affiliate approval or historical traffic is not a blocker.

## Evidence and historical records

Logs and screenshots: ignored `.task-work/release-audit/`, `test-results/` and `playwright-report/`. Historical reports under `docs/` preserve their original dated evidence; none overrides this current status. No purchase, account creation, affiliate activation or Renogy application is authorized by this audit.
