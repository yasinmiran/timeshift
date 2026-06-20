export type Era = {
  slug: string
  label: string
  blurb: string
  start: number
  end: number
}

// Chapters of the walk, used as soft dividers along one continuous year-by-year
// scroll. Each era frames a coherent stretch of the story.
export const ERAS: Era[] = [
  { slug: 'origins', label: 'Origins of standard time', blurb: 'How the world agreed to share one clock, from railway time to the prime meridian.', start: 0, end: 1919 },
  { slug: 'atomic', label: 'The atomic age', blurb: 'Atomic clocks, war-time changes, and the road to a precise global standard.', start: 1920, end: 1971 },
  { slug: 'leap-second', label: 'The leap-second era', blurb: 'The leap second arrives, the tz database is born, and daylight-saving rules settle.', start: 1972, end: 1999 },
  { slug: 'internet', label: 'The internet era', blurb: 'Y2K, energy-law clock shifts, and the first big leap-second outages online.', start: 2000, end: 2011 },
  { slug: 'governance', label: 'Governance and outages', blurb: 'Who maintains the time-zone database, and the outages that tested it.', start: 2012, end: 2018 },
  { slug: 'permanent-dst', label: 'The permanent-daylight wave', blurb: 'Country after country stops changing its clocks, and leap seconds near their end.', start: 2019, end: 2026 },
  { slug: 'future', label: 'Clocks still ahead', blurb: 'The rollovers and decisions still to come, from 2036 to 2106.', start: 2027, end: 9999 },
]

export function eraForYear(year: number): Era {
  return ERAS.find((e) => year >= e.start && year <= e.end) ?? ERAS[ERAS.length - 1]
}
