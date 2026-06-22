# TimeShift

A learning project on how time breaks software: a catalogue of the time changes
that have broken, or will break, code, laid out as one walk through time from
**1700 to 2106**. Daylight-saving shifts, leap seconds, a country redrawing its
clocks overnight, a 32-bit counter ticking down to 2038, all in one place.

It is **482 source-checked incidents**, plain on the surface and cited underneath.
Each one is checked against an authoritative source: the time-zone records kept by
**IANA**, the leap seconds announced by **IERS**, and the standards written by the
**IETF**. Anything that could not be verified is not here.

The corpus was assembled with AI assistance and then verified against primary
sources (and independently re-checked). Mistakes are still possible, so corrections
are welcome: [open an issue](https://github.com/yasinmiran/timeshift/issues).

## Quality

- Lighthouse: accessibility, best practices, and SEO 100; performance ~93
- Zero axe accessibility violations
- Every source link verified live (`npm run audit:links`)
- Unit tests for the data layer, Playwright smoke tests, and axe scans

## How it is built

- **Astro** static site, **Tailwind v4** theme, near-zero client JavaScript
- One vertical trail grouped by year: each year shows a short summary and its
  events as category-marked nodes on a connector spine
- Each event reads inline; a "Read more" clones its detail from an inert
  `<template>`, so the whole corpus stays light in the live DOM
- Navigation is progressive enhancement: a left **era rail** (scroll-spy) plus a
  floating **dock** with a category filter, a highlights toggle, and a decade jump
- Fonts (Fraunces, Inter) are self-hosted via Fontsource

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # serve the built site
npm run test       # vitest unit tests (data layer)
npm run test:e2e   # playwright smoke + axe accessibility
npm run audit:links   # verify every source link still resolves
```

## The corpus

`data/events.json` is the single source of truth; `data/year-summaries.json` holds
the one-line summary shown above each year. Each event:

| field | meaning |
| --- | --- |
| `id` | stable kebab-case id |
| `date` | ISO date, range, or year (the parser handles the mixed formats) |
| `category` | one of: standardization, leap-second, dst-policy, offset-change, legal-governance, vendor-bug, epoch-rollover |
| `body` | who decided it (IANA, IERS, IETF, a government, a vendor) |
| `whatChanged`, `technicalImpact` | the verified facts |
| `tzRelease` | the IANA tz release that encoded it, when applicable |
| `sourceUrl`, `sourceTitle` | the authoritative source |
| `headline`, `blurb`, `story` | the plain-language editorial layer |
| `tier` | `core` (highlights) or `deep` (everything) |
| `sidenotes`, `academicRefs` | optional further reading and cited papers |
| `reviewTag` | verification status (e.g. verified, a bit ambiguous) |
| `gotcha` | evergreen, dateless gotchas held off the timeline for a future edition |

## Adding or maintaining events

Append a record to `data/events.json` with every required field and a working,
authoritative `sourceUrl`, then run `npm run audit:links` to confirm all sources
still resolve. No event enters the corpus without a verified source.

## Project layout

```
data/events.json           the verified corpus
data/year-summaries.json   one-line summary per year
src/lib/                    data layer (categories, dates, eras, events)
src/components/             Hero, Year, EventRow, EventDetail, EraBand, EraRail, Dock, Footer
src/scripts/timeline.ts    read-more, filters, era-rail scroll-spy
src/pages/                 index.astro, 404.astro
scripts/audit-links.py     source-link checker
tests/                     smoke + a11y (playwright)
```
