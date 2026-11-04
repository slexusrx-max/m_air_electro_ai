# Renogy solar link generation — 4 November 2026

Twelve links were returned by the authenticated Impact **Create a Link** interface for Renogy programme **14864**, publisher **7767803**, during this session. Each ordinary landing-page field was populated with the exact parent or variant destination before reading the resulting short link. No short link was guessed, assembled from IDs, or requested for an attribution test.

The public source-to-issued-link mapping is recorded verbatim in [the supplemental data](../data/renogy-issued-solar-links-2026-11-04.json), with generation timestamps, feed identities and merchant variant SKUs. The entries comprise three parent product pages and nine selected variants:

| Family | Parent feed ID | Newly mapped variant IDs |
| --- | --- | --- |
| Lightweight suitcase | 8827104461057 | 46674258985217 (300 W), 46674259017985 (100 W), 46674264785153 (220 W) |
| ShadowFlux 200 W | 8827108622593 | 49259071308033 (one with bracket), 46435561603329 (one without bracket), 46948494967041 (four), 49394288787713 (six), 49394288820481 (eight) |
| Solar blanket | 8865886470401 | 46563072180481 (200 W) |

The already-reviewed suitcase 400 W, ShadowFlux two-panel pack and blanket 400 W mappings are preserved. Parent IDs are product-level identities, never selected variant IDs. Current merchant option names are identity evidence, not new promises of accessories, discounts, stock or delivery.

## Ordinary merchant verification

At **2026-11-04T13:45:30.685Z**, all three ordinary manufacturer endpoints returned HTTP 200:

- [Suitcase identity data](https://eu.renogy.com/products/renogy-400w-lightweight-portable-solar-suitcase.js)
- [ShadowFlux identity data](https://eu.renogy.com/products/renogy-200w-shadowflux-anti-shading-n-type-solar-panel.js)
- [Blanket identity data](https://eu.renogy.com/products/200w-400w-solar-panel-blanket.js)

Their product IDs and all nine variant IDs match the saved feed records. The manufacturer SKUs identify EU variants. Source verification used ordinary manufacturer URLs only; no Impact or supplier tracking endpoint was requested. Filtered identity evidence is retained under ignored `.task-work/mission-20261104/renogy-merchant-variants.json`; authenticated UI captures are retained in the same ignored session directory. No account credentials, raw feeds, prices or financial records are published here.

## Integration and safeguards

The existing Renogy provider merges these exact mappings before explicit deployment overrides. Existing approval, global tracking, EU verification, programme and exact-origin gates remain mandatory. Missing activation or origin verification continues to yield ordinary supplier URLs. The strict supplier policy accepts only the nine newly reviewed exact variant destinations, in addition to previous reviewed destinations; it does not broadly accept arbitrary Shopify variant IDs or extra query parameters. Parent feed rows resolve as parent destinations.

No canonical model, photograph, technical rating, price, stock, Waterdrop regional block or other supplier gate changes. The feed href register changes only these twelve formerly ordinary rows. Expected production coverage is **227 tracked / 138 ordinary** across the existing 365 feed identities; this is a release expectation until the deployed commit is independently recounted. The other 353 expected hrefs retain their previous values.

Unit regressions verify exact identity-to-link association, unique short links, parent/variant distinction, strict URL rejection, disabled configuration and existing mappings. Browser verification reads public hrefs without following supplier links. Creation of a tracking link and successful page rendering do not prove an Impact-recorded click, qualifying action, commission or payout. Production release and full-suite results are recorded by the coordinating release report.
