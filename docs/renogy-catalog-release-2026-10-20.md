# Renogy catalog expansion — 20 October 2026

## Baseline and authorization

Work started from the confirmed production/main commit `e6771ac16fa6160824903fcf4b6cce9ff487deeb`. The pending visual commits were integrated as `43728bd` and `4591bbd` on `codex/renogy-catalog-2026-10-20`. The original GitHub desktop checkout was not edited. The coordinating task relayed the owner's explicit 20 October authorization to implement, test and deploy this package.

The old handoff identifier `43467ec` is absent from both local Git object stores checked. GitHub no longer advertises `codex/visual-photo-refresh-2026-10-18`. Neither unverified identifier was used as the release baseline. A fresh `ls-remote` and Vercel production lookup both confirmed `e6771ac` before release.

## Reviewed catalog

The manufacturer's 20 October reply supplied `impactradius.csv` and confirmed that Impact carries synchronized catalog data and images, with detailed specifications/manuals on official product pages. The attachment contained 365 rows across 101 parent product URLs; variants are not separate parent products. Shipping charges, price differences, protection add-ons, gifts and regional promotional pseudo-products were excluded.

Added twelve selections, for nineteen Renogy selections total:

- DuoHeat Core Mini 100 Ah, one battery.
- Pro Smart 200 Ah, one battery.
- ShadowFlux two 200 W panels plus Z brackets; 400 W total.
- Rover 2 20 A Bluetooth MPPT.
- 400 W solar blanket and 400 W solar suitcase, separately.
- Backup kits with nominal battery energy 2560 Wh / 400 W PV / 2000 W inverter and 3840 Wh / 800 W PV / 2000 W inverter.
- EU 2000 W and 3000 W pure sine inverters.
- 175 W flexible panel.
- 500 A battery monitor.

`data/renogy-reviewed-products.json` records the exact official URL, variant ID, SKU, image URL, dimensions, SHA-256 and review date. The official product JSON, HTML and original image bytes are retained locally in ignored `.task-work/renogy-feed/`.

Photos were visually reviewed against the selected model/pack. Rover 2's generic feed image depicted a different controller; the selected variant's `Rover2_20A.webp` is used instead and visibly reads 100 V / 20 A. The 3840 Wh kit uses a clean official two-suitcase photo without a promotional price. No generated product images, altered image pixels or new locally hosted manufacturer images were introduced. New images are served directly and unoptimized from the official CDN; terms for alteration/rehosting remain unconfirmed.

Conflicting manufacturer facts remain explicit: Pro Smart charging-temperature lower limit; EU versus UK labels on portable-panel specification tables; the 60 A kit's stray 20 A table entry. No exact energy is inferred for DuoHeat from its marketing voltage. Rover 2 supports 300 W PV at 12 V / 600 W at 24 V, not a 400 W array at 12 V. Kits remain component collections, never complete power stations.

## Affiliate links

The originally supplied `https://renogy.sjv.io/E0XabP` was rechecked on 20 October: HTTP 200 at `https://www.renogy.com/`, preserving publisher `7767803` and campaign `14864`. It is a general homepage link, not an exact EU product destination, so it is not substituted for reviewed product links.

The existing issued full Impact ad URL contains publisher `7767803`, ad `3394229`, program `14864`. The documented Impact deep-link method appends an encoded `u` destination:

https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/tracking/tracking-links/create-and-manage-links/create-a-deep-link-for-an-ad

Each new link was followed to HTTP 200 and the exact Renogy EU path/variant with `mpid=7767803`. Public evidence, without transient click IDs, is in `docs/renogy-link-verification-2026-10-20.json`. This proves routing and publisher preservation, not a commission or conversion.

The twelve static reviewed mappings remain behind the existing approval, EU verification, global tracking and trusted-origin gates. Explicit deployment environment mappings take precedence. Existing six active Renogy mappings and the ordinary 20 A DC-DC charger link are retained. No account, OAuth grant, persistent credential, contract or paid campaign was created.

## Presentation and discovery

The existing design now groups Renogy equipment into seven navigable sections. Product cards and supplier controls use translucent glass and dark readable text, with reduced-transparency fallbacks. Manufacturer photo backgrounds are preserved. The feature uses the real 3840 Wh kit photo. Photo credits identify official manufacturer resources without granting public reuse rights.

The expansion adds twelve model routes in each language. Existing localized metadata, canonical/hreflang links, editorial WebPage schema, internal category links, robots rules and sitemap generation are retained. No Product/Offer/Review schema or invented prices, stock, ratings or delivery promises are introduced.

## Verification and limits

Test results and release identifiers are recorded in the task's final release report. Browser checks cover exact photo URLs/loading, affiliate destinations and disclosures, mobile layouts, keyboard-accessible category navigation, accessibility and RO/EN indexability. The unit suite covers variant allowlisting, unknown-data handling, pack quantities and preventing kits from being recommended as complete power stations.

Pre-release checks passed: production build, ESLint, 109/109 unit tests, 38/38 browser tests and `git diff --check`. Browser coverage includes 320–1920 px, both languages, official photo loading, seven catalog groups, existing supplier CTAs, Waterdrop, comparison, calculators, mobile logo order, direct water navigation, accessible contrast and clean localized sitemap entries. All twelve downloaded image hashes match the reviewed manifest; existing local manufacturer photographs were unchanged. Screenshots were visually inspected at 320 and 1440 px.

Romania delivery exclusions and product-specific shipping eligibility remain for confirmation by the merchant. The user's authenticated browser was not exposed through the supported computer interface; no Awin Publisher ID or Search Console account access is claimed. No external correspondence was sent during this implementation.
