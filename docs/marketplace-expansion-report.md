# Historical marketplace expansion — 14 September 2026

> Archived architecture and deployment evidence. The official public origin is now https://mairelectroai.com. Old Vercel URLs and missing owner/contact findings below describe the earlier release; use [current readiness](../AFFILIATE_APPLICATION_READINESS.md), [README](../README.md) and [PROJECT_BLUEPRINT](../PROJECT_BLUEPRINT.md) for current facts.

Review date: 14 September 2026 (Romania). Production: https://m-air-electro-ai.vercel.app

## 1. Previous architecture

The published baseline was a compact Romanian affiliate discovery site with a flat category structure, 11 model/class records, a system finder, backup and electrical calculators, legal pages and optional account/AI services. Historical repository documents still described a broader diagnostics/professional platform. Nine upstream production commits were integrated during this task, preserving API authentication/quota checks, safe redirects, onboarding/database security, calculator validation, existing product models and Impact verification. Git history was merged, not rewritten.

## 2. Official architecture

M Air Electro AI is a marketplace-first energy and electrical equipment discovery, calculation, comparison and recommendation platform for Romania and the EU. The journey is Need → Calculate → Understand → Discover → Compare → Choose → Visit supplier. Marketplace, Solutions and Learn share structured bilingual data and reusable server-rendered templates. AI and a future expert network support this journey.

## 3. Navigation tree

- Marketplace → ten families → relevant subcategories → model/class detail → comparison and supplier.
- Solutions → eight application-specific system guides.
- Tools → system finder, backup, battery, solar, cable sizing, voltage drop, generator, motor current, breaker, fuse and transformer.
- Learn → getting started, buying guides, technical guides and nine subject hubs → 18 articles; calculators and FAQ are linked.
- Experts → truthful professional-help information and contact, without fictional profiles.
- For Business → planning and procurement guidance, with clear limits on currently available services.
- Header utilities → search, RO/EN switching and existing account access where applicable.
- Footer → Marketplace, Solutions, Tools, Learn, Company, Legal.

Desktop uses grouped mega menus; mobile uses nested expandable sections. Keyboard Escape closes the current menu and restores focus. The skip link targets focusable main content.

## 4. Route architecture

103 public sitemap routes; search and compare are additional working, non-indexed utilities. Dynamic templates implement category, product, solution and learning routes. Company/legal pages, FAQ and solar sizing are integrated. Legacy category/product/map/professional/pricing/knowledge routes receive logical redirects. Old product URLs preserve their original model identity. The root loading boundary was restricted to protected routes so unknown public pages return actual HTTP 404 rather than a streamed 200.

Complete current sitemap inventory:

