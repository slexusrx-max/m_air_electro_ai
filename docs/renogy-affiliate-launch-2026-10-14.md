# Renogy commercial launch - 14 October 2026

## Evidence and boundaries

- Publisher: Stanislav Zavizion, individual / independent publisher, Romania / EU. M Air Electro AI is the brand, not an incorporated company or authorized dealer.
- Owner-confirmed Renogy approval date: 2026-10-14. Impact program: 14864. Advertiser: 3086767. These identifiers are records, not a tracking URL template.
- Waterdrop Germany approval and its three exact issued links were recorded in `waterdrop-affiliate-launch-2026-10-13.md`. Preserve its production configuration independently.
- Impact initially showed a security check and subsequently the sign-in form. There is no authenticated account session available. The owner was asked to finish authentication independently. No credential, verification code or token is requested in chat or source control.
- No Renogy network link, licensed banner, logo pack, commission action/rate, attribution window or EU campaign entitlement has been retrieved during this task. Do not import US program marketing rates or Awin terms into the Impact agreement.

## Implemented commercial experience

`/renogy` reuses the seven existing EU-source-backed models, original category illustrations and existing comparison/calculators. It covers component categories, applications, compatibility, limitations and merchant-controlled commercial details. Homepage artwork `/hero.png` remains unchanged. Plain-text Renogy identification is not presented as an authorized official logo. No manufacturer marketing images were copied.

Homepage, marketplace categories, product pages, navigation and footer connect to the storefront. The shared shell shows an intelligible RO/EN affiliate notice before content, not only in a footer. About, partnerships, FAQ, editorial policy and affiliate disclosure distinguish approval from tracking. Waterdrop's status is now computed from Waterdrop links only, not the global any-provider flag.

## Activation procedure (not yet executed for Renogy)

1. In authenticated Impact, verify the exact advertiser/program, active contract, permitted EU destination domain and territories including Romania. Record evidence without credentials or personal financial data.
2. Record commission actions, rates, exclusions, attribution window, paid-search/trademark restrictions, social/video requirements and permitted assets. Do not accept unknown amendments autonomously.
3. Obtain an exact network-generated link for each intended `https://eu.renogy.com/products/...` destination. Validate the final EU model page without placing an order. Record whether consent/country selection changes the landing page.
4. Save the exact source-to-issued mapping in the private deployment variable `RENOGY_IMPACT_LINKS_JSON`; save only the origins actually present in those verified links in `RENOGY_IMPACT_VERIFIED_ORIGINS_JSON`. Do not guess a host or construct a URL from program/advertiser IDs.
5. Set `RENOGY_IMPACT_EU_VERIFIED=true` only after step 1. Preserve the existing `RENOGY_AFFILIATE_APPROVED` and global `AFFILIATE_TRACKING_ENABLED` gates. A configured program ID must match `14864`. Do not change Waterdrop values or disable its global gate.
6. Preview with explicit activation tests. Verify exact issued hrefs, `rel=sponsored`, visible disclosure, correct supplier identity and final merchant page; verify ordinary fallback when each gate is disabled.
7. Deploy after validation and confirm GitHub/Vercel production SHA. Repeat public browser checks. A working redirect is not evidence of commission attribution: an authorized Impact reporting check is separate, and no purchase is permitted in automated testing.

## Future advertising rules

No paid-search campaign is launched. Do not bid on Renogy trademarks, variants or misspellings; obtain and follow the exact applicable Impact agreement before any campaign. Social posts must put a clear affiliate/ad disclosure before recommendations and alongside the link, not only in a bio or collapsed text. Videos need visible and spoken disclosure before endorsement and disclosure beside links in the description. Declare free samples only if actually received. Never claim hands-on testing without evidence. No invented customer reviews, ratings, discounts, stock, certifications or dealer endorsement.

## Release evidence

Local release validation on 14 October 2026:

- `npm test`: 84 passed, no skips.
- `npm run i18n:check`: 419 declared keys passed; lint, typecheck and production build passed.
- Full initial browser regression: 130/134 passed. Three stale assertions (old approval wording, old disclosure wording, previous homepage order) were corrected; a cold-browser cookie timeout was resolved by setting locale before navigation. A 320px auth-layout issue found earlier was fixed by placing disclosure outside the form's layout container.
- Final affected-suite browser run: **70/70 passed**, including every previously failing case, RO/EN, mobile/desktop, automatic accessibility, all seven Renogy product pages, Waterdrop, suppliers, comparison, search, calculators and performance evidence for both storefronts. No tests were skipped.
- Final crawl: **139 routes**, zero failures, orphans or redirects.
- Official supplier audit: **16/16 HTTP 200**, correct regional destinations, no invalid URLs or access blocks.
- `npm audit --omit=dev --audit-level=high`: zero production dependency vulnerabilities.

These local results do not establish production deployment or commission attribution. The associated GitHub pull request is the release record for the Vercel deployment SHA and subsequent public-domain smoke results. Renogy attribution remains unverified until authenticated Impact evidence is available; ordinary EU links are the intended release state.

The root layout exposes only a validated 40-character `VERCEL_GIT_COMMIT_SHA` as `meta[name=deployment-commit]` when Vercel supplies it. Production tests can require `EXPECTED_DEPLOYMENT_SHA` to match the intended release directly on the public domain. No token, account data or arbitrary environment value is exposed.
