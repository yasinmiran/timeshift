// TimeShift timeline behaviour, progressive enhancement only.
//
// The story sits inline in every card; this script handles the optional layers:
//  - "Read further": clones an event's inert <template> (when / who / dev notes /
//    sources) into the card on demand, so the long page stays light.
//  - The floating dock: category filter, highlights toggle, decade jump, and the
//    gotcha teaser, each in a popover so the reading column stays uncluttered.

function initReadFurther(root: HTMLElement): void {
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.ev-more')
    if (!btn) return
    const card = btn.closest('.ev-card')
    if (!card) return
    const existing = card.querySelector('.ev-extra')
    if (existing) {
      existing.remove()
      btn.setAttribute('aria-expanded', 'false')
      btn.textContent = 'Read further'
      return
    }
    const tpl = card.querySelector('template')
    if (!tpl) return
    const extra = document.createElement('div')
    extra.className = 'ev-extra'
    extra.appendChild(tpl.content.cloneNode(true))
    btn.insertAdjacentElement('afterend', extra)
    btn.setAttribute('aria-expanded', 'true')
    btn.textContent = 'Show less'
  })
}

function initFilter(root: HTMLElement): void {
  const events = Array.from(root.querySelectorAll<HTMLElement>('.ev'))
  const years = Array.from(root.querySelectorAll<HTMLElement>('.yr'))
  const eras = Array.from(root.querySelectorAll<HTMLElement>('.era'))
  const tierBtn = document.getElementById('dock-tier')
  const chips = Array.from(document.querySelectorAll<HTMLElement>('.cat-chip'))
  const countEl = document.getElementById('stop-count')
  const total = events.length

  let highlightsOnly = false
  let cat = 'all'

  function apply(): void {
    let visible = 0
    for (const el of events) {
      const isCore = el.dataset.tier === 'core'
      const matchCat = cat === 'all' || el.dataset.category === cat
      const show = (!highlightsOnly || isCore) && matchCat
      el.hidden = !show
      if (show) visible += 1
    }
    for (const y of years) y.hidden = !y.querySelector('.ev:not([hidden])')
    for (const era of eras) era.hidden = !era.querySelector('.yr:not([hidden])')
    if (countEl) {
      countEl.textContent =
        highlightsOnly || cat !== 'all' ? `${visible} shown of ${total}` : `${total} events`
    }
  }

  tierBtn?.addEventListener('click', () => {
    highlightsOnly = !highlightsOnly
    tierBtn.setAttribute('aria-pressed', String(highlightsOnly))
    tierBtn.setAttribute('aria-label', highlightsOnly ? 'Show all events' : 'Show highlights only')
    tierBtn.classList.toggle('is-on', highlightsOnly)
    apply()
  })

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      cat = chip.dataset.cat || 'all'
      for (const c of chips) {
        const on = c === chip
        c.setAttribute('aria-pressed', String(on))
        c.classList.toggle('is-on', on)
      }
      apply()
    })
  }

  apply()
}

function initDock(): void {
  const dock = document.getElementById('dock')
  if (!dock) return
  const triggers = Array.from(dock.querySelectorAll<HTMLButtonElement>('[data-panel]'))

  function panelFor(name: string): HTMLElement | null {
    return document.getElementById(`panel-${name}`)
  }

  function closeAll(except?: string): void {
    for (const t of triggers) {
      const name = t.dataset.panel!
      if (name === except) continue
      t.setAttribute('aria-expanded', 'false')
      panelFor(name)?.setAttribute('hidden', '')
    }
  }

  for (const t of triggers) {
    t.addEventListener('click', (e) => {
      e.stopPropagation()
      const name = t.dataset.panel!
      const panel = panelFor(name)
      if (!panel) return
      const isOpen = t.getAttribute('aria-expanded') === 'true'
      closeAll(name)
      if (isOpen) {
        t.setAttribute('aria-expanded', 'false')
        panel.setAttribute('hidden', '')
      } else {
        t.setAttribute('aria-expanded', 'true')
        panel.removeAttribute('hidden')
      }
    })
  }

  // jump links should dismiss the popover after a choice
  document.getElementById('panel-jump')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) closeAll()
  })

  document.addEventListener('click', (e) => {
    if (!dock.contains(e.target as Node)) closeAll()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll()
  })
}

function init(): void {
  const root = document.getElementById('timeline')
  if (!root) return
  initReadFurther(root)
  initFilter(root)
  initDock()
}

if (document.readyState !== 'loading') init()
else document.addEventListener('DOMContentLoaded', init)
