# M Air Electro AI

M Air Electro AI is a independent product discovery, comparison and sizing platform for Romania and the EU. Romanian is the default commercial language; English is supported.

Production: https://mairelectroai.com

## Owner and publisher

M Air Electro AI is the brand/platform. **Stanislav Zavizion** is its owner and publisher, operating in **Romania** as an **individual / independent publisher**, serving **Romania / European Union**. There is no incorporated company behind the website. These owner-confirmed facts are centralized in `lib/site.ts`; no company registration, VAT/tax identifier, office/residential address, employees, licenses or certifications are asserted.

Owner-authorized public contact: `slexusrx@gmail.com`, configured separately as `ownerContactEmail`. Contact and publisher pages use this address, including partnership/privacy inquiries, without claiming delivery was tested. Prepared domain addresses: `contact@mairelectroai.com`, `partnerships@mairelectroai.com`, `privacy@mairelectroai.com`. Domain mail links still require explicitly configured addresses and `CONTACT_EMAIL_VERIFIED=true`; form delivery also requires separate operational configuration. Publishing the Gmail address does not activate those gates. Owner identity does not establish technical reviewer identity, credentials or per-article authorship. See [identity update report](docs/publisher-identity-update.md).

Architecture, route inventory, repository audit and public deployment results: [marketplace expansion report](docs/marketplace-expansion-report.md).

**Need → Calculate → Understand → Discover → Compare → Choose → Visit supplier.** We support independent equipment selection. We do not sell equipment, hold inventory or operate product checkout. AI assistance and future experts support the buying decision.

## Product modules

- Marketplace: ten main families and 22 category/subcategory routes with buying advice, technical checks and working filters.
- Catalog: seven sourced Renogy EU models and eleven explicitly labelled equipment classes; no invented prices, stock, reviews or ratings. Existing production models are preserved.
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

## Environment and affiliate state

The official public origin is `https://mairelectroai.com`; `www` redirects permanently to the apex. This is also the safe canonical default when no site URL is configured. Use an explicit `NEXT_PUBLIC_SITE_URL=http://localhost:3100` only when testing local-origin contact delivery. Legacy Vercel-host values are normalized to the official public domain.

The original `public/hero.png` M/head image is preserved and prominent on the homepage. `lib/visual-system.ts` selects lightweight SVG energy diagrams per page family, without fetching unrelated background images. Search spans equipment, categories, solutions and guides. Engineering calculator copy shares a tested RO/EN translation layer.

Run `npx tsx scripts/audit-suppliers.ts` separately from the internal crawler. Merchant access blocks are reported as unverified, not internal-route failures. Release verification covers five passes: routes/controls; discovery/calculators; mobile/accessibility; SEO/domain/i18n/legal; visual/reviewer quality.

See [docs/production-environment.md](docs/production-environment.md) and `.env.example`. Public discovery and calculation do not require auth, AI or payment credentials. Private contact requires verified domain mailboxes and enabled delivery/spam configuration. GitHub is supplementary; without a private channel the affiliate application remains NOT READY.

**Renogy / Impact approval is not confirmed.** Current links are ordinary supplier links. Activation requires both `RENOGY_AFFILIATE_APPROVED=true` and `AFFILIATE_TRACKING_ENABLED=true`, with exact Impact-issued HTTPS links mapped by supplier URL in `RENOGY_IMPACT_LINKS_JSON`. The existing provider validates links and disclosure follows actual activation. Merchant model details, Romanian delivery and warranties remain external checks.

## Deployment

Run all checks, commit implementation and alignment, push the reviewed commit to `main`, and confirm the connected Vercel deployment is for that commit. Then rerun browser tests and the crawler with `TEST_BASE_URL=https://mairelectroai.com`. A local build alone is not completion.

Optional account, document, AI and saved home-profile flows remain. Ukrainian energy adapters and demonstration datasets are retained as specialized supporting modules, outside primary navigation and the commercial sitemap. Obsolete map/tariff/directory routes redirect to active sections.

External dependencies include affiliate approval, approved feeds/assets, real professional onboarding, confirmed private contact delivery, editorial review and remaining privacy/legal operational details. The owner/publisher identity above is confirmed; the other integrations are not complete.

## Affiliate application readiness

The owner requested independent informational positioning on 14 September 2026. Existing discovery routes and architecture remain; no equipment payments or active marketplace/dealer claims. See [readiness report](AFFILIATE_APPLICATION_READINESS.md) and [domain, publisher, contact and analytics setup](docs/custom-domain-and-publisher.md). Missing real publisher facts must not be invented.
