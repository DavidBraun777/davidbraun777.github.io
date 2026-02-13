import { test, expect, type Page } from '@playwright/test'
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

async function waitForClientHydration(page: Page) {
  await page.waitForFunction(() => {
    const header = document.querySelector('header')
    if (!header) return false
    const style = header.getAttribute('style') ?? ''
    // Header starts with translateY(-100px) from Framer Motion initial state.
    // Once hydrated, animation runs and this initial transform is removed.
    return !style.includes('translateY(-100px)')
  })
}

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('homepage has no critical or serious a11y violations', async ({ page }) => {
    await page.goto('/')
    await waitForClientHydration(page)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    const results = await new AxeBuilder({ page }).analyze()
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(violations, formatViolations(violations)).toEqual([])
  })

  test('blog page has no critical or serious a11y violations', async ({ page }) => {
    await page.goto('/blog')
    await waitForClientHydration(page)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    const results = await new AxeBuilder({ page }).analyze()
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(violations, formatViolations(violations)).toEqual([])
  })

  test('contact form inputs have associated labels', async ({ page }) => {
    await page.goto('/')
    await waitForClientHydration(page)
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
    await waitForClientHydration(page)
    const form = page.locator('#contact form')
    await form.scrollIntoViewIfNeeded()

    // Fill required fields
    await page.fill('#contact-name', 'Test User')
    await page.fill('#contact-email', 'test@example.com')
    await page.fill('#contact-subject', 'Test Subject')
    await page.fill('#contact-message', 'Hello, this is a test message.')

    // Submit and verify live region
    const submission = page.waitForRequest('**/api/contact')
    await form.locator('button[type="submit"]').click()
    await submission
    const successMsg = form.locator('[role="status"]')
    await expect(successMsg).toBeVisible({ timeout: 10_000 })
    await expect(successMsg).toHaveAttribute('aria-live', 'polite')
  })

  test('contact form error shows alert role', async ({ page }) => {
    // Mock the contact API to return error
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"fail"}' })
    )

    await page.goto('/')
    await waitForClientHydration(page)
    const form = page.locator('#contact form')
    await form.scrollIntoViewIfNeeded()

    // Fill required fields
    await page.fill('#contact-name', 'Test User')
    await page.fill('#contact-email', 'test@example.com')
    await page.fill('#contact-subject', 'Test Subject')
    await page.fill('#contact-message', 'Hello, this is a test message.')

    // Submit and verify alert role
    const submission = page.waitForRequest('**/api/contact')
    await form.locator('button[type="submit"]').click()
    await submission
    const errorMsg = form.locator('[role="alert"]')
    await expect(errorMsg).toBeVisible({ timeout: 10_000 })
  })
})
