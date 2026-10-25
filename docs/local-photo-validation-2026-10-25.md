# Local photo validation follow-up — 25 October 2026

Baseline: eea5432a800aa9de32eaf98346dd4db89ccccb34 (PR28).

The offline validator previously accepted `/product-photos/.` and `/product-photos/..` because directories exist. Local references now reject dot/traversal segments, require a supported raster extension, resolve real paths inside the intended asset directory and require a nonempty regular file. Remote image and affiliate URL policy is unchanged; no image decoding or content rewriting was added.

Regression fixtures cover directory paths, a directory named `.png`, traversal, missing/empty files and unsupported extensions. All 54 catalog records, 41 models, 35 model photos and 72 parent photo decisions remain accepted.

The browser test also uses committed `tests/fixtures/waterdrop-link-associations.json` for exact ID/href/status assertions across all 16 models. Provenance of the three opaque codes remains the 13 October issued-link record; feed links reference catalog 18289. K19H must remain ordinary. No merchant URL is opened by this test.

No runtime UI, environment, database, eligibility, supplier mapping or photo file changes. Rollback is a normal Git revert. CI and release evidence are recorded in the PR.
