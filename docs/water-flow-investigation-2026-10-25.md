# Water catalog and navigation audit - 25 October 2026

Local branch: codex/water-flow-audit. Base: 016c9209a47f4465138c515ec0b6ca2c998526f4 (PR20). Publication explicitly authorized by user on 25 October 2026 at 19:01:55 UTC. No environment change, contact submission or tracking-link traversal. Release results recorded in final handoff.

## Findings and implementation

The original three Waterdrop models (G3P600, G3P800, X12) were repeated across home/RO/under-sink facets. Empty categories repeated the discovery UI and generic supplier links, suggesting a product path where no suitable model was documented. Category pages now have compact heroes, localized links back to the hub finder, and explicit empty states. Shared discovery/proof/supplier blocks appear once on the hub. Empty categories have a selection guide, without generic Waterdrop recommendations. Category cards distinguish model listings from planning guides. Water comparison tray starts collapsed, with an explicit selection toggle. The Waterdrop page uses the actual model count and no longer repeats a three-model quick-choice section.

## Verified assortment

Source: C:/Users/PC/Downloads/Waterdrop-DE-product-feed_IR.txt.gz, authenticated Impact advertiser catalog 18289. SHA256 b102870beee0c45db06d8e740a2814f9fbfc1065cf0aef1658dcfb18560f63e6 matches repository photo provenance. All 32 decoded official DE destination pages returned HTTP 200 with titles recorded locally; no tracking URL was requested.

32 feed records are NOT 32 independent devices: 16 device model labels (3 existing + 13 added), 14 bundle/cartridge configurations excluded from independent-device count, 2 extra-year offers excluded. Exact classifications and exclusions are in waterdrop-feed-classification-2026-10-25.json. SKU 53105929158972 has a materially different official-page title and is excluded. Extra-year offer contents are not asserted to be warranty-only without evidence.

New models: K6, K19H, A1, C1H, X8, A2, X16, G5P500A, G5P700A, UA-UF, C1SL, K19-HG, A2G. Exact feed images/dimensions, merchant paths, SKUs and issued affiliate links are retained in data/waterdrop-reviewed-expansion.json. Existing affiliate configuration gates and original three overrides remain intact. No prices, stock, health claims, certifications or emergency suitability invented.

All 16 models are domestic water-treatment devices; 15 RO and one UF. Seven new countertop and two new under-sink entries use explicit official German title evidence. Together with the original three this gives 5 under-sink models. K6/X16/G5P500A/G5P700A installation stays Check manual; they are not assigned to an installation category until confirmed. Feed SKU is not presented as a manufacturer MPN. Output/recovery values absent from documented data display Unknown. Feed configurations and actual supplied variants remain merchant-controlled.

## Verification and limits

Full unit suite: 119/119 passed. Lint, TypeScript and supported webpack production build pass. NODE_USE_SYSTEM_CA=1 retains TLS verification. Turbopack fails creating a CSS subprocess in this Windows environment; webpack succeeds.

Browser suite covers RO/EN hub and all ten category routes, documented counts, empty states, localized finder links, desktop/mobile Back/Forward, repeated compare selection, compact tray, comparison page, Waterdrop brand page, all thirteen new model detail destinations, responsive overflow and accessibility checks. Final results are included in the handoff; local screenshots are under test-results and HTML report under playwright-report. No merchant/affiliate CTA is clicked.

The supplied Library screenshot could not be materialized: official Windows transfer helper failed with AttributeError: os.setxattr unavailable during atomic metadata application. No unsupported workaround was used; supplied pixels remain uninspected. Independently generated screenshots cover the reported emergency/off-grid route.

Remaining evidence gaps: installation manuals for four models, exact supplied bundle options, Romanian shipping/availability, contaminant performance and independent certification. These are deliberately not converted into claims. Network click registration, conversions and payout were not tested. The separate water-release publication approval is recorded above; it does not authorize new services or security changes.
Final local verification: 119/119 unit tests, lint/types and webpack production build passed. Browser route suite and supplemental full-image decoding results are recorded with the release handoff. All 13 new product detail pages preserve exact merchant destinations when tracking is disabled. No external CTA traversal.
