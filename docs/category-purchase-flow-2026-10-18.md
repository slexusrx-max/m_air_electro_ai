# Category search and purchase flow — 18 October 2026

## Scope

This pass retains the existing design, routes, catalog records, model photos and supplier configuration. It adds descriptive RO/EN metadata and selection advice to `/marketplace/inverters` and `/marketplace/solar/panels`, separates real-model and equipment-class result counts, labels category images on class cards as illustrative rather than purchase offers, and explains the external purchase flow on category pages. The purchase explanation follows the catalog so it does not displace product discovery.

The Romanian inverter title is **Invertoare pentru baterii: alegere și comparație în România**. The solar-panel title is **Panouri solare fotovoltaice: comparație și dimensionare**. Short navigation titles and H1 headings remain unchanged. Canonicals, hreflang, sitemap membership and filtered-page noindex rules remain unchanged.

No product, price, stock, delivery promise, review, commission rate or new tracking link was added. New Renogy listings remain pending exact specifications, permitted assets and the outstanding EU/Romania attribution clarification.

## Production CTA audit

Read-only HTML inspection of `https://mairelectroai.com/search?kind=product` returned HTTP 200. Its deployment metadata identified `95b4c3b4bc91e95484357201fcdeaea5e76fe420`, also the clean local and remote main baseline. The page exposed 16 model CTAs:

| Models | Live CTA state | Destination evidence |
| --- | --- | --- |
| PECRON E1500LFP, E2400LFP, F3000LFP | Ordinary links | Three exact EU product paths, not shop homepages |
| BLUETTI Elite 100 V2, Elite 200 V2, Apex 300 | Ordinary links | Three exact EU product paths, not shop homepages |
| Waterdrop G3P600, G3P800, X12 | Active tracked links, labelled and `rel=sponsored` | Three issued short URLs resolve to the exact German model paths; merchant responses then return HTTP 403 |
| Renogy Core Mini 100 Ah, Core Mini 200 Ah, 200 W panel, 1000 W inverter, 50 A DC-DC and Rover 40 A | Active tracked links, labelled and `rel=sponsored` | Six issued short URLs resolve to the exact EU model paths; merchant responses then return HTTP 403; Romanian commission eligibility remains unverified |
| Renogy 20 A DC-DC | Ordinary link | Exact EU product path |

The six Renogy short-link suffixes observed were respectively `2RqKQ7`, `R0jRON`, `dy0R9j`, `MKxQDq`, `yZ3re3` and `Pz9are` on `https://renogy.sjv.io`. Waterdrop URLs matched the three existing mappings in `tests/supplier-link-expectations.ts`.

**Live Renogy tracking is already partially active.** Older documents and tests describing all Renogy links as ordinary do not describe this observed production configuration. The current changes do not modify it. Active markup is not evidence that a Romanian purchase qualifies for commission.

A subsequent redirect audit inspected the final request URI even when the merchant returned HTTP 403. All six Renogy and all three Waterdrop tracked links reached the exact model paths recorded in the catalog. The final product-page bodies and stock/specifications could not be rechecked because of those access blocks. The supplied general link `https://renogy.sjv.io/E0XabP` instead reached **`https://www.renogy.com/`**, not the EU store or a model page. It was not substituted for any product CTA. Redirect evidence records only public paths, omitting click identifiers and tracking query parameters.

## Analytics inspection

`components/analytics-consent.tsx` uses a shared document listener and mutually exclusive `supplier_outbound_click` / `outbound_click` branches. `SupplierLink` supplies public catalog identifiers through data attributes and has no additional event sender. No listener or event was added.

`lib/analytics.ts` requires current accepted consent and the matching configured Plausible domain, excludes DNT, automated browsers, local hosts and private routes, and strips query/hash data. Supplier events include only validated product, supplier, category, language and source path. Existing tests cover these gates and payload restrictions. This is source inspection, not verification of production Plausible configuration, event receipt, attribution or revenue reporting. No analytics grant or configuration was changed.

## Outstanding account checks

This execution session exposed no browser/app bindings and no native window or computer API. Impact terms/eligibility, Awin Publisher ID and Search Console access therefore remain unverified. An authorized browser or native desktop connection must be made available to this task before those account checks can proceed. No credentials were extracted or created, and no account permissions or terms were changed.

## Release status

This is a review candidate, not a production release. Confirm the final commit and validation results from the handoff before publishing. After deployment, check the new titles and model/guide counts on both language routes, preserve the live tracked/ordinary CTA mix, and verify the deployed commit. Do not run older Renogy browser assertions that require all production CTAs to be ordinary without first reconciling the live configuration.


## Validation

- All 100 unit tests passed, including supplier gating and analytics consent/payload restrictions.
- Lint, the 419-key language check, TypeScript and the production build passed.
- Four focused browser scenarios cover both target categories in RO/EN at 390 and 1440 px: metadata, canonical URLs, filtered noindex, record counts, supplier destinations, class-image notes, no class purchase links, layout overflow and accessibility.
- Local crawl visited 277 routes with no failures, orphans or redirects. Screenshot review retained the existing visual design.
- Production browser/account access is unavailable in this session; production HTTP inspection is not a substitute for account eligibility verification.
