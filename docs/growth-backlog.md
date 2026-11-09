# Growth backlog

Updated 9 November 2026. Audience: Romania/EU; Romanian primary, English supported. Owner: Stanislav Zavizion, independent publisher. No public numerical prices, discount promises or stock; purchases at merchants.

5 November measurement update: [verified GA4 activation](ga4-activation-2026-11-04.md) supersedes the service/project blocker below. Production uses the actual ID with consent and automation guards; two key events and the existing Search Console link are configured. Landing-page search report for 8 October–4 November: 359 impressions, 0 clicks, average position 30.52. These are search metrics, not measured website sessions. Next: verify legitimate GA4 event receipt and finish only needed reporting definitions; do not recreate the property, stream or link. The historical Markifact credit blocker does not prevent the now-working authenticated Google search-report UI. Live scheduler status is still unverified despite the historical regular-execution description below.

| Priority | Hypothesis / task | Evidence and next verification | State |
|---|---|---|---|
| P0 | Waterdrop Romania requires separate EU programme | Partner clarification 28 October: DE programme/store Germany only. 3 November release now blocks all 16 Waterdrop supplier CTAs on the Romania/EU site; official source links remain ordinary documentation. 4 November RO/EN landings and comparison confirmed zero supplier anchors; keep stored mappings unchanged. Obtain actual EU approval and exact links before activating Romanian tracking. No repeated enquiry | Regional CTA block verified; EU activation outstanding |
| P0 | Verify Impact-recorded clicks, actions and payout separately | 4 November authenticated Performance by Brand refresh for 21 October–3 November: Renogy 19 clicks/0 actions; Waterdrop DE 6/0; total 25/0. Not unique customers; internal tests may be included. No approved/reversed commission or payout report obtained. Renogy Romania eligibility remains confirmed | Click/action baseline refreshed; financial evidence outstanding |
| P0 | Prepare capped Romania paid-search pilot | Owner cap EUR 50 total after checks. Draft in ads-ro-pilot-2026-10-28.md. Renogy/Waterdrop paid-channel questions sent; Google Ads account/billing, network reports and measurement still unresolved. No spend | Prepared, NOT launched |
| P0 | Activate legitimate first-party measurement | Consent-gated Google tag shipped in PR #40/#42. Plausible absent in last inspected env. Actual service receipt/report remains unverified; preserve consent/DNT/GPC/automation and do not invent a project or buy services | Production configuration accepted; legitimate receipt outstanding |
| P1 | Enforce link-only public pricing | Public UI could display fresh price values despite owner rule; remove rendering and public-page feed requests, preserve affiliate resolution | Published in PR #35 |
| P1 | Recover from empty catalogue results | Add visible Clear all filters / Resetează toate filtrele to current catalogue path, preserving locale | Published in PR #35 |
| P1 | Mobile search, filters, finder, compare, supplier journey | 28 October: 17 production browser tests passed, including RO/EN calculator/finder/compare at 390/430px, exact-SKU search, feed accessibility and RO ad landing. Supplier navigation intercepted; not a checkout/network attribution test | Verified within documented scope |
| P1 | Exact Renogy feed affiliate coverage | PR #41 recovered 15 existing mappings. On 4 November, authenticated Impact UI issued another 12 solar links (3 parents, 9 exact variants); ordinary merchant JSON independently confirmed their identities. Production at ef5e342 verified all 365 hrefs: 227 active/138 ordinary, with the other 353 hrefs preserved. No tracking endpoint requested. The remaining ordinary rows include 101 Worry-Free Purchase entries, not 101 equipment models | Twelve new solar mappings published; prioritize remaining genuine equipment |
| P1 | Search Console baseline and topic selection | 2 November gsc_select_accounts rejected for insufficient Markifact credits before platform access. No report obtained; clicks/impressions/CTR/position UNKNOWN. Do not retry until access/credits change and do not buy a subscription | Historical metered blocker; authenticated search reports now available above |
| P1 | Backup guide equipment path | Existing bottom cards showed only 3 expansion modules. Separate two documented AC stations and two standalone batteries with role explanations and same-category comparison links. Preserve calculations, images and supplier gates; RO/EN and both comparisons verified | Published PR #43 |
| P1 | Same-role comparison | Source category let D77/DC UPS mix with AC stations and expansion modules mix with separate batteries. Use one reviewed role group for table, form and tray; keep catalogue categories and supplier links unchanged | Published PR #44; RO/EN table/form and saved-tray checks passed; phone layout unverified |
| P1 | Same-role alternatives on detail pages | 31 October browser check: D77 detail still offers AC models under category alternatives. Comparison now rejects mixed roles; follow up by filtering related-model suggestions with documented roles, preserving product access | Published PR #45; five preview/live detail pages and RO/EN desktop transition verified; phone check outstanding |
| P2 | Organic distribution | Two RO/EN copy drafts prepared from existing guide. No verified connected owned social destination found; do not invent a channel or send spam | Drafts ready |
| P2 | Partner/Ukraine replies | Renogy/Waterdrop/PECRON/BLUETTI delivery, discounts, forwarding and commission remain separate. Existing partner reply watcher retained | Await new substantive replies |

## Regular execution
One enabled daily task at 09:00 Europe/Bucharest, starting 28 October 2026; weekly review on Monday inside the same task. No duplicate mail watcher. Maximum 30 minutes and 1–3 actions per run. Read current main and this log first; check active growth PR/work before writes; use expected-SHA lease. Never overwrite conflicting work or start a second conflicting release. No paid services, ads, purchases, mass generated pages or automated tracking clicks. Notify only meaningful release/result/new blocker. Schedule creation previously confirmed; bounded work and verification recorded in growth-log.


