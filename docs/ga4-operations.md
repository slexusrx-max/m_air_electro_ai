# GA4 operations and Search Console — 4 November 2026

This runbook describes steps and evidence requirements. It does not establish that a GA4 property, stream, custom definition, key event or Search Console link has been created. Keep credentials and account screenshots out of tracked files. Production code, deployment, provider configuration and backend receipt are separate checks.

Setup snapshot, 4 November 2026: the authorized owner browser reached the GA4 account/property draft for `M Air Electro AI`, with Romania time zone and EUR selected. The terms dialog had not been accepted. This draft is not evidence of a completed property, web stream, Measurement ID, activated collection or provider receipt. Record the later confirmed state separately; do not infer it from draft form selections.

## Activate a verified stream

1. Inspect the owner's existing Analytics account/property and current web streams first. Record the property ID, stream name, public Measurement ID, time zone, currency and exact website URL in authorized operational evidence. Do not create a duplicate property merely because code has no ID.
2. Verify the selected stream represents `https://mairelectroai.com`. Inspect existing tags, linked products and enhanced measurement. Turn off automatic pageviews, browser-history pageviews and other enhanced-measurement event collection for this stream before activating this manual, privacy-limited adapter. Record the settings readback. Audit automatic form/outbound measurements instead of assuming the application allowlist controls them.
3. Configure the verified public ID as `NEXT_PUBLIC_GA_MEASUREMENT_ID` through the established environment workflow. Never substitute the fixture `G-TEST000001`. This public variable is built into the client: redeploy and verify the official domain and deployed SHA. Valid GA4 configuration takes precedence over Plausible; do not run both through this adapter.
4. Verify current RO/EN consent wording. Fresh v3 acceptance is specific to the selected provider; previous v2 acceptance is insufficient. Check rejection, no configuration, withdrawal, Do Not Track, Global Privacy Control and private-route behavior. Advertising consent stays denied. No Ads conversion import, campaign launch or spend is part of this activation.
5. Prove one Google loader, one intended `config` destination and `send_page_view:false`; inspect a clean public path. The application supplies path-based title/location without queries. GA4's referrer is the origin plus `/` only for the exact HTTPS acquisition-host allowlist; unknown hosts, credentials and nonstandard ports produce an empty value. Verify that no referrer path/query/fragment or arbitrary UTM values enter the payload. Ensure the web stream does not create duplicate history events.
6. Record a genuine authorized, consented public visit in Realtime or the provider's supported debug workflow and compare a non-commercial detail view with expected `view_item`. Record timestamp, event name, public ID and receipt evidence, excluding personal data. A data-layer command or HTTP request alone does not prove backend reporting receipt.

Playwright/automation is excluded in Production. Unit/local isolated mocks may test permitted dispatch only with all external endpoints stubbed; never bypass the real Production automation guard to generate test traffic. Read-only production QA must not follow affiliate tracking URLs, create accounts, send mail or place orders. Testing a product view is sufficient to verify the GA item payload; network click proof requires separate genuine Impact evidence.

The application requests fixed 180-day analytics cookie expiry (`cookie_expires=15552000`, `cookie_update=false`); later page loads do not refresh that configured expiry. This does not establish the property's server data retention. In the actual property settings, inspect and record event/user data retention and the separate reset-on-new-activity option. The consent record also has its own 180-day expiry. Do not merge these three controls into a claim that all provider data disappears after 180 days. Google's [configuration reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) and [retention documentation](https://support.google.com/analytics/answer/7667196) describe the distinct controls.

## Reporting configuration

Use the [event contract](monetization-analytics.md). Propose event-scoped definitions for `supplier`, `category`, `site_locale`, `item_type` and `tracking_status` first. Add `source_page`, `product_id`, `brand` and `public_sku` only where a report needs them; product/SKU dimensions have higher cardinality. Use built-in page/item dimensions where they already answer the question. Record scope, exact parameter, creation date and status; do not claim retroactive availability. Google explains [custom dimension scope and reporting setup](https://support.google.com/analytics/answer/14240153).

The item array already supplies `item_id`, `item_brand` and `item_category` for `view_item`. A custom feed SKU is not an item variant. If item-scoped `public_sku` analysis is needed, document and create its distinct item-scoped definition deliberately rather than duplicating every event dimension.

`affiliate_click` is a candidate intent key event, and `finder_complete` may be a secondary goal. Mark them only as an explicit reporting decision and record the actual admin readback. Do not claim they are registered from a source-code deployment. Do not create a purchase key event from an outbound click. Impact remains the finance source.

Create a session segment for relevant eligible product detail visits and a second segment for those sessions with an affiliated departure from those pages. Match supplier, locale/country, dates and page scope. Save the segment definitions with the monthly report. `view_item` count does not supply a sessions denominator, and all-site sessions do not supply an eligible-product denominator.

## Search Console integration

1. Inspect existing links in GA4 Admin before creating one. Select the existing verified domain property for `mairelectroai.com` or the appropriate verified HTTPS URL-prefix property; record its exact type/name and coverage.
2. Confirm the operator has the required GA4 Editor access and Search Console verified ownership. Preserve authentication/2FA boundaries; missing access is a blocker, not permission to use another property.
3. Link that Search Console property to the verified production web data stream. Review the selected property/stream before submitting. Record completion time and settings evidence. Google's [Search Console linking instructions](https://support.google.com/analytics/answer/10737381) explain access requirements, compatible dimensions and report availability.
4. Check whether the Search Console report collection is published in Analytics. Publish it through the authorized account workflow if needed, then verify the query and organic landing-page reports. Do not call the integration complete merely because the collection is visible without data.
5. Compare Search Console's own report for the same range, search type, country, device and canonical URL scope. Preserve search impressions/clicks/CTR/position separately from GA4 sessions/engagement and from Impact clicks/actions. Search Console and Analytics use different measurement systems; [Google's comparison guide](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console) explains discrepancies.

The current clean-path/origin-only referrer collection supports broad attribution for known Google/Bing/DuckDuckGo/social origins while limiting other external acquisition sources and omitting arbitrary campaign parameters. Search Console integration exposes aggregate Google organic evidence; it does not restore omitted sources/campaign parameters, recover non-consenting sessions or join a query to a named visitor. Do not describe reported Google organic clicks as website sessions or GA4 acquisition reports as complete.

## Evidence checklist for each release/report

| Layer | Required evidence | Status until checked |
| --- | --- | --- |
| Code contract | Focused tests, privacy checks, public metadata/unknown handling | `UNVERIFIED` |
| Build/deployment | Required checks, main SHA and matching official-domain production deployment | `UNVERIFIED` |
| Configuration | Correct live stream ID, automatic collection settings, environment and provider selection | `UNVERIFIED` |
| Dispatch | Authorized consented clean event; no duplicate destination or sensitive fields | `UNVERIFIED` |
| Provider receipt | Realtime/debug/report readback with timestamp and public event context | `UNVERIFIED` |
| Reporting setup | Actual custom definitions/key events/GSC link readback | `UNVERIFIED` |
| Commercial outcome | Fresh Impact actions/approved commissions/payout records | `UNKNOWN` |

Refresh [the monthly template](ga4-monthly-performance-template.md) only from inspected exports or connected reports. Document collection interruptions and incomplete months. A prepared runbook/report template does not configure a scheduled job or imply continuing monitoring.
