# Model image correction - 16 October 2026

Scope: product imagery and removal of one reference class from commercial listings. No specifications, supplier links, affiliate settings, category artwork or overall design changed. Baseline main: afc45b4.

## Inventory

`npx tsx scripts/audit-product-images.ts` inventories all 29 records (16 named models), image paths and SHA-256 hashes into ignored `.task-work/product-image-audit.json`.

Four shared file paths were found. Most importantly, both Core Mini batteries and the 100 Ah reference class used `/equipment/lifepo4-battery-studio.png` (SHA-256 `3e7ccfe37d2467fe00aed7dd3316f8d01f2aca3881868e3537d127b1d090103e`). Six different PECRON/BLUETTI stations shared the portable-power illustration. No distinct image files had identical SHA-256 hashes. Water and other categories also reuse inline illustrations, separately identified in the inventory.

These are category illustrations, not verified model photographs. Named model cards/details now show the localized photo-pending-verification message instead of category artwork. Category tiles and reference illustrations remain unchanged.

## Official Renogy sources inspected

- [Core Mini 100 Ah](https://eu.renogy.com/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery): rendered selection was `2 Pack w/Battery Monitor`, SKU `RBT12100LFP-Mx2-RBM-EU`. The page also lists a `1 Pack` option; its exact SKU/image binding was not established.
- [Core Mini 200 Ah](https://eu.renogy.com/products/core-mini-12-8v-200ah-lifepo4-battery-w-low-temperature-protection): rendered selection was `1 Pack with 500A Battery Monito`, SKU `RBT12200LFP-M-RBM-EU`. The page also lists a `1 Pack` option; its exact SKU/image binding was not established.

The official pages expose different image paths (`1-1__01018.1745803999.1280.1280.jpg` and `1-1__48154.1745723843.1280.1280.jpg`). This alone does not verify their exact variant or authorize reproduction. Variant JSON could not be retrieved (direct DNS failure; web retrieval unavailable). Existing launch documentation records no obtained manufacturer asset permission. No supplier images were copied, no appearance inferred from capacity, and no shared image approved by assumption. The other models' photographs were not independently verified in this targeted pass; their placeholders do not claim verification.

`battery-lfp-100` remains in the source catalog and its reference URL still works, but it is excluded from listing results and product cards. Related-model lists filter it before slicing; search counts use the same listing policy.

Release evidence and final deployment SHA are recorded in the associated pull request. Official model photos remain pending exact-variant verification and documented usage permission.
