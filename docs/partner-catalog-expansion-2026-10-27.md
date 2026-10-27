# BLUETTI / PECRON catalog expansion — 27 October 2026

Working branch only. Production publication and advertising readiness are not verified.

## Scope and evidence

Authenticated Awin now confirms BLUETTI EU is Pending Approval. PECRON connection is owner-reported but issued links and programme assets are still absent from this session. Neither is treated as active tracking. Existing ordinary merchant links remain ordinary. No guessed publisher parameters, prices, stock, shipping promises, discounts or earnings are added.

Eight base-station models were added to the existing catalog, search, comparison and sizing flow. There are now eight PECRON and six BLUETTI stations, plus 19 Renogy and 16 Waterdrop model records: 49 canonical models. This is not a claim to cover the complete supplier assortment or available inventory. Expansion batteries, accessories and bundles are not counted as base stations.

| New model | Stored energy (Wh) | Rated AC output (W) | Official EU source |
|---|---:|---:|---|
| PECRON E300LFP | 288 | 600 | https://eu.pecron.com/products/pecron-e300lfp-solar-power-and-generator |
| PECRON E500LFP | 576 | 600 | https://eu.pecron.com/products/pecron-e500lfp |
| PECRON E600LFP | 614 | 1200 | https://eu.pecron.com/products/pecron-e600lfp |
| PECRON F1000LFP | 960 | 1500 | https://eu.pecron.com/products/pecron-f1000lfp |
| PECRON E3800LFP | 3840 | 4200 | https://eu.pecron.com/products/pecron-e3800lfp |
| BLUETTI Elite 30 V2 | 288 | 600 | https://www.bluettipower.eu/products/elite-30-v2-portable-power-station |
| BLUETTI Elite 300 | 3014.4 | 2400 | https://www.bluettipower.eu/products/elite-300-portable-power-station |
| BLUETTI Elite 400 | 3840 | 2600 | https://www.bluettipower.eu/products/elite-400-portable-power-station |

Sources checked on 27 October 2026. These are manufacturer ratings, not hands-on tests. No surge or transfer ratings were inferred. Existing six station identities/capacities/output are also present on the current official EU collections/product pages.

## Images

`data/bluetti-reviewed-photos.json` maps six exact model IDs to original images in the corresponding official EU product galleries. All six were visually checked against the base-station names/markings and EU sockets. No award montage, accessory bundle, generated photo or category fallback is used. Merchant assets remain unchanged, remotely served at their observed URLs.

BLUETTI's official affiliate page permits affiliates/agencies to promote its products using original content and creatives: https://www.bluettipower.eu/pages/affiliate-program . This is affiliate-use context, not a public-domain license. The owner originally reported a connection, but Awin now shows a pending application. These BLUETTI assets are prepared and privately previewed; verify programme approval or separate image permission before public release. PECRON photo permission / program-provided assets are not yet available in this session; its explicit pending-image state remains.

## Advertising and release gates

Awin's BLUETTI EU public profile identifies program 95479: https://ui.awin.com/merchant-profile/95479 . It prohibits trademark and trademark-plus-keyword bidding, direct linking from ads, and the bluetti.com display URL. Do not treat these public terms as an account-specific contract or guaranteed commission rate. Recheck the joined program's current terms before a paid campaign.

Still required before advertising sign-off:

- Issued deep links from the joined BLUETTI and PECRON publisher accounts, with exact destinations and independent activation configuration. No links constructed from IDs alone.
- Authorized PECRON product images/creative assets and exact model mapping.
- Account-side recorded click verification; commission remains unverified until a qualifying transaction appears in partner reports.
- Publish through the repository/deployment path and verify the deployed commit, public desktop/mobile flows, assets, links and disclosures.
- Review Romania delivery conditions and agree campaign budget before spending.

This branch is based on main 51c41f0 and includes the exact Renogy image patch. It must not be applied twice. The separate original worktree and its uncommitted changes remain untouched; superseded water-flow changes were not reapplied.

## Validation and remaining defects

