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
  await expect(page.locator('header')).toBeVisible()
}

const axePageChecks = [
  { label: 'homepage', path: '/' },
  { label: 'writing page', path: '/writing' },
  { label: 'services page', path: '/services' },
  { label: 'case studies page', path: '/case-studies' },
  { label: 'research page', path: '/research' },
  { label: 'Urarina research status page', path: '/research/urarina-hybrid-retrieval' },
  { label: 'contact page', path: '/contact?type=research' },
  { label: 'experience page', path: '/experience' },
  { label: 'career story page', path: '/experience/career-story' },
  { label: 'evidence standards page', path: '/approach/evidence' },
] as const

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  for (const { label, path } of axePageChecks) {
    test(`${label} has no critical or serious a11y violations`, async ({ page }) => {
      await page.goto(path)
      await waitForClientHydration(page)
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
      const results = await new AxeBuilder({ page }).analyze()
      const violations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
      expect(violations, formatViolations(violations)).toEqual([])
    })
  }

  test('Home and Work reflow at 320px with an enlarged browser font', async ({ page, context }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    const session = await context.newCDPSession(page)
    await session.send('Page.setFontSizes', { fontSizes: { standard: 32 } })
    await page.goto('/')
    const root = page.locator('html')
    await expect(root).toHaveCSS('font-size', '32px')
    expect(await root.evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(320)

    const header = page.getByRole('banner')
    const brand = await header.getByRole('link', { name: /David Braun/ }).boundingBox()
    const search = header.getByRole('button', { name: 'Search site', exact: true })
    const menu = header.getByRole('button', { name: 'Open navigation menu', exact: true })
    for (const control of [search, menu]) {
      const box = await control.boundingBox()
      expect(brand && box && (brand.x + brand.width <= box.x || brand.y + brand.height <= box.y)).toBe(true)
    }
    await search.click()
    await expect(page.getByRole('searchbox')).toBeFocused()
    await page.keyboard.press('Escape')
    await menu.click()
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Work', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Work', exact: true })).toBeVisible()
    expect(await root.evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(320)

    const titles = page.locator('article').getByRole('heading')
    await expect(titles.filter({ hasText: 'RoboReceptionist' })).toBeVisible()
    const clipped = await titles.evaluateAll(headings => headings.filter(heading => {
      const card = heading.closest('article')!.getBoundingClientRect()
      const text = document.createRange()
      text.selectNodeContents(heading)
      const bounds = text.getBoundingClientRect()
      return bounds.left < card.left || bounds.right > card.right || bounds.bottom > card.bottom
    }).map(heading => heading.textContent))
    expect(clipped).toEqual([])
  })

  test('expanded navigation has no critical or serious violations in either theme or viewport', async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme })
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto('/research')
        if (colorScheme === 'dark') {
          await expect(page.locator('html')).toHaveClass(/dark/)
        } else {
          await expect(page.locator('html')).not.toHaveClass(/dark/)
        }
        if (width < 1280) {
          await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click()
        }
        const navigation = page.getByRole('navigation', {
          name: width < 1280 ? 'Mobile' : 'Primary', exact: true,
        })

        for (const section of ['Experience', 'Research']) {
          const trigger = navigation.getByRole('button', { name: `${section} navigation`, exact: true })
          await trigger.click()
          await expect(trigger).toHaveAttribute('aria-expanded', 'true')
          const list = navigation.getByRole('list', { name: `${section} links`, exact: true })
          await expect(list).toBeVisible()
          const results = await new AxeBuilder({ page }).include('header').analyze()
          const violations = results.violations.filter(
            (violation) => violation.impact === 'critical' || violation.impact === 'serious'
          )
          expect(violations, `${colorScheme}, ${width}px, ${section}:\n${formatViolations(violations)}`).toEqual([])
          await page.keyboard.press('Escape')
          await expect(list).toBeHidden()
        }
      }
    }
  })

  test('contact form inputs have associated labels', async ({ page }) => {
    await page.goto('/contact')
    await waitForClientHydration(page)
    const contactSection = page.locator('#contact-form')
    await contactSection.scrollIntoViewIfNeeded()

    // Every visible input should have an associated label element.
    for (const id of [
      'contact-inquiry-type',
      'contact-name',
      'contact-email',
      'contact-organization',
      'contact-subject',
      'contact-urgency',
      'contact-message',
    ]) {
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

    await page.goto('/contact')
    await waitForClientHydration(page)
    const form = page.locator('#contact-form form')
    await form.scrollIntoViewIfNeeded()

    // Fill required fields
    await page.selectOption('#contact-inquiry-type', 'employment')
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

    await page.goto('/contact')
    await waitForClientHydration(page)
    const form = page.locator('#contact-form form')
    await form.scrollIntoViewIfNeeded()

    // Fill required fields
    await page.selectOption('#contact-inquiry-type', 'research')
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
