# Phase 4 — GA4 and affiliate measurement, 4 November 2026

## Verified starting point

Fetched GitHub main before edits. Main, local HEAD and official-domain deployment metadata were `10e72ab12db2018072ba4bd7b99c004c7a28c494`; Vercel Production `dpl_6VJWGJCdhQvfHmuQ4jXmaZCWQcfX` was READY. Read current AGENTS, README, blueprint, analytics documentation and committed Phase 1–3 reports. Three existing owner edits are excluded: `renogy-feature.tsx`, the original mission report and the Phase 2 report. Their hashes are retained and checked.

## Implementation

The existing central event dispatch now supports **GA4 as the preferred collector**, with the previous Plausible path only as a fallback. The two providers are not dispatched together. The only Google loader is a consent-gated GA4 loader with a validated actual `NEXT_PUBLIC_GA_MEASUREMENT_ID`. No ID or an invalid/example ID leaves it off. The previous bundled Google Ads destination is no longer initialized by analytics consent.

Fresh provider-specific v3 consent is required. Earlier v2 Ads/Plausible acceptance does not authorize GA4. Basic consent mode loads no Google script or measurement before acceptance. Advertising storage, advertising user data, personalization and Google Signals remain disabled. Current public-origin, DNT, GPC, browser-automation and private-route guards apply. Withdrawal immediately disables GA collection and discards queued manual GA events; failed consent persistence fails closed. GA cookies request a fixed 180-day expiry without sliding renewal; this is distinct from property-level retention.

Manual `page_view` events replace automatic pageviews (`send_page_view:false`). The actual stream's Enhanced Measurement, including history changes, must be disabled before activating its ID. Model `product_view` maps to `view_item`; equipment classes map to `equipment_class_view`. Existing compare, calculator, finder, supplier and affiliate events reuse the same handlers. Affiliate departures remain a subset of all supplier departures; neither is a purchase. No purchase, transaction value, commission or payout is manufactured in GA4.

Public product ID, known brand/feed SKU, catalog category, locale, source path and actual supplier tracking state are allowlisted. Unknown SKU stays absent. Comparison's compatibility role remains separate from its analytics category. Page locations/titles exclude query strings and fragments. A small exact allowlist retains search/social referrer **origins only**, never their path, query, credentials or nonstandard ports. Unknown referrers and campaign parameters are omitted, limiting acquisition attribution. Private account contents, search text, calculator values, full affiliate URLs and personal identifiers are not sent by the manual contract.

RO/EN privacy and consent notices reflect the selected provider or explicitly show that analytics is unconfigured. No Accept control is offered when no collector is configured. Existing marketplace navigation, comparison, calculations, supplier URLs and regional gates remain available independently.

## Google account and configuration checkpoint

The existing signed-in Google account showed GA4 Welcome/Create account with no accessible existing property. Prepared the authorized new-account draft: account/property **M Air Electro AI**, Romania time zone (the UI displays GMT+02:00 Romania), currency EUR, Business and Industrial category, smallest 1–10 size bracket for the established individual publisher, traffic and engagement objectives. Optional account data sharing was deselected during preparation; final persisted settings still require readback.

Google then required the Romania-specific **Analytics Terms of Service** and **GDPR data-processing terms**. The final Accept control was not used without the requested owner confirmation. These are actual contractual obligations, not routine technical settings. The owner's Phase 4 instructions and browser confirmation policy require that boundary. Account/property/stream creation, Measurement ID, custom definitions, key events and Search Console linking remain pending at this checkpoint. A draft is not an active property.

Fresh Vercel Production environment inventory contains neither `NEXT_PUBLIC_GA_MEASUREMENT_ID` nor the optional Plausible hostname. No placeholder was configured. No credential, API secret or private token was extracted or committed. Legitimate event receipt in Realtime/DebugView is unverified; a mocked queue, loaded script or successful build is not provider receipt.

The [operations runbook](ga4-operations.md) covers stream settings, production activation, custom definitions, the requested `affiliate_click`/`finder_complete` key events and linking the existing verified Search Console property. The [monthly template](ga4-monthly-performance-template.md) separates sessions, users, events, session-scoped outbound ratios and Impact finance. These documents do not themselves configure a dashboard or link.

## Hosting and financial boundary

Authenticated Vercel team inventory confirms **Hobby**. Official terms restrict Hobby to personal non-commercial use and explicitly include affiliate-focused websites under commercial use. Minimum listed Vercel option: **Pro, USD 20/month**, one deploying seat and USD 20 usage credit; extra seats, overage, add-ons and taxes can add charges. The [plan evidence and recommendation](vercel-commercial-plan-2026-11-04.md) records sources. No plan upgrade, subscription, purchase, campaign or legal acceptance was made by the code release. This hosting mismatch remains an owner decision and is independent of free GA4.

## Measurement limits

No new website users, sessions, CTR, channel performance, sales, approved/reversed commissions or payouts are claimed. The prior GSC 281 impressions/0 clicks and Impact 19+6 clicks/0 actions are dated Phase 3 observations, not a fresh Phase 4 reporting cycle. Impact remains authoritative for recorded clicks, qualifying actions and financial records. Comparing it with GA4 requires compatible dates, time zones, consent coverage and attribution definitions; missing values stay unknown.

