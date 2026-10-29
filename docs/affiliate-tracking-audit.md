# Affiliate tracking audit — 27 October 2026

## Baseline and evidence
GitHub main and Vercel production match `88ff839453c1987ab688c1edf359a15a39b37b51`, tree `8883a1d78a537bc3ff73cecf7c6135334f4d1600`; deployment READY. Local working tree was clean before this change. Existing catalogue/design/RO/EN retained. No test orders or bulk tracking clicks performed.

Production homepage HTML: 63 active canonical product CTAs: Renogy 18 tracked + 1 ordinary; Waterdrop 15 tracked; PECRON 23 ordinary; BLUETTI 6 ordinary. This excludes one archived Waterdrop record (64 total catalogue records). See affiliate-canonical-links.csv. “Tracked” here describes rendered approved mapping, NOT an Impact-reported click or commission.

All eight pages of /en/renogy/catalog fetched on our domain only: 365 unique SKU rows, all previously rendered ordinary merchant URLs and lacked supplier analytics data attributes. Marketplace/search SupplierEntryCard had the same bypass. This is a confirmed implementation gap: these surfaces ignored existing approved mappings.

## Fix
A shared server-rendered RenogyFeedLink now resolves the exact feed URL through existing renogyLink and all existing approval/activation/origin gates. Both feed index and Marketplace/search reuse it. Adds public SKU identity, supplier/category/language and tracking/disclosure status to the existing delegated analytics handler. Active links visibly disclose affiliate status. No click interception, new tracking service, cookies or conversion pixel. Unmapped variants remain ordinary; no guessed IDs, SKU substitution or new deep links.

Static exact-source mapping coverage: 186 of 365 feed rows match already-reviewed mappings; 179 do not. Expected after activation: 186 tracked and 179 ordinary. See affiliate-renogy-feed-links.csv; this is exact mapping coverage until production is checked after deployment. Unmapped rows need exact programme-issued links, not a guessed conversion.

## Financial evidence matrix
| Programme | A link shape/source | B local collector receipt | C Impact clicks | G attributed actions | D confirmed/paid commission |
|---|---|---|---|---|---|
| Renogy EU 14864 / publisher 7767803 | Reviewed mappings + baseline production hrefs; no new merchant click this audit | Unverified; collector unconfigured | Unverified; sign-in wall | Unverified | Unverified |
| Waterdrop DE | 15 production tracked links; independently gated | Unverified; collector unconfigured | Unverified; sign-in wall | Unverified | Unverified |
| PECRON | 23 ordinary links; no commission claim | Unverified | Programme activation unconfirmed | Unverified | Unverified |
| BLUETTI | 6 ordinary links; last Awin status pending | Unverified | Awin, not assumed Impact | Unverified | Unverified |

The current Impact browser tab is a login form. No authenticated click/action, contract or payout reports could be read. No reporting period/timezone or earnings amount is invented. The site’s Europe/Bucharest presentation timezone is not proof of Impact report timezone. Renogy Romania eligibility is already confirmed and not reopened. Ukraine delivery/commission is a separate outstanding enquiry.

Vercel environment metadata contains affiliate flags/mappings but no NEXT_PUBLIC_PLAUSIBLE_DOMAIN. Existing trackEvent therefore returns before sending. This is a measurement configuration blocker, not evidence of missing Impact attribution. Do not configure a domain against a nonexistent subscription/project. A legitimate existing collector/project and receipt verification are needed; no service was purchased. Consent, DNT, GPC and automation exclusion remain unchanged. Existing native anchor navigation works independently of analytics. Site event counts must not be equated with Impact unique clicks.

SubId/SharedId granularity has NOT been verified in the account. No manual parameter rewrite was added to opaque issued links. Obtain platform-generated labelled links/API settings, preserve advertiser metadata, and compare matching dates/timezones/definitions in Performance by Sub ID & Shared ID. Current attribution window, coupons, reversals, excluded SKUs, paid channel restrictions and payment-profile blockers remain unverified until authenticated contract/profile access. Bank/tax data untouched.

