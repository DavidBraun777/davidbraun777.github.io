import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const title = 'Time2Move: Real Estate Website & Inquiry Workflows'
const path = '/case-studies/time2move'
const successorLabel = 'Current business website — Hombuzz'
const expectedHeadings = [
  'Overview', 'What I built', 'Architecture', 'Workflow stories',
  'Engineering decisions and tradeoffs', 'Technical details',
  'Verification and limitations', 'Project continuation',
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
    await expect(page.locator('main')).toContainText('Past client project · Continued independently')
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

  test('keeps the narrative, diagram, disclosure and image accessible on desktop and mobile in both themes', async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ colorScheme })
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
        const headings = await page.locator('main h2').allTextContents()
        let previousIndex = -1
        for (const heading of expectedHeadings) {
          const currentIndex = headings.findIndex(text => text.trim() === heading)
          expect(currentIndex, heading).toBeGreaterThan(previousIndex)
          previousIndex = currentIndex
        }
        const architecture = page.locator('section').filter({ has: page.getByRole('heading', { level: 2, name: 'Architecture', exact: true }) })
        await expect(architecture).toContainText('IDX')
        await expect(architecture).toContainText('Follow Up Boss')
        expect(await architecture.locator('ol').count()).toBeGreaterThan(0)
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false)

        const summaries = page.locator('main details > summary')
        expect(await summaries.count()).toBeGreaterThan(0)
        for (const summary of await summaries.all()) {
          await summary.focus()
          await page.keyboard.press('Enter')
          await expect(summary.locator('..')).toHaveAttribute('open', '')
        }
        const illustration = page.locator('main figure')
        await expect(illustration).toBeVisible()
        const image = illustration.getByRole('img')
        await expect(image).toHaveAttribute('alt', /synthetic|example/i)
        await expect(illustration.locator('figcaption')).toContainText('October 27, 2026')
        await expect(illustration.locator('figcaption')).toContainText(/simulat/i)
        await expect(illustration.locator('figcaption')).toContainText(/no lead delivered/i)
        await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
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
    await expect(page.locator('main')).toContainText('34')
    await expect(page.locator('main')).toContainText('29 errors')
    await expect(page.locator('main')).toContainText('12 warnings')
    await expect(page.locator('main')).toContainText('October 27, 2026')
    await page.getByRole('button', { name: 'Search site', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Search the site', exact: true })
    const input = dialog.getByRole('searchbox', { name: 'Search site content' })
    for (const query of ['Time2Move', 'lead processing', 'FastAPI', 'Redis', 'Hombuzz']) {
      await input.fill(query)
      const results = dialog.locator(`a[href="${path}"], a[href^="${path}#"]`)
      const result = results.first()
      await expect(result, query).toBeVisible()
      await expect(result).toContainText(title)
      const hrefs = await results.evaluateAll(links => links.map(link => link.getAttribute('href')))
      expect(new Set(hrefs).size).toBe(hrefs.length)
    }
    await dialog.locator(`a[href="${path}"], a[href^="${path}#"]`).first().click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
  })
})
