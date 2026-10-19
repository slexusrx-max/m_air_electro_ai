# Mobile homepage: approved artwork first — 19 October 2026

Owner request: show the full approved turquoise logo immediately when opening the homepage on a phone; keep the computer version unchanged.

The homepage opts into a small `PlatformShell` slot between navigation and the existing commercial disclosure. It reuses `BrandArtwork` and the exact approved PNG. The slot is hidden by default and appears only at widths up to 767 px. Its square size is bounded by available width, 360 px and the short viewport height; intrinsic image dimensions reserve space before load. There is no splash screen, timer or client-side reordering.

On the same mobile homepage only, the footer's large artwork link is hidden to avoid repeating the large logo. Footer text, links and disclosure remain. Other routes keep their existing artwork placement. Desktop layout rules are unchanged; the mobile slot occupies no desktop space.

The commercial disclosure remains visible after the artwork and before all product recommendations and supplier links. Header navigation, sky-blue palette, Liquid Glass, product facts, photos and supplier tracking are unchanged.

Verification: RO/EN phone viewports 320×568, 390×844, 430×932 and 390×568; full uncropped image within the first viewport, one visible full artwork, preserved disclosure order, working menu, Axe, overflow and CLS checks. Four complete desktop before/after screenshots at 1366/1440 px in RO/EN are compared byte for byte. Runtime evidence stays in ignored `.task-work/` and `test-results/`; deployment results are in the final release report.
