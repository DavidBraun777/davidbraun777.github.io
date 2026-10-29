import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const title = 'Time2Move: Real Estate Workflows & Integrations'
const path = '/case-studies/time2move'
const successorLabel = 'Current business website — Hombuzz'
const expectedHeadings = [
  'Engineering ownership', 'Inside the system', 'AI development and tool use', 'Outcome and lessons', 'Related Case Studies',
]

test.describe('Time2Move historical case study', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('connects the historical card and experience to a canonical page with contextual onward navigation', async ({ page }) => {
    await page.goto('/case-studies')
    const historical = page.locator('#past-client-work')
    await expect(historical.getByRole('heading', { name: title, exact: true })).toBeVisible()
    const primaryLink = historical.locator(`a[href="${path}"]`)
    await expect(primaryLink).toHaveText(/Read case study/i)
    await expect(historical.getByRole('link', { name: successorLabel, exact: true })).toHaveAttribute('href', 'https://hombuzz.com/')
    await primaryLink.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://dbraun.io${path}`)
    await expect(page.locator('main')).toContainText('Past client project · Engagement concluded')
    await expect(page.getByRole('heading', { name: 'Live Proof', exact: true })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Quantified Outcomes', exact: true })).toHaveCount(0)
    await expect(page.getByRole('link', { name: successorLabel, exact: true })).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(page.locator('main a[href="/case-studies/vifg-nonprofit-platform"]')).toBeVisible()
    await expect(page.locator('main a[href="/case-studies/dealerflow"]')).toBeVisible()
    await page.getByRole('link', { name: 'Back to all case studies', exact: true }).click()
    await expect(page).toHaveURL(/\/case-studies$/)
    await page.goto('/experience')
    const experienceLink = page.locator(`main a[href="${path}"]`)
    await expect(experienceLink).toBeVisible()
    await experienceLink.click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
  })

  test('keeps the concise narrative accessible without empty or repeated sections on desktop and mobile', async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ colorScheme })
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
        const headings = await page.locator('main h2').allTextContents()
        expect(headings.map(heading => heading.trim())).toEqual(expectedHeadings)
        await expect(page.locator('main img, #content-illustration, #content-technical-details, #content-scope')).toHaveCount(0)
        await expect(page.locator('#content-ai-development ul li')).toHaveCount(3)
        const overview = page.locator('#content-inside-system')
        await expect(overview.locator('[data-diagram="inquiries"]')).toHaveCount(1)
        await expect(overview.locator('button, [role="tablist"], [role="tab"], [aria-pressed]')).toHaveCount(0)
        await expect(page.locator('[data-diagram="rates"], [data-diagram="reviews"], [data-diagram="property-search"], [data-graph-node="homepage-artifact"]')).toHaveCount(0)
        await expect(overview).not.toContainText(/Homepage-cache|No consumer shown|Explore four workflows/)
        const pipeline = page.locator('#content-review-data-pipeline')
        const lesson = page.locator('#content-ai-workflow-lesson')
        for (const disclosure of [pipeline, lesson]) {
          await expect(disclosure).not.toHaveAttribute('open')
          await disclosure.locator(':scope > summary').focus()
          await page.keyboard.press('Enter')
          await expect(disclosure).toHaveAttribute('open', '')
        }
        await expect(lesson.getByText('Illustrative extension', { exact: true })).toBeVisible()
        for (const section of await page.locator('main section[data-content-target]').all()) {
          expect((await section.innerText()).trim()).not.toBe('')
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false)

        const successor = page.getByRole('link', { name: successorLabel, exact: true })
        await successor.focus()
        await page.keyboard.press('Shift+Tab')
        await page.keyboard.press('Tab')
        await expect(successor).toBeFocused()
        expect(await successor.evaluate(element => element.matches(':focus-visible'))).toBe(true)
        expect(await successor.evaluate(element => getComputedStyle(element).boxShadow)).not.toBe('none')

        const violations = (await new AxeBuilder({ page }).analyze()).violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))
        expect(violations).toEqual([])
      }
    }
  })

  test('computes the synthetic checks locally and keeps review separate from schema validity', async ({ page }) => {
    const unexpectedRequests: string[] = []
    page.on('request', request => {
      if (request.method() !== 'GET' || (['fetch', 'xhr'].includes(request.resourceType()) && new URL(request.url()).origin !== 'http://localhost:3000')) {
        unexpectedRequests.push(`${request.method()} ${new URL(request.url()).pathname}`)
      }
    })
    await page.goto(`${path}#content-ai-workflow-lesson`)
    const lesson = page.locator('#content-ai-workflow-lesson')
    await expect(lesson).toHaveAttribute('open', '')
    await expect(lesson).toBeFocused()
    const check = (label: string) => lesson.locator('dl > div').filter({ has: page.getByText(label, { exact: true }) })
    await expect(check('Schema check')).toContainText('Passed')
    await expect(check('Evidence-presence check')).toContainText('Passed')
    await expect(check('Human-review gate')).toContainText('Required')
    await lesson.getByRole('button', { name: 'Needs clarification', exact: true }).click()
    await expect(check('Schema check')).toContainText('Passed')
    await expect(check('Human-review gate')).toContainText('Clarification needed')
    const unsupported = lesson.getByRole('button', { name: 'Unsupported detail', exact: true })
    await unsupported.focus()
    await page.keyboard.press('Space')
    await expect(unsupported).toHaveAttribute('aria-pressed', 'true')
    await expect(check('Schema check')).toContainText('Passed')
    await expect(check('Evidence-presence check')).toContainText('Failed')
    await expect(check('Human-review gate')).toContainText('Blocked')
    await expect(lesson).toContainText('budget of $500,000')
    expect(unexpectedRequests).toEqual([])
    await lesson.locator(':scope > summary').click()
    await expect(lesson).not.toHaveAttribute('open')
  })

  test('finds the original project through capabilities and its successor without publishing private audit material', async ({ page, request }) => {
    const indexResponse = await request.get('/search-index.json')
    expect(indexResponse.ok()).toBe(true)
    const index = await indexResponse.json()
    const records = index.records.filter((record: { href: string }) => record.href === path || record.href.startsWith(`${path}#`))
    const canonical = records.filter((record: { href: string }) => record.href === path)
    expect(canonical).toHaveLength(1)
    expect(canonical[0].title).toBe(title)
    const response = await page.goto(path)
    const publicOutput = `${await response?.text()} ${JSON.stringify(records)}`
    expect(publicOutput).not.toMatch(/\/Users\/|prime-location-site|docs\/audits|technical-audit\.md|case-study-brief\.md|source-manifest\.json|\bE\d{2}\b|api\.vercel\.com\/v1\/integrations\/deploy/i)
    expect(publicOutput).not.toMatch(/Technical evidence|Local form feedback|Recorded local audit|515deb2|29 errors|12 warnings|time2move-contact-simulated-error/i)
    expect((await request.get('/images/projects/time2move-contact-simulated-error.png')).status()).toBe(404)
    await page.getByRole('button', { name: 'Search site', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Search the site', exact: true })
    const input = dialog.getByRole('searchbox', { name: 'Search site content' })
    for (const query of ['Time2Move', 'CRM workflows', 'visitor-interaction analysis', 'housing-market content', 'Hombuzz']) {
      await input.fill(query)
      const results = dialog.locator(`a[href="${path}"], a[href^="${path}#"]`)
      const result = results.first()
      await expect(result, query).toBeVisible()
      await expect(result).toContainText(title)
      const hrefs = await results.evaluateAll(links => links.map(link => link.getAttribute('href')))
      expect(new Set(hrefs).size).toBe(hrefs.length)
    }
    const selectedResult = dialog.locator(`a[href="${path}"], a[href^="${path}#"]`).first()
    const selectedHref = await selectedResult.getAttribute('href')
    await selectedResult.click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(url => `${url.pathname}${url.hash}` === selectedHref)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)

    // Removed evidence links use the existing stale-fragment fallback cleanly.
    await page.goto(`${path}#content-illustration`)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
    await expect(page.locator('#content-illustration')).toHaveCount(0)
  })
})
