import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']

test('home page has no axe violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})

test('expanded stop has no axe violations', async ({ page }) => {
  await page.goto('/')
  await page.locator('ol > li:first-child summary').click()
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})

test('404 page has no axe violations', async ({ page }) => {
  await page.goto('/does-not-exist')
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})
