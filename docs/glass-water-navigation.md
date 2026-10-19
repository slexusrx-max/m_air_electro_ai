# Clear equipment cards and direct water navigation — 19 October 2026

Local follow-up to `fc4c468`, prepared as one release package. Publication remains on hold until explicit user confirmation; do not retry the denied push.

## Changes

- On Home and Marketplace, the four Renogy hero cards use translucent glass surfaces and centered photo viewports. White CSS backing and padding are removed; the Core Mini image viewport no longer stretches its empty white margins across the card.
- Equipment Categories use translucent glass cards, transparent preview wrappers and no image padding. Hover remains translucent. Reduced-transparency and unsupported-backdrop-filter fallbacks retain readable solid surfaces.
- All primary navigation destinations display in uppercase while retaining their existing RO/EN wording.
- A highlighted `PURE WATER FILTERS` destination points to the existing localized `/marketplace/water` route. It is directly accessible from the mobile menu without opening Marketplace categories.
- At desktop widths 1301–1550 px the primary navigation occupies its own row, keeping the larger labels and account controls separate. Wider desktops retain the compact single-row header; phones retain the existing expandable menu and homepage logo-first layout.

## Image fidelity and unresolved white backgrounds

All product/category image files are unchanged. No generated cutouts, tinting, opacity reduction, blending, masks or filters are applied to the photographs. The four genuine Renogy JPEGs still have baked-in white backgrounds; transparent containers cannot remove those pixels. CSS multiply blending would recolor product pixels and white panel details, so it is not used. Full photographic background removal remains unresolved following the parent's failed fidelity review of generated cutouts.

The exact approved brand artwork and sky-blue palette are preserved. Supplier links, catalog facts, disclosures and tracking configuration are unchanged.

## Validation and references

The focused browser test covers RO/EN at 320, 390, 768, 1366, 1440 and 1920 px: direct water-link keyboard navigation, header accessibility, localized routes, uppercase labels, no horizontal overflow, transparent card wrappers/hover, loaded genuine photographs, and screenshots of Home and Marketplace hero/categories. Existing menu and mobile logo-first tests are included. Build, profile-specific unit tests and rendered-background text contrast are also checked; final results are in the workspace handoff report.

Library reference access was attempted using the supported materialization workflow. It failed again on Windows because the required extended-attribute operation is unavailable. No alternate download or metadata bypass was used; visual validation uses local rendered interface screenshots.
