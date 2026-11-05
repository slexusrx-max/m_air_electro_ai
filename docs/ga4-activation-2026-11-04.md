# GA4 activation evidence — 4 November 2026

## Initial checkpoint

The owner's activation instruction supplies **`G-RG28QVQF7N`** and states that the existing `M Air Electro AI` account and web stream have been created. This is owner-reported information at this checkpoint, not yet an authenticated settings readback. Reuse that account/stream; do not create a duplicate. No live Analytics, Vercel or Search Console service calls were made while preparing this document.

Local repository HEAD at preparation was `4a750f429ddeb9534aab9621073a938dab126cde`. Current GitHub main, official-domain deployment and subsequent activation evidence require the coordinating execution's readback. The [Phase 4 report](monetization-phase4-2026-11-04.md) records the earlier safe-off release and its tests; those historical checks are not a test of this newly supplied real ID.

## Activation evidence register

Replace pending fields only with observed evidence and a timestamp. A configured public ID is not event receipt, and receipt of a pageview is not proof of an affiliate purchase.

| Requirement | Status at initial checkpoint | Evidence to append |
| --- | --- | --- |
| Existing GA4 account and stream | Owner reports created | Authenticated account/property/stream identifiers and names |
| Measurement ID | Owner supplies `G-RG28QVQF7N`; UI verification pending | Stream settings readback matching the exact ID |
| Website URL and stream duplication | `UNVERIFIED` | Exact production URL; relevant stream/tag inventory |
| Enhanced Measurement / history tracking | `UNVERIFIED` | Saved off state, including automatic outbound/form/search measurement |
| Google Signals / ad personalization settings | Application disables signals; service settings `UNVERIFIED` | Actual property/tag settings readback; no Ads conversion import |
| Property data retention / reset on activity | `UNVERIFIED` | Actual saved setting; separate from 180-day cookie/consent controls |
| Vercel Production environment | `UNVERIFIED` for the supplied ID | Existing project and `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RG28QVQF7N` readback |
| Production deployment | `UNVERIFIED` for activation | READY deployment, full SHA and matching official-domain metadata |
| Consent, DNT/GPC, automation/private-route guards | Prior release tested; activation acceptance pending | Current scoped tests and production observations without bypass |
| Manual page/product/funnel event dispatch | Implemented in Phase 4; real-ID acceptance pending | Sanitized expected payload, one destination and no duplicate route views |
| Legitimate Realtime event receipt | `UNVERIFIED` | Authenticated report, timestamp and observed event names |
| `affiliate_click` key event | Authorized; configuration `UNVERIFIED` | Exact name, counting method and unset monetary default readback |
| `finder_complete` key event | Authorized; configuration `UNVERIFIED` | Exact name, counting method and unset monetary default readback |
| Existing Search Console property link | Authorized; configuration `UNVERIFIED` | Exact property/stream pair and saved link readback |
| Current traffic, qualifying actions and finance | `UNKNOWN` | Fresh source-specific reporting windows and records |

Expected application event coverage is `page_view`, real-model `view_item`, `product_compare_add`, `product_compare_remove`, `calculator_start`, `calculator_complete`, `finder_complete`, `supplier_outbound` and `affiliate_click`. Equipment-role views remain `equipment_class_view`; affiliate departures remain a subset of supplier departures. Verify outbound logic with isolated/stubbed tests and first-party href inspection, without following tracking endpoints or generating artificial affiliate events. Genuine provider receipt may cover only the events legitimately observed; do not fill the remaining rows with synthetic traffic.

## Minimal settings checklist

