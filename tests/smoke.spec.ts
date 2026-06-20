import { test, expect } from '@playwright/test'

test('the timeline renders year groups, each with a summary', async ({ page }) => {
  await page.goto('/')
  const years = page.locator('#timeline .yr')
  expect(await years.count()).toBeGreaterThan(40)
  await expect(years.first().locator('h2 time')).toBeVisible()
  await expect(years.first().locator('.yr-summary')).not.toBeEmpty()
})

test('every event shows a category icon and a short blurb inline', async ({ page }) => {
  await page.goto('/')
  const blurbs = page.locator('.ev .ev-blurb')
  expect(await blurbs.count()).toBeGreaterThan(100)
  await expect(blurbs.first()).toBeVisible()
  await expect(blurbs.first()).not.toBeEmpty()
  await expect(page.locator('.ev svg use').first()).toBeAttached()
})

test('"read more" reveals the full story plus when/who/source and toggles back', async ({ page }) => {
  await page.goto('/')
  const node = page.locator('.ev').first()
  const more = node.locator('.ev-more')
  await more.click()
  await expect(more).toHaveAttribute('aria-expanded', 'true')
  const extra = node.locator('.ev-extra')
  await expect(extra).toHaveCount(1)
  await expect(extra.locator('a[href^="http"]').first()).toBeVisible()
  await expect(extra.getByText('Who decided')).toBeVisible()
  await more.click()
  await expect(node.locator('.ev-extra')).toHaveCount(0)
})

test('the dock filter narrows the timeline to one category', async ({ page }) => {
  await page.goto('/')
  await page.locator('.dock-btn[data-panel="filter"]').click()
  const before = await page.locator('.ev:not([hidden])').count()
  await page.locator('.cat-chip[data-cat="leap-second"]').click()
  const after = page.locator('.ev:not([hidden])')
  expect(await after.count()).toBeLessThan(before)
  expect(
    await after.evaluateAll((els) => els.every((e) => (e as HTMLElement).dataset.category === 'leap-second'))
  ).toBe(true)
})

test('the dock highlights toggle reduces the number of visible events', async ({ page }) => {
  await page.goto('/')
  const visible = page.locator('.ev:not([hidden])')
  const all = await visible.count()
  await page.locator('#dock-tier').click()
  expect(await visible.count()).toBeLessThan(all)
})

test('the dock gotcha panel teases the future-edition entries', async ({ page }) => {
  await page.goto('/')
  await page.locator('.dock-btn[data-panel="gotcha"]').click()
  const panel = page.locator('#panel-gotcha')
  await expect(panel).toBeVisible()
  expect(await panel.locator('.dock-gotcha-list li').count()).toBeGreaterThan(0)
})

test('opening a dock panel closes the previously open one', async ({ page }) => {
  await page.goto('/')
  await page.locator('.dock-btn[data-panel="filter"]').click()
  await expect(page.locator('#panel-filter')).toBeVisible()
  await page.locator('.dock-btn[data-panel="jump"]').click()
  await expect(page.locator('#panel-jump')).toBeVisible()
  await expect(page.locator('#panel-filter')).toBeHidden()
})

test('the initial DOM stays light enough for good performance', async ({ page }) => {
  await page.goto('/')
  // The "read more" detail lives in inert <template>s (excluded from the live
  // tree) and icons share one sprite, so the whole corpus on one page stays far
  // below the ~16k nodes that tanked performance. DOM size is only a soft factor
  // for a static, zero-blocking-JS page; this guards against runaway growth.
  const nodes = await page.evaluate(() => document.querySelectorAll('*').length)
  expect(nodes).toBeLessThan(5500)
})
