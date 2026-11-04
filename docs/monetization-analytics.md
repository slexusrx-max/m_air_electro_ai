# Commercial funnel measurement — 4 November 2026

This is the application event contract, not evidence of an active reporting property, received events or revenue. A valid `NEXT_PUBLIC_GA_MEASUREMENT_ID` selects GA4; otherwise the existing exact-domain `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=mairelectroai.com` selects Plausible. Neither configured means optional measurement stays off. Only one collector is selected. Record actual activation and receipt evidence using [the operations runbook](ga4-operations.md).

## Event mapping

| Application event | GA4 event | Trigger and interpretation |
| --- | --- | --- |
| `pageview` | `page_view` | One public route view after consent; route returns can produce another view |
| `product_view`, `kind=product` | `view_item` | A real, identified catalog model detail is displayed; not a view of every catalog card |
| `product_view`, `kind=equipment-class` | `equipment_class_view` | Technical equipment-role detail; never a purchasable GA4 item |
| `product_view` without kind | `product_view` | Compatibility fallback; do not merge into identified model views without checking its producer |
| `product_compare_add` / `product_compare_remove` | Same names | A successful selection change, per affected product ID; clear-all removes each selected model |
| `comparison_view` | Same name | A populated comparison is displayed; not a selection change |
| `calculator_start` | Same name | First edit of a live calculator input, including invalid input |
| `calculator_complete` | Same name | An edited valid result settles for 1.2 seconds; valid revisions may produce multiple events |
| `finder_start` | Same name | First finder interaction |
| `finder_complete` | Same name | A valid selection result is requested; not an order or a compatibility guarantee |
| `supplier_outbound` | Same name | A supplier CTA is activated, with ordinary or active tracking |
| `affiliate_click` | Same name | The same CTA has server-resolved active tracking; subset of `supplier_outbound` |

Plausible uses the application event names. Older `supplier_outbound_click`, `comparison_add` and `finder_result` names remain compatibility inputs, not additional events emitted alongside the canonical names. Segment reports at each deployed change timestamp. Earlier finder results must not be counted twice as calculator completions.

