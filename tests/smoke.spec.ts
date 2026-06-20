import { test, expect } from '@playwright/test'

test('renders the full trail of stops', async ({ page }) => {
  await page.goto('/')
  const stops = page.locator('details[name="stop"]')
  expect(await stops.count()).toBeGreaterThanOrEqual(112)
})

test('a stop expands to reveal a verified source link', async ({ page }) => {
  await page.goto('/')
  const first = page.locator('ol > li').first()
  await first.locator('summary').click()
  await expect(first.locator('details')).toHaveJSProperty('open', true)
  await expect(first.locator('a[href^="http"]')).toBeVisible()
})

test('only one stop stays open at a time', async ({ page }) => {
  await page.goto('/')
  const items = page.locator('ol > li')
  const first = items.nth(0)
  const second = items.nth(1)

  await first.locator('summary').click()
  await expect(first.locator('details')).toHaveJSProperty('open', true)

  await second.locator('summary').click()
  await expect(second.locator('details')).toHaveJSProperty('open', true)
  await expect(first.locator('details')).toHaveJSProperty('open', false)
})
