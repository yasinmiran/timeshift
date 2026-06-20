import { describe, it, expect } from 'vitest'
import { loadStops } from './events'

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
    const y2038 = stops.find((s) => s.id.includes('2038'))
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