- TypeScript check passed.
- 25 catalog/supplier/feed tests passed after integration, including exact source identity, capacities, output, search, comparison, cross-supplier URL rejection and six-image mapping.
- Catalog validator: 62 records, 49 models, 41 photo mappings, no errors. Eight PECRON models still have explicit pending-image states.
- Webpack production-mode build completed using Next's test-only Google-font response adapter with the existing project's saved original font files. Standard online build could not fetch fonts.googleapis.com under this environment's network policy. No font adapter or substitute font is shipped in this patch.
- Local Romanian model/search/comparison HTML checks were exercised. English search HTML checks failed: `/en/search?kind=product&brand=PECRON` returned `html lang="ro"`, Romanian heading and unprefixed product links, including with an English locale cookie. This local discrepancy remains unexplained. Browser checks on both the existing public site and the hosted preview confirm correct English content and /en links; it is not presented as a production defect.
- Playwright mobile test could not launch because the required Chromium executable is absent. No mobile E2E success is claimed.
- Production still points to main commit `51c41f07ac0c3dd4a45ae2a9034db25d48c3ddca`; this expansion is not published. GitHub integration write requests previously returned 403. No new permission or publication success is assumed.


## Release integration update — 27 October 2026

- BLUETTI EU is Pending Approval in the authenticated Awin account; no joined/active status is claimed. Manager qi.luo@bluetti.com was sent the catalogue, exact SKU/variant, current EUR/VAT prices, imagery-use and issued-link request in the existing thread.
- The exact Renogy image patch was integrated into this branch. All 365 CSV identities match their image field exactly: 364 images and one image-less promotional row 50175394414849. No price/stock/tracking fields were introduced into these raw identities.
- The old water-flow commit 05d82a9 is already superseded by changes in current main, including model counts, hub-only discovery and no repeated category navigation on child pages. It was deliberately not reapplied.
- A fresh public browser check of https://mairelectroai.com/en/search?kind=product&brand=PECRON shows English content and /en product links. The earlier local webpack HTML failure does not establish a production locale defect. Public routing was not modified on that assumption.
- GitHub branch creation was retried in this authorized run and returned 403 Resource not accessible by integration. The published main/deployment still points at 51c41f0. A source-based Vercel preview may be used for verification; it is not a claim that these commits reached GitHub main.


## Hosted preview verification

The source-upload preview for local commit 7df117f reached READY on Vercel (deployment dpl_FbkWEhRRwHk5o67w7Qni4FwAZ1fF). Browser checks of the English BLUETTI brand search returned six models, six correctly mapped loaded official images, /en links, lang=en and no horizontal overflow at 1363×936. This is a preview, with preview environment settings, not Production or GitHub main.

The exact supplied Renogy image is now also rendered on raw supplier-entry cards in main discovery/search, using the same SKU record as the full feed index. Missing images stay absent; no fallback photograph is inferred. Supplier entries remain unreviewed and untracked, independently of image availability.

## Public release gate update

Owner authorized publication on 27 October. All six BLUETTI image records now have publicationApproved=false and are excluded from rendered photo mappings until permission is documented. Exact provenance remains available internally. PECRON and BLUETTI show explicit missing-photo states. This does not activate tracking, prices or programme approval. GitHub write access was restored and PR #30 contains the release. Earlier preview photo counts and access failures above describe historical checks, not this release.

## Owner-directed station-photo publication

On 27 October the owner explicitly instructed publication of all photographs, superseding the prior internal publication hold. Six BLUETTI and eight PECRON original official EU images are now mapped to exact model IDs. PECRON images were visually inspected for base-station identity and EU presentation; E3800LFP includes the cart pictured in its official listing. All use square display dimensions and object-fit containment. The image records preserve exact source pages and remote asset URLs; no generated replacements or marketing price overlays are used. Public photo credits identify sources and retain rights with their holders. Owner publication authorization is not represented as manufacturer permission, affiliate approval or tracking activation. The Renogy feed’s single image-less promotional identity remains without an invented image.
