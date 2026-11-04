# Commercial funnel measurement — 4 November 2026

The existing optional Plausible integration is the collector. This change does not create a first-party collection server, activate an analytics subscription, confirm a live reporting property, or establish traffic/revenue figures. Production measurement requires `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` matching the public hostname and a working Plausible project with the required custom events/properties configured.

## Event contract

| Event | Trigger | Interpretation |
| --- | --- | --- |
| `product_view` | Exact product or equipment-class detail is displayed | A consented detail view, not a distinct customer or impression of every catalog card |
| `product_compare_add` / `product_compare_remove` | Successful comparison selection change | One event per affected public product ID; clearing removes each selected ID |
| `comparison_view` | A populated comparison is displayed | Comparison usage; not a product selection change |
| `calculator_start` | First edited live calculator input | Tool interaction, including an initially invalid input |
| `calculator_complete` | Valid edited live result settles for 1.2 seconds | Calculation use; repeated valid revisions may produce more events |
| `finder_start` | First finder interaction | The beginning of a guided selection attempt |
| `finder_complete` | Valid finder result is requested | A completed requirement estimate, not a purchase or verified compatible system |
| `supplier_outbound` | A catalog supplier link is activated | All catalog supplier departures, ordinary and affiliated |
| `affiliate_click` | The activated supplier link has server-resolved active tracking status | Subset of `supplier_outbound`; not proof of an Impact click or qualifying order |

`affiliate_click` and `supplier_outbound` describe overlapping populations. Never sum them. The listener does not fetch or follow a supplier URL in order to measure it, and middle-button departures are counted separately from non-navigation auxiliary clicks. Automated browsers are excluded.

Before this release, supplier departures used `supplier_outbound_click`, additions used `comparison_add`, and finder completion used `finder_result` together with `calculator_complete`. New UI integrations emit the canonical names above once per corresponding action. The older names remain supported by the analytics library for compatibility, but are not emitted alongside the new names. Segment historical reports at the deployed release timestamp; do not count finder results twice as calculator completions.

## Privacy and limitations

All events require unexpired explicit consent, a matching configured public hostname, no Do Not Track/Global Privacy Control and no browser automation. Existing private-route exclusions apply. Public product IDs, supplier/category IDs where available, language and public source path are allowlisted. Comparison controls have product ID/language context; supplier/category fields are omitted when not supplied. Queries, fragments, destination/tracking URLs, referrers, calculation values, budgets, account IDs, emails and form contents are not sent by this instrumentation. Marketing campaign query parameters are intentionally not copied. Plausible receives the request IP/user agent and supplies the receipt timestamp.

Mounted product views can record a view after consent is granted; repeated consent notifications do not record a duplicate view. There is no retroactive collection of earlier interactions. Consent withdrawal stops subsequent requests. Analytics blockers, missing consent, privacy settings and provider configuration can reduce observed events.

Outbound CTR uses relevant consented product-page sessions as its denominator, not all site visits or the count of raw product-view events. Impact and on-site events have different collection/attribution rules and may include different test exclusions, reporting delays and time zones. Commission, reversals and payouts must come from verified Impact finance records. No purchase conversion or payment is inferred from this funnel.
