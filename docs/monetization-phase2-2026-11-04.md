# Monetization Phase 2 — 4 November 2026

## Release scope and priorities

Started from GitHub main and Vercel production source `2cd8e082dcbac008de0dd7ca535d6dbf1daade40`, with application release `ef5e342` already delivered. Fetched main before work and again before release; no competing upstream change was found. The owner's existing changes to `renogy-feature.tsx` and the previous mission report are excluded from this package.

The highest independent priorities were recognizable product cards, technically meaningful comparisons, the observed battery-calculator search opportunity and recovery from unavailable account profile reads. Photograph publication and additional affiliate activation remain evidence-gated. No prices, availability, reviews, approval, purchase or revenue facts were invented.

## Completed changes

- Shared product cards now present the manufacturer, exact existing model, documented SKU where available, three prioritized source specifications, intended use, comparison control and current-price supplier CTA. Usage limitations remain available in a disclosure. This improves presentation across the existing 77 records; it does not change their technical facts or claim an uplift in conversion.
- Energy card controls use restrained lime/dark teal accents and water controls use aqua. Glass borders, readable specification panels, keyboard focus and minimum 44px controls preserve the existing route-family design and both original hero artworks. Eleven marketplace category tiles receive coordinated original SVG identifiers while retaining their licensed/authorized photographs.
- Comparison rows are specific to batteries, panels, AC power stations and water systems. Nominal voltage and voltage class remain separate; panel power retains its STC qualification; missing cycle life, surge, efficiency, replacement intervals and contaminant claims remain explicitly undocumented. Exact source fields and conflicting source values are retained. Incompatible equipment roles still cannot be compared as equivalent. The previously corrected compact saved-comparison behavior is preserved.
- The existing RO/EN battery calculator has clearer search metadata, an original server-rendered sizing example and localized links to LiFePO4 selection, runtime guidance and a real 100Ah/200Ah comparison. The illustrative result is approximately 556Wh/43.4Ah for a 100W load over four hours with explicitly stated assumptions; it is not a runtime guarantee.
- Failed account lifecycle-status queries now fail closed instead of constructing an active profile. Login/registration expose localized recovery instead of a redirect loop, and optional account-detail failures retain the already verified base profile. Successful empty-profile bootstrap, pending/blocked handling, private project ownership and Supabase RLS remain intact. See [account audit](account-auth-audit-2026-11-04.md).

## Photography and affiliate integrity

**Photographs added: 0.** The 35 existing permitted Renogy/Waterdrop product photographs remain enabled. All 29 withheld BLUETTI/PECRON assets remain withheld because a publishable licence and exact current variant mapping were not established. The [29-model rights register and two unsent permission drafts](product-photo-rights-phase2-2026-11-04.md) document sources and remaining requirements. Three expansion models share a source image URL and require particular care before activation. No substitute or generated product photograph was published.

Read existing business correspondence on 4 November before considering outreach. PECRON's 30 October message from the owner already asks for approval, Romania eligibility, issued links and permitted images/feed; the latest observed supplier reply in that chain supplies a registration route, not approval or photo permission. BLUETTI's 19 October reply allows Romanian publishers to apply and obtain a feed after joining; subsequent owner follow-ups already request approval. No new permission was established and no duplicate message/application was submitted.

Renogy programme 14864 and publisher 7767803 remain separate from product editorial facts. Preserve all 365 feed identities: 227 tracked and 138 ordinary supplier hrefs, including the twelve exact links delivered in Phase 1. No new tracking URL was fabricated in this phase. Final first-party HTML verification is recorded in the release acceptance below; it does not follow affiliate endpoints or prove purchase attribution.

Waterdrop DE programme 19363 remains geographically restricted. The existing Romanian blocked-affiliate notices and ordinary official source links are preserved. No approved EU/Romania tracking activation was established.

## Real reporting observations

### Impact

Reopened **Performance by Brand**, reapplied the completed reporting period **21 October–3 November 2026** and read the refreshed results on 4 November:

| Programme | Recorded clicks | Recorded actions |
| --- | ---: | ---: |
| Renogy 14864 | 19 | 0 |
| Waterdrop DE 19363 | 6 | 0 |
| Total | 25 | 0 |

These refreshed figures are unchanged from the prior baseline. They are network clicks, not unique visitors or verified genuine-customer counts; some historical activity may be internal tests. Impact warns of reporting delays. This report ends on 3 November and is not a complete 4 November total. Approved/reversed commissions and payouts were not verified and remain **unknown**, not zero. No tracking endpoints, orders or artificial clicks were generated by QA.

