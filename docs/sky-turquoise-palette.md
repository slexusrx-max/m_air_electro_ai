# Owner-requested sky-blue palette — 19 October 2026

The owner explicitly corrected the previous logo-only release: remove the muddy green site background and UI palette, using a lighter, pleasant sky-blue and soft turquoise treatment. This supersedes the previous instruction to preserve the lime palette.

Base: `6604fecc9408cb48e4808525152b9e3eca421ebe`.

## Changes

- Page canvas: `#F3FBFF`, soft sky glow `#D5F0FA`, pale glass `#E4F6FE`. Every route-family background now uses the light sky glow, including Solar and Learn, which previously used yellow-beige hues.
- Primary storefront controls: soft turquoise `#9FE4ED`, hover `#B9EEF4`, dark blue-slate text. General dark primary controls use `#16798B` with white text. Focus remains visible with blue outlines.
- Updated existing decorative literals in global CSS and Renogy/Waterdrop modules: typography, menu surfaces, filters, cards, outlines, shadows, footer, comparison tray and fallbacks. This replaces their paint at source instead of hiding old rules under one body override.
- Calculator and auxiliary decorative Tailwind accents use sky instead of lime. Semantic success, warning/error statuses and map legends retain their meanings.
- Website viewport/manifest theme color is `#F3FBFF`. No browser theme or user preferences were changed.
- Existing Liquid Glass blur, highlights, hover/active feedback and reduced-motion/transparency behavior remain. Layout, content, routes, forms, calculations, catalog facts and supplier tracking are unchanged.
- The approved brand artwork, real product assets and photographic rendering are unchanged. No image filters were added.

## Verification

`sky-palette.spec.ts` checks six representative routes in RO/EN at 390 and 1440 px: Home, Marketplace, backup calculator, a real Renogy product, Renogy and Water. It checks rendered decorative paint, accessibility, page errors, overflow and photographic filter/opacity. Existing navigation, beginner-selection, model-photo and exact-logo tests cover their respective flows. The logo test's former lime-button expectation now matches the explicitly approved turquoise correction.

Runtime screenshots and deployment verification are kept outside source control under `test-results/` and `.task-work/`; the final delivery report records the exact release and results.
