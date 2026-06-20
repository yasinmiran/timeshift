import raw from '../../data/events.json'
import { CATEGORIES, type CategoryId } from './categories'
import { parseEventDate, isFuture } from './dates'

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
    .map((e) => {
      const d = parseEventDate(e.date)
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
      }
      return { stop, startMs: d.startMs }
    })
    .sort((a, b) => a.startMs - b.startMs || a.stop.id.localeCompare(b.stop.id))
    .map((x) => x.stop)
}
