# M Air Electro AI

## Current catalog snapshot — 27 October 2026 (working branch)

49 canonical model records: 19 Renogy, 16 Waterdrop, 8 PECRON and 6 BLUETTI. This is not an in-stock offer count: Waterdrop K19H is archived/unavailable with ordinary documentation links. The 32-row Waterdrop feed represents 16 device models, 14 bundle/cartridge configurations and two extra-year offers excluded from device counts (one has conflicting title evidence). No full merchant-assortment claim is made. BLUETTI base-station photographs are documented from official EU galleries but disabled pending usage permission. PECRON imagery and exact issued tracking links for both suppliers remain outstanding; this branch is not an advertising-readiness sign-off. See `docs/partner-catalog-expansion-2026-10-27.md`.

Renogy and Waterdrop Germany are the two approved programmes. Renogy EU/Romania eligibility is confirmed; Waterdrop delivery to Romania remains unverified. PECRON/BLUETTI remain ordinary listings. Awin BLUETTI EU programme 95479 shows Pending Approval for publisher 3128269 on 27 October 2026; the feed/price/creative access request has been sent to the programme manager. `/renogy/catalog` now exposes all 365 exact Renogy feed SKU entries through search and pagination while retaining the distinction between feed entries and the 19 separately reviewed canonical Renogy models. Runtime prices require a fresh exact official feed; missing values fail closed to the merchant link. The earlier 72-parent disclosure and image audits remain historical evidence for the curated parent subset.

Current tests inspect routing and hrefs without generating external affiliate clicks. Network click registration, conversions and payout remain separate and unproven by these site tests. Earlier dated counts and route traversals below are historical, not instructions to repeat tracking tests.


M Air Electro AI is an independent product discovery, comparison and sizing platform for Romania and the EU. Romanian is the default commercial language; English is supported.

Production: https://mairelectroai.com

## Owner and publisher

M Air Electro AI is the brand/platform. **Stanislav Zavizion** is its owner and publisher, operating in **Romania** as an **individual / independent publisher**, serving **Romania / European Union**. There is no incorporated company behind the website. These owner-confirmed facts are centralized in `lib/site.ts`; no company registration, VAT/tax identifier, office/residential address, employees, licenses or certifications are asserted.

Public contact: `contact@mairelectroai.com`; partnerships: `partnerships@mairelectroai.com`; privacy: `privacy@mairelectroai.com`. The owner confirms all three Cloudflare Email Routing addresses are active. A real external inbound message to `contact@mairelectroai.com` reached the owner's inbox; separate receipt tests for the other aliases are not claimed. Website delivery uses Brevo SMTP with STARTTLS and Cloudflare Turnstile. Configuration, provider acceptance and inbox receipt are separate facts; see the current readiness report for their verified status. Public domain addresses are centralized in `lib/site.ts`; operational mailbox environment gates and the independent form gate remain in place. Owner identity does not establish reviewer credentials or per-article authorship. See [identity update report](docs/publisher-identity-update.md).

Architecture, route inventory, repository audit and public deployment results: [marketplace expansion report](docs/marketplace-expansion-report.md).

Public RO/EN URL rules, search-intent priorities, worked energy examples and the outstanding search-data baseline: [SEO growth foundation](docs/seo-growth-foundation.md).

**Need → Calculate → Understand → Discover → Compare → Choose → Visit supplier.** We support independent equipment selection. We do not sell equipment, hold inventory or operate product checkout. AI assistance and future experts support the buying decision.

## Product modules

The 26 October UX/CRO update brings all 365 Renogy feed identities into main search and category discovery where the official feed title supports a classification. Exact canonical SKU matches appear once; raw supplier entries remain labelled and are not eligible for technical filters or comparison. `/renogy/catalog` retains the complete index. Main discovery is paginated; reviewed-only and guide-only filters remain available. Current prices still require a fresh official feed, independently of affiliate tracking. See [implementation and verification notes](docs/ux-cro-2026-10-26.md).

The [full Renogy feed catalog](docs/renogy-365-price-catalog-2026-10-26.md) exposes all 365 exact SKU identities at `/renogy/catalog` (also in English), with 48 entries per page and model/SKU search. These entries remain separate from individually reviewed selections. Only a fresh official feed may supply the current EUR price; no original price, discount or stock is displayed.

The [15 October UX redesign](docs/ux-redesign-2026-10-15.md) makes equipment browsing and guided selection the two homepage entry points. Marketplace opens a filterable catalog, Renogy categories have no decorative numbering, and a shared comparison tray preserves selections across RO/EN switching. Finder drafts use bounded, non-sensitive URL parameters; filtered/draft URLs remain noindex. Existing supplier gates and Waterdrop configuration are unchanged.

