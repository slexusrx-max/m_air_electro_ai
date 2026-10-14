# M Air Electro AI — Authoritative Product Blueprint

Version 4 · Official marketplace-first direction · 24 September 2026

This specification supersedes earlier positioning across production, source, metadata, documentation and coding-agent instructions.

## Product Vision

M Air Electro AI is an independent product discovery, comparison and sizing platform. Help customers understand a system before choosing equipment.

## Official Positioning

Owner-confirmed identity: **M Air Electro AI** is the brand/platform; **Stanislav Zavizion** is the owner/publisher, an **individual / independent publisher** operating in **Romania**, with commercial region **Romania / European Union**. No incorporated company exists behind the website. Do not invent company forms, registration/VAT/tax identifiers, offices, residential addresses, employees or credentials. Owner identity is not automatic attribution or technical review of every article.

Cloudflare Email Routing is owner-confirmed active for the three official domain addresses. A real external inbound test to `contact@mairelectroai.com` reached the owner's inbox. Separate receipt tests for the other aliases are not confirmed. Use `CONTACT_EMAIL_VERIFIED=true` with the three explicit mailbox environment values. Website sending uses Brevo SMTP and Turnstile with an independent form gate. Configuration, provider acceptance and inbox receipt are separate; the current gate/deployment/test status is maintained in AFFILIATE_APPLICATION_READINESS.md. Represent the publisher as `Person` and the platform name as `Brand` / `WebSite`, not an incorporated `Organization`.

Public contacts are `contact@mairelectroai.com`, `partnerships@mairelectroai.com` and `privacy@mairelectroai.com`. Publish these domain addresses; the forwarding inbox is not the primary public brand contact. Active inbound routing does not enable the website contact form. No physical address was provided.

**Need → Calculate → Understand → Discover → Compare → Choose → Visit supplier.** Marketplace is the primary commercial layer. Calculators, Find My Solution, technical guides, AI and future experts support the decision. The platform is not a direct merchant, warehouse, general handyman service, outage-monitoring product or brochure.

## Primary Market

Romania is the launch market; the EU is the commercial region. Romanian is primary, English secondary. Region selection must not silently send users to another region's supplier. EU catalog classification does not guarantee Romanian delivery.

## Commercial Model

Independent affiliate-commerce discovery. The merchant controls price, stock, payment, orders, shipping, warranty and returns. No fabricated inventory, reviews, ratings, prices or partnership status. There is no equipment checkout or fulfilment operation.

## Information Architecture

Primary navigation: Marketplace, Solutions, Tools, Learn, Experts, For Business. Experts is a professional-preparation guide, not a booking directory. Search and RO/EN switching stay accessible. About the platform and Legal are in a deep footer. Desktop mega menus group real destinations; mobile uses nested expandable groups. Every visible control works.

## Marketplace Taxonomy

Ten families: Solar, Batteries, Inverters, Battery Charging, Backup Power, Generators, EV Charging, Electrical Components, Industrial Electrical and Marine Electrical.

Initial nested categories: solar panels, rigid/portable/flexible panels, solar kits, solar controllers; LiFePO4, 12 V, 100 Ah batteries; pure sine and 2000 W inverters; DC-DC chargers. All 22 category routes share one template and genuine parent-child breadcrumbs.

Future dimensions include panel power bands; home/RV/marine/off-grid kits; MPPT/PWM; 24/48 V; 200/300 Ah; Bluetooth/heating; inverter chargers; AC-DC; UPS; EV accessories; breakers/fuses/contactors/relays; VFD/motors/PLC/sensors; shore power/monitoring. Use facets or procurement topics until source evidence and useful content justify deeper routes. Do not publish thin doorway pages.

Category pages provide explanations, child navigation, equipment or explicit selection guidance, useful known-value filters, buying advice, technical checks, related calculator/solution/guide, FAQ and supplier disclosure.

## Solutions Architecture

Eight records: apartment-backup, home-backup, solar-battery, rv-caravan, marine, off-grid-cabin, workshop, business-backup. Each covers intended users, loads, architecture, an illustrative range/calculation, battery/inverter needs, solar/generator considerations and professional caveats. Example inputs can populate the finder; they do not describe the customer's actual site.

## Learn Architecture

