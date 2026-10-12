# EU supplier listings and affiliate preparation

## Scope and evidence

AI-assisted official-source check on 12 October 2026. These are manufacturer-stated specifications, not hands-on test results, human editorial approval, merchant endorsement or evidence of affiliate approval. Descriptions are independently written. No merchant images, prices, discounts, stock, reviews, ratings, shipping promises or certification claims were imported.

| Model | Verified fields published | Official EU model page |
| --- | --- | --- |
| Waterdrop G3P600 | Under-sink tankless RO; electricity required; 600 GPD; purified-to-drain 2:1 | https://www.waterdropfilter.eu/products/reverse-osmosis-water-filtration-system-g3p600 |
| Waterdrop G3P800 | Under-sink tankless RO; electricity required; 800 GPD; purified-to-drain 3:1 | https://www.waterdropfilter.eu/products/tankless-reverse-osmosis-system-g3p800 |
| Waterdrop X12 | Under-sink tankless RO; electricity required; 1200 GPD; purified-to-drain 3:1 | https://www.waterdropfilter.eu/products/reverse-osmosis-system-x12 |
| PECRON E1500LFP | Base capacity 1536 Wh; rated AC output 2200 W | https://eu.pecron.com/products/e1500lfp-power-station-2200w-1536wh |
| PECRON E2400LFP | Base capacity 2048 Wh; rated AC output 2400 W | https://eu.pecron.com/products/pecron-e2400lfp-power-station-2400w-2048wh |
| PECRON F3000LFP | Base capacity 3072 Wh; rated AC output 3600 W | https://eu.pecron.com/products/pecron-f3000lfp-portable-power-station |
| BLUETTI Elite 100 V2 | Base capacity 1024 Wh; rated AC output 1800 W | https://www.bluettipower.eu/products/elite-100-v2-portable-power-station |
| BLUETTI Elite 200 V2 | Base capacity 2073.6 Wh; rated AC output 2600 W | https://www.bluettipower.eu/products/elite-200-v2-portable-power-station |
| BLUETTI Apex 300 | Base capacity 2764.8 Wh; rated AC output 3840 W | https://www.bluettipower.eu/products/apex-300-home-battery-backup |

The BLUETTI Elite 200 V2 web-retrieval tool timed out; a direct HTTPS fetch of the exact EU page returned 200 and its product title confirmed both figures. No US/UK model page was substituted. Product pages may offer bundles or UK plug variants alongside base EU models; listings explain that the EU variant and exact manual must be checked. EU storefront presence does not guarantee delivery to Romania.

Water production/recovery ratings depend on inlet and filter conditions. No contaminant-performance records were added, so contaminant filters still return no match without exact model/cartridge/substance evidence. Waterdrop listings remain exclusively in Water / home purification / reverse osmosis / under-sink categories. Existing water suppliers and the illustrative visual system are preserved.

## Provider identity and URL policy

`lib/affiliate/suppliers.ts` centralizes Renogy EU, Waterdrop Europe, PECRON EU and BLUETTI EU identities and exact official origins. Real catalog entries must explicitly select a supplier; a URL no longer defaults to Renogy. Brand, merchant and region derive from that selection. The existing Waterdrop identity comes from `providers/water.ts`, not a competing registry.

The shared validator rejects HTTP, credentials, non-default ports, query/fragment tracking, malformed/encoded embedded origins, noncanonical paths, other regions and cross-supplier mismatches. The supplier audit checks every catalog/source URL and validates each redirect before following it. Access blocks and network failures remain unverified evidence, not successes.

## Affiliate safety and application readiness

Renogy's existing two-flag and exact Impact-issued-link gate remains intact, with additional ordinary-URL validation. Waterdrop, PECRON and BLUETTI use a separate pending provider configuration: approval false, tracking false, empty link mappings, network unconfirmed and no program ID. Renogy/global environment flags cannot activate them. No new speculative tracking environment fields or network URLs were added.

Future activation must be a separate evidence-backed change: confirm the publisher's actual acceptance, the eligible EU storefront/territories, exact network-issued links or identifiers, the agreement's permitted uses and the matching disclosure. Preserve fail-closed ordinary URLs whenever any prerequisite is missing. Public advertised commission rates or program IDs are not granted terms and were not imported into runtime configuration.

The 8 October outreach record remains historical evidence of correspondence, not approval. No affiliate application, contract acceptance, purchase, account creation or live email was performed by this catalog task. Renogy, Waterdrop, PECRON and BLUETTI approval remains unconfirmed. Existing owner identity and verified contact history are unchanged.

## Verification

Run unit, i18n, lint, typecheck, build, supplier audit, browser and crawl checks. Browser coverage must include nine public products in RO/EN at mobile/desktop widths, source labels, ordinary outbound links, product schema without fabricated offers/ratings, search, mixed-supplier comparison and Water subcategory discovery. Deployment is complete only when the public domain serves these pages from the committed/main release, as confirmed by deployment metadata and live smoke checks.

The source audit returned HTTP 200 for all 16 existing and new supplier model URLs, with no invalid URLs, regional redirects, merchant blocks or network-unverified records. `npm test` passed 80 tests; i18n validated 419 keys; lint, typecheck and the Next.js 16.3.8 production build passed.

Final local release validation (including footer, FAQ and partnership copy): all 56 browser scenarios passed; the sequential crawl visited 137 routes with zero failures, orphan routes or redirects.

An initial concurrent local browser/crawl run encountered connection/load timeouts. A separate existing navigation test incorrectly tried to click Marketplace after opening other sections of the named mobile accordion; it now reopens that section before clicking, without removing link assertions. The complete 56-scenario browser suite subsequently passed with the repository's default single worker. Final release/browser/crawl evidence is saved separately in ignored `.task-work/` and `test-results/`; production success is not inferred from these local checks.

Dependency audit: `npm audit --omit=dev` reports zero vulnerabilities. The full development-tool audit reports five high-severity entries in the existing `braces` / `micromatch` / `fast-glob` / Next ESLint chain. No dependencies were added or version-changed in this release. The suggested force-fix downgrades `eslint-config-next` to 14.x, so it was not applied to the Next 16 project. This remains a development-tool maintenance item, not a claim of an entirely clean dependency audit.