- Marketplace: ten main families and 22 category/subcategory routes with buying advice, technical checks and working filters.
- Catalog: sourced Renogy EU models plus three Waterdrop Germany, three PECRON EU and three BLUETTI EU models; explicitly labelled equipment classes are retained. A separate fail-closed server layer may show the current EUR price only when an authorized official feed matches the exact SKU and is fresh; otherwise the interface links to the supplier for the current price. No list/old price, discount, stock, reviews or ratings are invented or displayed. See the [EU source and safety record](docs/eu-supplier-listings-2026-10-12.md).
- Solutions: apartment, home, solar + battery, RV/caravan, marine, off-grid cabin, workshop and business continuity.
- Learn: 18 independent guides, twelve topic/reading-level hubs and grouped FAQ.
- Search: names, brands, specifications, voltage, power, capacity, applications and tags; intersecting known-value filters.
- Compare: 2–4 records, shareable URLs and local card selection; missing values stay unknown.
- Tools: system finder, backup, battery, solar, cable, voltage drop, generator, motor, transformer, breaker and fuse calculations.
- Business and Experts: truthful information/contact paths; professional booking and procurement fulfilment are not active services.

## Taxonomy

Solar (panels: rigid/portable/flexible; kits; controllers), Batteries (LiFePO4, 12 V, 100 Ah), Inverters (pure sine, 2000 W), Battery Charging (DC-DC), Backup Power, Generators, EV Charging, Electrical Components, Industrial Electrical and Marine Electrical.

Additional sizes/features remain facets or procurement topics until catalog evidence and original content justify dedicated routes. [PROJECT_BLUEPRINT.md](PROJECT_BLUEPRINT.md) is authoritative.

## Stack and architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase SSR for optional accounts, Playwright and Node tests. Read the installed Next.js documentation before changing framework code.

`lib/marketplace/content.ts` owns bilingual taxonomy; `catalog-data.ts` owns models/classes; `solutions.ts`, `guides.ts` and `information.ts` own editorial content. `query.ts` and `recommendation.ts` provide deterministic logic. `routes.ts` provides the public inventory. Existing `lib/affiliate/catalog.ts` exports remain compatible; supplier tracking stays in `lib/affiliate/providers`.

`lib/affiliate/price-feed.ts` is the server-only official-feed reader; `lib/affiliate/pricing.ts` owns exact SKU and freshness validation. Price data never changes editorial product facts or affiliate-link gates. Only current EUR amounts are rendered, and any unavailable, ambiguous or expired value becomes the ordinary “current price at supplier” action.

Reusable server templates are `app/marketplace/[...path]`, `app/solutions/[slug]` and `app/learn/[slug]`. Small client components handle navigation, comparison selection and calculation inputs. Long-form content is not sent as menu client state.

## Development and verification

```sh
npm ci
npm run dev
npm test
npm run i18n:check
npm run lint
npm run typecheck
npm run build
npm audit
npx playwright install chromium
npm run start -- -p 3100
# In a second terminal:
npm run test:e2e
npm run test:crawl
```

Use the lockfile. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. If Node cannot see an installed trusted system CA, set `NODE_USE_SYSTEM_CA=1`; do not disable TLS verification.

`TEST_BASE_URL` selects a different local/public target. Browser tests include 1440/1366/768/390 screenshots and 430 mobile navigation. The crawler starts at the homepage, follows internal links, checks errors, redirects, malformed/dead links and local anchors, and reports orphan public routes. Generated evidence is in ignored `test-results/` and `playwright-report/`.

Public page titles, descriptions and Open Graph locales follow the selected RO/EN language. `tests/e2e/locale-contact.spec.ts` checks public metadata in both languages, preserves canonical/noindex rules, and verifies language switching plus contact-email copying (including denied clipboard access). The contact page supports copying the address into webmail while the separate website-form delivery gate remains in place.

## Environment and affiliate state

Current public routing and analytics status, including the 24 October check of 18 Renogy and 3 Waterdrop issued links: [commercial journey verification](docs/commercial-readiness-2026-10-24.md). Successful merchant redirects do not establish network-recorded clicks or commissions. Plausible remains unconfigured on the inspected baseline; the consent-gated event implementation alone is not an active analytics service.

The official public origin is `https://mairelectroai.com`; `www` redirects permanently to the apex. This is also the safe canonical default when no site URL is configured. Use an explicit `NEXT_PUBLIC_SITE_URL=http://localhost:3100` only when testing local-origin contact delivery. Legacy Vercel-host values are normalized to the official public domain.

The original `public/hero.png` M/head image is preserved and prominent on the homepage. `lib/visual-system.ts` selects lightweight SVG energy diagrams per page family, without fetching unrelated background images. Search spans equipment, categories, solutions and guides. Engineering calculator copy shares a tested RO/EN translation layer.

