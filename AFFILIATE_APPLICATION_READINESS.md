# Renogy EU / Impact application readiness

## Current authoritative status — 24 September 2026

**NOT READY — final release verification is in progress.** The code corrections are being tested; the current production release still contains superseded contact/editorial presentation. This is a release gate, not a requirement to obtain affiliate approval before applying.

This file supersedes historical readiness checklists. See the dated files under `docs/` only for historical deployment evidence. No application, live contact message, purchase or user-account creation is performed by this audit.

## COMPLETED

- Official brand/platform: M Air Electro AI. Owner and publisher: **Stanislav Zavizion**, an **individual / independent publisher** operating in **Romania** for **Romania / European Union**. No incorporated company, registration, tax ID, private address or professional credentials are invented.
- Official domain: **https://mairelectroai.com**. The www hostname permanently redirects to the apex; canonical, sitemap and structured-data URLs use the apex.
- Owner-confirmed Cloudflare Email Routing is active for `contact@mairelectroai.com`, `partnerships@mairelectroai.com` and `privacy@mairelectroai.com`. The owner confirmed an actual external-message receipt test for **contact**. The other two routes are active; individual receipt tests are not claimed.
- Public brand contact uses the domain addresses. Gmail is no longer published as the primary contact. GitHub issues remain an optional public technical channel.
- Website form and outbound SMTP/send-as remain separately disabled/unverified. Public pages show an honest unavailable form notice, with usable email links.
- Publisher identity is separate from article authorship and human technical review. Source/methodology disclosures remain visible; no author, publication or human-review date is manufactured.
- Marketplace-first architecture, original M/head hero, route-family artwork and RO/EN behavior are preserved.
- Renogy/Impact approval is not confirmed. Ordinary EU supplier links remain active; affiliate tracking is disabled.

## VERIFIED

- Baseline GitHub main / successful Vercel deployment: `9a3c4ced89959092f3ee7d05c7cd5fd0bf5bde0f`.
- Baseline production crawl: **113 routes, zero failures, zero orphans**.
- Current Renogy audit: **7 models / 7 exact official EU URLs / 7 HTTP 200 responses**, no region redirects or malformed destinations. [Field-level source audit](docs/renogy-source-audit.md).
- Final local and production test results will be recorded here after the release checks complete. Passing builds are not substituted for public browser/crawl evidence.

## NOT REQUIRED TO APPLY

- Renogy approval or Impact tracking activation before the application itself.
- Outbound SMTP/send-as or an operational website form when working email contact is available and the form is clearly unavailable.
- An invented incorporated company, corporate identifiers, office, employees, credentials or verified professional directory.
- Fabricated traffic, conversions, historic sales, product prices, stock, reviews or ratings. If audience evidence is requested and none is available, state that honestly.
- A claim of hands-on product testing or human technical sign-off where no such record exists. Source-based desk research and preliminary calculations are described as such.

## EXTERNAL / PENDING

- Final deployment and production regression verification are still in progress for this release.
- Vercel's four non-secret contact variables are prepared; automatic approval review requires a fresh user confirmation before saving them. This does not prevent the confirmed public email links from being represented accurately in code.
- The precise Renogy EU advertiser/campaign, eligible destinations/territories and contract terms must be checked in the actual Impact application/account flow. Approval, commissions and tracking terms are not assumed.
- Google Search Console verification/indexing is not claimed. Follow [setup instructions](docs/custom-domain-and-publisher.md): add the apex Domain property, verify using the provided DNS record, submit `https://mairelectroai.com/sitemap.xml`, inspect representative URLs and review indexing reports.
- Optional outbound/form activation requires its own sender-domain, Resend, Turnstile and authorized delivery validation. Optional analytics requires real configuration/consent and genuine data.

## Production contact configuration

```dotenv
NEXT_PUBLIC_CONTACT_EMAIL=contact@mairelectroai.com
NEXT_PUBLIC_PARTNERSHIPS_EMAIL=partnerships@mairelectroai.com
NEXT_PUBLIC_PRIVACY_EMAIL=privacy@mairelectroai.com
CONTACT_EMAIL_VERIFIED=true
```

Keep `CONTACT_FORM_ENABLED=false`, `RENOGY_AFFILIATE_APPROVED=false` and `AFFILIATE_TRACKING_ENABLED=false` until their separate requirements are actually met. Missing flags fail closed. Do not publish secrets or private provider details.

## Application next action after release verification

Apply to the verified Renogy EU campaign through Impact using the official website, the actual individual publisher identity/country and `partnerships@mairelectroai.com`. Describe independent Romanian/English educational equipment discovery, calculations and comparison. Supply example guides, model pages and the system finder; provide audience data only if genuinely available. Submit sensitive tax/bank information only through the legitimate provider's secure application process. No application is submitted by this task.

## Evidence and history

Generated logs/screenshots stay under ignored `.task-work/final-readiness/`, `test-results/` and `playwright-report/`; unrelated `tmp/pdfs/member-deal/` is preserved. Historical documents: [23 September production audit](docs/production-completion-report.md), [14 September marketplace expansion](docs/marketplace-expansion-report.md). Their superseded owner/domain/mailbox prerequisites are not current blockers.
