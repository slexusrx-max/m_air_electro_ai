# Phase 3 analytics audit — 4 November 2026

## Outcome

Funnel instrumentation exists, but verified live receipt is still unavailable. No collector/project/subscription was created, purchased or activated by this package. No production event or affiliate click was generated for this audit. The lead agent owns authenticated provider access and final deployment verification.

The lead agent's fresh Production environment-name inspection found no analytics/Plausible/GA4 collector variables. The reported absence of `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is therefore a configuration blocker, not a zero-traffic measurement. Its GA4 browser inspection reached a welcome/create-account flow without an accessible existing property. No GA4 property was created. A possible inaccessible property must not be described as nonexistent everywhere.

Authenticated Vercel CLI inspection could read the metrics schema. A Production `page_view.count` query over the preceding 30 days returned empty summary/data, not proof of zero visits. The custom-event count query grouped by event name returned `payment_required`, requiring Pro/Enterprise. Ignored evidence is in `.task-work/phase3-20261104/vercel-pageviews.txt` and `vercel-custom-events.txt`.

The lead agent's Plausible browser inspection reached an email/password login screen without an authenticated existing project/session. This is a current access gate, not proof that the owner has never held a Plausible account. Supporting access observations are in `.task-work/phase3-20261104/plausible-access.txt` and `ga4-access.txt`. No login credentials were supplied or inferred, and no new project/account was created.

## Existing integrations and smallest justified options

| Candidate | Repository evidence | Required existing authorization/configuration | Decision |
| --- | --- | --- | --- |
| Plausible | `lib/analytics.ts` directly POSTs to `https://plausible.io/api/event`; one central event contract | Accessible authorized site for `mairelectroai.com`, existing service entitlement, Production build variable `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=mairelectroai.com`, exact canonical custom-event goals and reporting access | Smallest code change if an existing authorized project is found. The hostname variable alone cannot provision a site or establish receipt. |
| GA4 | No configured `G-…` stream, GA4 adapter or GA4 package in current source | Access to an existing approved property/web stream, actual measurement ID and permission to configure reporting | Do not create a parallel property. A future adapter would reuse existing gates and allowlisted event payloads, sanitize URLs and avoid duplicate automatic/manual pageviews. No GA4 configuration variable is currently consumed by this app. |
| Vercel Web Analytics | No `@vercel/analytics` dependency or mounted collector; authenticated custom-event query requires paid access | Existing project entitlement covering custom events, explicit budget scope where billing applies, consent/privacy wrapper and real SDK integration | Current account cannot provide the required custom funnel without a paid change. Hosting on Vercel alone does not enable this event contract. |
| Google Ads | Existing `AW-18541953196` tag loads after consent with denied personalization | Existing Ads account/reporting; this tag has no canonical funnel event dispatch | Preserve its separate role. An Ads tag is not a GA4 stream, and ad visits cannot establish equipment engagement, supplier sales or commissions. |
| Custom first-party server | No analytics collector endpoint/schema exists | New bounded ingestion/storage/retention/security design and operational ownership | No need to build a parallel data service merely to avoid missing provider access. No such endpoint was introduced. |

Plausible accepts browser-sent events with the browser's own IP/user agent and permits the current `text/plain` JSON request. A 202 response can still accompany bot-dropped events; HTTP acceptance alone is not authenticated reporting receipt. See the [official Events API reference](https://plausible.io/docs/events-api).

