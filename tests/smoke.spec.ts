import { test, expect } from '@playwright/test'

test('the timeline renders year groups, each with a summary', async ({ page }) => {
  await page.goto('/')
  const years = page.locator('#timeline .yr')
  expect(await years.count()).toBeGreaterThan(40)
  await expect(years.first().locator('h2 time')).toBeVisible()
  await expect(years.first().locator('header p')).not.toBeEmpty()
})

test('event descriptions are visible inline without any interaction', async ({ page }) => {
  await page.goto('/')
  const stories = page.locator('.ev-card .ev-story')
  expect(await stories.count()).toBeGreaterThan(100)
  await expect(stories.first()).toBeVisible()
  await expect(stories.first()).not.toBeEmpty()
})

test('"read further" reveals when/who/source and toggles back', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('.ev-card').first()
  const more = card.locator('.ev-more')
  await more.click()
  await expect(more).toHaveAttribute('aria-expanded', 'true')
  const extra = card.locator('.ev-extra')
  await expect(extra).toHaveCount(1)
  await expect(extra.locator('a[href^="http"]').first()).toBeVisible()
  await expect(extra.getByText('Who decided')).toBeVisible()
  await more.click()
  await expect(card.locator('.ev-extra')).toHaveCount(0)
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
  // <template> detail is excluded from the live tree, so the whole corpus on one
  // page stays well under the budget that scored Lighthouse performance ~100.
  const nodes = await page.evaluate(() => document.querySelectorAll('*').length)
  expect(nodes).toBeLessThan(4500)
})
