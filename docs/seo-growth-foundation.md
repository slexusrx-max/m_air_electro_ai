# SEO growth foundation — 17 October 2026

## Scope and release gates

Romania is the initial search market; Romanian is primary, English secondary. Two initial content clusters are apartment backup and RV battery/solar planning. These are editorial priorities, not proven high-volume keywords. Search volumes, rankings, CTR opportunities, competitor gaps and growth forecasts remain unverified until Search Console and a country/language-specific SERP sample are available.

This release fixes the technical prerequisites, improves the existing pages and supplies reproducible examples. It does not assert TOP-10 rankings, human technical approval, physical measurements or new professional mentions.

## Public URL contract

- Romanian uses the existing root paths. English uses `/en` and `/en/...`.
- Public language is selected by URL, irrespective of saved cookies. Private account pages retain their existing language preference mechanism.
- `proxy.ts` overwrites the locale request header before rendering and rewrites English URLs to the existing page implementation. No duplicate content implementation or catalog exists.
- Each indexable public page has a self-canonical and reciprocal RO/EN alternates; Romanian is the x-default. The sitemap includes both languages.
- Search, comparison and filtered URLs remain noindex/follow with a clean canonical.
- Robots blocks `/expert$` and `/expert/`, preserving crawl access to the public `/experts` guidance page. Authentication remains the access control for private content.
- Public language links are ordinary anchors and work without JavaScript. Search/filter forms and internal links retain the language; query state and click-time fragments are preserved when switching languages.
- For local production testing use `next start --hostname localhost --port 3100` and `TEST_BASE_URL=http://localhost:3100`. Mixing a 127.0.0.1 server hostname with NextURL's normalized localhost can cause an external rewrite round trip and a second proxy invocation.

## Search intent ownership

The English counterpart of each path below is `/en` plus the path. Query themes are research candidates, not measured demand. Avoid giving a category, guide and solution identical titles or targeting all three with the same primary promise.

| Existing page | Romanian query theme | English query theme | User task / boundary |
| --- | --- | --- | --- |
| `/marketplace/batteries/lifepo4` | baterii LiFePO4 | LiFePO4 batteries EU | Browse and filter equipment, not explain every formula |
| `/marketplace/backup-power` | stație de alimentare portabilă | portable power station Romania | Compare documented models and constraints |
| `/solutions/apartment-backup` | alimentare de rezervă apartament | apartment backup power Romania | Choose an architecture and define essential loads |
| `/learn/apartment-backup-system` | cum aleg alimentarea de rezervă pentru apartament | how to plan apartment backup | Learn selection constraints and exclusions |
| `/learn/how-to-size-backup-battery` | dimensionare baterie de rezervă | how to size a backup battery | Calculate required nominal capacity from a load budget |
| `/learn/battery-runtime-calculation` | calcul autonomie baterie | battery runtime calculation | Explain runtime, AC/DC losses and sensitivity |
| `/calculators/battery` | calculator capacitate baterie | battery capacity calculator | Enter inputs and obtain an estimate |
| `/solutions/rv-caravan` | sistem electric rulotă | RV electrical system planning EU | Combine house loads, storage and charging architecture |
| `/learn/rv-solar-basics` | dimensionare panouri solare rulotă | RV solar sizing | Understand the daily energy and charging budget |
| `/learn/12v-vs-24v-vs-48v` | sistem 12V 24V 48V diferențe | 12V vs 24V vs 48V | Compare current and architecture constraints |
| `/marketplace/products/renogy-core-mini-100ah` | Renogy Core Mini 100Ah | Renogy Core Mini 100Ah EU | Evaluate one exact model with source-backed specifications |
| `/marketplace/products/renogy-core-mini-200ah` | Renogy Core Mini 200Ah | Renogy Core Mini 200Ah EU | Evaluate the higher-capacity model, not repeat the category |

Other route families retain their current roles: homepage = discovery; Marketplace categories = selection; Solutions = system use cases; Learn hubs = navigation; Learn articles = one learning task; calculators = one computation; model pages = one exact model. Policy, contact and publisher pages support trust rather than commercial keyword targeting. Utility search/comparison/filter variants are excluded from indexing. Use the existing route inventory in `lib/marketplace/routes.ts` as the source of truth.

## Calculations and technical review