18 initial guides cover storage sizing, inverter choice, chemistry, DC voltage, kWh, solar sizing, controllers, surge, runtime, apartment/home/RV/marine systems, DC-DC, generators, EV, protection and motors. Twelve topic/reading-level hubs aggregate them. Original explanations, examples, sources and links connect learning to tools and equipment. FAQ content is visible; do not claim unsupported rich-result eligibility.

## Tools Architecture

Extend the existing deterministic calculations and UI primitives. The finder supports seven settings, load, peak, hours, region, budget and existing battery/solar/generator. Separate continuous and starting power. Do not deduct unknown existing equipment or invent prices to fit a budget.

Battery storage equals required delivered Wh divided by usable fraction and efficiency. Backup calculations respect each load's hours. Solar watts equal daily Wh divided by equivalent sun hours and declared yield factor. Defaults are illustrative, not a Romania forecast. Relevant tools lead to appropriate equipment; no forced unrelated sales links.

## Affiliate Architecture

Renogy Impact approval is owner-confirmed on **14 October 2026**, program `14864`, advertiser `3086767`. M Air Electro AI remains an independent publisher/affiliate, not a dealer. Approval, EU campaign eligibility and tracking activation are separate states. The `/renogy` storefront reuses the seven existing source-backed products, comparison and sizing tools. Editorial URLs remain ordinary. Activation requires both existing flags, an explicit EU verification gate, exact issued mappings and exact verified tracking origins; invalid/missing configuration returns the ordinary URL. Visible RO/EN disclosures precede promotional content. Waterdrop Germany retains its separate working Impact configuration. See `docs/renogy-affiliate-launch-2026-10-14.md` for missing Impact evidence and release verification.

## Supplier Architecture

12 October 2026 expansion (historical): distinct PECRON EU and BLUETTI EU identities were added. All real products require an explicit supplier, with brand/merchant/origin checked centrally in `lib/affiliate/suppliers.ts`. Nine EU-source-checked models are documented in `docs/eu-supplier-listings-2026-10-12.md`. Waterdrop remains in Water / Water & Resilience; portable power stations belong to Backup Power. The 13 October Waterdrop Germany launch supersedes its previous pending status. PECRON/BLUETTI tracking remains off. No prices, stock, ratings, certifications or approval are inferred.

Real models carry official sources and review dates. Classes describe technical roles, not invented purchasable products. No merchant copy or images are reproduced. Original category artwork includes studio-style generated solar panel imagery and schematic illustrations for other families. Category imagery is illustrative, not a photograph of the named model. New suppliers need evidence, regional URL, disclosure and delivery checks. Never label a generic collection URL as a specific model.

## Search

GET `/search` renders results on the server. Normalize case, diacritics, separators and compact/spaced units; search names, brands, categories, known specs, tags and uses. Intersect filters over known fields. Display count, query, reset and useful no-result guidance. Missing data stays unknown. Bound inputs and safely handle repeated query parameters. Internal search/filtered URLs are not indexable landing pages.

## Compare

Compare 2–4 unique valid IDs using a shareable URL and optional local card selection. Only documented fields appear; unknown values are explicit. Distinguish models/classes and show uses/limitations. Cross-family comparisons do not establish compatibility.

## SEO Strategy

Unique title, description, canonical and H1 for commercial pages. A real route inventory drives the sitemap. Use factual BreadcrumbList and Article data, Person for the individual publisher, and Brand/WebSite for the platform; do not represent the platform as an incorporated Organization. Product markup is restricted to actual models and has no invented offers/reviews/ratings. Auth/account/dashboard/search/filtered URLs are excluded from indexing. Obsolete routes redirect; retained specialized tools stay outside the commercial sitemap.

## Localization

Switching preserves full path and query. `mr-electro-locale` preserves stored preferences; Romanian is the default. Typed `{ro,en}` records allow later de/fr/it/es without duplicated route components. Ukrainian dictionary data remains for legacy code; the active request locale and switcher accept Romanian and English. Translate editorial copy while keeping model names/units intact. Do not claim complete Romanian coverage for untranslated legacy supporting interfaces.

## Data Architecture

`content.ts` owns taxonomy; `catalog-data.ts` records; `solutions.ts`, `guides.ts`, `information.ts` content; `query.ts` querying; `recommendation.ts` estimates; `routes.ts` inventory. `lib/affiliate/catalog.ts` preserves existing APIs. Fields/facets exist only with evidence. Tracking stays separate from editorial records.

## Future Database Strategy

