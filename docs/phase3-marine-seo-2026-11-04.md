# Marine discovery metadata — 4 November 2026

Authenticated Search Console was refreshed on 4 November. In the selected three-month view, the actual performance coverage remains **16 October–2 November 2026**. `/en/marketplace/marine` has **9 impressions, 0 clicks and average position 25.7**. This places an existing commercial category in the requested position 8–30 opportunity range. The linked marine planning guide has 8 impressions and average position 19.5. These are page-level observations, not proof that any particular query generated those impressions or that this release improved CTR.

The existing category receives more specific metadata and buyer guidance. Route, navigation label/H1, product facts, images, catalog memberships, affiliate mapping, original artwork and supplier gates are unchanged. It still links to the existing battery calculator, marine planning guide and related solution. No duplicate landing route is created.

Browser inspection confirmed that the marine category currently contains one equipment-class guide and no reviewed purchasable marine model. A new, explicitly labelled component section connects it to existing LiFePO4, DC-DC charger and flexible-panel categories. It states that component links establish neither marine certification nor a complete approved installation. Models were not assigned to the marine category without evidence. An initial browser-test assumption that Core Mini 100Ah appears directly in this category was corrected to verify the actual cross-category journey; the model assertion remains in the real battery category.

The layout's unchanged ` | M Air Electro AI` suffix follows the title strings below:

| URL | Previous title | New title |
| --- | --- | --- |
| `/en/marketplace/marine` | `Marine electrical` | `Marine battery systems: capacity, charging and solar` |
| `/marketplace/marine` | `Sisteme electrice navale` | `Baterii la bord: capacitate, încărcare și panouri solare` |

Previous EN description: `Plan house batteries, charging and distribution for a vessel environment.`

New EN description: `Plan a boat's house battery, charging and solar around daily Wh. Compare documented equipment, use the capacity calculator and check vessel-specific installation limits.`

Previous RO description: `Planifică bateriile de servicii, încărcarea și distribuția pentru mediul naval.`

New RO description: `Planifică bateria de servicii, încărcarea și panourile solare după consumul în Wh. Compară echipamente, calculează capacitatea și verifică limitele instalației navale.`

Intended search intent: boat house-battery sizing, marine charging/solar planning and Romanian battery-at-anchor selection. These are editorial intent descriptions, not verified query-volume estimates. The new copy describes the existing page's technical and product-discovery value. It does not claim marine certification, compatible installation, price, inventory, shipment or a guaranteed outcome.

The visible explanation keeps starting and house batteries separate, uses Wh for energy budgets, requires the same nominal voltage for Ah comparison and checks discharge/charging requirements before system selection. Existing vessel-specific installation cautions remain. The established battery guide/calculator owns the sizing assumptions; no new technical formula or product capability was invented here.

`tests/e2e/phase3-marine-discovery.spec.ts` prepares RO/EN coverage at 390, 430, 768, 1366 and 1440px: metadata/canonical, real model visibility, vessel-compatibility caveat, no page overflow, localized marine-to-battery calculator path and the preserved exact 100Ah/200Ah comparison with supplier anchors. Supplier destinations are not followed. Actual browser acceptance, deployment date and commit are recorded in the coordinating Phase 3 report after release.

Evaluate titles after fresh Search Console observations over a stated window; same-day unchanged data cannot establish an SEO uplift. Rollback is the isolated marine editorial entry, rather than a replacement of the category system.
