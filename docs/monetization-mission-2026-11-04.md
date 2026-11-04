# Commercial improvement session — 4 November 2026

## Baseline and priorities

Started from an older local checkout, then fast-forwarded to current GitHub main `db1ccef5ca0324dda26a0701bfa01866381eab76` before implementation. Preserved the owner's separate uncommitted Renogy wordmark change. Current production policies, regional restrictions, image rights and artwork were reviewed before making changes.

Prioritized exact issued Renogy links, comparison usability, consented funnel measurement and meaningful release verification. Existing marketplace, finder, calculators, canonical product identities, link-only pricing, RO/EN routes and supplier activation gates are extended in place.

## Work package

- Comparison is absent at zero selections, compact at one to four, and expands only on request. Saved selections remain collapsed on reload. Added minimize, remove, clear, Escape and focus recovery; mobile navigation hides the tray. Same-role comparison restrictions remain.
- Added canonical product views, comparison changes, calculator starts, finder completions, supplier departures and the affiliate subset. Finder results no longer inflate calculator completions. Public identifiers and paths are allowlisted; consent, DNT, GPC, private-route and automation exclusions remain. See `monetization-analytics.md` for the event contract and historical-name migration.
- Reconciled browser assertions with the existing Germany-only Waterdrop restriction and model photo permissions. Tests must distinguish disabled regional notices from purchase anchors, and traverse catalog pagination rather than assume all models fit one page.
- Obtained twelve exact links through the authenticated Impact create-a-link interface for three Renogy solar families. Independently checked the three product IDs and nine variant IDs using ordinary official merchant JSON. No tracking endpoint was requested, so generation and configuration do not prove Impact click registration or an order. Detailed link provenance accompanies the supplemental mapping.

## Reporting observed this session

Refreshed Impact's **Performance by Brand** report on 4 November for the completed **21 October–3 November 2026** period, all programmes, EUR. It showed Renogy programme 14864: **19 clicks, 0 actions**; Waterdrop DE 19363: **6 clicks, 0 actions**; total **25 clicks, 0 actions**. This confirms the supplied baseline for that interval; it is not a count of unique customers or of genuine non-test visitors. Recent hours can be delayed according to the reporting UI. Private UI evidence is retained in ignored `.task-work/mission-20261104/`.

Website sessions, organic impressions/clicks, consented outbound CTR, approved/reversed commissions and confirmed payouts were not obtained. They remain unknown, rather than zero. The account balance or the lack of recorded actions is not a payout report. No purchase, test account, contact message, advertising spend or synthetic affiliate click was made.

## Inventory and external dependencies

Catalog audit: 77 records, 64 real models, 13 equipment classes; 35 usable model photographs and 29 withheld PECRON/BLUETTI photographs. Product records, images and merchant facts are unchanged by this package. Waterdrop supplier CTAs remain blocked for Romania; separate EU programme approval and exact links remain outstanding. No new partner approval is inferred.

The Gmail connector advertised tools but rejected execution as unavailable. Existing correspondence and application states could not be refreshed; no duplicate messages or applications were sent. Search Console data and a working Plausible reporting project remain external dependencies; instrumentation is not proof of service receipt. No paid subscription or new analytics project was created.

## Verification and publication

Fresh pre-release checks and production results are recorded below as they finish. Historical reports are not substitutes for this session's results. Initial browser attempts failed before launch because sandbox storage resolved a different browser directory; subsequent runs explicitly use the already installed Chromium outside sandbox network isolation. Existing local English rendering discrepancies and stale historic test expectations were investigated separately; no language assertions were relaxed to hide them.

No new automation was created. The repository documents an existing daily growth task, but this session does not independently confirm its current scheduler state or promise continued execution after the active session ends.

Pre-release results: 179 unit tests passed; i18n checked 419 keys; catalog validation passed (77 records, 64 models, 35 permitted photos); TypeScript and production webpack build passed. ESLint passed with one existing feed-image warning, and the production dependency audit reported zero vulnerabilities. Final comparison/browser checks passed all eleven scenarios including cross-route focus recovery, five requested viewport widths and tray axe checks. Both automated-funnel privacy scenarios passed with external requests blocked and browser automation exclusions intact. The local first-party crawl visited 379 routes with zero failures, orphans or redirects. Product-photo pagination verification and production acceptance are recorded after completion.

Application release **ef5e34237c72373d7f3c3fe0e8dd9bd632d6bceb** was pushed to main and deployed as **dpl_8runRY8JU5zcRz42y5U7uBkfJ8JK**, READY / Production, on the official domain. GitHub's Verify run **41842660748** completed successfully. The public deployment-commit metadata matched that full SHA on all eight feed pages. All **365** published Renogy hrefs matched the updated register: **227 tracked / 138 ordinary**, with all twelve new exact links active and zero mapping failures. No tracking endpoint was followed.

Fresh production browser results: **28 distinct scenarios passed** across comparison (eleven), automated telemetry privacy (two), Waterdrop comparison/assortment/editorial-source controls (five), Waterdrop RO/EN regional blocking at 390/1440px (four), RO/EN finder draft/language retention (two), and calculator-to-finder-to-comparison-to-intercepted-supplier handoffs at 390/430px (four). The two old Waterdrop-region failures expected purchase anchors; their fixtures were corrected to require the existing disabled non-anchor notices, and all four locale/width cases then passed. No production gate was weakened. Both finder language-switch cases pass in production despite the documented local environment discrepancy.

Local photo checks also passed at 390/1440px, traversing both pages and all 64 unique models, validating 35 actual images and 29 honest withheld-image placeholders. A stale white-wrapper assertion was aligned with the existing transparent glass wrappers; official image bytes and model associations did not change. Screenshots, logs, merchant identity evidence and the exact live href audit are retained in ignored `.task-work/mission-20261104/`.

The fresh production crawl visited **379 routes**, with **zero failures, zero orphans and zero redirects**. This checks first-party HTTP/link integrity, not Google indexing or external merchant availability. The closeout updates documentation and one stale regional test only; application source remains equivalent to the verified release above.

## Next priorities

1. Verify the deployed source SHA, exact new feed hrefs, compact comparison and consent safeguards on the official domain.
2. Obtain live measurement receipt and Search Console data without buying services; use relevant consented product sessions as the outbound CTR denominator.
3. Continue exact issued links for commercially relevant remaining feed rows. Most ordinary rows are not separate equipment models; do not optimize a link count in isolation.
4. Obtain Waterdrop EU eligibility and specific photo publication permissions. Avoid duplicate partner applications and unsupported conversion claims.

Rollback is a focused revert of this package after checking subsequent commits. No database migration, security bypass or supplier configuration removal is required.
