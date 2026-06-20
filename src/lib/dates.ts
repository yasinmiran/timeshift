const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export type ParsedDate = { year: number; label: string; startMs: number; isRange: boolean }

// The corpus 'date' field is not uniform. It can be a plain year, a year-month,
// a full day, an ISO timestamp, a leap-second instant ending ':60', a '/'-range,
// or a ';'-separated multi-instant. We always key off the first instant.
function firstInstant(raw: string): string {
  return raw.split(';')[0].split('/')[0].trim()
}

type Kind = 'year' | 'ym' | 'day'

function parseOne(input: string): { d: Date; kind: Kind } {
  // A leap second is 23:59:60, which native Date cannot parse. Step it to :59;
  // it still lands on the correct day, which is all the display needs.
  const s = input.replace('T23:59:60', 'T23:59:59')
  if (/^\d{4}$/.test(s)) return { d: new Date(Date.UTC(Number(s), 0, 1)), kind: 'year' }
  if (/^\d{4}-\d{2}$/.test(s)) {
    const [y, m] = s.split('-').map(Number)
    return { d: new Date(Date.UTC(y, m - 1, 1)), kind: 'ym' }
  }
  return { d: new Date(s.includes('T') ? s : s + 'T00:00:00Z'), kind: 'day' }
}

function dayLabel(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function parseEventDate(raw: string): ParsedDate {
  const isRange = raw.includes('/')
  const { d, kind } = parseOne(firstInstant(raw))

  let label: string
  if (kind === 'year') label = String(d.getUTCFullYear())
  else if (kind === 'ym') label = `${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`
  else label = dayLabel(d)

  if (isRange) {
    const end = parseOne(raw.split('/')[1].trim()).d
    const sameMonth =
      d.getUTCFullYear() === end.getUTCFullYear() && d.getUTCMonth() === end.getUTCMonth()
    label = sameMonth
      ? `${d.getUTCDate()} to ${end.getUTCDate()} ${MONTHS[end.getUTCMonth()]} ${end.getUTCFullYear()}`
      : `${dayLabel(d)} to ${dayLabel(end)}`
  }

  return { year: d.getUTCFullYear(), label, startMs: d.getTime(), isRange }
}

export function isFuture(startMs: number, nowMs: number): boolean {
  return startMs > nowMs
}
