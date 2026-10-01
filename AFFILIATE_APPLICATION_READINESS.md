# Renogy EU / Impact application readiness

## Current authoritative status — 1 October 2026

**NOT READY TO APPLY.** Final audit is in progress. The 24 September READY result is historical and is not evidence for the current release. Production regression and the authorized contact delivery verification must be completed before changing this decision.

This is the single authoritative release/contact status. Configuration guides describe procedures; dated audit documents are historical snapshots.

## Source and deployment

- Initial local checkout: `50b8722261b79af7a59f664ca9687dd56af34907`, branch `main`, behind remote by three commits. No tracked local modifications; unrelated `tmp/pdfs/member-deal/` preserved.
- Starting audited GitHub/main SHA: `eeef5bc30c42673755d57384bf503ce00e4ee4cd`. Local main was fast-forwarded to it.
- Starting Vercel Production: `Gk8NSuwTbHwCSJNVyvn2KUzR4QHj`, Ready / Current, official domain attached, source equals that complete SHA.
- Audit corrections and final deployment verification are pending in this revision. Final deployment evidence belongs in ignored `.task-work/release-audit/`.

## Identity, domain and commercial facts

M Air Electro AI is a brand/platform owned and published by **Stanislav Zavizion**, an **individual / independent publisher** in **Romania**, serving **Romania / European Union**. There is no incorporated company. Ownership does not establish article authorship, credentials, product testing or human technical review.

The official public domain is **https://mairelectroai.com**. The apex returned 200, www returned permanent 308 to the apex, and robots/sitemap returned 200 with apex URLs. A stale Vercel `NEXT_PUBLIC_SITE_URL` value was corrected to the official apex; application normalization already protected public canonicals.

Renogy approval remains unconfirmed. Tracking is inactive; no Impact link/ID or dealer/reseller relationship is invented. The two activation flags are absent in the inspected project environment and therefore fail closed, equivalent to false. Ordinary exact Renogy EU supplier URLs remain published. Absence of affiliate approval or historical audience data is not a blocker to applying.

## Contact and provider state

- Cloudflare Email Routing is owner-confirmed active for `contact@mairelectroai.com`, `partnerships@mairelectroai.com` and `privacy@mairelectroai.com`. Actual external inbound receipt is confirmed for contact only.
- Supabase auth-email receipt was separately confirmed on 30 September. It does not prove contact-form receipt.
- The website currently implements Brevo SMTP, `smtp-relay.brevo.com:587`, required STARTTLS, fixed verified sender/recipient, and visitor address in Reply-To only. SMTP acceptance is not inbox delivery.
- The production form is enabled. It is not accurate to describe it as disabled. All required Brevo and Turnstile variables were present with Production scope. No credential values were printed.
- Public DNS shows Cloudflare MX/SPF, Brevo domain verification, both Brevo DKIM CNAMEs and DMARC. Current provider UI authentication status and actual message authentication still require verification; a DNS record alone is not a delivered-message check.
- Turnstile script and frame return 200 with production CSP permissions; no CSP blockage was observed. The audit browser has not completed a challenge. Third-party challenge warnings/network errors are not a clean Turnstile success.
- **Authorized real form test: no message submitted yet; SMTP acceptance and inbox receipt are not claimed.** Brevo currently requires login in the audit browser.

## Vercel Production environment inventory (no secrets)

| Variable | Presence |
| --- | --- |
| NEXT_PUBLIC_SITE_URL | PRESENT; official apex correction saved, redeployment pending |
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

## Verification recorded so far

- Unit tests: 67 passed / 0 failed; i18n: 419 declared keys; lint, typecheck and production build passed.
- Local crawl: 114 routes, zero failures, zero orphans, zero redirects.
- Full local Playwright: 105 passed / 0 failed (6.9 minutes), including existing axe checks. Production repetition remains pending.
- Supplier audit: 7 exact official EU URLs, all HTTP 200, no non-EU redirects, malformed URLs or failures. Current official product titles match the seven published models. Prices, stock, ratings and shipping promises remain unknown/unpublished.
- [Renogy EU shipping policy](https://eu.renogy.com/pages/shipping-policy) lists Romania; product/order-specific availability and charges must be confirmed with the merchant. This is not a platform shipping promise.
- Final production crawl, responsive/axe results, contact delivery and final deployed SHA: pending.

## Application decision boundary

Do not submit the Renogy application during this audit. A GO requires current main deployed, clean production regression, usable truthful contact, working commercial flows, correct canonical/domain, safely inactive tracking and accurate current documentation. Contact-provider acceptance and inbox receipt must be reported separately, without fabrication.

Current pending gates: finish production release verification; complete the one authorized form test if Turnstile permits it; confirm recipient receipt independently or explicitly record the remaining verification gap. No lack of approval, invented company or fabricated traffic is required.

## Evidence and historical records

Logs and screenshots: ignored `.task-work/release-audit/`, `test-results/` and `playwright-report/`. Historical reports under `docs/` preserve their original dated evidence; none overrides this current status. No purchase, account creation, affiliate activation or Renogy application is authorized by this audit.
