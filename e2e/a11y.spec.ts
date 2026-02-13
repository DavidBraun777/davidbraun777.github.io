import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/** Format axe violations into a readable string for test failure output */
function formatViolations(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description}\n` +
        v.nodes.map((n) => `  - ${n.html}`).join('\n')
    )
    .join('\n\n')
}

test.describe('Accessibility', () => {
  test('homepage has no critical or serious a11y violations', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page }).analyze()
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(violations, formatViolations(violations)).toEqual([])
  })

  test('blog page has no critical or serious a11y violations', async ({ page }) => {
    await page.goto('/blog')
    const results = await new AxeBuilder({ page }).analyze()
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(violations, formatViolations(violations)).toEqual([])
  })
})
