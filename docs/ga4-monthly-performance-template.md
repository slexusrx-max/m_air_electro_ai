# M Air Electro AI — monthly performance template

Copy for each completed reporting period. Replace placeholders only with verified source values; leave unavailable values `UNKNOWN`, verified zero `0`, and mathematically undefined ratios `N/A`. This blank template contains no current performance claims and schedules no reporting automation.

## Reporting context

| Field | Value |
| --- | --- |
| Calendar period and inclusive dates | `UNKNOWN` |
| Extraction time / reporting time zone per source | `UNKNOWN` |
| Production SHA / deployment verified | `UNKNOWN` |
| Analytics provider / property / stream | `UNKNOWN` |
| Measurement active dates / interruptions | `UNKNOWN` |
| Consent version / configuration verified | `UNKNOWN` |
| Analytics cookie expiry / renewal setting verified | `UNKNOWN` — application requests 180 days, non-sliding |
| Property data retention / reset-on-activity setting | `UNKNOWN` — separate from cookie and consent expiry |
| Country, locale, device and page filters | `UNKNOWN` |
| Internal/test exclusions and known limits | `UNKNOWN` |
| GA4 custom definitions / key events actually configured | `UNKNOWN` |
| Search Console property / search type / link status | `UNKNOWN` |
| Impact account / program filters / currency / date basis | `UNKNOWN` |
| Evidence exports or authorized report references | `UNKNOWN` |

## Website and organic discovery

| Metric | This period | Previous comparable period | Source / definition |
| --- | --- | --- | --- |
| Website sessions | `UNKNOWN` | `UNKNOWN` | GA4, consented observed sessions; not total people |
| Observed users | `UNKNOWN` | `UNKNOWN` | Exact GA4 metric name required; not clicks |
| Google organic impressions | `UNKNOWN` | `UNKNOWN` | Search Console, matching filters |
| Google organic clicks | `UNKNOWN` | `UNKNOWN` | Search Console, not GA4 sessions |
| Google organic CTR / average position | `UNKNOWN` | `UNKNOWN` | Search Console; do not average page CTRs unweighted |
| GA4 Organic Search sessions | `UNKNOWN` | `UNKNOWN` | Exact allowlisted origin-only referrers can support broad attribution; other sources and campaign parameters are omitted; never substitute GSC clicks |
| Genuine qualified outbound target | 100–300 | `N/A` | Objective only, not an achieved metric or guarantee |

## Product selection funnel

| Metric | This period | Previous comparable period | Scope |
| --- | --- | --- | --- |
| Identified model `view_item` events | `UNKNOWN` | `UNKNOWN` | Excludes equipment classes |
| `equipment_class_view` events | `UNKNOWN` | `UNKNOWN` | Technical role pages |
| Compare additions / removals | `UNKNOWN` / `UNKNOWN` | `UNKNOWN` / `UNKNOWN` | Event counts, not distinct customers |
| Populated comparison views | `UNKNOWN` | `UNKNOWN` | `comparison_view` |
| Calculator starts / completions | `UNKNOWN` / `UNKNOWN` | `UNKNOWN` / `UNKNOWN` | Revisions can produce repeated completion events |
| Finder starts / completions | `UNKNOWN` / `UNKNOWN` | `UNKNOWN` / `UNKNOWN` | Requirement estimates, not orders |
| Supplier departures, all tracking states | `UNKNOWN` | `UNKNOWN` | `supplier_outbound` |
| Affiliated departures | `UNKNOWN` | `UNKNOWN` | `affiliate_click`; subset of supplier departures |
| Eligible product detail sessions | `UNKNOWN` | `UNKNOWN` | Saved session segment, filters documented below |
| Those sessions with ≥1 affiliated departure | `UNKNOWN` | `UNKNOWN` | Same session/page/supplier scope |
| Affiliated departure events from those detail pages | `UNKNOWN` | `UNKNOWN` | Same numerator scope; excludes homepage/feed/finder-only departures |
| Affiliate click events / eligible detail session | `UNKNOWN` | `UNKNOWN` | Requested outbound CTR; repeat clicks may exceed 100% |
| Eligible session departure rate | `UNKNOWN` | `UNKNOWN` | Sessions with affiliated departure / eligible detail sessions |

Saved denominator definition, source-page scope and eligible supplier/region rules: `UNKNOWN`.

Break down by public product ID/SKU, supplier, category, locale and source path where the data supports it. Unknown SKU stays missing. Use a separate raw Renogy feed section (`category=supplier-entry`); a parent row is not an exact reviewed variant. Waterdrop DE's Romania-blocked CTA must not appear as an active eligible departure. Never sum overlapping departure events.

## Impact network and finance

Refresh Impact for each cycle. The historical 21 October–3 November 2026 baseline (19 Renogy clicks, 6 Waterdrop clicks, 0 actions) is not a current-period report and must not be carried forward as live data. Clicks are not unique customers; historical test clicks may be present.

| Verified network metric | Renogy program 14864 | Waterdrop DE program 19363 | Combined, only where comparable |
| --- | --- | --- | --- |
| Recorded clicks | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Recorded qualifying actions, status defined | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Pending commission and currency | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Approved commission and currency | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Reversed actions / commission and currency | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Confirmed payouts / payout date / currency | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Qualifying actions / network clicks | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Approved commission / network click | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Action status/date basis and attribution caveats: `UNKNOWN`. Do not mix event-date and click-cohort reports without explanation. Do not combine currencies without a disclosed verified conversion method. A commission approved this month may originate from older clicks; a payable balance is not a confirmed bank receipt.

## Reconciliation and next actions

| Observation | Evidence / limitation | Action / owner |
| --- | --- | --- |
| Site affiliated departures versus Impact recorded clicks | `UNKNOWN` — check program/region, period/time zones, lag, privacy blockers and tests | `UNKNOWN` |
| Search pages gaining or losing impressions/CTR | `UNKNOWN` — compare matching GSC filters and canonical pages | `UNKNOWN` |
| Product/SKU/source-path departures and selection friction | `UNKNOWN` — sample size and consent coverage required | `UNKNOWN` |
| Link/catalog/measurement defects found and fixed | `UNKNOWN` | `UNKNOWN` |
| Access or regional eligibility blockers | `UNKNOWN` | `UNKNOWN` |
| Next highest-impact change and measurable hypothesis | `UNKNOWN` — hypothesis, not promised growth | `UNKNOWN` |

Definitions and controls: [event contract](monetization-analytics.md), [GA4 and Search Console operations](ga4-operations.md). Missing reporting access is a documented blocker; it is never evidence of zero traffic or zero revenue.
