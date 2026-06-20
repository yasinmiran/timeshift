import { describe, it, expect } from 'vitest'
import { CATEGORIES } from './categories'

describe('CATEGORIES', () => {
  it('covers all 7 corpus categories with label + node color', () => {
    const ids = Object.keys(CATEGORIES).sort()
    expect(ids).toEqual([
      'dst-policy',
      'epoch-rollover',
      'leap-second',
      'legal-governance',
      'offset-change',
      'standardization',
      'vendor-bug',
    ])
    for (const c of Object.values(CATEGORIES)) {
      expect(c.label.length).toBeGreaterThan(0)
      expect(c.node).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})
