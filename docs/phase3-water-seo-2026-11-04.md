# Phase 3 water selection journey — 4 November 2026

Baseline main: `00f7fe8`, read before edits. This package improves the existing Romanian and English water-selection guide and its links to Water discovery. It creates no additional indexable route, supplier agreement, product record, tracking link or contaminant-performance claim. Publication SHA/date and production acceptance are recorded by the coordinating release report after deployment.

## Evidence and opportunity

The owner-provided verified Search Console period is **16 October–2 November 2026**. The English guide had **14 impressions**; the coordinating session also observed average position **19.5** for the guide. These are baseline observations, not evidence that this change improved CTR or rank. They justify working on an existing visible page before creating unrelated content. Exact target queries below are editorial hypotheses; no query-level volume, ranking or click count is invented.

Inspection found three concrete relevance defects: the water guide inherited electrical procurement/cabling paragraphs; its water selector was called a calculator; and CDC/NSF links in the technical-reading list were incorrectly labelled Victron. Those exact-guide defects are corrected without rewriting the other guides.

## Metadata experiment

The existing metadata builder uses the guide title and `title + ". " + intro` as its description. The platform's normal title suffix, canonicals and RO/EN alternates remain unchanged.

| URL | Previous title input | New title input |
| --- | --- | --- |
| `/en/learn/choosing-water-system` | Choosing a water system | How to choose a water filter: home RO vs portable |
| `/learn/choosing-water-system` | Cum alegi un sistem de apă | Cum alegi filtrul de apă: osmoză inversă sau portabil |

Previous English intro: “Start with the source and the job, then verify the exact model. This guide is a selection checklist, not a declaration that your water is safe to drink.” New English intro: “Compare home RO and portable filters by source, documented contaminants, daily capacity and installation.”

Previous Romanian intro: “Începe cu sursa și utilizarea, apoi verifică modelul exact. Acest ghid este o listă de criterii de alegere, nu o confirmare că apa ta este potabilă.” New Romanian intro: “Compară osmoza inversă și filtrele portabile după sursă, dovezi, consum zilnic și instalare.”

Safety limitations remain in the actual guide and FAQ; the shorter introduction describes the selection benefit naturally. Candidate queries: **how to choose a water filter**, **home reverse osmosis vs portable filter**, **water filter for an apartment**, **cum aleg un filtru de apă**, **osmoză inversă pentru apartament** and **filtru de apă portabil**. The guide makes no unsupported “best” ranking, price, delivery or safe-water promise.

## Content and customer path

Six original RO/EN sections now distinguish water source, installation format, daily volume/refilling, exact contaminant evidence, emergency limitations and upkeep/regional supply. A water-specific brief replaces the electrical procurement block and supplies four category paths: reverse osmosis, countertop, portable planning and emergency/off-grid planning. It also links directly to the existing water finder and under-sink category.

The illustrative capacity check uses **12 L/day ÷ 4 L usable treated water per batch = 3 batches/day**. Both inputs are explicitly hypothetical, not a product specification or personal consumption recommendation. The explanation distinguishes usable treated volume from feed-tank volume, asks the reader to check production/refill time and drain water, and does not turn a nominal GPD rating into promised real output.

Two existing same-installation comparison paths now follow the guide: **Waterdrop G3P600/G3P800** for under-sink examples and **Waterdrop C1H/A2** for countertop examples. All four are real existing catalog records, with their source-backed facts and existing photos unchanged. No model is recommended for a measured contaminant without its own evidence. Portable/emergency categories remain clearly labelled planning paths where no verified models are currently listed.

The Water hub's supplier explanation now states the actual Germany-only programme scope and Romanian block instead of suggesting activation alone enables Waterdrop offers. The finder links back to the daily-capacity/installation brief. No supplier gate is changed; all four guide cards and both comparison tables retain their blocked Waterdrop Romanian notices. Ordinary official documentation remains separate from an affiliate purchase offer.

## Primary sources checked

- [CDC — About Choosing Home Water Filters](https://www.cdc.gov/drinking-water/prevention/about-choosing-home-water-filters.html): source testing, limits of appearance/taste, intended use and upkeep.
- [NSF — Contaminant Reduction Claims](https://www.nsf.org/consumer-resources/articles/contaminant-reduction-claims-guide): substance-specific claim checking.
- [NSF — Certified Drinking Water Treatment Units](https://info.nsf.org/Certified/DWTU/): exact manufacturer/model and claim lookup; linking the registry does not assert certification of our listed examples.
- [CDC — How to Make Water Safe in an Emergency](https://www.cdc.gov/water-emergency/about/): emergency-source limitations. The initially attempted longer CDC path returned 404 and was not added; the actual current endpoint is used.

These sources support selection criteria, not independent product tests, local health clearance or blanket contaminant-removal claims. Emergency instructions from relevant authorities take precedence over a shopping category. No treatment recipe, medical recommendation or inferred model certification is introduced.

## Verification and preservation

Focused unit tests validate category reachability, both real same-format comparison groups, no new model contaminant claims and truthful source labels. Six targeted water tests passed; targeted ESLint passed. The ten new browser scenarios cover RO/EN at 390, 430, 768, 1366 and 1440 px: localized metadata, actual guide-to-comparison navigation, regional notices, original crystal-hero reference, finder/guide return links and document overflow. Test collection is not execution; coordinating release results must establish browser/production acceptance separately.

The turquoise `/water/crystal-hero-v2.png` artwork, all catalog IDs/photos/specifications, 227/138 Renogy feed mapping, Waterdrop regional restrictions, original RO/EN route hierarchy, consent and authentication are preserved. No global CSS or protected owner report/feature files are edited. React review: the new explanatory component stays server-rendered; the existing finder gains only an ordinary localized link, with no new effects, state, remote requests or analytics events.

After deployment, compare the same guide's Search Console impressions/clicks/position over an explicit later date range and inspect query relevance. Do not attribute any change to this title alone without sufficient observations. Analytics receipt, supplier departures, Impact actions, approved commission and payout remain distinct measurements outside this content package.
