# TimeShift

A walk through the time changes that matter to anyone who builds with time, from
**1700 to 2106**: the birth of standard time and the prime meridian, every leap
second, daylight-saving switches, offset and date-line changes, and the epoch
rollovers still ahead.

## Sources

Every entry cites a primary source and is built on the records of the bodies that
actually govern time:

- **IANA** time-zone database (tzdata): release notes, commentary, and the zone,
  `backward`, and `backzone` files.
- **IERS** leap-second bulletins.
- **IETF** standards: RFC 6557 (tz database maintenance) and RFC 8536 (TZif).

Government decrees, standards documents, and reputable post-mortems cover the rest.
Anything that could not be verified against a source is not in the corpus.

## The corpus

`data/events.json` is the single source of truth: **480 dated entries** on the
timeline (plus a couple of evergreen, dateless gotchas held back for later). Each
carries its date, what changed, the responsible body, the technical impact, the
IANA tz release that encoded it where applicable, and a cited source. Run
`npm run audit:links` to check that every source still resolves.

It was assembled with AI assistance, verified against primary sources, then
independently cross-checked by separate models (Opus and Sonnet to build, DeepSeek
V4 and GPT-5.5 high to re-check). It is not infallible.

## Corrections

Found an error? [Open an issue](https://github.com/yasinmiran/timeshift/issues).