### Analytics receipt

The production environment-name inventory contains no Plausible analytics domain configuration. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is not configured, and the public privacy page already states that Plausible is not enabled. There is therefore no verified live funnel receipt or session denominator for outbound CTR. Consent, DNT, GPC, automation and private-route exclusions are retained. Automated QA is excluded from genuine-customer events. No paid project/subscription was created, privacy protection disabled or instrumentation misreported as receipt.

Next requirement: configure an existing authorized collector/site for the official hostname, then verify legitimate consented activity in its authenticated reports. Website sessions, product engagement, outbound CTR and revenue per affiliate click remain unavailable until the corresponding records are verified. Search Console and a Google Ads tag do not establish general analytics receipt.

### Google Search Console

Authenticated access to the official HTTPS property was available. Settings explicitly confirms verified ownership; the property was added on 17 October. The existing `/sitemap.xml` was **successfully processed on 4 November**, with **372 discovered URLs**. The first-party crawl count is a different measure and must not be equated with indexed URLs.

The selected three-month performance view contains chart observations from **16 October–2 November 2026**: **281 impressions, 0 clicks, 0% CTR and average position 35**. The report contains 110 page rows and 53 visible query rows; visible query totals are not necessarily exhaustive.

Leading pages by impressions (all zero clicks):

| Page | Impressions |
| --- | ---: |
| `/en/calculators/battery` | 42 |
| `/en/calculators/generator` | 24 |
| `/en/calculators/motor-current` | 22 |
| `/en/learn/choosing-water-system` | 14 |
| `/en/marketplace/marine` | 9 |

Visible queries include “generator sizing calculator” (10 impressions), “dimensionare panouri fotovoltaice” (5), and “generator selection calculator” (4). These observations support improving useful calculator-to-equipment journeys; they do not demonstrate traffic or revenue growth after this release.

The index report is dated **23 October**, showing **199 indexed / 101 not indexed**: 91 discovered but not indexed, 5 crawled but not indexed and 5 excluded by noindex. This is an older coverage snapshot, not 101 verified current defects. Robots was reported healthy; Core Web Vitals had insufficient field data for mobile and desktop.

The Product rich-result report still showed two old errors for Core Mini 100Ah/200Ah URLs last crawled on 18 October. Fresh first-party responses are 200 and contain editorial WebPage/BreadcrumbList/ListItem markup with no Product, Offer, Review or AggregateRating. After checking those current responses, requested **Validate fix**. Search Console visibly reports **validation started on 4 November**. Completion and indexing are pending; no fabricated offers/reviews were added to satisfy a stale report.

## Verification

Pre-release checks passed: **194 unit tests**, i18n validation (419 keys), TypeScript, catalog validation (77 records / 64 real models / 13 classes), lint (zero errors, one existing raw-image optimization warning), production build and a **379-route local crawl with no failures/orphans**. Eleven local RO browser scenarios cover new cards/specification comparisons at 390, 430, 768, 1366 and 1440px and the battery sizing example; a separate image-decoding run verifies all eleven category photos before capture. A read-only cross-agent review found no material product-fact or comparison regression.

The local server's existing English rewrite discrepancy is not hidden by weakening language assertions. RO was checked locally and both languages must pass on the actual production domain. Production acceptance, the deployed source SHA and GitHub checks are appended after release.

## Remaining blockers and next priorities

1. Enable an authorized analytics collector and establish authenticated receipt; use real engagement data to choose the next conversion experiment.
2. Obtain BLUETTI/PECRON approval and exact SKU/variant photo permission; reconcile three shared expansion-image associations before publishing any of the 29 assets.
3. Obtain the appropriate Waterdrop EU approval and issued Romania-eligible links before regional activation.
4. Review Search Console validation and coverage after fresh crawls. Improve generator sizing and water-system journeys next, using observed search demand and original technical guidance rather than duplicate doorway pages.
5. Complete owner-account login/confirmation/reset and signed-in dashboard acceptance in a real authorized session. Current mocked and anonymous tests do not prove inbox delivery or a real signed-in session.
6. Reconcile the existing private equipment-project work before adding saved calculations. The smallest secure extension needs a bounded versioned result schema and owner/RLS tests; existing projects accept catalog IDs and quantities, not arbitrary calculator payloads. No parallel saved-data system was introduced.

No paid campaign, legal agreement, account creation, supplier message or purchase was performed. This is an active-session report; no persistent worker or recurring automation has been configured.