- Apartment example: 18 W × 4 h + 45 W × 4 h + 12 W × 3 h = 288 Wh AC; 288 / 0.92 / 0.80 = 391.3 Wh nominal before excluded losses/reserve.
- RV example: 435 Wh DC + 180 Wh AC; (435 + 180 / 0.92) / 0.80 = 788.3 Wh nominal. Inverter efficiency is applied only to AC loads.
- Sensitivity: an additional 180 Wh AC requires about 244.6 nominal Wh; an additional 180 Wh DC requires 225 nominal Wh at the stated usable fraction.
- Battery examples: nominal Wh × 0.80 × 0.92 / constant AC W. These are calculated scenarios, not measured autonomy or verified product/inverter combinations.
- Regression tests check the mixed AC/DC calculation, input validation, existing battery/inverter sizing limits, private-route separation and URL normalization.
- On 17 October, the official [Core Mini 100 Ah page](https://eu.renogy.com/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery) confirmed 12.8 V, 100 Ah and 100 A maximum discharge. 1280 Wh is explicitly calculated as V × Ah. The official [Core Mini 200 Ah page](https://eu.renogy.com/products/core-mini-12-8v-200ah-lifepo4-battery-w-low-temperature-protection) confirmed 200 Ah, 2560 Wh and 200 A continuous discharge. This was AI-assisted source checking, not hands-on testing or human review. Prices, stock, warranty promises and unsupported certifications were not imported.
- The reference 100 Ah equipment-class page is linked contextually from examples; it remains outside purchasable model listings.

## Attribution and dates

Stanislav Zavizion remains the confirmed owner and independent publisher. Ownership does not establish article authorship, professional qualifications or technical review. An owner question about attributable work/experience is pending. Do not add unsupported bylines, credentials or reviewer schema.

`editorial-records.json` records actual substantive update dates for the eight pages changed in this release. `updated` controls dateModified independently of `reviewed`; a human review date must never be inferred from a code commit. Original publication dates remain absent when unknown.

## Baseline and follow-up procedure

Search Console was opened in the available signed-in browser on 17 October. The domain property was unavailable in that account and no accessible property was listed. Therefore clicks, impressions, CTR, average position, index coverage and field Core Web Vitals have no verified baseline in this work. Blank means unavailable, never zero.

Once property access or exports are supplied:

1. Record export date, property, search type Web, country Romania, device, and date range. Save the most recent complete 28 days, preceding 28 days and same period last year when available. Keep the latest three incomplete days outside comparisons.
2. Export query/page pairs, clicks, impressions, CTR and position. Separate branded queries and RO/EN URL groups; GSC has no query-language filter, so language classification needs manual review. Retain an unclassified group.
3. Inspect indexing and selected canonical for the main RO/EN pages; submit the sitemap if needed. Request indexing selectively after checking rendered content.
4. For each priority query, capture the Romania SERP separately in Romanian and English, with date/device and the actual first ten organic results. Compare intent, page type, original evidence, model coverage and local relevance. Do not treat unrelated-country rankings as the target TOP-10.
5. Choose work from observed gaps: indexed pages with relevant impressions but weak CTR; positions near page one with strong intent match; pages receiving calculator users but weak equipment engagement. Compare like-for-like cohorts, report counts and denominators, and avoid treating seasonality as a release effect.
6. Recheck after enough complete search data accrues. This document does not create a recurring automation or promise a ranking deadline.

Existing consent-gated analytics already records calculator completion, comparison views and supplier outbound clicks. These are useful funnel events; they do not replace search performance data. Do not bypass consent or include user-entered queries/personal details in analytics.

## Professional references

No new third-party mentions have been obtained in this release. Candidate contributions are the reproducible apartment AC load budget and the mixed AC/DC RV example, each with assumptions and reusable calculation logic. A credible outreach brief should offer a relevant Romanian installer or RV technical publication a source-specific review of an existing guide. Identify actual editorial relevance and check facts before contacting anyone; do not buy links, invent endorsements or count an affiliate relationship as an editorial recommendation.

## Validation evidence

Ignored evidence lives under `.task-work/seo-audit-2026-10-17/` and `test-results/`. Local validation passed build, TypeScript, ESLint, the 419-key translation check and all 90 unit tests. The internal-link crawl visited 275 URLs with no failures, redirects or orphaned public routes. Browser validation covered 86 distinct scenarios across the regression and release runs, including all 268 sitemap pages in both languages, keyboard navigation, supplier-link honesty, calculations, comparison, no-JavaScript language links and mobile layouts. Five stale artwork selectors/expectations in the initial run were corrected and passed on rerun; they did not require replacing the preserved artwork.

Production delivery still requires matching the public `deployment-commit` marker to GitHub main and the successful Vercel commit status, then running the public browser/crawl checks. Store that final release evidence alongside the ignored logs; do not treat a local build or this document as proof of production deployment.