## Verification and remaining work
TypeScript passed before build. 19 existing affiliate/Renogy tests and one new feed-link regression passed (gated href, RO/EN disclosure and public identifiers). Targeted ESLint: no errors; existing img performance warning. Catalogue validation: 77 records,64 models/products,64 photos,no errors. Local Turbopack build fails because existing node_modules symlink exits its root; webpack build is used instead. CI/preview/production results must be checked before claiming delivery. Mobile visual inspection and real collector receipt have not yet been verified. No claim of full commission readiness.

To finish external verification: sign into the existing Impact publisher account, inspect contracts/click/action reports and payment-profile status, generate approved placement labels, perform the smallest supported marked click test, and agree any conversion test with the manager before spending. Record test timestamp, programme, label, report filter/timezone and result. Do not poll tracking URLs. No sale is required to prove a technical link fix; a sale/action is required to prove conversion attribution.

## Verified release result
Fix merged in PR #34, application commit aa39c50a0b48604f97c3c70d8f80111ddeea926e; Vercel production deployment dpl_G2sYc4uUWFWERX3R5tCkkhh7Fd2X is READY. All eight production feed pages returned HTTP 200. Actual rendered coverage: **200 tracked / 165 ordinary / 365 unique SKU rows**. Production environment exact mappings add coverage beyond the repository-only estimate of 186/179 above. The CSV now records the actual rendered public links. All explicit deep-link u destinations matched the pre-release source for the same SKU. No tracking links were followed in bulk. Opaque shortlinks have not been newly resolved during this audit.

All **149 unit tests passed**. Webpack build, post-build TypeScript, catalogue validation and targeted lint completed; only the existing img performance warning remains. Preview HTTP 200 showed 48 ordinary links with public SKU attributes, confirming preview's disabled activation gate. Production browser showed marked affiliate links, correct public SKU attributes, real photos and visible disclosure; screenshot impact-feed-fix-20261027.jpg. Browser search submission did not establish a filtered-result transition in this run, so no successful search-filter test is claimed. Mobile browser testing unavailable (Playwright Chromium binary absent); not reported as passed.

Secure Impact sign-in was offered and declined. No network-recorded clicks, actions, contract rules, payout eligibility or earnings could be verified. This is a partial attribution audit with a deployed routing fix, not confirmation that commissions are accruing. No paid order, self-purchase or artificial revenue event created. Plausible remains unconfigured; no first-party event receipt claimed.


## 28 October 2026 — Waterdrop regional scope correction

Partner clarification received 28 October at 11:22 Europe/Bucharest: the existing DE programme covers German orders only. Romania requires its separate EU store and affiliate programme. The partner-reply watcher already handled this message; no duplicate email, application or notification issued by this cycle. Source: Waterdrop Affiliate Team reply in the existing Ukraine/eligibility thread, Gmail message 1a181d188c31652f. No private email body retained.

DE tracking URL validity must not be described as Romanian commission eligibility. Preserve the 15 active DE mappings and one archived ordinary model; label every shared Waterdrop supplier CTA as DE / Germany only, including comparisons, product cards and detail pages. Brand-page metadata and pre-product notice now state the separate EU requirement. Do not invent an EU merchant URL, migrate exact variants, disable working German attribution or activate EU tracking without issued links. No network click, action, commission or payout verified in this run. Renogy Romania eligibility remains confirmed and untouched.


## 29 October 2026 — exact SKU follow-up (PR #41)

Continue the existing draft, not a replacement implementation. Feed entries had only their base product URL passed to the resolver; 12 already-reviewed variant mappings were unused. Prefer an existing exact SKU variant mapping only after validSupplierUrl accepts the reviewed variant and renogyLink returns tracked. Otherwise preserve the existing parent/ordinary link. Guarding before the strict resolver prevents unreviewed raw variants from throwing during server rendering; reproduced with the real 365-row feed and fixed before release.

Baseline freshly checked: all eight pages 200, 365 unique SKUs, 200 active/165 ordinary. No network click generated. Post-release counts follow in growth-log. Link correctness/HTML activation remains level A only; analytics receipt, Impact clicks, actions, confirmed commission and payout are not established by this change. Renogy Romania eligibility is closed/confirmed. Waterdrop Germany-only scope and all independent gates remain unchanged.