Move typed records to versioned database tables only when editorial workflow/feed scale requires it. Preserve IDs, slugs, localization, sources and review dates. Validate imports before publication. Existing Supabase supports optional accounts; never simulate live stock.

## Future AI Strategy

AI may explain requirements, manuals and selection. Deterministic functions own numerical calculations. AI must distinguish unknowns, cite provided sources and never invent products/live stock. Do not turn the homepage into an AI-first landing page without owner instruction.

## Authentication Strategy

Public discovery, search, comparison and tools require no login. Preserve Supabase sessions and role checks for optional accounts. Missing configuration must not break public browsing. Private pages are noindex; secrets remain server-only.

## Expert Marketplace Strategy

No fictional profiles, credentials or response-time promises. Current Experts provides preparation guidance and contact. Future profiles require identity, relevant credentials, regions and publication consent. Booking, payments and protected service transactions are separately scoped future work.

## Security

Maintain headers, validated inputs, server-only secrets and escaped JSON-LD. Never disable TLS verification to resolve a host CA issue. Audit dependencies, use the lockfile, patch material vulnerabilities, and read installed Next.js docs after upgrades. Public verification must not create accounts, send messages or place orders.

## Legal / Disclosure Model

State independent discovery, preliminary calculations, external seller responsibility and current affiliate status consistently. Privacy describes cookies, local storage, optional providers, Cloudflare email forwarding and external navigation. Use the confirmed publisher identity and active domain contact routes above; do not infer outbound or form delivery. GitHub issues remain supplementary and must not invite private information. Publish only evidenced authorship and review records, with source-based research and preliminary calculation limits clear. Do not invent retention periods, service-provider arrangements or legal sign-off.

## Development Roadmap

1. Current phase: deep discovery, 22 categories, eight solutions, 18 guides, 19 records, search, compare, tools and official repository alignment. Every major category includes equipment records or classes; the catalog retains existing production models alongside the new records.
2. After approval: actual Impact activation, disclosure update and approved attribution testing.
3. Curate more verified EU models/suppliers and promote justified facets to categories.
4. Real expert onboarding, optional saved projects and separately scoped database/feed/AI work.

## Definition of Done

A visitor can explore, calculate requirements, understand categories, review equipment, compare facts, read related guides, reach external suppliers and understand disclosure comfortably on desktop/mobile. Documentation, tests and metadata describe one product.

Evidence: unit tests, i18n check, lint, typecheck, build, audit, functional browser tests, complete crawl, screenshots at 1440/1366/768/430/390. Five passes cover routes/controls; discovery/calculators; responsive/accessibility; domain/SEO/i18n/disclosure; visual/reviewer quality. Push to main, confirm the Vercel commit, then test public production. A build is not completion.

## Rules for Future Coding Agents

Official public origin: https://mairelectroai.com. The www hostname permanently redirects to the apex. Legacy Vercel URLs are historical deployment references, not public canonicals.

Primary navigation: Marketplace, Solutions, Tools, Learn, Experts, For Business (RO/EN). Experts is a professional-preparation resource, not a bookable or verified directory. Home uses the original public/hero.png artwork; lib/visual-system.ts maps other route families to original lightweight energy schematics. Do not restore one shared raster background to every route. Search includes equipment, categories, solutions and guides.

Release verification uses five passes: routes/controls; discovery and calculations; responsive/accessibility; domain/SEO/language/disclosures; visual and reviewer perspective. Confirm the production deployment SHA before claiming release success. Application readiness requires accurate publisher/contact information, working public flows and transparent editorial claims. Affiliate approval and optional outbound/form activation are separate later steps. Human authorship or review must never be implied without evidence.

Marketplace-first is authoritative. Do not restore diagnostics or Ukrainian outage/address flows as primary identity/navigation. Never invent commercial approval, inventory, prices, reviews, ratings or professionals. Do not redesign direction without owner instruction. Extend existing architecture; integrate commerce into Marketplace/Solutions/Learn. Every control must work. Keep Romania/EU orientation, honest limitations and user changes. Read AGENTS.md and installed Next.js docs.

## Affiliate application readiness

The owner requested independent informational positioning on 14 September 2026. Existing discovery routes and architecture remain; no equipment payments or active marketplace/dealer claims. See [readiness report](AFFILIATE_APPLICATION_READINESS.md) and [domain, publisher, contact and analytics setup](docs/custom-domain-and-publisher.md). Missing real publisher facts must not be invented.
