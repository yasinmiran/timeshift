import type { CategoryId } from './categories'

// Small line glyphs drawn on a 24x24 grid, one per category. Stroke only, they
// inherit the category color via currentColor. Decorative: every stop also names
// its category in text, so these are aria-hidden and never the only signal.
export const ICONS: Record<CategoryId, string> = {
  // globe with a meridian and equator: the standardization of world time
  'standardization':
    '<circle cx="12" cy="12" r="8.5"/>' +
    '<path d="M12 3.5 C7 7 7 17 12 20.5 C17 17 17 7 12 3.5"/>' +
    '<path d="M3.5 12 H20.5"/>',
  // a clock with a small plus: one extra second
  'leap-second':
    '<circle cx="10.5" cy="13" r="7"/>' +
    '<path d="M10.5 13 V8.8"/><path d="M10.5 13 L13.8 14.6"/>' +
    '<path d="M19 4 V8 M17 6 H21"/>',
  // a sun: daylight saving
  'dst-policy':
    '<circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2.5 V4.8 M12 19.2 V21.5 M2.5 12 H4.8 M19.2 12 H21.5 ' +
    'M5.2 5.2 L6.8 6.8 M17.2 17.2 L18.8 18.8 M18.8 5.2 L17.2 6.8 M6.8 17.2 L5.2 18.8"/>',
  // a two-headed arrow: the clock shifts to a new offset
  'offset-change':
    '<path d="M3.5 12 H20.5"/>' +
    '<path d="M7.5 8 L3.5 12 L7.5 16"/><path d="M16.5 8 L20.5 12 L16.5 16"/>',
  // a document with a folded corner: a law or decision
  'legal-governance':
    '<path d="M7 3.5 H14 L17.5 7 V20.5 H7 Z"/>' +
    '<path d="M14 3.5 V7 H17.5"/>' +
    '<path d="M9.5 12 H15 M9.5 15.5 H15"/>',
  // a warning triangle: software broke
  'vendor-bug':
    '<path d="M12 4 L21 19.5 H3 Z"/>' +
    '<path d="M12 10 V14"/><path d="M12 16.6 V16.7"/>',
  // an hourglass: a countdown to a rollover
  'epoch-rollover':
    '<path d="M6 4 H18 M6 20 H18"/>' +
    '<path d="M6.5 4 H17.5 L12 12 Z"/><path d="M6.5 20 H17.5 L12 12 Z"/>',
}
