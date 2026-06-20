import { describe, it, expect } from 'vitest'
import { parseEventDate, isFuture } from './dates'

describe('parseEventDate', () => {
  it('year only', () => {
    const r = parseEventDate('1972')
    expect(r.year).toBe(1972)
    expect(r.label).toBe('1972')
  })
  it('year-month', () => {
    expect(parseEventDate('2016-03').label).toBe('March 2016')
  })
  it('full day', () => {
    expect(parseEventDate('1883-11-18').label).toBe('18 Nov 1883')
  })
  it('range with slash, same month', () => {
    const r = parseEventDate('2011-12-29/2011-12-31')
    expect(r.year).toBe(2011)
    expect(r.isRange).toBe(true)
    expect(r.label).toBe('29 to 31 Dec 2011')
  })
  it('iso timestamp', () => {
    expect(parseEventDate('2010-03-01T00:00:00Z').label).toBe('1 Mar 2010')
  })
  it('leap-second :60 instant does not throw', () => {
    const r = parseEventDate('2012-06-30T23:59:60Z')
    expect(r.year).toBe(2012)
    expect(r.label).toBe('30 Jun 2012')
  })
  it('multi-instant semicolon takes the first', () => {
    const r = parseEventDate('1999-08-21; 2019-04-06T23:59:42Z')
    expect(r.year).toBe(1999)
    expect(r.label).toBe('21 Aug 1999')
  })
})

describe('isFuture', () => {
  it('after now is future, before now is not', () => {
    const now = Date.UTC(2026, 5, 20)
    expect(isFuture(Date.UTC(2038, 0, 19), now)).toBe(true)
    expect(isFuture(Date.UTC(2011, 0, 1), now)).toBe(false)
  })
})
