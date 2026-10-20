# Current navigation section — 20 October 2026

The water navigation link had an unconditional blue fill, outlined border and heavier text. That permanent promotional treatment looked selected even when a different link correctly had aria-current=page. A second mobile-only CSS rule also filled the Romanian water URL unconditionally. The previous route check also matched only exact section landing URLs, and mobile section headings had no current state.

All seven primary sections now share one current style derived from usePathname. Locale prefixes, query strings and trailing slashes are normalized. The most specific linked destination owns nested routes and shortcuts: the solution finder and backup calculator belong to Tools, FAQ belongs to Learn, Renogy to Marketplace, and water categories, Waterdrop and water model/planning pages to Pure water filters. Water's nested Marketplace placement never selects both sections. Pages outside these sections have no primary selection.

Desktop links and mobile section headings/direct links expose the same single aria-current state. Native browser history and client-side routing update it through usePathname. The existing glass paint, hover/focus behavior and menu expansion remain. No href, catalog, image, affiliate configuration, SEO or Search Console changes.

Validation: 111 unit tests; production build; ESLint; direct-load, click, back and forward tests for all seven sections in RO/EN at 390/1440 px; representative nested routes, mobile menu and header accessibility checks. Final results and production identifiers are recorded in the task release report.
