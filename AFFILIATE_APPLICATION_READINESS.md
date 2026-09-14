# Renogy EU / Impact application readiness

Audit date: 14 September 2026. Verdict: **NOT READY** until the owner requirements below are evidenced. No application, email, purchase, account creation or external form submission was performed. Affiliate tracking remains inactive.

## Implemented changes

- Independent discovery/comparison/sizing positioning on the homepage, About and metadata. Equipment remains the primary discovery path; no checkout or merchant claims. Planned experts removed from primary navigation, retained transparently in the footer.
- Validated canonical origin configuration used by metadata, sitemap, robots and structured data; no fixed production alias in application source. Verified same-domain mailboxes and real publisher/editor configuration; incomplete information is visible.
- Contact form with accessible labels, length/email validation, consent, honeypot, bounded server body, origin validation, server-verified hostname/action/single-use Turnstile, fixed recipient and explicit failure/acceptance messages. Disabled until all real configuration exists. Mock-only transport tests prevent accidental mail.
- Editorial Policy, Author Policy, Corrections Policy, AI Use Policy and Media Kit / Partnerships, linked from the footer and sitemap, in RO and EN.
- Shared editorial records on guides, solutions, comparisons and product/class pages. Missing author, publication and human-review dates stay unconfirmed. TechArticle schema omits unconfirmed fields; this is valid vocabulary use but does not claim eligibility for a rich result. Product schema retains factual Product without invented offers/ratings.
- Seven exact Renogy EU product pages checked against currently listed basic fields. Supplier source checks are dated separately from human approval. No copied long descriptions, prices, stock, ratings or shipping promises.
  See the [field-level source audit](docs/renogy-source-audit.md); the legacy DCC50S product URL now displays a newer SKU, so the old revision name was removed from the visible title.
- Optional consent-gated Plausible infrastructure, withdrawal/settings and the requested three events. Bots/private routes/query data excluded; real measurement not claimed as operational before configuration.
- Responsive controls, contact/publisher layout, keyboard focus, enlarged navigation/footer targets and automated mobile/SEO/accessibility checks. Original category illustrations preserved.

## Manual owner actions / blockers

1. Supply and connect an owned custom domain; prove HTTPS and canonical/redirect behavior on it.
2. Supply real operator/editor name, verified biography, expertise and any professional profile; confirm editorial responsibility. Legal controller information must be consistent and complete.
3. Provision and verify all three domain mailboxes, delivery provider and spam keys; confirm mailbox retention, processing agreements and Privacy content. Then enable contact and personally verify delivery. No email was sent in this task.
4. Review and sign every article/guide/comparison, record real author/publication/review/source evidence in the per-page registry, and resolve any technical findings. Source extraction and passing tests are not a human editorial sign-off.
5. Configure consent-aware real analytics and collect 30–60 days of genuine reports. Share dated evidence and limitations; do not include browser QA visits.
6. Confirm the exact EU campaign in Impact and approval terms with Renogy before applying or configuring tracking. A public US campaign is insufficient evidence.

## Data that must never be invented

Identity, qualifications, registrations, addresses, domain/email ownership, author attribution, human review or publication dates, hands-on experience, visitors/conversions, geographic reach, reviews, ratings, customers, verified professionals, prices, availability, shipping guarantees, campaign ID, commission rate, attribution window, approval or contracts.

## Required application information

Owned canonical site; legal publisher identity/country and tax details requested by Impact; monitored partnerships mailbox; truthful editorial competence; RO/EN Romania/EU audience scope; independent educational promotional model; example battery-sizing guide, Core Mini comparison and system finder; original source/review workflow; real audience period/export (or truthful no-data statement); intended traffic sources and prohibited promotional methods. Submit sensitive tax/bank details only to the legitimate provider's required secure process, never in repository files.

## Correct EU campaign — separate mandatory check

