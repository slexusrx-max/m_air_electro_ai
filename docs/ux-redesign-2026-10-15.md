# Customer-first UX redesign - 15 October 2026

## Baseline and scope

Started from GitHub main eb641a65f2bf4142486dda23511c46d11cfc9af5, including merged Renogy PR 10 and its production-test follow-up PR 11. No newer remote changes or existing tracked modifications were present.

Read-only baseline browser audit: homepage, marketplace, Renogy, Waterdrop, search, batteries, comparison, finder, solar calculator, Learn, partnerships, contact and login. All 39 route/viewport combinations returned 200 with no page overflow at 390, 768 and 1440 pixels. Before screenshots are in ignored `.task-work/ux-redesign/before/`. No messages, accounts or orders were created.

## Findings and implemented changes

| Finding | Change |
| --- | --- |
| Mobile brand image preceded the proposition and primary actions | Copy-first hero with Browse Equipment and Find My Solution; original hero.png retained |
| Categories followed multiple promotional sections | Compact equipment tiles and application shortcuts precede partner promotion |
| Every desktop dropdown exposed the same whole-site menu | Each dropdown shows only its own taxonomy, plus a leading Renogy feature and secondary Water entry |
| Search was an ambiguous symbol | Recognizable search icon and desktop text; accessible mobile label |
| Renogy category/section/graphic numbers added no meaning | Decorative numbers removed; comparison and off-grid planning moved outside equipment taxonomy |
| Renogy cards repeated long engineering paragraphs | Specifications stay visible; application, compatibility and limitations use native keyboard-accessible disclosure; full details remain linked |
| Selected comparison records were difficult to recover | Shared selection tray with real product names, remove controls, count and URL-based comparison |
| Active filters were not individually visible/removable | Labelled filter chips preserve other active filters and support clear-all |
| Long technical filter lists pushed mobile results far below the fold | Native technical-filter disclosure stays open when any technical filter is active |
| Finder inputs reset when switching language | Bounded public planning inputs and step persist in the URL; parameterized finder pages are noindex |
| Homepage repeated journey, guide and promotional blocks | A shorter equipment/application/partner/product/planning sequence with Waterdrop retained |
| Marketplace repeated the entire homepage | A distinct catalog page with category access and working known-value filters |

## Design and integrity

Warm surfaces, forest green, restrained emerald/lime, existing Space Grotesk/Jakarta typography, glass navigation and consistent rounded actions. No new dependencies or manufacturer imagery. Existing illustrations remain clearly labelled. Responsive styles cover small phones through desktop and retain reduced-motion support.

Public Renogy status describes ordinary untracked links without exposing activation variable names or implementation requirements. Owner-confirmed approval is unchanged; it does not establish dealer status or independently verified EU campaign eligibility. Renogy tracking remains OFF. Waterdrop's existing independent provider configuration is unchanged. No prices, stock, ratings, reviews, commission rates or tracking URLs were fabricated.

## Verification and release evidence

New browser tests cover the hybrid journey, individual filter removal, comparison names/removal, RO/EN persistence, finder drafts, number-free categories, expandable product details and WCAG 2.2 AA rule tags. Visual audit covers 13 routes at 320, 360, 390, 768, 1024 and 1440 pixels. Existing account, contact, calculator, supplier, Waterdrop, SEO, canonical, crawl and navigation regressions remain enabled.

The first iterative run identified excessive tablet hero-image cropping; the responsive height was corrected. An overlapping screenshot run collided with Playwright's default artifact directory; final runs are sequential. Neither issue is treated as a successful test.

The full regression also identified a root loading boundary causing unknown marketplace categories to stream HTTP 200 instead of 404. The loading boundary was restricted to search. Five old locale tests expected only two query parameters; they now explicitly verify preserved load, hours, peak and wizard step rather than rejecting the expanded draft URL.

Final local release checks: 84 unit tests and all 154 Playwright tests passed with no skips. Translation parity passed for 419 keys. ESLint, TypeScript validation and the production build passed. The final build's crawl visited 139 routes with zero failures, orphans or redirects. All 16 official supplier source URLs returned HTTP 200 with zero invalid, blocked or unverified destinations. The runtime dependency audit reported zero vulnerabilities.

The first public-domain run exposed an obsolete all-links-are-ordinary assumption in four onboarding tests: the new full catalog now includes Waterdrop's already-active production links. These checks now reuse the existing exact-issued-URL assertions for Waterdrop and retain exact ordinary destinations for Renogy and every other supplier. No merchant URL, provider gate or environment configuration was changed to satisfy the test.

A public search test also exposed an early language-switch click before hydration after a full filter-form navigation. Language controls now stay disabled until the client handler is ready; a delayed-script browser regression checks this explicitly rather than adding arbitrary sleeps to the test.

The pull request release record contains deployment SHA and actual public-domain verification. Screenshots and test artifacts are ignored, not committed. Automated accessibility results are bounded test coverage, not certification of universal WCAG compliance. Real contact delivery and affiliate purchase attribution are not exercised by these read-only tests.

## Impact blockers

No new authenticated Impact evidence was supplied in this request. Genuine Renogy links, verified EU/Romania terms and commission actions, authorized brand assets and independent attribution evidence are still required before activation. The program/advertiser IDs are not tracking URL templates. Preserve all existing fail-closed gates.
