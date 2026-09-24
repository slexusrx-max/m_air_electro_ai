# Renogy EU source audit — 24 September 2026

**All seven published Renogy model records checked against their official EU pages. All seven distinct supplier URLs returned HTTP 200 and remained on the exact EU product URL.** No broken supplier URLs, US redirects, malformed URLs or duplicated origins were found.

This is an AI-assisted source check, separate from human technical review, hands-on testing, order fulfilment and affiliate approval. Each model now has an explicit source-check date in `lib/marketplace/catalog-data.ts`; adding a model requires its own date and source URL. No merchant descriptions or images were copied into the catalog. Prices, stock, shipping promises, ratings, reviews, discounts, warranty promises and SKU-specific Romanian availability remain unpublished.

## Model and claim checks

All rows were checked on **2026-09-24**. Published category assignments match the equipment type on the linked source. Source attribution is displayed on each product page and factual comparisons.

| Published record / category | Source-supported fields | Identity and variant observations | Official EU source |
| --- | --- | --- | --- |
| Core Mini 100 Ah / LiFePO4 batteries | 12.8 V nominal; 100 Ah; 100 A maximum discharge; LiFePO4; 1280 Wh explicitly calculated as V × Ah | Page includes single batteries and bundles; the fetched default SKU was `RBT12100LFP-Mx2-RBM-EU`. Catalog values describe one battery, not the default two-pack/monitor bundle. Charging temperature on the source is 0–50°C, consistent with the catalog warning. | [Core Mini 100 Ah](https://eu.renogy.com/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery) |
| Core Mini 200 Ah / LiFePO4 batteries | 12 V class; 200 Ah; 2560 Wh; 200 A continuous discharge; LiFePO4 | Source mixes a 12 V class label with a 12.8 V heading; retain the explicit voltage-class wording. Default SKU `RBT12200LFP-M-RBM-EU` includes a monitor. Catalog values are per battery. Its compatibility note now uses its own 200 A limit instead of a generic 100 A warning. | [Core Mini 200 Ah](https://eu.renogy.com/products/core-mini-12-8v-200ah-lifepo4-battery-w-low-temperature-protection) |
| N-Type 16BB 200 W / rigid solar panels | 200 W at STC; Voc 37.44 V; operating voltage 31.03 V; Isc 6.85 A; 10.6 kg; rigid; supplier 24 V class | Default SKU `RSP200DC-EU`, 200 W / one panel. Page also offers 175 W and 100 W variants; values were checked against the 200 W specification block. No cell-efficiency or warranty claims were imported. | [N-Type 16BB 200 W](https://eu.renogy.com/products/renogy-16bb-n-type-200-watt-24v-solar-panel) |
| 1000 W pure sine inverter / inverters | 12 V DC input class; 1000 W continuous; pure sine waveform | SKU `R-INVT-PUH1-101235-EU`. The page specifies an EU socket. The URL retains “UPS function”; the catalog correctly avoids claiming uninterrupted supply, a built-in charger or medical suitability. | [1000 W inverter](https://eu.renogy.com/products/1000w-12v-pure-sine-wave-inverter-with-ups-function) |
| 50 A DC-DC + MPPT / DC-DC chargers | 12 V class; 50 A class; MPPT; alternator and solar inputs | Default SKU `RBC50D1S-BT-EU`, while the URL and some images retain DCC50S. The displayed catalog title correctly omits the legacy model code. Exact source sharing and PV limits must follow the selected revision manual. | [50 A DC-DC + MPPT](https://eu.renogy.com/products/dcc50s-12v-50a-dc-dc-on-board-battery-charger-with-mppt-new-version) |
| Rover Li 40 A / solar charge controllers | MPPT; 40 A rated charging output | Default SKU `RNG-CTRL-RVR40-EU`. Source supports 12/24 V systems and states automatic voltage detection for non-lithium batteries; catalog does not infer universal automatic lithium setup. Optional Bluetooth bundle is not represented as an included feature. | [Rover Li 40 A](https://eu.renogy.com/products/rover-li-40-amp-mppt-solar-charge-controller) |
| 20 A DC-DC / DC-DC chargers | 12 V system; 20 A charging class; DC-DC conversion | Default bundle SKU `RBC20D1U-BT2-EU`; charger-only is another option. Catalog does not claim Bluetooth is included, solar MPPT or a 230 V mains input. | [20 A DC-DC](https://eu.renogy.com/products/12v-20a-dc-to-dc-battery-charger) |

## Supplier-link audit

`scripts/audit-suppliers.ts` audits the union of all published catalog product, supplier and source URLs. These resolve to **7 unique EU product URLs**. Unused Amazon/eBay provider adapters do not create published merchant links and are outside this published-link count.

The script records malformed URLs, non-EU/wrong-page redirects and HTTP failures separately from merchant automated-access blocks (401/403/429) and network verification limitations. A 200 response after redirecting to a US store or the merchant homepage is no longer accepted as a valid model destination. Invalid URLs no longer abort the remaining audit.

The live, read-only run uses trusted system CAs and network permission:

```powershell
$env:NODE_USE_SYSTEM_CA='1'
npx.cmd tsx scripts/audit-suppliers.ts
```

Evidence: ignored `.task-work/supplier-audit.json`, including each original URL, final URL, status, check time and outcome. Current result: **7 reachable, 0 invalid URLs, 0 destination issues, 0 HTTP issues, 0 merchant access blocks, 0 network-unverified URLs.** Initial sandbox-restricted fetches were superseded by this network-authorized run and are not merchant failures.

Targeted verification: `npx tsx --test tests/catalog.test.ts tests/supplier-audit.test.ts` — **12 passed**. The new audit regression tests distinguish broken links and regional redirects from merchant access restrictions. Catalog coverage also requires a useful record in every primary family; the AC EV charging class adds no supplier URL. The root production-readiness pass owns full-suite and deployed-site verification.

## Commercial boundaries

Renogy approval is **not confirmed** and Impact tracking remains **inactive**. Ordinary supplier URLs are preserved. There is no dealer, reseller, partnership or inventory claim. Source-page selection advice is preliminary: pack selection, exact hardware revision, installation requirements and supplier terms must be confirmed before an order. These normal purchase checks do not themselves prevent applying to the affiliate program.