## Pre-release verification

210 unit tests passed; i18n validated 419 keys; lint passed with only the existing Renogy feed image warning; TypeScript and the production build passed. Fourteen isolated browser fixtures exercise the real adapter with a fake window and no-op Google endpoint; no real analytics traffic was sent. These cover privacy gates, sanitization, origin-only acquisition, invalid IDs, private/public transitions and withdrawal.

Fresh local application checks passed seven privacy cases (five RO widths plus two existing guard cases) and ten comparison regressions. The known local EN rewrite issue is deferred to real RO/EN production testing, not suppressed by weaker assertions. Two repeated 390/1440 captures verify readable safe-off settings, with no Accept control when unconfigured. The local crawl visited 379 routes with zero failures, orphans or redirects. Production acceptance is recorded below after deployment.

Evidence is ignored under `.task-work/phase4-20261104/`. No synthetic affiliate click, supplier navigation, order, new customer account or contact-form submission was used for QA. No scheduled automation or persistent analytics worker was created.

## Production acceptance

Application commit **`7fc458304b34552bfe004615b66a3d02a26dbda8`** was pushed to main. Vercel Production **`dpl_qHhvq42apEHqBquuwMy4YFVAYq9J`** is READY, and official `/en/privacy` metadata matched the full SHA before testing. The page explicitly reported `data-analytics-provider="none"`; no real Measurement ID was configured. [GitHub Verify run 41884694071](https://github.com/slexusrx-max/m_air_electro_ai/actions/runs/41884694071) completed successfully.

**35 distinct production browser scenarios passed without retries**: ten GA4/privacy/navigation scenarios (RO/EN × 390, 430, 768, 1366, 1440px), two existing automated-telemetry guards, eleven compact-comparison cases, two battery-sizing journeys, six read-only account/anonymous-denial cases and four Waterdrop regional cases. No browser automation exclusion was disabled. Production 390px English and 1440px Romanian consent-panel screenshots were inspected; the safe-off notice and controls are readable. The test fixture's fake GA ID was never used as a Vercel variable or a live collector.

The production crawl visited **379 routes**, with zero failures, orphans or redirects. All **365** first-party Renogy href identities matched the register and the new deployment SHA: **227 tracked / 138 ordinary**, including all twelve previously issued exact links, with zero mapping failures. No external tracking endpoint was followed. Product facts, photos and affiliate mappings changed: **0**. These checks do not prove merchant conversion or Impact attribution.

| Requirement | Final observed status at application acceptance |
| --- | --- |
| GA4 account/property | Prepared draft; required agreements awaiting owner confirmation |
| Web stream / Measurement ID / Vercel value | Not created or configured |
| Production adapter and privacy UI | Deployed and verified with collection off |
| Allowed collection / withdrawal logic | Unit and isolated-browser tests pass; actual GA service behavior still needs activation acceptance |
| Actual GA4 event receipt | Unverified; no legitimate production measurement generated for QA |
| Search Console connection | Not configured; existing GSC property must be reused after stream creation |
| Event implementation | Manual page views, model views, comparison, calculators, finder, supplier/affiliate departures implemented |
| Key events / custom definitions / saved dashboard | Runbook prepared; not configured in a live property |
| Hosting | Hobby confirmed; commercial plan mismatch unresolved; no upgrade purchased |
| Required quality checks | Unit, i18n, lint, typecheck, build and scoped production QA passed |
| Verified traffic / commissions / payouts this phase | Unknown; no fabricated zero or revenue |

Next action is the owner's confirmation of the displayed Romania Analytics and GDPR data-processing agreements. Then finish the stream with Enhanced Measurement disabled, configure the actual public ID only for Production, rebuild, set the requested key events/custom definitions, link the existing Search Console property and verify a genuine consented session in authenticated GA4 reports. Separately resolve the hosting plan with an approved budget or migration decision. Neither elapsed time nor the deployment substitutes for either approval.

The three protected owner files remained hash-identical. The local server was stopped. A documentation-only closeout records this acceptance; final main/domain metadata is checked again after that publication. No new background automation was configured and no continued activity beyond this execution session is claimed.

## 5 November activation addendum

The draft/account-access blockers above are historical. The existing GA4 stream `16274159877` and actual ID `G-RG28QVQF7N` were verified and configured only in Vercel Production. Production SHA `96a75d4c0ef0ad05a53bea00400b3fed43e1c074`, READY deployment, successful CI and 12 production privacy cases establish the activated adapter and retained automation/consent guards. `affiliate_click` and `finder_complete` are registered key events without monetary values; all 307 regions now disallow ad personalization following explicit owner approval. The existing Search Console HTTPS URL-prefix property is linked, and its query/landing-page reports return historical search data. The Reports snapshot now uses Marketing performance. Live website-event receipt is still unverified; custom definitions await actual parameter verification. Full evidence, report scopes and remaining blockers are in [the activation register](ga4-activation-2026-11-04.md). No finance or hosting-compliance conclusion follows from these configuration changes.
