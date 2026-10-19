# Typography, product preview scale and logo visibility — 19 October 2026

Based on production commit `36873deac88fd3d91ceec6d3ff38aabde08c6953`.

## Changes

- Primary desktop navigation: 14.08 px (previously 12.48 px at 1366–1440 px). Menu links, Marketplace descriptions, specifications, filters and result counts are slightly larger.
- Dark blue body text and a restrained dark blue/cyan gradient on large headings. Forced-colors mode restores plain system text.
- Homepage model image containers: 170 px desktop, 130 px mobile, 108 px at widths up to 360 px; no added image padding or CSS white backing. Core Mini 100 uses a 1.55 CSS display scale to trim empty margins without cropping the battery. Other supplier compositions, including MINI badge, front/rear panel views and inverter socket detail, remain complete.
- Existing homepage background artwork opacity increases from .38 to .48. Its file, hue, mobile logo-first placement and glass panels are preserved.
- Caption text was darkened after rendered-background testing found an initial contrast ratio below 4.5.

No catalog facts, affiliate configuration, supplier URLs, product image files or logo image files changed.

## Explicit remaining image work

The four JPEGs contain baked-in white backgrounds. CSS removes additional white UI surfaces but does **not** remove those raster backgrounds. Parent is handling authorized image editing and fidelity review separately; no generated or edited product image is included in this release.

Exact official sources from the verified provenance record:

- `public/product-photos/renogy-mini-100.jpg`: https://cdn.shopify.com/s/files/1/0758/6519/4753/files/1-1__01018.1745803999.1280.1280.jpg?v=1766131565
- `public/product-photos/renogy-mini-200.jpg`: https://cdn.shopify.com/s/files/1/0758/6519/4753/files/1-1__48154.1745723843.1280.1280.jpg?v=1773818387
- `public/product-photos/renogy-panel-200.jpg`: https://cdn.shopify.com/s/files/1/0758/6519/4753/files/1-1__47984.1744772049.1280.1280.jpg?v=1764818486
- `public/product-photos/renogy-inverter-1000.jpg`: https://cdn.shopify.com/s/files/1/0758/6519/4753/files/R-INVT-PUH1-101235.jpg?v=1766122478

A bounded check of the official product galleries found no verified transparent replacement of the same composition. The examined non-JPEG alternatives also had no alpha channel. Do not replace a single battery with the gallery's battery bundle image.

## Validation

- Production build passes.
- 23 existing browser tests pass: RO/EN mobile logo-first, keyboard navigation, overflow and sky-palette accessibility checks.
- Twelve additional RO/EN viewport checks at 320, 390, 430, 768, 1366 and 1440 px confirm navigation/action separation, unchanged photo filters, original-image loading, transparent wrappers and target image sizes.
- Rendered-background contrast passes on RO/EN mobile and desktop, using the lightest gradient stop for heading measurements.
- Production commit/deployment verification, public tests and affiliate preservation evidence are recorded in the workspace release report after deployment.

The untracked Renogy EU expansion candidates document remains on hold and is not part of this release.
