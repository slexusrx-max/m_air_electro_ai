# Catalog and supplier audit — 4 November 2026

Baseline: current main `db1ccef`, reconciled before edits. The newer owner directions in AGENTS.md and the 3 November image-rights gate supersede the old local checkout. This pass preserves those directions, the link-only pricing policy, all supplier activation gates and exact existing artwork. It does not reinstate withheld photos or Germany-only offers.

## Current inventory

| Surface | Count | Evidence and limits |
| --- | ---: | --- |
| Canonical records | 77 | 64 real models and 13 equipment classes; classes are planning references, not invented purchasable models |
| Renogy canonical models | 19 | The 4 November canonical public-href register records 18 tracked and 1 ordinary destination |
| PECRON canonical models | 23 | Ordinary links; no approval or publication rights inferred |
| BLUETTI canonical models | 6 | Ordinary links; no approval or publication rights inferred |
| Waterdrop canonical models | 16 | Public supplier CTAs deliberately blocked for the Romania-facing site; ordinary editorial sources remain accessible |
| Active model photos | 35 | Exact ID mappings in `lib/marketplace/product-photos.ts`: 19 Renogy and 16 Waterdrop |
| Withheld model photos | 29 | 23 PECRON and 6 BLUETTI, pending rights-holder permission or approved partner creative access |
| Renogy feed identities | 365 | Separate raw-feed discovery rows, not 365 independently reviewed canonical models |
| Feed href snapshot | 215 tracked / 150 ordinary | Counted from the existing `docs/affiliate-renogy-feed-links.csv`; a rendered tracking href is not an Impact-recorded click |

Canonical href counts above were recounted from `docs/affiliate-canonical-links-2026-11-04.csv` in this pass. That register documents its own production observation date/source commit. Feed href counts were recounted from the saved register; this audit does not present it as a new live network report. The historical 48 tracked/12 missing starting point is therefore not the current inventory: the 12 requested mappings are a subset of the 150 ordinary feed identities, as already recorded in the growth backlog.

## Defect fixed in release verification

Several browser fixtures still expected 16 Waterdrop purchase anchors and active tracking, although the production gate now renders non-clickable regional notices. The photo suite also expected one supplier anchor for every real model. Those stale expectations could hide the distinction between a deliberate market gate and a broken commercial control.

The shared supplier assertion and dependent catalog/detail/comparison tests now require Waterdrop notices to be disabled, have no href or target, and not be anchors. The search/photo suite separately counts 48 other supplier anchors and 16 blocked notices. Waterdrop detail tests retain their exact ordinary editorial-source checks. This changes verification only; no affiliate URL, product fact, photo or activation setting changes.

## Additional source check

Read the ordinary official [200 W N-Type panel page](https://eu.renogy.com/products/renogy-16bb-n-type-200-watt-24v-solar-panel) and [Rover Li 40 A controller page](https://eu.renogy.com/products/rover-li-40-amp-mppt-solar-charge-controller). Both resolve to the named product family. The panel page offers multiple powers and pack quantities, so a parent URL should not be treated as proof of a pinned variant. Existing exact photo provenance identifies single-unit selections. Changing those canonical destinations and their short tracking mappings requires a separate exact-destination verification; no tracking endpoint was followed or guessed in this pass. No live price, stock, dispatch or shipping promise was imported.

## Next commercial priorities

1. Obtain authenticated Impact reporting and exact issued missing mappings through the existing account. Preserve ordinary fallbacks until each destination and variant is evidenced; do not create artificial test clicks.
2. Obtain Waterdrop EU programme approval and eligible destination links before any Romanian affiliate activation. The DE contract is not EU-wide permission.
3. Obtain publication permission or specific approved partner creatives for the 29 withheld model photos. Keep exact model identities and neutral placeholders while rights remain unresolved.
4. Execute the updated browser suites on the released commit at the official domain, then record actual results separately from these audit observations.

### Solar link-generation queue

The ordinary-feed subset contains exactly twelve solar rows across the three families below. They are a candidate reconstruction of the outstanding solar request from existing feed/register identities, not confirmation that the original email listed exactly these rows. The original request in thread `1a100fc84d82a512` should be checked before contacting a manager again. Full generated queue evidence for all 150 ordinary rows is retained under ignored `.task-work/mission-20261104/renogy-link-generation-queue.json`; issued tracking URLs are deliberately blank.

| Family | Feed SKU | Feed row kind | Selected option recorded in feed |
| --- | --- | --- | --- |
| [Lightweight suitcase](https://eu.renogy.com/products/renogy-400w-lightweight-portable-solar-suitcase) | 8827104461057 | Parent | Unselected; do not add this product-level ID as a variant |
| Lightweight suitcase | 46674258985217 | Variant | 300 W |
| Lightweight suitcase | 46674259017985 | Variant | 100 W |
| Lightweight suitcase | 46674264785153 | Variant | 220 W |
| [ShadowFlux 200 W](https://eu.renogy.com/products/renogy-200w-shadowflux-anti-shading-n-type-solar-panel) | 8827108622593 | Parent | Unselected; do not add this product-level ID as a variant |
| ShadowFlux 200 W | 49259071308033 | Variant | 1 Pack with Z bracket, as feed-labelled |
| ShadowFlux 200 W | 46435561603329 | Variant | 1 Pack |
| ShadowFlux 200 W | 46948494967041 | Variant | 4 Pack with Z bracket, as feed-labelled |
| ShadowFlux 200 W | 49394288787713 | Variant | 6 Pack with Z bracket, as feed-labelled |
| ShadowFlux 200 W | 49394288820481 | Variant | 8 Pack with Z bracket, as feed-labelled |
| [Solar blanket](https://eu.renogy.com/products/200w-400w-solar-panel-blanket) | 8865886470401 | Parent | Unselected; do not add this product-level ID as a variant |
| Solar blanket | 46563072180481 | Variant | 200 W |

The feed labels describe identities, not a new claim of free accessories, quantities delivered, stock or present offers. The separate reviewed suitcase 400 W, ShadowFlux two-pack and blanket 400 W identities already have mappings and are excluded from this ordinary subset. Generate any future links only through authenticated Impact, verify selected merchant variants, then record exact returned links and enable only reviewed destinations. Existing raw-feed ordinary destinations and public gates stay unchanged.

Of the other ordinary rows, 101 are the Worry-Free Purchase family. The 150 count therefore must not be described as 150 unmonetized equipment models or prioritized purely to increase link counts.

### Same-session continuation

The authenticated Impact generator became accessible after the initial audit. All twelve solar entries above now have returned exact links, and ordinary merchant JSON confirmed the three parent IDs and nine selected variants. [Generation and integration provenance](renogy-issued-solar-links-2026-11-04.md) supersedes the pending-generation state for this subset. The saved href register now contains the twelve release expectations; expected feed coverage is 227 tracked/138 ordinary, pending production recount. No network click or financial outcome is inferred from generating the links.

Sessions, organic impressions/clicks, Impact clicks/actions, approved/reversed commission and payouts remain unverified by this audit. No sales or revenue uplift is claimed. No duplicate applications, correspondence, paid campaigns, purchases or accounts were created.

Session follow-up: authenticated Impact generation subsequently supplied all twelve solar mappings above. They were verified against ordinary merchant identity JSON, integrated without changing canonical models/images, and published at ef5e342. Live feed coverage is now 227 tracked/138 ordinary. See `renogy-issued-solar-links-2026-11-04.md` and `monetization-mission-2026-11-04.md` for provenance, refreshed Impact click/action baseline and bounded production verification. The earlier 215/150 table is the audit's starting snapshot.
