# Localization architecture

Romania/EU is the commercial focus. Romanian is the default request locale, English is selectable in the header, and the full pathname/query is preserved when switching. The existing mr-electro-locale cookie name is retained for preference compatibility. Legacy Ukrainian dictionary data remains, while public requests use Romanian or English.

Marketplace, solution/learning content, navigation, comparison, search, system finder, all public engineering calculators and public information pages use explicit Romanian/English copy. Manufacturer model names and units remain intact. Retained specialist AI/document interfaces may still contain English or Ukrainian supporting copy; do not claim their translation coverage is complete.

Typed LocalText records live alongside content data rather than being embedded in duplicated page components. Future languages should extend the supported-locale registry and content validation. Commercial paths stay stable; a separate path-based locale/SEO strategy can be scoped if independently indexable language variants are needed.

npm run i18n:check validates dictionary references and the Romanian/English inheritance mechanism. npm test validates bilingual category/guide/solution fields. Playwright checks default Romanian, language switching on a deep route, and mobile navigation. Do not interpret key completeness as proof that every legacy string has a translation.
