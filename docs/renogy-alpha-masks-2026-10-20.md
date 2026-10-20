# Approved Renogy alpha masks — 20 October 2026

Four supplied PNGs replace the existing photographs of Core Mini 100 Ah, Core Mini 200 Ah, N-Type 200 W and the 1000 W inverter. Only exterior alpha changes; dimensions, every original RGB pixel, labels, badge, inset detail and white panel back remain intact. Original JPEGs are retained. Product/category photo mappings use the new PNGs; a CSS rule removes white wrapper backing only for these four model IDs.

Source: Downloads/renogy-transparent-photos.zip. All four output SHA256 values exactly match the supplied manifest. Pillow verifies exact RGB equality against all four existing repository originals, including transparent pixels. Sharp's JPEG decoder differs at 17 pixels for the 200 Ah source; Pillow gives zero differences. The manifest panel original hash differs from the repository/current CDN JPEG hash (914d07a9...), but decoded pixels match exactly. The supplied manifest is retained unchanged alongside measured fidelity results.

No catalog records, supplier links, SEO configuration, route structure, approved logo or layout changed. The 19 Renogy selections and 18 production affiliate links remain.

Validation: production build, 109 unit tests and ESLint passed. Desktop/mobile RO/EN browser and production results are recorded in the task release report.
