# Filter Reset synchronization — 25 October 2026

Production de31aba reproduced a stale form after Reset: the URL and result set returned to the full catalog, but the uncontrolled `kind` select still held `product` (browser assertion failed after 10 seconds). A client-side Link navigation reused the existing form DOM; changing `defaultValue` did not reset its current field values.

The form is now keyed by the applied, sanitized query. Reset, active-filter navigation and browser history remount only the filter form when that query changes, aligning native field values with server-filtered results. Normal field editing and native GET submission are unchanged; no client state store, network service or affiliate behavior was added.

Regression coverage: RO/EN at 390 and 1165x747; populated search, kind, format and sort; Reset; re-Apply; Waterdrop brand Reset; Back/Forward and another Apply. The test proves both displayed field values and actual resulting products.

Validation:125/125 unit tests, lint, TypeScript and production build passed. Eight local browser tests passed: four new Reset/history/re-Apply cases and four existing fresh facet-selection cases. The before-fix live test failed specifically because kind retained product after URL reset. No real contact submissions or affiliate traversal.
