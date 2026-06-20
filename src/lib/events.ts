import raw from '../../data/events.json'
import yearSummaries from '../../data/year-summaries.json'
import { CATEGORIES, type CategoryId } from './categories'
import { parseEventDate, isFuture } from './dates'
import { eraForYear, type Era } from './eras'

export type Stop = {
  id: string
  year: number
  dateLabel: string
  isFuture: boolean
  category: CategoryId
  categoryLabel: string
  node: string
  headline: string
  blurb: string
  story: string
  facts: { when: string; who: string; tzRelease?: string }
  devNote: string
  source: { url: string; title: string }
  sidenotes: { label: string; url: string }[]
  academicRefs: { authors: string; title: string; venue: string; year: string; url: string }[]
  tier: 'core' | 'deep'
  decade: number
  era: string
}

type RawEvent = {
  id: string
  title: string
  date: string
  category: string
  body: string
  whatChanged: string
  technicalImpact: string
  tzRelease?: string
  sourceUrl: string
  sourceTitle?: string
  headline?: string
  blurb?: string
  story?: string
  tier?: string
  gotcha?: boolean
  sidenotes?: { label: string; url: string }[]
  academicRefs?: { authors: string; title: string; venue: string; year: string; doi?: string; url?: string; keyFinding?: string }[]
}

function firstSentence(s: string): string {
  const m = s.match(/^.*?[.!?](\s|$)/)
  return (m ? m[0] : s).trim()
}

// Build the sorted display model. Editorial fields (headline/blurb/story) are
// filled by the enrichment pass; until then we fall back to the verified facts
// so the site renders end to end at every stage.
export function loadStops(now: number = Date.now()): Stop[] {
  const events = raw as unknown as RawEvent[]
  return events
    .map((e) => ({ e, d: parseEventDate(e.date) }))
    // guard: a chronological timeline cannot place an unparseable date, so drop
    // any such event rather than emit a NaN year that corrupts sorting/grouping.
    // gotcha entries are evergreen (dateless) gotchas held back for a future
    // edition; they live in the dock, not on the timeline.
    .filter(({ e, d }) => Number.isFinite(d.year) && !e.gotcha)
    .map(({ e, d }) => {
      const cat = CATEGORIES[e.category as CategoryId]
      const stop: Stop = {
        id: e.id,
        year: d.year,
        dateLabel: d.label,
        isFuture: isFuture(d.startMs, now),
        category: e.category as CategoryId,
        categoryLabel: cat?.label ?? 'A moment',
        node: cat?.node ?? '#888888',
        headline: e.headline?.trim() || e.title,
        blurb: e.blurb?.trim() || firstSentence(e.whatChanged),
        story: e.story?.trim() || e.whatChanged,
        facts: { when: d.label, who: e.body, tzRelease: e.tzRelease || undefined },
        devNote: e.technicalImpact,
        source: { url: e.sourceUrl, title: e.sourceTitle?.trim() || 'Read the source' },
        sidenotes: e.sidenotes ?? [],
        academicRefs: (e.academicRefs ?? []).map((r) => ({
          authors: r.authors,
          title: r.title,
          venue: r.venue,
          year: r.year,
          url: r.doi ? `https://doi.org/${r.doi}` : r.url ?? '',
        })),
        tier: e.tier === 'deep' ? 'deep' : 'core',
        decade: Math.floor(d.year / 10) * 10,
        era: eraForYear(d.year).slug,
      }
      return { stop, startMs: d.startMs }
    })
    .sort((a, b) => a.startMs - b.startMs || a.stop.id.localeCompare(b.stop.id))
    .map((x) => x.stop)
}

// A year of the timeline: the year's events plus a one-line editorial summary.
// The summaries are authored in data/year-summaries.json; any year missing one
// falls back to its lead headline so the page always renders.
export type YearGroup = {
  year: number
  era: Era
  summary: string
  isFuture: boolean
  decade: number
  stops: Stop[]
}

function deriveSummary(stops: Stop[]): string {
  const lead = stops[0].headline
  return stops.length > 1 ? `${lead}, and more` : lead
}

// Evergreen "gotchas" held back from the dated timeline for a future edition,
// surfaced as a teaser in the dock.
export function loadGotchas(): { title: string; blurb: string }[] {
  return (raw as unknown as RawEvent[])
    .filter((e) => e.gotcha)
    .map((e) => ({ title: e.headline?.trim() || e.title, blurb: e.blurb?.trim() || '' }))
}

export function loadYears(now: number = Date.now()): YearGroup[] {
  const summaries = yearSummaries as Record<string, string>
  const byYear = new Map<number, Stop[]>()
  for (const s of loadStops(now)) {
    const arr = byYear.get(s.year)
    if (arr) arr.push(s)
    else byYear.set(s.year, [s])
  }
  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, stops]) => ({
      year,
      era: eraForYear(year),
      summary: summaries[String(year)]?.trim() || deriveSummary(stops),
      isFuture: stops.every((s) => s.isFuture),
      decade: Math.floor(year / 10) * 10,
      stops,
    }))
}
