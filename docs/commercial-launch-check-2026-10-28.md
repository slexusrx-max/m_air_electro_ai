# Paid-traffic readiness check - 28 October 2026

Decision: NOT ready to spend. The owner approved a Romania-only test up to EUR 50 total after verification. No campaign was launched, money spent, merchant order placed, payout settings changed or new agreement accepted by this task. This package changes tests and operational documentation only, not the public design, product facts, prices or affiliate configuration.

## Verified website results

Production application baseline: `f3a3f3428c55c0c8c5be78211acd94d4f633bb93`, matched against public deployment metadata. Vercel/GitHub reported success for this baseline.

- All 64 canonical product detail pages returned the expected merchant identity and exact issued or ordinary supplier URL. The active catalogue contains 63 models; Waterdrop K19H is retained as unavailable.
- Canonical links: Renogy 18 active / 1 ordinary; Waterdrop 15 active / 1 ordinary (archived); PECRON 23 ordinary; BLUETTI 6 ordinary.
- All 365 Renogy feed rows were checked across eight public catalogue pages: 200 active / 165 ordinary. No duplicate SKU, altered destination, false affiliate disclosure or numerical public price was found by these assertions. Deployment metadata remained consistent during the crawl.
- Seventeen Chromium tests passed on the actual production domain: exact-SKU search in RO/EN, same-category comparison and locale preservation, calculator validation and transfer, legacy model redirects, accessible feed results at 390/1440px, and the mobile home-calculator -> finder -> comparison -> supplier button path at 390/430px in RO/EN. The planned Romanian battery landing page passed mobile overflow, CTA, canonical and scoped axe checks.
- Supplier popup navigation was intercepted before reaching external domains. These tests do NOT generate or verify network-recorded clicks, merchant checkout, orders, commissions or payouts. Axe results cover tested page regions, not a site-wide WCAG certification.
- All 150 unit tests passed. i18n check (419 declared keys), TypeScript, catalogue validation (77 records, 64 models/photos) and webpack production build passed. ESLint: no errors, one existing `no-img-element` warning in the raw feed page.

Regression tests now compare feed destinations against the previously audited public CSV instead of assuming every feed link is ordinary. Metadata assertions wait for the single settled canonical after client navigation, rather than failing on transient streaming overlap. No persistent duplicate canonical was observed in the passing run.

Evidence is retained locally in ignored `.task-work/ad-readiness/`, `.task-work/commercial-production.json` and Playwright `test-results/`. No credentials, private payment information or email screenshots are committed.

## Correspondence and programme distinctions

Authenticated inbox review established these facts, not new programme activations:

- Renogy's 26 October reply confirms orders from Romanian customers through its EU store belong to the EU programme with standard EU terms. It does not supply a numeric rate, paid-search permission or proof of an attributed sale.
- Waterdrop's 28 October reply says its EU/DE stores do not ship to Ukraine and cannot confirm eligible Ukraine orders. The owner-requested acknowledgement was sent and verified in Sent at 10:16 Europe/Bucharest: focus on Germany and officially supported European markets; do not advertise Ukraine support. The reply also asks whether Romania and non-brand Google Search are permitted under the existing DE programme.
- A separate Waterdrop Europe GoAffPro invitation is NOT approval and does not replace or activate the existing Waterdrop Germany configuration. ECO-WORTHY's new Impact invitation is likewise not approval. No new PECRON or BLUETTI approval was established by the focused recent-mail search.
- A Renogy follow-up asking permission for non-brand Romanian Google Search to our own battery category was sent and verified in Sent at 10:45 Europe/Bucharest. Trademark bidding and unsupported price/delivery claims are excluded from the proposed pilot. The campaign remains unlaunched while permissions are unresolved.

## Measured results and blockers

The link counts above are site configuration coverage, NOT measured traffic. Current network clicks, pending/approved commissions, sales and paid withdrawals remain UNKNOWN. Historical 24 October figures are not reused as current results. An Impact sign-in wall prevented current report/payment-profile inspection; owner handoff is required. No bank or card details were requested in chat.

The Google Ads account chooser reported no accounts for the signed-in user. Its new-account setup then displayed an ad-blocker warning. No terms, billing data, campaign or payment were submitted. The owner must finish legitimate account/billing setup privately; do not bypass protections or silently accept terms.

First-party analytics receipt is not verified. Existing growth documentation records missing Plausible configuration; that historical observation is not a new configuration audit. Do not label an outbound click as a purchase or use invented revenue for conversion bidding.

## Next release gates

Use [the prepared ad draft](ads-ro-pilot-2026-10-28.md): one Romanian Search pilot, own battery landing page, up to EUR 40 media plus a verified all-in reserve within the owner's EUR 50 ceiling. Do not switch to a daily budget as a substitute for a total cap, automatically expand countries, or launch Waterdrop promotion in Romania before eligibility is confirmed.

Before spend: establish channel permission, actual network reporting, payment-profile readiness, consented measurement receipt, completed Google Ads setup and enforceable all-in budget/end date. A successful site build or active-looking URL cannot substitute for those gates.

The previously documented daily growth task and partner watcher are not duplicated. Their scheduler state was not independently revalidated in this run. Future runs should read this report and the ad draft, notify only material new evidence or a required action, and never interpret preparation as permission to increase the budget or start recurring spend.
