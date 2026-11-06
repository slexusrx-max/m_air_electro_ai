# EV supplier navigation — 6 November 2026

The owner reported that the AC home charging page had no seller link. Baseline production and main: `ac6d039a8cb51c37d6448831e31c34d25db6ef17`.

Cause: category discovery falls back to an equipment-class guide when no model is available. The guide used the product layout with an internal CTA back to the same category, creating a loop.

The EV guide now opens the EV-Mag home charging category directly, on both its catalog card and detail page. The label explicitly describes a retailer category, not an offer for the illustrative ChargePoint photograph. The link is ordinary and has no affiliate status, SKU, inferred specifications or Product markup. Existing Renogy and Waterdrop gates are unchanged. Other equipment guides lead to their buying guide instead of looping through the category. Supplier actions on model pages precede the methodology panel.

## Merchant evidence

- Category: https://ev-mag.ro/15-statii-de-incarcare-home — observed home charging models and links to individual products.
- Merchant: https://ev-mag.ro/ — General Security SRL, Cluj-Napoca, Romania, as stated by the retailer.
- Delivery policy: https://ev-mag.ro/content/1-livrare — describes courier delivery within Romania. No delivery fee, stock, timing, installation or compatibility promise is copied into the site.
- Checked through the retailer's public pages on 6 November 2026. No order, registration, supplier contact or affiliate application was made.

## Verification

- 210 unit tests passed using `node --import tsx --test` (the tsx CLI's IPC pipe is unavailable in this runtime).
- TypeScript, i18n (419 keys), production build and lint passed; lint retains one existing image warning in the Renogy catalog.
- Managed local preview cannot launch Next.js because it injects unsupported Vite flags. Browser verification will use the Vercel deployment instead.
