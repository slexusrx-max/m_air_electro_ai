# Clearer homepage glass — 19 October 2026

This is the owner's second request, implemented after the mobile-logo release `7307045901190cdf5e13e8b75ebd553e07f7c7ca` was published and verified. It explicitly permits changing desktop panel paint; the desktop freeze applied to the preceding mobile-only step.

Scope is the homepage. The hero now uses 46–16% background alpha with 2 px blur instead of nearly opaque fills and 20 px blur. Its inner showcase uses 20–10% alpha and 1 px blur. The disclosure strip uses 44–28% alpha with 3 px blur, and the header 44–24% alpha with 6 px blur. Glass edges, shadows and controls remain. The existing decorative background artwork's opacity rises from .28 to .38 on the homepage only.

No parent opacity is applied: text, controls and real product photographs stay at opacity 1, with no photographic filters. White product-photo surfaces remain neutral. Body text and disclosure retain dark blue-slate contrast. Reduced-transparency and unsupported-blur modes keep a solid readable surface.

There are no layout, content, route, catalog, affiliate or image-asset changes. The mobile full-logo-first result is preserved. Other pages retain their current glass treatment.

Verification uses the mobile-brand, palette and navigation suites in RO/EN; visual inspection of desktop and mobile; rendered-paint evidence; an artwork-visible/hidden comparison; and a conservative contrast measurement against the actual background pixels beneath the hero/disclosure text, with foreground glyphs temporarily hidden only during the measurement. Local minimum measured body/disclosure/caption contrast was 5.98:1 and heading contrast 9.03:1. This supplements the Axe checks; it is not a field performance claim.

Runtime artifacts remain in ignored `.task-work/` and `test-results/`. The final delivery report records production verification and exact deployment.
