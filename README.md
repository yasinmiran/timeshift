# TimeShift

I keep getting bitten by time. Daylight saving shifts, leap seconds, a country
redrawing its clocks overnight, a 32-bit counter quietly ticking down to 2038. So I
started keeping a record of every time change that has broken, or will break, software,
and laid them out as one trail you can walk from 1879 to 2038.

It is **112 incidents**, plain on the surface and source-checked underneath. I checked
each one against an authoritative source: the time-zone records kept by **IANA**, the
leap seconds announced by **IERS**, and the standards written by the **IETF**. If I
could not verify it, it is not here.

## Quality

- Lighthouse 100 across performance, accessibility, best practices, and SEO
- Every one of the 112 source links verified live (`npm run audit:links`)
- Unit tests for the data layer, Playwright smoke tests, and axe accessibility scans

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # serve the built site
npm run test       # vitest unit tests (data layer)
npm run test:e2e   # playwright smoke + axe accessibility
python3 scripts/audit-links.py   # verify every source link still resolves
```

## How it is built

- **Astro** static site, **Tailwind v4** theme, near-zero client JavaScript
- The expand/collapse is native `<details>` (one open at a time)
- Fonts (Fraunces, Inter) are self-hosted via Fontsource
- The trail is generated from `data/events.json` by a small typed data layer in `src/lib/`

## The corpus

`data/events.json` is the single source of truth. Each event:

| field | meaning |
| --- | --- |
| `id` | stable kebab-case id |
| `date` | ISO date, range, or year (parser handles the mixed formats) |
| `category` | one of: standardization, leap-second, dst-policy, offset-change, legal-governance, vendor-bug, epoch-rollover |
| `body` | who decided it (IANA, IERS, IETF, a government, a vendor) |
| `whatChanged`, `technicalImpact` | the verified facts |
| `tzRelease` | the IANA tz release that encoded it, when applicable |
| `sourceUrl`, `sourceTitle` | the authoritative source |
| `headline`, `blurb`, `story` | plain-language editorial layer for the surface |
| `validation` | link-check and fact-check metadata for each source |

## Adding or maintaining events

Add an event by appending a record to `data/events.json` with every required field and a
working, authoritative `sourceUrl`. Run `npm run audit:links` to confirm all sources still
resolve before publishing. No event should enter the corpus without a verified source.

## Project layout

```
data/events.json          the verified corpus
src/lib/                   data layer (categories, date parsing, loadStops)
src/components/            Hero, Trail, Stop, Footer
src/pages/                 index.astro, 404.astro
scripts/                   audit-links.py
tests/                     smoke + a11y (playwright)
```