The [public Renogy affiliate page](https://www.renogy.com/pages/affiliate-program) is branded US and links to Impact. This does **not** establish that its campaign covers `eu.renogy.com`, Romania, the intended publisher country or the current seven models. Confirm the exact advertiser/campaign ID, EU destination domains, eligible territories, currency, contract entity, commission/attribution terms, trademark/PPC/email/coupon rules and allowed creative use in Impact and with Renogy. Record the confirmation and date privately. Until then: affiliation not yet approved, ordinary EU links only. Do not activate existing tracking flags or paste speculative Impact links.

## Go / no-go checklist

- [ ] Owned custom domain live with HTTPS, correct canonical/OG/sitemap/robots and old-host redirects.
- [ ] Real operator/editor identity and biography published consistently.
- [ ] Domain contact, partnerships and privacy mailboxes verified; private form delivery proven by owner.
- [ ] Legal/privacy/processing/retention review complete for actual services.
- [ ] Every editorial page has confirmed author, real dates, evidence and human approval.
- [ ] All Renogy facts and regional model revisions signed off; no unsupported commercial claims.
- [ ] Genuine analytics report available or lack of data disclosed accurately to campaign manager.
- [ ] Exact EU Impact campaign and Romania/EU eligibility confirmed.
- [ ] Local quality checks and public production checks pass at the same deployed/main commit.
- [ ] Owner reviews the application before any submission; tracking still off until contract approval.

## Verification results

Local validation: lint and TypeScript pass; production build passes; 33/33 unit tests pass; 419 i18n keys pass; dependency audit reports zero vulnerabilities. Browser validation passed all 54 cases across runs: 39 existing/account/catalog/form scenarios, then 15 final visual/editorial/accessibility/SEO scenarios after correcting the Romanian menu selector and metadata. Initial contrast failures were fixed; a disabled analytics settings panel no longer opens automatically.

Responsive audit covers 320, 360, 375, 390, 414, 768, 1024 and 1440 px, plus legacy 412/430/1366 checks. Axe WCAG 2 A/AA, 2.1 AA and 2.2 AA checks report no violations on homepage, Contact, About, Media Kit, battery guide, comparison and battery calculator. Automated checks do not establish complete accessibility conformance or replace manual assistive-technology review. Keyboard navigation, focus and table scrolling also have browser coverage.

Local crawl: 113 visited URLs, no failures or orphans. Sitemap SEO audit: 108 routes, no duplicate/missing titles or descriptions. Seven Renogy EU source pages were checked separately; third-party content availability can change.

Screenshots: ignored `.task-work/readiness-local-complete/` contains 375/1440 full-page and viewport captures of homepage, About, Contact, policies, Media Kit, Privacy, battery guide, comparison and Renogy product. Production browser/crawl outputs are recorded separately in `.task-work/readiness-production/`, `.task-work/readiness-production.log`, and `.task-work/readiness-production-crawl.log` when deployment completes; the final task response states deployed/main commit verification. No live contact delivery or human identity/author verification is claimed.

Production validation at application commit `f13ad4c`: **54/54 browser cases passed** (including nine isolated component/form fixtures), 113 crawled URLs without failures/orphans, 108 sitemap routes with unique titles/descriptions, and no violations in the seven-page automated accessibility scope. GitHub main and the successful Vercel deployment matched. Production screenshots were visually reviewed at 375 and 1440 px and collected in ignored `.task-work/affiliate-review-screenshots/index.html`.

A final narrow correction removes inherited supplier-check dates from equipment classes: only actual sourced models show a supplier-check date. The added regression checks all eleven class pages and mixed comparisons at 375/1440; its local run passed. Post-deployment verification for that correction is recorded in `.task-work/readiness-classes-production.log` and the final task response. No new author/publication/human-review dates were invented.

## Configuration guide

See [custom domain and publisher setup](docs/custom-domain-and-publisher.md). Evidence belongs in ignored `.task-work/` and `test-results/`; the unrelated `tmp/pdfs/member-deal/` user folder is preserved.

## Changed files

- `.env.example`
- `AFFILIATE_APPLICATION_READINESS.md`
- `PROJECT_BLUEPRINT.md`
- `README.md`
- `app/ai-use-policy/page.tsx`
- `app/api/contact/route.ts`
- `app/author-policy/page.tsx`
- `app/calculators/battery/battery-calculator.tsx`
- `app/calculators/breaker-selection/breaker-selection-calculator.tsx`
- `app/calculators/cable-sizing/cable-sizing-calculator.tsx`
- `app/calculators/fuse-selection/fuse-selection-calculator.tsx`
- `app/calculators/generator/generator-calculator.tsx`
- `app/calculators/motor-current/motor-current-calculator.tsx`
- `app/calculators/transformer/transformer-calculator.tsx`
- `app/calculators/voltage-drop/voltage-drop-calculator.tsx`
- `app/contact/page.tsx`
- `app/corrections-policy/page.tsx`
- `app/editorial-policy/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/learn/[slug]/page.tsx`
- `app/marketplace/page.tsx`
- `app/marketplace/products/[slug]/page.tsx`
- `app/page.tsx`
- `app/partnerships/page.tsx`
- `app/solutions/[slug]/page.tsx`
- `components/analytics-consent.tsx`
- `components/analytics-event.tsx`
- `components/calculation-analytics.tsx`
- `components/contact-form.tsx`
- `components/editorial-record.tsx`
- `components/marketplace/compare-page.tsx`
- `components/marketplace/deep-footer.tsx`
- `components/marketplace/discovery-home.tsx`
- `components/marketplace/information-page.tsx`
- `components/marketplace/solar-calculator.tsx`
- `components/marketplace/solution-finder.tsx`
- `components/product/backup-calculator.tsx`
- `components/publisher-details.tsx`
- `docs/custom-domain-and-publisher.md`
- `docs/renogy-source-audit.md`
- `lib/analytics.ts`
- `lib/contact.ts`
- `lib/editorial.ts`
- `lib/marketplace/catalog-data.ts`
- `lib/marketplace/copy.ts`
- `lib/marketplace/editorial-records.json`
- `lib/marketplace/information.ts`
- `lib/marketplace/navigation.ts`
- `lib/marketplace/policies.ts`
- `lib/marketplace/routes.ts`
- `lib/marketplace/specifications.ts`
- `lib/site.ts`
- `package-lock.json`
- `package.json`
- `tests/e2e/contact-fixture.spec.ts`
- `tests/e2e/marketplace.spec.ts`
- `tests/e2e/readiness.spec.ts`
- `tests/readiness.test.mjs`
