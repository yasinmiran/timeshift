import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']

test('home page has no axe violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})

test('an expanded "read further" layer has no axe violations', async ({ page }) => {
  await page.goto('/')
  const first = page.locator('.ev-card').first()
  await first.locator('.ev-more').click()
  // let the reveal animation settle so contrast is measured at full opacity
  await first
    .locator('.ev-extra')
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)))
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})

test('the open dock panels have no axe violations', async ({ page }) => {
  await page.goto('/')
  await page.locator('.dock-btn[data-panel="filter"]').click()
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})

test('404 page has no axe violations', async ({ page }) => {
  await page.goto('/does-not-exist')
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})