- [/](https://m-air-electro-ai.vercel.app/)
- [/marketplace](https://m-air-electro-ai.vercel.app/marketplace)
- [/marketplace/find-my-solution](https://m-air-electro-ai.vercel.app/marketplace/find-my-solution)
- [/solutions](https://m-air-electro-ai.vercel.app/solutions)
- [/learn](https://m-air-electro-ai.vercel.app/learn)
- [/faq](https://m-air-electro-ai.vercel.app/faq)
- [/about](https://m-air-electro-ai.vercel.app/about)
- [/business](https://m-air-electro-ai.vercel.app/business)
- [/experts](https://m-air-electro-ai.vercel.app/experts)
- [/contact](https://m-air-electro-ai.vercel.app/contact)
- [/privacy](https://m-air-electro-ai.vercel.app/privacy)
- [/terms](https://m-air-electro-ai.vercel.app/terms)
- [/affiliate-disclosure](https://m-air-electro-ai.vercel.app/affiliate-disclosure)
- [/methodology](https://m-air-electro-ai.vercel.app/methodology)
- [/calculators](https://m-air-electro-ai.vercel.app/calculators)
- [/backup-calculator](https://m-air-electro-ai.vercel.app/backup-calculator)
- [/marketplace/solar](https://m-air-electro-ai.vercel.app/marketplace/solar)
- [/marketplace/batteries](https://m-air-electro-ai.vercel.app/marketplace/batteries)
- [/marketplace/inverters](https://m-air-electro-ai.vercel.app/marketplace/inverters)
- [/marketplace/chargers](https://m-air-electro-ai.vercel.app/marketplace/chargers)
- [/marketplace/backup-power](https://m-air-electro-ai.vercel.app/marketplace/backup-power)
- [/marketplace/generators](https://m-air-electro-ai.vercel.app/marketplace/generators)
- [/marketplace/ev-charging](https://m-air-electro-ai.vercel.app/marketplace/ev-charging)
- [/marketplace/electrical-components](https://m-air-electro-ai.vercel.app/marketplace/electrical-components)
- [/marketplace/industrial](https://m-air-electro-ai.vercel.app/marketplace/industrial)
- [/marketplace/marine](https://m-air-electro-ai.vercel.app/marketplace/marine)
- [/marketplace/solar/panels](https://m-air-electro-ai.vercel.app/marketplace/solar/panels)
- [/marketplace/solar/panels/rigid](https://m-air-electro-ai.vercel.app/marketplace/solar/panels/rigid)
- [/marketplace/solar/panels/portable](https://m-air-electro-ai.vercel.app/marketplace/solar/panels/portable)
- [/marketplace/solar/panels/flexible](https://m-air-electro-ai.vercel.app/marketplace/solar/panels/flexible)
- [/marketplace/solar/kits](https://m-air-electro-ai.vercel.app/marketplace/solar/kits)
- [/marketplace/solar/controllers](https://m-air-electro-ai.vercel.app/marketplace/solar/controllers)
- [/marketplace/batteries/lifepo4](https://m-air-electro-ai.vercel.app/marketplace/batteries/lifepo4)
- [/marketplace/batteries/12v](https://m-air-electro-ai.vercel.app/marketplace/batteries/12v)
- [/marketplace/batteries/100ah](https://m-air-electro-ai.vercel.app/marketplace/batteries/100ah)
- [/marketplace/inverters/pure-sine](https://m-air-electro-ai.vercel.app/marketplace/inverters/pure-sine)
- [/marketplace/inverters/2000w](https://m-air-electro-ai.vercel.app/marketplace/inverters/2000w)
- [/marketplace/chargers/dc-dc](https://m-air-electro-ai.vercel.app/marketplace/chargers/dc-dc)
- [/solutions/apartment-backup](https://m-air-electro-ai.vercel.app/solutions/apartment-backup)
- [/solutions/home-backup](https://m-air-electro-ai.vercel.app/solutions/home-backup)
- [/solutions/solar-battery](https://m-air-electro-ai.vercel.app/solutions/solar-battery)
- [/solutions/rv-caravan](https://m-air-electro-ai.vercel.app/solutions/rv-caravan)
- [/solutions/marine](https://m-air-electro-ai.vercel.app/solutions/marine)
- [/solutions/off-grid-cabin](https://m-air-electro-ai.vercel.app/solutions/off-grid-cabin)
- [/solutions/workshop](https://m-air-electro-ai.vercel.app/solutions/workshop)
- [/solutions/business-backup](https://m-air-electro-ai.vercel.app/solutions/business-backup)
- [/learn/how-to-size-backup-battery](https://m-air-electro-ai.vercel.app/learn/how-to-size-backup-battery)
- [/learn/how-to-choose-inverter](https://m-air-electro-ai.vercel.app/learn/how-to-choose-inverter)
- [/learn/lifepo4-vs-lead-acid](https://m-air-electro-ai.vercel.app/learn/lifepo4-vs-lead-acid)
- [/learn/12v-vs-24v-vs-48v](https://m-air-electro-ai.vercel.app/learn/12v-vs-24v-vs-48v)
- [/learn/how-many-kwh-do-i-need](https://m-air-electro-ai.vercel.app/learn/how-many-kwh-do-i-need)
- [/learn/solar-panel-sizing](https://m-air-electro-ai.vercel.app/learn/solar-panel-sizing)
- [/learn/mppt-vs-pwm](https://m-air-electro-ai.vercel.app/learn/mppt-vs-pwm)
- [/learn/inverter-surge-power](https://m-air-electro-ai.vercel.app/learn/inverter-surge-power)
- [/learn/battery-runtime-calculation](https://m-air-electro-ai.vercel.app/learn/battery-runtime-calculation)
- [/learn/apartment-backup-system](https://m-air-electro-ai.vercel.app/learn/apartment-backup-system)
- [/learn/home-backup-system](https://m-air-electro-ai.vercel.app/learn/home-backup-system)
- [/learn/rv-solar-basics](https://m-air-electro-ai.vercel.app/learn/rv-solar-basics)
- [/learn/marine-battery-system](https://m-air-electro-ai.vercel.app/learn/marine-battery-system)
- [/learn/dc-dc-charger-guide](https://m-air-electro-ai.vercel.app/learn/dc-dc-charger-guide)
- [/learn/generator-vs-battery-backup](https://m-air-electro-ai.vercel.app/learn/generator-vs-battery-backup)
- [/learn/ev-charging-basics](https://m-air-electro-ai.vercel.app/learn/ev-charging-basics)
- [/learn/cable-and-protection-basics](https://m-air-electro-ai.vercel.app/learn/cable-and-protection-basics)
- [/learn/industrial-motor-planning](https://m-air-electro-ai.vercel.app/learn/industrial-motor-planning)
- [/learn/getting-started](https://m-air-electro-ai.vercel.app/learn/getting-started)
- [/learn/buying-guides](https://m-air-electro-ai.vercel.app/learn/buying-guides)
- [/learn/technical-guides](https://m-air-electro-ai.vercel.app/learn/technical-guides)
- [/learn/backup-power](https://m-air-electro-ai.vercel.app/learn/backup-power)
- [/learn/batteries](https://m-air-electro-ai.vercel.app/learn/batteries)
- [/learn/solar](https://m-air-electro-ai.vercel.app/learn/solar)
- [/learn/inverters](https://m-air-electro-ai.vercel.app/learn/inverters)
- [/learn/generators](https://m-air-electro-ai.vercel.app/learn/generators)
- [/learn/ev-charging](https://m-air-electro-ai.vercel.app/learn/ev-charging)
- [/learn/electrical-basics](https://m-air-electro-ai.vercel.app/learn/electrical-basics)
- [/learn/marine](https://m-air-electro-ai.vercel.app/learn/marine)
- [/learn/industrial](https://m-air-electro-ai.vercel.app/learn/industrial)
- [/marketplace/products/renogy-core-mini-100ah](https://m-air-electro-ai.vercel.app/marketplace/products/renogy-core-mini-100ah)
- [/marketplace/products/renogy-core-mini-200ah](https://m-air-electro-ai.vercel.app/marketplace/products/renogy-core-mini-200ah)
- [/marketplace/products/renogy-n-type-200w](https://m-air-electro-ai.vercel.app/marketplace/products/renogy-n-type-200w)
- [/marketplace/products/renogy-pure-sine-1000w](https://m-air-electro-ai.vercel.app/marketplace/products/renogy-pure-sine-1000w)
- [/marketplace/products/renogy-dcc50s-mppt](https://m-air-electro-ai.vercel.app/marketplace/products/renogy-dcc50s-mppt)
- [/marketplace/products/lfp-battery-12v-100ah-class](https://m-air-electro-ai.vercel.app/marketplace/products/lfp-battery-12v-100ah-class)
- [/marketplace/products/pure-sine-inverter-2000w](https://m-air-electro-ai.vercel.app/marketplace/products/pure-sine-inverter-2000w)
- [/marketplace/products/portable-solar-kit-400w](https://m-air-electro-ai.vercel.app/marketplace/products/portable-solar-kit-400w)
- [/marketplace/products/mppt-controller-class](https://m-air-electro-ai.vercel.app/marketplace/products/mppt-controller-class)
- [/marketplace/products/portable-panel-200w-class](https://m-air-electro-ai.vercel.app/marketplace/products/portable-panel-200w-class)
- [/marketplace/products/flexible-panel-200w-class](https://m-air-electro-ai.vercel.app/marketplace/products/flexible-panel-200w-class)
- [/marketplace/products/essential-load-backup](https://m-air-electro-ai.vercel.app/marketplace/products/essential-load-backup)
- [/marketplace/products/marine-dc-power-system](https://m-air-electro-ai.vercel.app/marketplace/products/marine-dc-power-system)
- [/marketplace/products/dc-wiring-and-protection](https://m-air-electro-ai.vercel.app/marketplace/products/dc-wiring-and-protection)
- [/marketplace/products/generator-battery-system](https://m-air-electro-ai.vercel.app/marketplace/products/generator-battery-system)
- [/marketplace/products/mppt-charge-controller](https://m-air-electro-ai.vercel.app/marketplace/products/mppt-charge-controller)
- [/marketplace/products/dc-dc-charger-20a](https://m-air-electro-ai.vercel.app/marketplace/products/dc-dc-charger-20a)
- [/marketplace/products/industrial-backup-planning](https://m-air-electro-ai.vercel.app/marketplace/products/industrial-backup-planning)
- [/calculators/battery](https://m-air-electro-ai.vercel.app/calculators/battery)
- [/calculators/solar](https://m-air-electro-ai.vercel.app/calculators/solar)
- [/calculators/cable-sizing](https://m-air-electro-ai.vercel.app/calculators/cable-sizing)
- [/calculators/voltage-drop](https://m-air-electro-ai.vercel.app/calculators/voltage-drop)
- [/calculators/generator](https://m-air-electro-ai.vercel.app/calculators/generator)
- [/calculators/motor-current](https://m-air-electro-ai.vercel.app/calculators/motor-current)
- [/calculators/breaker-selection](https://m-air-electro-ai.vercel.app/calculators/breaker-selection)
- [/calculators/fuse-selection](https://m-air-electro-ai.vercel.app/calculators/fuse-selection)
- [/calculators/transformer](https://m-air-electro-ai.vercel.app/calculators/transformer)

## 5. Marketplace taxonomy

22 category/subcategory pages across ten families. The modest increase over the approximate target gives batteries, solar and inverters meaningful depth. Facets and procurement topics cover further dimensions without producing empty doorway pages. EV equipment is currently a requirements/learning path without a verified purchasable model; this absence is explicit.

- Solar equipment — /marketplace/solar
- Batteries — /marketplace/batteries
- Inverters — /marketplace/inverters
- Battery charging — /marketplace/chargers
- Backup power — /marketplace/backup-power
- Generators — /marketplace/generators
- EV charging — /marketplace/ev-charging
- Electrical components — /marketplace/electrical-components
- Industrial electrical — /marketplace/industrial
- Marine electrical — /marketplace/marine
- Solar panels — /marketplace/solar/panels
- Rigid solar panels — /marketplace/solar/panels/rigid
- Portable solar panels — /marketplace/solar/panels/portable
- Flexible solar panels — /marketplace/solar/panels/flexible
- Solar kits — /marketplace/solar/kits
- Solar charge controllers — /marketplace/solar/controllers
- LiFePO4 batteries — /marketplace/batteries/lifepo4
- 12 V batteries — /marketplace/batteries/12v
- 100 Ah batteries — /marketplace/batteries/100ah
- Pure sine inverters — /marketplace/inverters/pure-sine
- 2000 W inverters — /marketplace/inverters/2000w
- DC-DC chargers — /marketplace/chargers/dc-dc

Every template includes breadcrumbs, a category introduction, available subcategories/records, applicable known-value filters, buying advice, technical considerations, calculator/solution/guide links, FAQ and supplier disclosure.

## 6. Search

GET /search?q= searches independent English/Romanian titles and summaries, brands, categories, known specifications, units, applications and tags. Case, accents and spaced/compact units are normalized. Filters intersect over documented values; unknown specifications never imply a feature. Query values are bounded and repeated parameters normalized. Result count, current query, reset and useful no-result paths are visible. Filtered category URLs are noindex and canonicalize to the category.

## 7. Compare

Cards support browser-local selection of up to four records. /compare uses shareable IDs or four selection controls, rejects invalid/duplicate IDs and presents a 2–4 column comparison. Only known specifications, uses, limitations and review dates are displayed; missing values remain explicitly undocumented. Class records are distinguished from real models. Comparing different categories never asserts system compatibility.

## 8. Solutions

- Apartment backup — /solutions/apartment-backup
- Home backup — /solutions/home-backup
- Solar + battery — /solutions/solar-battery
- RV / caravan — /solutions/rv-caravan
- Marine house power — /solutions/marine
- Off-grid cabin — /solutions/off-grid-cabin
- Workshop — /solutions/workshop
- Business continuity — /solutions/business-backup

Each includes users, typical loads, architecture, an illustrative energy/power case, battery and inverter considerations, solar/generator context, safety/design limits and links into the finder, catalog and guides. Example values can prefill the finder; existing equipment is not blindly deducted from the result.

## 9. Learn

18 original bilingual guides with technical explanations, worked cases, selection limits, sources and links to calculators, categories, products and solutions. Twelve topic/reading-level hubs aggregate them. A shared procurement section supplements the topic-specific explanation; each guide also has its own distinct worked example.

- How to size a backup battery — /learn/how-to-size-backup-battery
- How to choose an inverter — /learn/how-to-choose-inverter
- LiFePO4 versus lead-acid — /learn/lifepo4-vs-lead-acid
- 12 V, 24 V or 48 V? — /learn/12v-vs-24v-vs-48v
- How many kWh do I need? — /learn/how-many-kwh-do-i-need
- Solar panel sizing — /learn/solar-panel-sizing
- MPPT versus PWM controllers — /learn/mppt-vs-pwm
- Understanding inverter surge power — /learn/inverter-surge-power
- Calculate battery runtime — /learn/battery-runtime-calculation
- Plan an apartment backup system — /learn/apartment-backup-system
- Plan a home backup system — /learn/home-backup-system
- RV solar basics — /learn/rv-solar-basics
- Marine battery system planning — /learn/marine-battery-system
- How to choose a DC-DC charger — /learn/dc-dc-charger-guide
- Generator or battery backup? — /learn/generator-vs-battery-backup
- Home EV charging basics — /learn/ev-charging-basics
- Cable and protection basics — /learn/cable-and-protection-basics
- Industrial motor and VFD planning — /learn/industrial-motor-planning

Hubs: getting-started, buying-guides, technical-guides, backup-power, batteries, solar, inverters, generators, ev-charging, electrical-basics, marine, industrial.

Structural inspiration came from Renogy's product/scenario/learning hierarchy. Text and technical illustrations are independently authored. Manufacturer copy and product images were not copied. Model facts link to exact official Renogy EU product pages; technical sources include Victron's Wiring Unlimited, European Commission PVGIS and CPSC generator/CO guidance.

## 10. Catalog and calculators

18 records: 7 sourced Renogy EU models and 11 explicitly labelled equipment classes. The three additional retained records preserve previously published product/industrial content rather than removing it to meet an approximate count. Price and original-price fields remain null; no offers, inventory, ratings or reviews are fabricated.

- Renogy Core Mini 12.8 V 100 Ah — documented model
- Renogy Core Mini 12 V 200 Ah — documented model
- Renogy 16BB N-Type 200 W rigid panel — documented model
- Renogy 12 V 1000 W pure sine inverter — documented model
- Renogy DCC50S 12 V 50 A DC-DC + MPPT — documented model
- 12 V 100 Ah LiFePO4 battery class — equipment class
- 2000 W pure sine inverter class — equipment class
- 400 W solar kit class — equipment class
- MPPT controller class — equipment class
- 200 W portable panel class — equipment class
- 200 W flexible panel class — equipment class
- Essential-load backup system — equipment class
- Marine DC distribution class — equipment class
- DC wiring and protection class — equipment class
- Generator + battery system class — equipment class
- Renogy Rover Li MPPT / 40 A — documented model
- Renogy 12 V / 20 A DC–DC charger — documented model
- Industrial load continuity guide — equipment class

The tested planning engine remains authoritative for load energy, discharge/efficiency assumptions, continuous margin and surge. Backup appliance edits, quantity, per-appliance hours, custom loads and global duration are preserved. Invalid input suppresses actionable recommendations. Existing advanced electrical range/overflow protections remain unchanged. Solar sizing uses daily Wh / equivalent sun hours / declared yield factor. The finder leads into equipment classes, catalog candidates, comparison and a relevant solution.

## 11. Affiliate architecture

Renogy EU is the first intended affiliate supplier. Approval is not confirmed. Public supplier links remain ordinary HTTPS links. Existing Impact verification metadata is preserved and does not prove approval. The existing provider/tracking architecture requires both RENOGY_AFFILIATE_APPROVED=true and AFFILIATE_TRACKING_ENABLED=true, plus an exact supplier-URL mapping in RENOGY_IMPACT_LINKS_JSON. Invalid, missing, non-HTTPS or credential-bearing configured links fall back safely. Activated links are labelled and use sponsored relationship metadata; disclosure follows activation. No invented referral IDs are used.

## 12. Three verification passes

1. Functional architecture: npm test passed 23 tests, including retained API, database permission, redirect, quota and calculator-limit regressions plus taxonomy, search, compare and content integrity. npm run i18n:check passed (419 keys). Lint, typecheck and production build passed. npm audit reported zero vulnerabilities using the system certificate authority.
2. Content/navigation/mobile: all 16 Playwright scenarios passed locally. Tests cover RO/EN deep-route preservation, keyboard/skip navigation, 390/430/768 mobile menus, filter/compare/finder/backup/solar/battery flows, every category/product/solution/article, sitemap, legacy redirects, real 404 and runtime errors. Screenshots cover 1440, 1366, 768 and 390 widths. Readability, checkbox layout and menu focus defects were corrected. A homepage-started crawl visited 105 routes with zero failures and zero orphans.
3. Public production: all 16 Playwright scenarios passed against https://m-air-electro-ai.vercel.app in 1.9 minutes. The complete category/model/solution/article route sweep, RO/EN, mobile navigation, calculations, search, comparison, supplier disclosure, canonical, sitemap, legacy 308 responses, real 404 and four-width visual/console checks passed. Production screenshots at laptop/tablet widths were also inspected directly.

## 13. Deployment

Implementation/alignment commit: cd6c9a9f57c1cc6450a63ced7916022e7490e484, “Make marketplace-first architecture official project-wide”. Pushed to main without force. Vercel deployment: https://vercel.com/m-air-electro-ai/m-air-electro-ai/FSZPVvrPqRe8w1szWeJfLNLbn3Zo. GitHub's Vercel status reported success, “Deployment has completed”, for this exact commit before public browser verification. This report is a documentation-only follow-up; the tested application code is unchanged.

## 14. Production crawl

The homepage-started production crawl completed at 2026-09-13T21:40:36.908Z (14 September in Romania): 105 visited routes, zero HTTP/link failures and zero orphan routes. The separate browser suite verified legacy redirects that intentionally do not appear in current navigation. Raw crawl details and browser screenshots are retained locally in ignored test-results; results above refer to the public production origin, not localhost.

## 15. Remaining external dependencies

- Renogy/Impact approval and provider-issued approved links; optional product-feed and asset licences.
- Supplier-owned price, stock, exact variant, Romania delivery, warranty and return confirmation.
- Owner-confirmed legal/operator details, verified private contact channel and review of provider retention/legal disclosures. The existing public GitHub contact path works and warns that submissions are public; an unverified mailbox is not advertised.
- Optional Supabase/AI services require their actual environment configuration and deployed migrations. Database tests validate the migrations in an isolated database; no live database mutation was performed for this expansion.
- Real expert onboarding/verification and any future supplier commercial arrangements. Booking, fulfilment, bulk pricing and paid engineering services are not represented as active.
- Some retained advanced/support interfaces still contain English or legacy Ukrainian copy. The new commercial architecture is Romanian/English; complete translation of every historical internal tool is not claimed.

## 16. Honest Impact / Renogy readiness

The public site provides an independently authored catalog, useful calculator-to-equipment journeys, clear sources, legal/contact paths, mobile navigation and transparent affiliate status. It is technically suitable for an application review. Approval, dealership status or legal certification is not claimed. Operator/contact/legal verification and the affiliate decision remain external responsibilities. Commercial launch is discovery/referral, not direct sales or installation contracting.

## Repository-wide consistency audit

| File / area | Old positioning | New positioning | Status |
| --- | --- | --- | --- |
| README.md | Mixed historical platform/MVP framing | Current marketplace-first product, stack, modules, commands, affiliate state | Updated |
| PROJECT_BLUEPRINT.md | Broad diagnostics/professional-platform roadmap | Authoritative Romania/EU marketplace, Solutions, Learn, tools, data, security and roadmap | Rewritten |
| AGENTS.md / CLAUDE.md | Framework/general agent guidance | Explicit marketplace authority and 12 preservation/verification rules | Updated; Next rules preserved |
| package.json / GitHub description | Electrical-professionals positioning | Energy marketplace, sizing, comparison and engineering tools | Updated |
| Site configuration, root/OG metadata, manifest | General or narrow backup/AI descriptions | Consistent official brand and commercial purpose | Reviewed and aligned |
| Header, navigation and footer | Flat, compact discovery paths | Six grouped primary areas, nested mobile menu, deep footer | Implemented and tested |
| Homepage / marketplace | Compact affiliate front page | Category/solution/catalog/tool/learning discovery entry | Expanded |
| Product/category schema | Flat 11-record catalog | 22 category routes, 18 records, evidence/facets/limitations, original illustrations | Expanded; original models retained |
| Search / comparison | Limited discovery paths | Functional GET search, intersecting filters and shareable 2–4 record comparison | Implemented and tested |
| About / business / experts | Mixed planned-service descriptions | Independent discovery; truthful available and future services | Updated |
| Affiliate / privacy / terms / contact | Initial application copy | Current storage/data/referral model, dynamic tracking disclosure, verified-contact gate | Aligned; owner legal review remains external |
| Dictionaries / localization docs | Mixed historical language/positioning | RO default, EN switching, bilingual commercial content, legacy limits documented | Updated and tested |
| Sitemap / robots / legacy routes | Flat or obsolete public surfaces | Real route inventory, noindex utilities/private pages, HTTP 308 legacy redirects and true 404 | Tested |
| Environment / deployment docs | Old address and referral-variable assumptions | Approved-link map, both activation flags, public deployment checks; shipping removed | Updated |
| Tests / browser crawler | Earlier IA assertions | New navigation, catalog, solution, learning and compare coverage plus retained security/calculation regressions | Passed locally; production recorded above |

No historical commits, user-supplied PDFs or unrelated local assets were removed. The existing green-energy wallpaper and Impact verification were retained. Temporary test reports and screenshots are ignored build evidence, not application dependencies.
