# Generator sizing search journey — 4 November 2026

## Scope and evidence

This package improves the existing `/calculators/generator` and `/en/calculators/generator` routes. It adds no translated doorway routes, merchant offers, product records or affiliate mappings. The existing calculator shell, localization, navigation, supplier gates and comparison system are reused.

The Phase 2 Search Console observation supplied by the owner was **24 impressions for `/en/calculators/generator`**, with visible queries including **generator sizing calculator** and **generator selection calculator**. That is historical opportunity evidence, not refreshed Phase 3 traffic. No increase in impressions, clicks, CTR, affiliate actions or revenue is claimed by this implementation.

## Exact metadata changes

The root layout appends ` | M Air Electro AI` to the page title. Values below are the exact route-level title strings before that unchanged suffix.

| Locale / URL | Previous title | New title |
| --- | --- | --- |
| RO `/calculators/generator` | `Calculator pentru generatoare` | `Calculator dimensionare generator: kW, kVA și pornire` |
| EN `/en/calculators/generator` | `Generator sizing calculator` | `Generator sizing calculator: kW, kVA & motor starts` |

Previous RO description: `Estimează puterea generatorului după sarcina de funcționare, rezerva de putere și pornirea motoarelor.`

New RO description: `Estimează necesarul în kW și kVA din consum, factor de putere și pornirea motoarelor. Vezi exemple de calcul, limite și pașii alegerii generatorului.`

Previous EN description: `Estimate generator sizing for running load, reserve, and motor-start allowance.`

New EN description: `Estimate generator kW and kVA needs from running load, power factor and motor starts. Follow worked examples, sizing limits and equipment-selection steps.`

Target queries are the observed English sizing/selection queries, plus closely matching Romanian intent: `calculator dimensionare generator`, `putere generator kW kVA`, and `generator pornire motor`. These Romanian phrases describe the actual page; no search-volume estimate is asserted. The titles state the specific technical task and the descriptions explain the calculation and worked examples, without rankings, prices or equipment guarantees. Existing localized canonicals and reciprocal language alternates remain controlled by `buildMetadata`.

Deployment date and final commit are to be filled in the coordinating Phase 3 production report after actual release. This document does not independently claim deployment.

## Technical audit and corrections

The original interface did not define whether motor kW meant mechanical output or electrical input. It also accepted a motor input greater than the stated total running load. The updated convention is explicit: total simultaneous electrical input includes the motor; a shaft-output rating must first be converted using efficiency. `calculateGenerator` now rejects `largestMotorKw > runningLoadKw`. Equality and zero-motor cases remain valid.

The old final card displayed a value rounded through the existing preferred-number series used by protection calculations, labelled as a recommended generator. That is not evidence of an available generator model. For a 2 kW, unity-PF, zero-motor load with 25% reserve, actual demand is **2.5 kVA**, while the old rounded card displayed **6 kVA**. The new interface displays the unrounded **preliminary apparent-power budget** and a separate **continuous real-power requirement in kW**. The previous rounded return field remains for API compatibility; it is not presented as a purchasable generator size.

The disclosed simplified model is:

- Running apparent power: `S = P / PF`.
- Reserved real power: `P_reserve = P × (1 + reservePercent / 100)`.
- Reserved apparent power: `S_reserve = S × (1 + reservePercent / 100)`.
- Additional motor-start planning budget: `A = motorElectricalKw × factor`.
- Screening apparent-power budget: `max(S_reserve, S + A)`.

The pre-existing factors are **4.5 / 2.2 / 1.2 kVA per motor-input kW** for direct-on-line / soft starter / VFD. The interface now states that these are illustrative additional allowances, **not universal starting-current ratios, measurements or manufacturer performance limits**. They may understate a real motor's requirement. No accuracy or starting guarantee is made. The model still requires a manufacturer transient study for a real selection.

Reserve is applied to running demand, not applied a second time to the start case. A 6 kW total load, PF 0.8, 20% reserve and 1 kW motor input gives **7.5 kVA running**, **9 kVA reserved**, **7.2 kW reserved**, **4.5 kVA additional DOL allowance**, and **12 kVA screening demand**. Both worked examples are visible server-rendered text.

## Content and selection journey

Original RO/EN explanations distinguish active kW, apparent kVA, load power factor, generator rated power factor, motor efficiency and starting current. They explain how actual current/voltage data, load sequencing, phase imbalance, harmonics, temperature, altitude and duty affect final sizing. The page includes the single-phase and balanced three-phase starting-kVA relations and links to the existing motor-current calculator and motor/VFD guide.

Generator-category links lead to generator planning. The interface no longer describes the generator result as an inverter/battery shopping recommendation. The absence of verified commercial generator models is disclosed from current catalog data. The separate alternative comparison is explicitly labelled **battery alternatives: PECRON E1000LFP / E1500LFP**; these are real existing same-category models, and are never called combustion generators. Their comparison does not validate the generator startup estimate.

The page also links to the existing generator-versus-battery guide, portable battery category and manufacturer/safety sources. It does not add supplier or affiliate URLs or follow tracking endpoints.

The existing transformer-sizing route remains linked in the motor/load technical section for transformer-fed loads. A coordinating crawl caught its loss of the only internal discovery link during the initial action-row rewrite; the link was restored rather than removing the route from crawl expectations.

## Sources and limits

Reviewed primary technical sources:

- [Generac: Basic Sizing for Mobile Generators](https://www.generac.com/globalassets/pdfs/industrial/whitepapers/basic-sizing-for-mobile-generators.pdf): load information, kW/kVA/PF, motor-start data and drive/soft-starter constraints.
- [Generac: Sizing Considerations for Commercial and Industrial Generators](https://www.generac.com/globalassets/pdfs/industrial/whitepapers/sizing-considerations-for-comm-and-ind-gens.pdf): engine/alternator transient behavior, sequencing and nonlinear loads.
- [CPSC: Portable Generator Hazards](https://www.cpsc.gov/s3fs-public/Portable-Generator-Safety-Alert-2017_5123.pdf): outdoor placement, carbon monoxide and backfeeding hazards. This US safety source is not represented as Romanian law; local requirements and the actual manual remain necessary.

These sources support the technical distinctions and safety explanation. They do **not** certify this site's heuristic factors or a particular product. The examples are original arithmetic illustrations, not equipment tests or human engineering approval.

## Verification prepared

Five new generator regression cases verify kW/kVA separation, PF behavior, the two examples, zero motor, and rejecting a motor larger than total input. The scoped run with the existing functional-readiness and regression suites passed **28 tests**. No unrelated calculator behavior was changed.

`tests/e2e/generator-seo.spec.ts` adds RO/EN coverage at **390, 430, 768, 1366 and 1440px** for metadata, initial server-rendered examples, calculations, input consistency, accessible content, no page overflow and the labelled battery comparison route. Browser/build/production acceptance belongs to the coordinating release; a prepared test is not a passing test or proof of publication.
