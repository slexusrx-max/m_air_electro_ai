# Commercial journey verification - 24 October 2026

## Scope and route map

Baseline: clean `main`, fast-forwarded to `d6e4442`. Existing architecture, visual identity, supplier configuration, model facts and photographs are retained. This is an affiliate discovery platform, not an equipment merchant or checkout.

| Entry | Decision support | Next action |
| --- | --- | --- |
| `/`, `/marketplace` | Equipment families, search, filters | Product detail, comparison or finder |
| `/marketplace/find-my-solution` | Loads, duration, assumptions, bounded station screening | Compare candidates or separately investigate components |
| `/backup-calculator`, `/calculators/*` | Energy, power, losses, voltage and protection checks | Relevant category or model; never an installation design |
| `/renogy`, `/waterdrop` | Source-backed brand selections | Exact ordinary or gated affiliate supplier URL |
| `/marketplace/products/*`, `/compare` | Specifications, unknowns, limitations and sources | External merchant; price, stock, shipping and warranty remain merchant-controlled |
| `/solutions/*`, `/learn/*` | Labeled editorial examples and selection methodology | Tools and relevant catalog categories |
| `/experts`, `/business`, `/contact` | Preparation guidance and independent publisher contact | Enquiry/email; no invented directory or response guarantee |

Romanian uses root paths; English uses `/en`. Existing reciprocal metadata, public sitemap and language-preserving links remain.

## Corrections

- The water header label was a hard-coded English string. Both languages now use the Water & Resilience family name. Mobile Marketplace no longer repeats the separate water destination.
- Footer groups were selected by array position. Adding Water displaced Learn and duplicated Water. Stable route selection restores Learn, retaining one Water category link in the footer.
- Homepage actions now precede the long introductory paragraph, reducing the mobile distance to selection without removing the approved logo or pre-content disclosure.
- Add `contact_accepted` after HTTP success and the server's explicit `accepted` result. Never count validation failures, failed requests or an unconfirmed inbox delivery as a conversion. No personal form fields are included.
- Existing analytics now also respects Global Privacy Control, rejects invalid/future consent timestamps and excludes localized private routes. Supplier query parameters are neither changed nor sent to analytics.
- Regression fixtures are aligned with the expanded nineteen-model Renogy catalog, exact variants, responsive hidden artwork and the approved alpha-mask display. No tests are intentionally skipped.

## Commercial evidence and limits

All 28 official source URLs responded HTTP 200 on approved regional origins. The production product audit verified all 28 pages and exact issued mappings: eighteen Renogy and three Waterdrop tracked links, seven ordinary links. One explicit test traversal of each tracked link reached its exact merchant path. Renogy retained publisher `7767803` and selected variants. Evidence excludes transient click identifiers.

Existing official-feed manifests retain exact SKU/variant, image provenance and check dates. This change does not claim a new manual technical review of every specification, permission for new imagery or guaranteed Romanian delivery. Existing unknown prices/stock and PECRON/BLUETTI photo fallbacks remain. Calculated candidates are screened by documented energy/output limits, not commission; components are not promoted as confirmed compatible systems.

Impact currently requires owner login. Gmail correspondence was inspected read-only in the authenticated browser after the connector was unavailable. Renogy's 12 October response explicitly confirms EU-store affiliate links for Romanian buyers; the 20 October response points to the Impact product feed and images. This supports the documented regional route, not fresh network ingestion, the current contract/action configuration or recorded commissions. Public redirects cannot establish those facts.

BLUETTI's 19 October response confirms Romanian publisher eligibility and supplies Awin programme 95479, with feed access after joining; PECRON's 9 October response supplies a registration route only. Awin's 19 October account-activation notice and EcoFlow's 23 October invitation are not merchant-program activation evidence. No new supplier tracking was enabled. Waterdrop's existing reviewed configuration remains unchanged; no new Waterdrop approval or tracking-report evidence was obtained. No account, purchase, contract acceptance or live form submission occurred.

Plausible is disabled on the inspected production baseline. The new event is ready in code but requires configured service access and a real consented ingestion check before claiming collected leads. Keep the existing privacy and consent gates. Contact API/SMTP acceptance and mailbox receipt are separate; the prior owner's 1 October receipt confirmation is not a new delivery test.

## Verification and release

Initial baseline: 111 unit tests passed. Updated unit suite: 113 passed; 419 declared translation keys; production build, TypeScript and ESLint passed. Internal crawl: 301 routes, no failures, redirects or orphans.

The full 236-case Playwright run completed with 233 passes and three readiness failures: a cold-page `load` timeout and two keyboard attempts before hydration enabled the menu button. Tests now wait for relevant content and enabled/focused controls rather than unrelated image loading. Both affected files then passed all 15 cases, including all three previously failing cases. No test was skipped. The suite covers RO/EN, responsive layouts from 320 to 1440 pixels, automated accessibility, calculators/finder, search, comparison, exact supplier CTAs, SEO, account/contact fixtures and Waterdrop. Nine isolated auth/contact fixture cases also passed without external submissions.

Final deployed SHA and public smoke results are recorded in the delivery result; this document does not predeclare production release successful.

`scripts/verify-commercial-production.ts` checks all real model pages, the deployed SHA when supplied, exact issued URLs, actual suppliers and disclosure/sponsored status. `VERIFY_AFFILIATE_REDIRECTS=true` explicitly requests real test handoffs; ordinary repeat smoke tests do not generate additional network clicks. Results go to ignored `.task-work/commercial-production.json`.

## Metrics after activation

- Consented sessions and `finder_start` to `finder_result` completion; calculator completions by public route.
- `comparison_add` and `comparison_view`, then `supplier_outbound_click` by public product/supplier/category/language.
- `contact_accepted` counts accepted submissions, not qualified leads or delivery. Determine qualification from actual enquiries without exporting personal content to analytics.
- Impact-reported clicks, eligible actions, approved/rejected commissions and reversals. Reconcile against on-site consented clicks without expecting identical totals: privacy choices, blockers and network attribution differ.
- Conversion rate, approved commission per click and revenue per qualified session only after real denominators and settled network evidence exist. No earnings projection is claimed.
