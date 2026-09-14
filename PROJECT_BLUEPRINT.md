# M Air Electro AI — Authoritative Product Blueprint

Version 3 · Official marketplace-first direction · 14 September 2026

This specification supersedes earlier positioning across production, source, metadata, documentation and coding-agent instructions.

## Product Vision

M Air Electro AI is a independent product discovery, comparison and sizing platform. Help customers understand a system before choosing equipment.

## Official Positioning

**Need → Calculate → Understand → Discover → Compare → Choose → Visit supplier.** Marketplace is the primary commercial layer. Calculators, Find My Solution, technical guides, AI and future experts support the decision. The platform is not a direct merchant, warehouse, general handyman service, outage-monitoring product or brochure.

## Primary Market

Romania is the launch market; the EU is the commercial region. Romanian is primary, English secondary. Region selection must not silently send users to another region's supplier. EU catalog classification does not guarantee Romanian delivery.

## Commercial Model

Independent affiliate-commerce discovery. The merchant controls price, stock, payment, orders, shipping, warranty and returns. No fabricated inventory, reviews, ratings, prices or partnership status. There is no equipment checkout or fulfilment operation.

## Information Architecture

Primary navigation: Equipment, Solutions, Tools, Learn, For Business. Planned professional help remains in the footer. Search and RO/EN switching stay accessible. Company and Legal are in a deep footer. Desktop mega menus group real destinations; mobile uses nested expandable groups. Every visible control works.

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

Renogy EU is the first intended affiliate supplier, **not an approved partner or dealer**. Ordinary URLs live in editorial records. The existing provider abstraction resolves supplier CTAs. Activation requires explicit approval and a real Impact-issued HTTPS mapping from exact supplier URLs to approved HTTPS links. Invalid/missing configuration returns the ordinary URL. Update disclosures at actual activation. Site-verification metadata alone is not affiliate approval.

## Supplier Architecture

Real models carry official sources and review dates. Classes describe technical roles, not invented purchasable products. No merchant copy or images are reproduced. Original category artwork includes studio-style generated solar panel imagery and schematic illustrations for other families. Category imagery is illustrative, not a photograph of the named model. New suppliers need evidence, regional URL, disclosure and delivery checks. Never label a generic collection URL as a specific model.

## Search

GET `/search` renders results on the server. Normalize case, diacritics, separators and compact/spaced units; search names, brands, categories, known specs, tags and uses. Intersect filters over known fields. Display count, query, reset and useful no-result guidance. Missing data stays unknown. Bound inputs and safely handle repeated query parameters. Internal search/filtered URLs are not indexable landing pages.

## Compare

Compare 2–4 unique valid IDs using a shareable URL and optional local card selection. Only documented fields appear; unknown values are explicit. Distinguish models/classes and show uses/limitations. Cross-family comparisons do not establish compatibility.

## SEO Strategy

Unique title, description, canonical and H1 for commercial pages. A real route inventory drives the sitemap. Use factual BreadcrumbList, Article and Organization/WebSite data. Product markup is restricted to actual models and has no invented offers/reviews/ratings. Auth/account/dashboard/search/filtered URLs are excluded from indexing. Obsolete routes redirect; retained specialized tools stay outside the commercial sitemap.

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

State independent discovery, preliminary calculations, external seller responsibility and current affiliate status consistently. Privacy describes cookies, local storage, optional providers and external navigation. Do not invent operator identity or a functioning mailbox. Use the configured contact channel or existing public repository issues. Operator details, retention specifics and legal review remain owner dependencies before unconditional legal/application readiness.

## Development Roadmap

1. Current phase: deep discovery, 22 categories, eight solutions, 18 guides, 18 records, search, compare, tools and official repository alignment. The catalog retains existing production models alongside the new records.
2. After approval: actual Impact activation, disclosure update and approved attribution testing.
3. Curate more verified EU models/suppliers and promote justified facets to categories.
4. Real expert onboarding, optional saved projects and separately scoped database/feed/AI work.

## Definition of Done

A visitor can explore, calculate requirements, understand categories, review equipment, compare facts, read related guides, reach external suppliers and understand disclosure comfortably on desktop/mobile. Documentation, tests and metadata describe one product.

Evidence: unit tests, i18n check, lint, typecheck, build, audit, functional browser tests, complete crawl, screenshots at 1440/1366/768/390 and 430 mobile navigation. Three passes cover functionality; content/navigation/mobile; public production/application quality. Push to main, confirm the Vercel commit, then test public production. A build is not completion.

## Rules for Future Coding Agents

Marketplace-first is authoritative. Do not restore diagnostics or Ukrainian outage/address flows as primary identity/navigation. Never invent commercial approval, inventory, prices, reviews, ratings or professionals. Do not redesign direction without owner instruction. Extend existing architecture; integrate commerce into Marketplace/Solutions/Learn. Every control must work. Keep Romania/EU orientation, honest limitations and user changes. Read AGENTS.md and installed Next.js docs.

## Affiliate application readiness

The owner requested independent informational positioning on 14 September 2026. Existing discovery routes and architecture remain; no equipment payments or active marketplace/dealer claims. See [readiness report](AFFILIATE_APPLICATION_READINESS.md) and [domain, publisher, contact and analytics setup](docs/custom-domain-and-publisher.md). Missing real publisher facts must not be invented.
