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

  test('contact form inputs have associated labels', async ({ page }) => {
    await page.goto('/')
    const contactSection = page.locator('#contact')
    await contactSection.scrollIntoViewIfNeeded()

    // All required fields should have a label element
    for (const id of ['contact-name', 'contact-email', 'contact-subject', 'contact-message']) {
      const input = contactSection.locator(`#${id}`)
      await expect(input).toBeVisible()
      const label = contactSection.locator(`label[for="${id}"]`)
      await expect(label).toBeAttached()
    }
  })

  test('contact form success shows live region', async ({ page }) => {
    // Mock the contact API to return success
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    )

    await page.goto('/')
    const form = page.locator('#contact form')
    await form.scrollIntoViewIfNeeded()

    // Fill required fields
    await page.fill('#contact-name', 'Test User')
    await page.fill('#contact-email', 'test@example.com')
    await page.fill('#contact-subject', 'Test Subject')
    await page.fill('#contact-message', 'Hello, this is a test message.')

    // Submit and verify live region
    await form.locator('button[type="submit"]').click()
    const successMsg = form.locator('[role="status"]')
    await expect(successMsg).toBeVisible({ timeout: 5000 })
    await expect(successMsg).toHaveAttribute('aria-live', 'polite')
  })

  test('contact form error shows alert role', async ({ page }) => {
    // Mock the contact API to return error
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"fail"}' })
    )

    await page.goto('/')
    const form = page.locator('#contact form')
    await form.scrollIntoViewIfNeeded()

    // Fill required fields
    await page.fill('#contact-name', 'Test User')
    await page.fill('#contact-email', 'test@example.com')
    await page.fill('#contact-subject', 'Test Subject')
    await page.fill('#contact-message', 'Hello, this is a test message.')

    // Submit and verify alert role
    await form.locator('button[type="submit"]').click()
    const errorMsg = form.locator('[role="alert"]')
    await expect(errorMsg).toBeVisible({ timeout: 5000 })
  })
})