Run `npx tsx scripts/audit-suppliers.ts` separately from the internal crawler. Merchant access blocks are reported as unverified, not internal-route failures. Release verification covers five passes: routes/controls; discovery/calculators; mobile/accessibility; SEO/domain/i18n/legal; visual/reviewer quality.

See [docs/production-environment.md](docs/production-environment.md) and `.env.example`. Public discovery and calculation do not require auth, AI or payment credentials. Visitors use domain email links from their own email application. Production mailbox values are the three addresses above with `CONTACT_EMAIL_VERIFIED=true`. The form requires a verified same-domain sender, `BREVO_SMTP_LOGIN`, `BREVO_SMTP_KEY`, both Turnstile keys and `CONTACT_FORM_ENABLED=true`. Production has been enabled for the authorized delivery verification; do not infer inbox receipt from configuration or SMTP acceptance. A disabled environment shows an unavailable notice without editable controls; GitHub is supplementary. The current application status and release evidence are maintained only in [the readiness report](AFFILIATE_APPLICATION_READINESS.md).

**Renogy / Impact approval was owner-confirmed on 14 October 2026** (program `14864`, advertiser `3086767`). This is not dealer status, proof of EU campaign eligibility or active tracking. `/renogy` presents the seven existing sourced EU models and links to comparison and calculators. A visible RO/EN disclosure precedes content throughout the platform. Activation preserves both `RENOGY_AFFILIATE_APPROVED=true` and `AFFILIATE_TRACKING_ENABLED=true`, and additionally requires `RENOGY_IMPACT_EU_VERIFIED=true`, exact issued URL mappings in `RENOGY_IMPACT_LINKS_JSON` and exact verified HTTPS origins in `RENOGY_IMPACT_VERIFIED_ORIGINS_JSON`. Empty, invalid, non-allowlisted or mismatched-program configuration falls back to the ordinary supplier URL. No link can be derived from the IDs. See [the Renogy launch record](docs/renogy-affiliate-launch-2026-10-14.md). Do not alter Waterdrop's independent settings when activating Renogy.

**Waterdrop Germany is accepted through Impact, while PECRON EU and BLUETTI EU tracking remains OFF.** Waterdrop stays fail-closed until `WATERDROP_AFFILIATE_APPROVED=true`, `AFFILIATE_TRACKING_ENABLED=true` and exact network-issued links are mapped in `WATERDROP_IMPACT_LINKS_JSON`. Real product entries explicitly select a supplier from `lib/affiliate/suppliers.ts`; ordinary product/source URLs must match its exact European origin. The `/waterdrop` landing page and Water / Water & Resilience listings disclose tracked links beside the action. Delivery to Romania must be confirmed with the merchant; acceptance in the DE program does not prove Romanian delivery. No approval is inferred for the remaining suppliers.

## Deployment

Run all checks, commit implementation and alignment, push the reviewed commit to `main`, and confirm the connected Vercel deployment is for that commit. Then rerun browser tests and the crawler with `TEST_BASE_URL=https://mairelectroai.com`. A local build alone is not completion.

Run `npx tsx scripts/verify-suppliers-production.ts` after confirming the production source SHA. This read-only smoke test targets the actual public domain, derives the expected Waterdrop total from the reviewed expansion evidence, retains the three PECRON and three BLUETTI requirements, and verifies HTTP 200, model headings, supplier identity, issued Waterdrop links and ordinary PECRON/BLUETTI CTAs. Success reports the current verified model count with zero failures and writes evidence to ignored `.task-work/`. The Renogy storefront, model CTAs, disclosures, RO/EN metadata, mobile layout and accessibility are covered by `tests/e2e/renogy-storefront.spec.ts`. A prior report is not evidence for a new run; check the process exit code and timestamp.

Optional account, document, AI and saved home-profile flows remain. Ukrainian energy adapters and demonstration datasets are retained as specialized supporting modules, outside primary navigation and the commercial sitemap. Obsolete map/tariff/directory routes redirect to active sections.

External activation dependencies include affiliate approval, approved feeds/assets, real professional onboarding and optional outbound/form delivery. None is implied by a successful build. Publisher identity, the official domain and inbound contact routing are confirmed. Human author/reviewer metadata is published only with page-specific evidence; source-based informational content does not claim professional sign-off. Missing affiliate approval or historical traffic does not prevent applying to a program.

## Affiliate application readiness

The owner requested independent informational positioning on 14 September 2026. Existing discovery routes and architecture remain; no equipment payments or active marketplace/dealer claims. See [readiness report](AFFILIATE_APPLICATION_READINESS.md) and [domain, publisher, contact and analytics setup](docs/custom-domain-and-publisher.md). Missing real publisher facts must not be invented.
