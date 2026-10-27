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

