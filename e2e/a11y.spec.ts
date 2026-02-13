import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage has no critical or serious a11y violations', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page }).analyze()
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(violations).toEqual([])
  })

  test('blog page has no critical or serious a11y violations', async ({ page }) => {
    await page.goto('/blog')
    const results = await new AxeBuilder({ page }).analyze()
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(violations).toEqual([])
  })
})