## Weekly review — 2 November 2026

Review window 26 October–1 November. Verified improvements: 15 existing exact Renogy mappings recovered on 29 October, same-role guide/comparison/detail paths published, Waterdrop Germany scope labelled, link-only prices and catalogue identities retained. Current feed baseline on 2 November: 365 SKUs, 215 tracked/150 ordinary. No measured organic traffic, network click, conversion, confirmed commission or payout increase can be established from the available data.

Next order: (1) obtain genuine existing-service analytics/Impact receipts and resolve Search Console access without new spend; (2) complete phone validation of recent changes when a working runner is available; (3) create and verify the 12 requested solar parent/variant links in authenticated Impact, retaining exact destinations. Those 12 requested records are a subset of the 150 ordinary feed rows, not an additional count. Waterdrop EU approval and issued links remain separate prerequisites. Defer new templated content and repeated role changes until evidence identifies a useful next package.

## 3 November verification note

No new actionable partner reply after the 2 November Renogy message already handled by the partner watcher. Main/production now includes PR #48 direct calculator handoff and PR #49 finder hydration readiness; preserve both. A single Chromium installation attempt in the refreshed dependency environment still returned invalid ZIP archives. Phone validation remains outstanding; do not repeat until the browser source/runner condition changes. Markifact credit and declined Impact access conditions have not changed, so neither was retried. Priorities from the 2 November weekly review remain in force. HTTP 200 alone does not establish hydrated finder behaviour or commissions.


## 6 November continuation

Resume PR #55 after the 5 November GA4 production/account acceptance checkpoint; the earlier activation-release hold is superseded. Preserve actual-ID production, privacy guards, Search Console link and all newer owner-restored photographs (50 photos; 14 still withheld). Real GA4 receipt and needed reporting definitions remain separate follow-up work.

Fresh static production feed: 365 unique SKU identities, 227 active/138 ordinary; all eight pages HTTP 200. [Exact equipment queue](renogy-equipment-link-queue-2026-11-05.md) contains 26 ordinary identities across seven merchant families, all 26 current hrefs match. Remaining 112 ordinary rows are protection/accessory/fee/promotion records, not 112 missing equipment models. Next authenticated exact-link work must preserve SKU/variant and existing gates; no bulk tracking traversal.

Partner watcher coordination: the 6 November Renogy reply refers Ukraine delivery questions to customer service and does not confirm delivery, discounts or commission. A support follow-up is already in Sent; do not duplicate it. PECRON/BLUETTI Ukraine requests were sent 5 November; no new reply found. No new Waterdrop reply found in this cycle. Direct shipping, forwarding, warranty, discounts and commission remain separately unverified for Ukraine. Renogy Romania eligibility remains closed/confirmed.


## 7 November verification checkpoint

PR #55 is merged; reuse its exact 26-SKU queue, do not recreate it. Preserve PR #58 seller navigation and the newer main. [Guide navigation evidence](equipment-guide-navigation-2026-11-07.md): 26 RO/EN equipment-class pages and 20 distinct internal guide destinations HTTP 200; no same-category action loop, EV-Mag explicitly ordinary/category-only. Static checks are not a phone/browser interaction pass or tracking receipt.

Impact currently opens its login form; no login attempted in this cycle and no fresh reporting figures obtained. Existing GA4 receipt and financial reporting priorities remain, with unknowns retained. Gmail contains no newer substantive partner reply beyond the handled Renogy referral/support follow-up. No duplicate correspondence or Ukraine delivery promise. No application change justified by this health check.


## 8 November editorial package

Existing runtime guide now distinguishes nominal battery Wh from measured AC-output Wh in RO/EN. Hypothesis: making the measurement boundary explicit prevents double-subtracting losses before equipment selection. Illustrative 800 Wh / 100 W = 8 h is not a product test or promise. Sources: existing Wiring Unlimited and the manufacturer's separate maximum-efficiency/zero-load ratings, checked 8 November. No specs, prices, compatibility, tracking or new indexed route added. Organic RO/EN copy saved as drafts; no connected owned publishing destination established. Next: retain measurement/reporting and exact-link priorities, then assess actual guide engagement when legitimate analytics data is available.


## Weekly review — 9 November 2026 (supersedes prior weekly ordering)

Review window 2–8 November; [full evidence and measurement limits](growth-weekly-review-2026-11-09.md). Delivered: twelve issued solar links, GA4 configuration/privacy acceptance, compact comparison, photo restoration, exact equipment queue, repaired equipment-guide navigation and localized runtime measurement clarification. Link coverage increased from the dated 215/150 snapshot to 227/138; this is not a traffic, conversion or revenue increase. No matching weekly analytics/finance window is available, so no trend or outbound CTR is calculated.

Next order: (1) legitimate GA4 receipt plus matched Impact action/commission/payout evidence when authorized session access is available, (2) exact issued links for the preserved 26 equipment identities/seven families, (3) only scoped pending mobile/funnel acceptance with a changed working runner condition, then evidence-led editorial work. Do not recreate the GA4 stream/Search Console link or repeat the old 12-solar request. Old blanket mobile-unavailable notes are historical: 4–5 November registers already document scoped production acceptance, without proving every later change on a phone.

Fresh targeted SEO: eight first-party endpoints HTTP 200; tested search/filter queries noindex, clean canonicals and reciprocal RO/EN alternates; sitemap has 372 unique official-origin locs without query/private/search paths and includes both runtime-guide URLs. Sitemap parse is not a 372-route crawl or Google indexing proof. No defect found, no app patch. No new substantive partner reply after 8 November, duplicate enquiry, declined login retry, credit request or new spend. Paid pilot stays deferred within this task; organic drafts remain unposted without a verified owned channel.
