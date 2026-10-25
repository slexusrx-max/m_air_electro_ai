# Disclosure and feed-count accuracy - 25 October 2026

Disclosure rendering no longer replaces both programme status and link explanation with the same generic paragraph. Renogy and Waterdrop Germany approvals are named, Renogy EU/Romania eligibility retained, and PECRON/BLUETTI remain ordinary/unapproved listings. Tracking, conversion and payout are distinct. Merchant-controlled terms and no-dealer framing remain.

Renogy raw source: C:/Users/PC/Downloads/impactradius.csv SHA256324ed1595cfa45631baafdfd01ae2bd5dd158017d614ff9da69654876e485169. Grouped by exact product URL path with query removed. Multirowgroups with empty Parent SKU identify parent-summary rows; populated Parent SKU identify variants; single-rowgroups are single options. Selected72parents:186rows=31summaries+114variants+41singleoptions. Thus155options, not186variants. Per-parent row types in data/renogy-parent-row-types.json; original issued link mapping unchanged. Original skuCount retained as legacy source-row field, no longer displayed as variants.

Generic /opengraph-image now has generic brand/equipment-discovery alt; it is not described as an individual model photograph. Canonical, hreflang and JSON-LD unchanged.

Image publication is separate and requires visual inspection. No image is certified by this count audit. Source URL/image association alone is insufficient for UK connectors, bundle quantities or logo-only files.

Short desktop regression: expanded sticky filters placed Apply below the viewport at 1165x747. The selection was retained; the button was unreachable. Filter forms now use normal document flow. A pre-fix browser test failed with viewport ratio 0; RO/EN tests cover pointer submit, keyboard Enter and reset visibility at heights 700/747. No form-state refactor.
## Validation

124/124 unit tests, lint, TypeScript and webpack production build passed. Eight local disclosure/Renogy route tests passed before the final copy polish. Final browser suite: 12 RO/EN cases covering disclosure, OG alt, normal/mobile facet submission and short 700/747px desktop pointer/keyboard submission. No affiliate destinations traversed or real forms sent. Initial browser run could not reach a sandbox-local server; rerun used the same authorized network environment. Short-viewport test demonstrably failed before the CSS fix.
