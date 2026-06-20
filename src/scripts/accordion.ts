// Keep one stop open at a time. Modern browsers do this natively via the
// shared `name` attribute on <details>; this listener is an idempotent fallback
// for browsers without that support. When a stop opens, close any sibling that
// is still open. In a browser that already closed them, this finds none and is
// a no-op, so it is safe to run everywhere with no feature detection.
const stops = Array.from(
  document.querySelectorAll<HTMLDetailsElement>('details[name="stop"]'),
)

for (const stop of stops) {
  stop.addEventListener('toggle', () => {
    if (!stop.open) return
    for (const other of stops) {
      if (other !== stop && other.open) other.open = false
    }
  })
}
