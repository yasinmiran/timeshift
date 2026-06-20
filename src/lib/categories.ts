export type CategoryId =
  | 'standardization'
  | 'leap-second'
  | 'dst-policy'
  | 'offset-change'
  | 'legal-governance'
  | 'vendor-bug'
  | 'epoch-rollover'

export type Category = { id: CategoryId; label: string; name: string; node: string }

// label is the plain-language kicker shown above a stop; name is the plain
// category name used in the footer legend; node is a muted hex color that sits
// quietly on warm paper. Color is never the only signal: the kicker text always
// names the moment, and the legend pairs each color with its name.
export const CATEGORIES: Record<CategoryId, Category> = {
  'standardization': { id: 'standardization', label: 'A turning point', name: 'Standard time', node: '#6f7b8a' },
  'leap-second': { id: 'leap-second', label: 'An extra second', name: 'Leap seconds', node: '#c08a3e' },
  'dst-policy': { id: 'dst-policy', label: 'A clock changed', name: 'Daylight saving', node: '#bb6a4e' },
  'offset-change': { id: 'offset-change', label: 'A new offset', name: 'Offset changes', node: '#7a9a6d' },
  'legal-governance': { id: 'legal-governance', label: 'A decision', name: 'Laws and decisions', node: '#9a7aa8' },
  'vendor-bug': { id: 'vendor-bug', label: 'Something broke', name: 'Software bugs', node: '#c2615e' },
  'epoch-rollover': { id: 'epoch-rollover', label: 'A countdown', name: 'Rollovers ahead', node: '#5f8e95' },
}