Plausible requires exact custom-goal names, and custom events count toward billable usage. Do not add its automatic outbound tracking alongside the existing supplier listener. See [custom event tracking](https://plausible.io/docs/custom-event-goals).

Vercel documents custom events for Pro/Enterprise; Pro collection can incur usage charges, and custom-property limits vary by plan. Do not assume the full product/supplier/category/language/source payload fits an available tier. See [custom events](https://vercel.com/docs/analytics/custom-events) and [pricing](https://vercel.com/docs/analytics/limits-and-pricing). No plan was upgraded.

GA4 event setup requires an existing account/property/web stream and appropriate access; the existing Ads destination is not that prerequisite. See [Google's event setup guide](https://developers.google.com/analytics/devguides/collection/ga4/events). Preserve the current explicit-consent approach; [Google's consent guide](https://developers.google.com/tag-platform/security/guides/consent) distinguishes consent-state commands from proof that data reached reporting.

## Correctness fixes in this package

- **Failed withdrawal persistence:** with readable old acceptance and a failed storage write, the previous UI could display rejection while event collection still read the old acceptance. `saveAnalyticsConsent` now blocks collection in the current document on any failed consent write and attempts to remove stale acceptance. A subsequent explicit, successfully persisted acceptance can restore measurement. If both write/removal fail, this in-document block cannot guarantee persistence after reload; the browser must permit storing the new preference for that guarantee.
- **Workspace exclusions:** the shared provider guard now excludes `/documents`, `/assistant`, `/diagnostics`, `/energy-ai` and `/my-home`, including localized forms. Their route layouts explicitly declare noindex/nofollow. The public `/experts` guidance page remains measurable; private `/expert` stays excluded. This is a telemetry boundary, not an access-control replacement.
- **Same-route duplicate pageviews:** acceptance/withdrawal/reacceptance on one rendered route now queues at most one pageview. Actual route transitions and returns remain separate views. Product/comparison view deduplication remains in the existing `AnalyticsEvent` component.

## Event contract and safeguards

Continue the [existing event contract](monetization-analytics.md): `product_view`, `product_compare_add`, `product_compare_remove`, `calculator_start`, `calculator_complete`, `finder_start`, `finder_complete`, `comparison_view`, `supplier_outbound` and its `affiliate_click` subset. Old aliases are not emitted alongside canonical names. Never sum `affiliate_click` and `supplier_outbound`.

All funnel dispatch still requires current accepted consent, matching configured hostname, public route, no DNT/GPC and no automation. Queries, fragments, destination/tracking URLs, user-entered calculations, form contents and account identifiers stay out of Plausible event payloads. Public product identifiers and optional supplier/category fields are allowlisted. No automated browser guard was disabled. The Google tag's own processing remains separate from the manually allowlisted Plausible payloads; a loaded script is not a complete network/privacy acceptance test after prior real consent.

Thirty focused tests passed across the analytics privacy/funnel/Google-consent, affiliate-readiness and readiness suites. They include the genuine-consent code path only in isolated mocks whose fetch calls never reach a service. These establish request/gate correctness, not real audience activity or provider receipt. Release checks and public automated-browser safeguards must still pass after deployment.

## Receipt and authenticated-account acceptance still needed

Receipt evidence must identify the actual authorized site/property, date range/time zone and canonical event names in authenticated reporting for legitimate consented activity. Do not bypass `navigator.webdriver`, forge visitor headers or label automated QA as genuine customer activity. No live metrics, CTR, sales, commissions or payouts are established by this audit.

Account acceptance requires an already authorized browser session/account and, for confirmation/recovery tests, the actual controlled mailbox and intended workflow. No credentials or session cookies should be exported into reports or commits. Use existing sessions where available; do not generate privileged replacement sessions or unnecessary accounts. Registration and password recovery send real messages and must not be exercised as read-only form checks. Distinguish provider acceptance from actual inbox receipt.

The existing `phase2-account-readonly.spec.ts`, mocked auth/profile tests and PostgreSQL-compatible RLS tests provide bounded public-form/anonymous-denial/error-path/isolation coverage. They do not prove real client/expert dashboards, login/logout, email confirmation/reset or cross-device session behavior. Saved comparisons remain browser-local, not an account-synchronized private dataset. The lead agent must record these remaining authenticated results or their access blocker honestly.

The lead agent subsequently found an existing authorized website session. On 4 November, `/dashboard` rendered the actual `/dashboard/client` account page, and `/onboarding` rendered Edit profile/Save profile controls without submission. Requesting `/dashboard/expert` with the same Client role returned to the client dashboard, preserving the role boundary. Redacted evidence is in `site-session-access.txt`, `profile-access-redacted.txt` and `client-role-boundary.txt` under the coordinating ignored evidence directory. This is real authenticated read-only acceptance of those paths, not a new login, registration, inbox confirmation, password reset, logout or an expert-role session. Those remaining flows are still unverified; no credential, session cookie or private profile value was copied into this report.

The same dashboard/profile/role checks passed again in the actual session after the Phase 3 application deployment. The [coordinating Production acceptance](monetization-phase3-2026-11-04.md#production-acceptance--4-november) records that release, 58 automated Production scenarios and the separate unverified analytics-receipt requirement.
