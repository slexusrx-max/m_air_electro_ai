# Catalog discovery — 5 November 2026

## Problem and change

The homepage's PECRON/BLUETTI image-placeholder text overlapped the model names: a photo-sized SVG inherited a fixed height inside a shorter placeholder. A read-only Production probe at 1440px reproduced the text extending roughly 27px below its visual container. The placeholder now sizes to its content and uses a bounded icon. Withheld photographs remain withheld; exact official photographs and artwork are unchanged.

The unfiltered Marketplace showed record type, brand and sorting before any results. Search now remains visible while those additional controls sit in a native, keyboard-operable **Filters and sorting / Filtre și sortare** disclosure. Applied non-search filters reopen it, preserving their values after navigation and reload. Category/search-page forms start expanded. Technical filters, query normalization, pagination, clear controls and supplier gates are unchanged. No new client script is required.

## Experiment and evidence

Hypothesis: less space before results and readable hero cards reduce friction in equipment discovery. This is not a measured conversion increase.

At RO 390×950, the same first-party browser measurement found:

| Measure | Baseline Production | Changed local build |
| --- | ---: | ---: |
| Filter form height | 418.05px | 252.77px |
| First product top from viewport origin | 936.56px | 771.28px |

Thus the form shrank and the first product moved up by 165.28px. This is a layout result, not an audience or revenue metric. Baseline main/Production was `257739a6cce30e603b9a7742e99baa38135e03e8`.

The commercial path is tested in both RO/EN: search 100Ah, apply Renogy/model filters, reload, select two same-role models, open comparison, inspect supplier hrefs without navigating away, then clear all filters. Existing 0/1/2/4/saved comparison and mobile navigation tests remain.

## Pre-release validation

- 210 unit tests; 419 declared i18n keys; typecheck; lint with zero errors and one existing catalog image warning; production build with the actual public GA4 ID.
- 23 browser cases: 10 RO/EN layout/accessibility cases at 390/430/768/1366/1440px, two search/comparison journeys and 11 comparison regressions.
- 14 isolated GA4 mocked-dispatch cases passed. These use stubbed providers and do not establish actual GA4 receipt.
- Production baseline regression failed on the real overlap assertion after correcting an initial test-selector error. Initial local browser attempts encountered sandbox/browser-location and localhost access restrictions; successful host-environment runs replace those failed attempts.
- All new browser scenarios block external measurement and merchant navigation. Production automation exclusions stay enabled. No synthetic affiliate clicks, purchase or account creation.

Private source/report observations and generated evidence remain under ignored `.task-work/growth-20261105/`. Application changes do not update partner terms, prices, product records, photos or tracking destinations.

## Acceptance and next decision

Production release and same-SHA browser acceptance must be recorded after publication; localhost is not delivery. Evaluate the experiment using relevant consented Marketplace sessions and subsequent product views/supplier departures once genuine provider receipt and a usable denominator are established. No uplift threshold is claimed from the current small sample.

Next commercial priority: validate remaining genuine Renogy equipment deep-link gaps using the separately prepared PR #55 queue, preserving exact variants and issuing links only through the official Impact workflow. Do not treat ordinary protection/service rows as missing equipment models.