`view_item.items` contains the canonical catalog `item_id`, known `item_brand`, category and known public feed SKU. It sends no invented `price`, `value`, `currency`, `item_variant` or MPN. The public feed SKU does not establish a manufacturer part number. This follows the item structure in [Google's ecommerce event documentation](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce). This affiliate marketplace has no merchant checkout: do not relabel supplier departure as `purchase`, `add_to_cart` or `begin_checkout`.

## Public dimensions

| Application property | GA4 parameter | Meaning and availability |
| --- | --- | --- |
| `product` | `product_id` | Stable catalog ID, or `renogy-feed-{public SKU}` for a raw feed row |
| `supplier` | `supplier` | Catalog provider ID; `other` is a valid non-integrated provider |
| `category` | `category` | Existing catalog category; raw feed uses `supplier-entry`, not an invented technical classification |
| `language` | `site_locale` | `ro` or `en` |
| Public route | `source_page` | Path without query or fragment |
| `kind` | `item_type` | `product` or `equipment-class`; raw feed rows do not pretend to be reviewed catalog models |
| `brand` | `brand` | Existing model brand: Renogy, Waterdrop, PECRON or BLUETTI; not a claim about a legal manufacturer entity |
| `sku` | `public_sku` | Existing documented merchant/feed identifier; omitted where unknown |
| `tracking` | `tracking_status` | `active` or `ordinary` from the actual resolved outbound CTA |

Product detail, comparison add/remove and supplier departures receive the public context available to their producer. Comparison grouping still uses the existing technical role; analytics receives the catalog category separately. Only minimal public metadata is serialized into the existing comparison context; the analytics client does not import the catalog. Calculators/finders send locale and source path, not inputs or product attributes they do not possess. A comparison page view is an aggregate usage event, not four fabricated product views.

The Waterdrop Romania notice has no supplier anchor and emits no supplier departure. Tracking status is determined by the existing supplier gates, not by a brand name, an application approval or a browser-side guess. Raw feed parent IDs remain parent identities and are not relabelled as exact variants.

## Privacy and attribution boundary

Measurement requires fresh, unexpired, provider-bound explicit consent (`mair-analytics-consent-v3`, 180 days), exact public origin `https://mairelectroai.com`, no Do Not Track/Global Privacy Control and no browser automation. Older consent is not silently carried over to GA4. Private/authentication/workspace routes are excluded. Withdrawal disables further GA dispatch and clears queued site events; requests already received by a provider cannot be recalled by this control.

The GA-only loader does not configure Google Ads. `ad_storage`, `ad_user_data` and `ad_personalization` remain denied; Google Signals and ad personalization signals are disabled in application configuration. Manual clean-path pageviews require automatic enhanced-measurement pageviews/history tracking to be off in the GA4 web-stream settings before activation; verify those settings separately. Missing configuration does not load a Google script through this integration.

No account identifiers, email, form content, calculation values, budget, full supplier/tracking URL, query string or fragment is sent by this instrumentation. Page title is a clean path. GA4 receives only the HTTPS origin, followed by `/`, of an exactly allowlisted Google, Bing, DuckDuckGo or social referrer; its path, query and fragment are discarded. Unknown hosts, credentials and nonstandard ports produce an empty referrer. The current allowlist covers selected Google domains (`.com`, `.ro`, `.de`, `.hu`, `.co.uk`), Bing, DuckDuckGo, Facebook, Instagram, YouTube and `t.co`, including only the explicit host variants in `safeAcquisitionReferrer`. Plausible does not receive this acquisition referrer.

**Acquisition reporting remains limited:** known origin-only referrers can support broad source attribution, but other sources and UTM/campaign values are omitted. Do not describe GA4 Organic Search sessions or campaign attribution as complete. Use Search Console's separate organic impressions/clicks alongside the observed GA4 data. GA4 may create its own analytics identifiers after consent; this is not an anonymous first-party event server.

GA4 configuration sets `cookie_expires=15552000` seconds (180 days) and `cookie_update=false`, so ordinary subsequent visits do not slide the configured cookie expiry forward. This is separate from the 180-day consent record and does not configure GA4 property-level server data retention. Inspect and record the property's actual retention and reset-on-activity settings separately. See Google's [cookie configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) and [data retention controls](https://support.google.com/analytics/answer/7667196).

Mounted detail views can record after consent is granted; repeated consent notifications do not duplicate that view. Earlier interactions are not collected retroactively. Consent, browser privacy controls, blockers, configuration and reporting delays reduce observability. A return value indicating an event was queued is not backend receipt evidence.

## Denominators and financial authority

- Requested outbound CTR: affiliated departure **event count from the relevant product detail pages** / consented sessions that visited those same eligible detail pages, with matching time range, locale, country and supplier scope. Label this as affiliate click events per eligible session; repeat clicks can exceed 100%.
- Session departure rate: eligible detail sessions with at least one `affiliate_click` / those eligible detail sessions. Use a session segment, not an event count divided by site-wide sessions.
- Homepage, finder and raw-feed departures are separate source-path groups. Do not divide them by a detail-only denominator. Raw `view_item` event counts are not sessions.
- Affiliate conversion rate: verified qualifying Impact actions / Impact recorded clicks for the same program and defined reporting window. State action status and reporting date basis; attribution lag means a same-month ratio is not necessarily a click cohort conversion rate.
- Revenue per affiliate click: approved Impact commission / Impact recorded clicks, with the same program, window and currency. Keep pending, approved, reversed and paid amounts separate.

Never sum `affiliate_click` and `supplier_outbound`. A site departure is not proof of a network-recorded click, customer, sale or commission. Compare their counts with caveats for reporting delays, attribution windows, privacy blockers, test exclusions and time zones; a difference alone proves neither fraud nor broken tracking. **Impact records are the authority for qualifying actions, commissions, reversals and payouts.** Unknown figures stay `UNKNOWN`; a verified zero is `0`; an undefined ratio is `N/A`.

Use [the monthly template](ga4-monthly-performance-template.md) to report traffic, engagement and verified network finances without merging them.
