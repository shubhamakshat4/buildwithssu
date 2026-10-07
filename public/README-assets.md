# Brand assets — what to drop in here

The site renders fine without any of these files. It uses a generated placeholder crest, and company logos are already in `logos/` (fetched by `npm run logos`).

| File                                                          | Where                      | Then change                                                                           |
| ------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| `logo-ssu.png` (square, ≥ 256 px, transparent background)     | `/public/logo-ssu.png`     | `logoSrc` in `src/data/site.ts` → `"/logo-ssu.png"`                                   |
| Campus hero image (`campus-hero.jpg`, ~2400 × 1400, < 400 KB) | `/public/campus-hero.jpg`  | `heroImage` in `src/data/site.ts` → `"/campus-hero.jpg"` (shown faintly)              |
| A better logo for a company                                   | `/public/logos/<slug>.png` | add/replace the entry in `src/data/logos.generated.json` (see README › Company logos) |

Notes

- Only display logos you're comfortable using; review the logo wall once before wide distribution.
- Keep files small — every KB counts towards the Lighthouse score.
