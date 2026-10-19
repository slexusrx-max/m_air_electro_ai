# Search discovery and honest catalog markup — 19 October 2026

## Release state

Prepared locally on `codex/seo-indexability-2026-10-19`, in the separate `seo-indexability` worktree, based on production/GitHub main `36873deac88fd3d91ceec6d3ff38aabde08c6953`. Not pushed or deployed. The visual commits `fc4c468` and `d4ff8ff`, pending image work and original checkout are not included or altered. Publication remains subject to the parent's explicit release decision following the earlier automatic approval rejection of a production push.

## Findings and scope

The parallel live audit found no global indexing block: tested categories returned 200, allowed crawling, had self canonicals and reciprocal RO/EN alternates, and the sitemap contained 270 unique URLs. The parent verified Google's first-search-appearance email reporting activity since 17 October; the email arrived on 19 October. It would be inaccurate to say the whole site is unindexed. Search Console URL coverage, actual queries and rankings were not inspected in this executor, and no indexing request or validation was submitted.

`/marketplace/solar/panels` already has useful original content, the Romanian title “Panouri solare fotovoltaice: comparație și dimensionare”, and a Romania-oriented description. This change preserves that page, its metadata and URL. The inverter category's existing targeted editorial content is also preserved. No new competing landing pages or locale are introduced.

Before this change, genuine model pages emitted `Product` without an offer, review or aggregate rating. [Google's Product snippet requirements](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) require at least one of those properties in addition to the name for snippet eligibility. Missing rich-result data is not a general indexing prohibition. There are no verified catalog prices or qualifying ratings/reviews to populate these properties honestly.

## Exact changes

- `components/marketplace/structured-data.tsx` and `app/marketplace/products/[slug]/page.tsx`: emit `WebPage` for genuine model pages, with the existing localized name, description, canonical URL and language. Remove the incomplete `Product` declaration rather than inventing commercial data. Existing BreadcrumbList, ItemList and site identity markup remain. No nested Product/Offer/Review is introduced. This intentionally makes no claim to product rich-result eligibility.
- `lib/marketplace/content.ts`: add distinct bilingual search titles/descriptions to the solar equipment root, battery root and LiFePO4 category. Improve battery/LiFePO4 headings and introductions around usable energy, voltage, BMS and model-specific limits. Tell readers to confirm price, delivery to their Romanian address and warranty with the supplier. Do not assert stock, Romanian shipping coverage or direct selling. Preserve the existing detailed selection/safety guidance and solar-panels/inverter editorial entries.
- `components/marketplace/discovery-home.tsx`: add visible server-rendered links from the homepage and Marketplace category section directly to the existing panels and LiFePO4 pages, with descriptive RO/EN anchors.
- Update schema regression assertions in `tests/publisher.test.mjs`, `tests/e2e/seo-foundation.spec.ts` and `tests/e2e/supplier-listings.spec.ts`; add `tests/e2e/seo-indexability.spec.ts` for the release checks below.

No catalog records, product specifications, prices, photos, tracking links, shipping promises, CSS, navigation configuration, credentials or supplier gates are changed. Robots, sitemap, canonical/hreflang generation and filtered-page noindex policy are preserved.

## Verification

- Locked `npm ci`; production `npm run build` passed, including TypeScript checking (Next.js 16.3.8).
- Eight targeted unit tests passed: publisher identity/schema and SEO routing/energy examples.
- ESLint passed for changed implementation and test files; `git diff --check` passed.
- Eleven SEO browser tests passed in 18.7 seconds against the production build at `http://localhost:3117`.
  - Five category URLs per language: HTTP 200, one H1, descriptions, self canonical, RO/EN/x-default alternates and no noindex.
  - Every genuine model in both languages: localized WebPage matches H1, meta description and canonical; breadcrumbs remain; no Product/Offer/Review/aggregate-rating types.
  - Direct links operate without JavaScript at 390 and 1440 px in both languages; no horizontal overflow. RO mobile/desktop category screenshots inspected visually.
  - Sitemap has 270 unique clean canonical URLs including the target categories; robots permits public crawling; actual filtered battery URL remains noindex with the clean canonical.
  - Existing language navigation, legacy redirects and private English route exclusion passed.
- Four supplier regression tests passed in 15.6 seconds: nine Waterdrop/PECRON/BLUETTI models, documented specifications, official source links and ordinary supplier CTAs at 390/1440 px in RO/EN.

The first browser run exposed two test assumptions: waiting for an absent optional robots tag, and waiting for all assets in a JavaScript-disabled navigation test. The final assertions accept absent robots as default index/follow and verify the server-rendered document at DOM readiness. No production application behavior was changed to satisfy those assumptions. The fresh final run passed all eleven checks; the retained initial log is not the release result.

Local evidence (ignored generated output): `.task-work/seo-build.log`, `.task-work/seo-browser-final.log`, `.task-work/seo-supplier-tests.log`, `test-results/seo-final/` and `test-results/seo-suppliers/`.

## After an authorized release

Confirm the deployed commit and repeat public HTML checks on the changed RO/EN categories, a panel and an inverter, plus robots/sitemap and the homepage anchors. Through existing authorized Search Console access, inspect the exact affected URLs and the reported Product issue before requesting validation or indexing. No Search Console action has been taken here. Google's recrawl and reporting updates may take time; this change does not guarantee indexing, rankings or rich results.