- **Manual collection:** retain application `send_page_view:false`; disable Enhanced Measurement and its browser-history and automatic interaction options in the actual stream. Automatic outbound measurement can include destination URLs, while search/form measurement can collect fields outside the manual event contract. Read back the saved settings. See [Google's Enhanced Measurement reference](https://support.google.com/analytics/answer/9216061).
- **Key events:** mark exact `affiliate_click` and `finder_complete` names. If absent from recent events, register their existing code-emitted names with the UI's code-based event option; do not create a derived duplicate or rename an existing pageview. Use once-per-event counting and no invented default revenue. Record the actual configuration; registration is not event receipt. Google documents [marking key events](https://support.google.com/analytics/answer/13128484), [code-based registration](https://support.google.com/analytics/answer/12844695) and [counting methods](https://support.google.com/analytics/answer/13366706).
- **Retention:** the privacy-minimal proposed setting is two months with user-identifier reset on new activity off. Confirm and record the actual saved choice. This is a property setting, not the application's fixed 180-day cookie expiry or consent expiry; standard aggregated reports have a distinct retention behavior. See [Google's retention controls](https://support.google.com/analytics/answer/7667196).
- **Search Console:** inspect existing links first. With GA4 Editor access and verified GSC ownership, link the existing official property to this verified web stream, review/submit and read back the exact pair. Publish the GSC report collection if needed. A saved link is separate from report data availability. See [Google's linking instructions](https://support.google.com/analytics/answer/10737381).

Maintain fresh provider-bound v3 consent; no Google script/collection before acceptance; no collection on DNT/GPC, automated browsers or excluded private routes; withdrawal stops subsequent optional dispatch. Acquisition retains only approved HTTPS referrer origins, without path/query/fragment or arbitrary campaign values. Google Ads remains unconfigured by this adapter. Do not accept new agreements, purchase services, alter banking data or bypass login/2FA to finish activation.

## Historical documents requiring a dated addendum

Do not rewrite earlier observations as though activation existed at that time. After authenticated confirmation, append the new observation and link this evidence register:

| Document | Historical statement to contextualize |
| --- | --- |
| [Phase 4 report](monetization-phase4-2026-11-04.md) | Draft/terms checkpoint, no stream/Measurement ID/Production value, safe-off production acceptance and next action |
| [Operations runbook](ga4-operations.md) | Earlier 4 November unaccepted-draft snapshot |
| [Growth backlog](growth-backlog.md) | Measurement blocked on service/project; later activation must supersede that task state |
| [README](../README.md) | Phase 4 introduction points at earlier activation blockers; link the later accepted state |

The event contract and blank monthly report remain valid definitions/templates. Do not replace their `UNKNOWN` placeholders with a historical total or a guessed zero. The hosting-plan issue is independent; GA4 activation does not establish that it has been resolved.

## Final acceptance update

**Pending coordinating execution evidence.** Record activation timestamp, actual stream/settings, environment, full production SHA/deployment, tests, genuine receipt scope, key events, Search Console link and remaining blockers here. Until then, the supplied Measurement ID is owner-reported and operational GA4 collection remains unverified.

## 5 November 2026 — authenticated activation checkpoint

The existing Google account is accessible again. Authenticated Analytics UI confirms account `414748884`, property `562384962`, and one web stream named **M Air Electro AI — Production**, stream `16274159877`, URL `https://mairelectroai.com`, Measurement ID **`G-RG28QVQF7N`**. No account/property/stream was created by this execution. The stream's Enhanced Measurement switch was already off (grey, left position; accessibility label “Enable enhanced measurement”). Connected site tags: **0**. The application retains manual `send_page_view:false`. Google reported that site data had not yet been received; this is not evidence of zero website visitors.

Vercel CLI added `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RG28QVQF7N` as a **Config** value scoped only to **Production** in existing team/project `m-air-electro-ai/m-air-electro-ai`. Environment-list readback confirms that name, type and scope. This public client identifier is not a credential. No other environment variable, paid plan, banking detail or legal agreement was changed.

At this checkpoint main and local HEAD are `4a750f429ddeb9534aab9621073a938dab126cde`. The variable requires a new production build before activation. Deployment and provider receipt are still pending; do not interpret the environment change as received traffic.

Unchanged application acceptance checks completed on 4 November: 210 unit tests, 419 i18n keys, lint (zero errors, one existing image warning), TypeScript, and 14 local mocked GA4 browser cases. The mocked cases did not load Google code or send collection events. An actual-ID build is in progress on 5 November; production checks will follow the new deployment. Evidence is under ignored `.task-work/ga4-activation-20261104/` and `.task-work/ga4-activation-20261105/`.

Property retention was saved and reloaded: event data **2 months**, user data reduced from **14 to 2 months**, reset on new user activity **off**. Google notes a 24-hour settings effect and that most standard aggregated reports are unaffected. Google Signals and user-provided-data collection both show their Enable action and remain off. No new user-data collection declaration was accepted.

The actual-ID production build subsequently **passed** (exit 0, 108 static pages). Its client output contains `G-RG28QVQF7N`. The first sandbox attempt stalled and was stopped; its incomplete log is retained separately, and the successful authorized host build is `build.log`. No app source or local environment file was changed for activation.

At the release-preparation checkpoint, account-level ad personalization still permits 307 regions. Automatic action review rejected disabling all regions for lack of explicit scope; the owner was asked and the setting was left unchanged. The application independently denies ad consent and disables ad personalization and Google Signals. Key-event registration and Search Console linking remain pending. A draft `affiliate_click` registration has no monetary default and uses the code-based option, but its submission was also stopped for duplicate-event review; it is not recorded as configured.

## 5 November 2026 — production and account acceptance

This dated update supersedes the pending items in the earlier checkpoints only where evidence is listed below. Configuration and provider receipt remain separate.

| Layer | Verified result |
| --- | --- |
| Production | Vercel `dpl_Ad5diN9Zr9268BCq3Wwp3Dk2s6rC` READY; official RO/EN privacy pages returned HTTP 200 and deployment SHA `96a75d4c0ef0ad05a53bea00400b3fed43e1c074` |
| Client configuration | Official-domain markup selects `ga4`; first-party client chunk contains the actual `G-RG28QVQF7N`. Eleven first-party chunks were inspected without requesting Google or supplier endpoints |
| CI | [Verify 41978912443](https://github.com/slexusrx-max/m_air_electro_ai/actions/runs/41978912443) completed successfully for the same SHA |
| Production privacy QA | 12/12 browser cases passed: RO/EN at 390, 430, 768, 1366 and 1440px plus two existing Google/funnel guards. Automation exclusion remained enabled and third-party requests were blocked. Consent, withdrawal, private routes, navigation, comparison and calculator assertions passed |
| Key events | `affiliate_click` and `finder_complete` saved and confirmed in the key-event table, once per event, without a default monetary value. These register the exact code-emitted names; no derived URL rule or synthetic event was created |
| Advertising personalization | Owner explicitly approved disabling all 307 regions on 5 November. Applied **Disallow all**, then **Apply**. Saved property UI reads **0 of 307** allowed regions. The earlier automatic-review blocker is resolved |
| Property locale | Existing reporting country/time zone displays Romania / `(GMT+02:00) Romania`; existing currency displays euro (EUR). No changes were necessary |
| Search Console | Existing links list was empty. Linked the existing verified **URL-prefix** property `https://mairelectroai.com/` to **M Air Electro AI — Production**, stream `16274159877`. Google displayed **Link created**, and the saved table shows that exact pair dated 5 November |
| Search reports | Search Console collection was available in report navigation; both Queries and Google organic landing-page reports opened and returned historical search data. No duplicate collection or property was created |
| Live website event receipt | Realtime showed no users/events in its current 30-minute window. Actual website `page_view`, `view_item` or funnel-event receipt remains **UNVERIFIED**. This is not a conclusion that the site has no visitors |

The earlier key-event submission review was resolved by inspecting Google's code-based registration workflow and the exact configuration before retrying. Both saved events were then verified. Google's pre-existing `purchase` key-event entry was not created by this execution, and the application does not emit purchases or revenue. Affiliate departures are intent, not merchant sales.

Authenticated Search Console data read through the linked GA4 reports, **8 October–4 November 2026**, without country/device restrictions: the organic landing-page report shows **359 impressions, 0 clicks, 0% search CTR and average position 30.52**. The separate query report shows **99 impressions, 0 clicks and average position 52.35** across its reportable queries. These reports have different dimension/coverage scopes; do not replace the landing-page total with the query-table subtotal or infer a traffic trend against an unmatched historical period. The empty Analytics user/event columns are not verified totals for all website visitors. No new Impact commission/action/payout report was obtained.

No website code, product record, photograph or affiliate destination changed in this account-configuration follow-up. The three protected owner files were preserved. Evidence from the activation build and privacy checks remains under ignored `.task-work/ga4-activation-20261105/`.

The previously empty Reports snapshot now uses the **Marketing performance** template. The saved view shows users, sessions, acquisition source/medium and key-event columns. Empty site-analytics figures are not evidence of zero real visitors or revenue. Country/device and Search Console reports remain available through their existing report navigation. The repository's monthly template supplies the separate product/funnel/Impact definitions and denominator checks.

Remaining reporting work: verify a legitimate consenting session in authenticated Realtime/reporting, then inspect/register only needed custom dimensions after confirming the actual parameters. Google's [event-scoped definition instructions](https://support.google.com/analytics/answer/14239696) call for confirming collected parameters and describe the subsequent reporting delay. No custom definitions have been claimed as created. A live event receipt must not be manufactured by disabling automation exclusions or following affiliate links. The monthly report template remains available with unknown values left unknown. Vercel's previously verified Hobby commercial-use mismatch and live scheduler inventory remain separate outstanding items; no paid upgrade or duplicate automation was created.
