import { describe, it, expect } from 'vitest'
import { loadStops, loadYears } from './events'

const NOW = Date.UTC(2026, 5, 20)

describe('loadStops', () => {
  const stops = loadStops(NOW)

  it('loads the full corpus', () => {
    expect(stops.length).toBeGreaterThanOrEqual(112)
  })

  it('is sorted oldest first', () => {
    for (let i = 1; i < stops.length; i++) {
      expect(stops[i].year).toBeGreaterThanOrEqual(stops[i - 1].year)
    }
  })

  it('marks a 2038 event as future', () => {
    const y2038 = stops.find((s) => s.year === 2038)
    expect(y2038).toBeDefined()
    expect(y2038!.isFuture).toBe(true)
  })

  it('every stop has a verified http source and a headline', () => {
    for (const s of stops) {
      expect(s.source.url).toMatch(/^https?:\/\//)
      expect(s.headline.length).toBeGreaterThan(0)
    }
  })

  it('every category is known', () => {
    const known = new Set([
      'standardization', 'leap-second', 'dst-policy', 'offset-change',
      'legal-governance', 'vendor-bug', 'epoch-rollover',
    ])
    for (const s of stops) expect(known.has(s.category)).toBe(true)
  })
})

describe('loadYears', () => {
  const years = loadYears(NOW)

  it('groups every stop into exactly one year', () => {
    const grouped = years.reduce((n, y) => n + y.stops.length, 0)
    expect(grouped).toBe(loadStops(NOW).length)
  })

  it('is sorted oldest year first with no duplicate years', () => {
    const ys = years.map((y) => y.year)
    expect(ys).toEqual([...ys].sort((a, b) => a - b))
    expect(new Set(ys).size).toBe(ys.length)
  })

  it('gives every year a non-empty summary', () => {
    for (const y of years) expect(y.summary.trim().length).toBeGreaterThan(0)
  })

  it('marks a wholly future year as future', () => {
    const y2038 = years.find((y) => y.year === 2038)
    expect(y2038?.isFuture).toBe(true)
  })
})
