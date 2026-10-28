import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { SearchIndex } from '../src/lib/search/types'

const searchTrigger = (page: Page) => page.getByRole('button', { name: 'Search site', exact: true })
const searchDialog = (page: Page) => page.getByRole('dialog', { name: 'Search the site', exact: true })
const searchInput = (page: Page) => searchDialog(page).getByRole('searchbox', { name: 'Search site content' })

async function openSearch(page: Page) {
  await searchTrigger(page).click()
  await expect(searchDialog(page)).toBeVisible()
  await expect(searchInput(page)).toBeFocused()
}

test.describe('site content search', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('loads only on first open, preserves a query, and reuses the index across navigation', async ({ page }) => {
    let indexRequests = 0
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === '/search-index.json') indexRequests++
    })
    await page.goto('/')
    await expect(searchTrigger(page)).toBeVisible()
    expect(indexRequests).toBe(0)

    await openSearch(page)
    const dialog = searchDialog(page)
    await expect(dialog.getByRole('heading', { name: 'Suggestions', exact: true })).toBeVisible()
    for (const name of ['Case Studies', 'Research', 'Experience', 'Writing', 'Résumés & CV']) {
      await expect(dialog.getByRole('link', { name, exact: true })).toBeVisible()
    }
    await searchInput(page).fill('VIFG')
    const result = dialog.locator('a[href="/case-studies/vifg-nonprofit-platform"]')
    await expect(result).toBeVisible()
    await expect(dialog.getByRole('link').first()).toHaveAttribute('href', '/case-studies/vifg-nonprofit-platform')
    expect(indexRequests).toBe(1)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(searchTrigger(page)).toBeFocused()
    await openSearch(page)
    await expect(searchInput(page)).toHaveValue('VIFG')
    await result.click()
    await expect(page).toHaveURL(/\/case-studies\/vifg-nonprofit-platform$/)
    await expect(dialog).toBeHidden()
    await openSearch(page)
    await expect(searchInput(page)).toHaveValue('VIFG')
    await expect(result).toBeVisible()
    expect(indexRequests).toBe(1)
  })

  test('finds actual public content, accents, short terms, and article body text', async ({ page }) => {
    await page.goto('/')
    await openSearch(page)
    const dialog = searchDialog(page)
    const input = searchInput(page)
    for (const [query, href] of [
      ['  vIfG  ', '/case-studies/vifg-nonprofit-platform'],
      ['AWS', '/case-studies/vifg-nonprofit-platform'],
      ['RAG', '/case-studies/rageatm'],
      ['Urarina', '/research/urarina-hybrid-retrieval'],
      ['work arrives unevenly', '/writing/designing-automation-platforms-for-real-workflows'],
    ]) {
      await input.fill(query)
      await expect(dialog.locator(`a[href="${href}"]`), query).toBeVisible()
    }

    await input.fill('resume')
    await expect(dialog.locator('a[href="/resumes"]')).toBeVisible()
    const plainResumeLinks = await dialog.getByRole('link').evaluateAll((links) => links.map(link => link.getAttribute('href')))
    await input.fill('résumé')
    await expect(dialog.locator('a[href="/resumes"]')).toBeVisible()
    await expect.poll(() => dialog.getByRole('link').evaluateAll((links) => links.map(link => link.getAttribute('href')))).toEqual(plainResumeLinks)

    for (const query of ['AI', 'ML', '.NET', 'C++', 'Next.js']) {
      await input.fill(query)
      await expect(input).toHaveValue(query)
      await expect(dialog.getByRole('status')).not.toBeEmpty()
      const hrefs = await dialog.getByRole('link').evaluateAll((links) => links.map(link => link.getAttribute('href') ?? ''))
      expect(hrefs.some(href => /^\/(?:projects|blog)(?:\/|$)/.test(href))).toBe(false)
    }
  })

  test('handles empty, nonsense, long input and clearing with settled feedback', async ({ page }) => {
    await page.goto('/')
    await openSearch(page)
    const dialog = searchDialog(page)
    const input = searchInput(page)
    await input.fill('   ')
    await expect(dialog.getByRole('heading', { name: 'Suggestions', exact: true })).toBeVisible()

    await input.fill('zxqvnonexistentportfolio')
    await expect(dialog.getByRole('status')).toContainText(/no results|0 results/i)
    await expect(dialog).toContainText(/try|different|shorter/i)
    await expect(dialog.getByRole('link')).toHaveCount(0)

    await input.fill('z'.repeat(1000))
    await expect(dialog.getByRole('status')).toContainText(/no results|0 results/i)
    expect((await input.inputValue()).length).toBeLessThanOrEqual(160)
    await dialog.getByRole('button', { name: 'Clear search', exact: true }).click()
    await expect(input).toHaveValue('')
    await expect(input).toBeFocused()
    await expect(dialog.getByRole('heading', { name: 'Suggestions', exact: true })).toBeVisible()
    await dialog.getByRole('button', { name: 'Close search', exact: true }).click()
    await expect(dialog).toBeHidden()
    await expect(searchTrigger(page)).toBeFocused()
  })

  test('traps focus, restores shortcut focus, and leaves unrelated editable fields and browser Find alone', async ({ page }) => {
    await page.goto('/contact')
    const brand = page.getByRole('link', { name: 'David Braun AI Systems & Platform Engineer', exact: true })
    for (const shortcut of ['Meta+k', 'Control+k']) {
      await brand.focus()
      await page.keyboard.press(shortcut)
      const dialog = searchDialog(page)
      await expect(dialog).toBeVisible()
      await expect(searchInput(page)).toBeFocused()
      for (const key of ['Tab', 'Shift+Tab']) {
        for (let index = 0; index < 12; index++) {
          await page.keyboard.press(key)
          await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
        }
      }
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
      await expect(brand).toBeFocused()
    }

    for (const selector of ['#contact-name', '#contact-message']) {
      const editable = page.locator(selector)
      await editable.focus()
      for (const modifier of ['metaKey', 'ctrlKey']) {
        const prevented = await editable.evaluate((element, modifierKey) => {
          const event = new KeyboardEvent('keydown', { key: 'k', [modifierKey]: true, bubbles: true, cancelable: true })
          element.dispatchEvent(event)
          return event.defaultPrevented
        }, modifier)
        expect(prevented).toBe(false)
        await expect(searchDialog(page)).toBeHidden()
      }
    }
    const browserFindPrevented = await brand.evaluate((element) => {
      const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, bubbles: true, cancelable: true })
      element.dispatchEvent(event)
      return event.defaultPrevented
    })
    expect(browserFindPrevented).toBe(false)
    await expect(searchDialog(page)).toBeHidden()
  })

  test('distinguishes a failed index from no matches and recovers with retry', async ({ page }) => {
    let attempts = 0
    await page.route('**/search-index.json', async (route) => {
      attempts++
      if (attempts === 1) {
        await route.fulfill({ status: 503, body: 'Unavailable' })
      } else {
        await route.continue()
      }
    })
    await page.goto('/')
    await openSearch(page)
    const dialog = searchDialog(page)
    await searchInput(page).fill('VIFG')
    await expect(dialog.getByRole('button', { name: 'Retry loading search', exact: true })).toBeVisible()
    await expect(dialog.getByRole('status')).not.toContainText(/no results|0 results/i)
    await dialog.getByRole('button', { name: 'Retry loading search', exact: true }).click()
    await expect(dialog.locator('a[href="/case-studies/vifg-nonprofit-platform"]')).toBeVisible()
    expect(attempts).toBe(2)
  })

  test('offers additional matches without duplicates', async ({ page }) => {
    await page.route('**/search-index.json', route => route.fulfill({
      json: {
        version: 1,
        records: Array.from({ length: 18 }, (_, index) => ({
          id: `sample-${index}`,
          title: `Sample project ${index + 1}`,
          href: `/case-studies#sample-${index}`,
          type: 'Project',
          description: 'A sample project for checking result pagination.',
          tags: [],
          headings: [],
          body: '',
        })),
      },
    }))
    await page.goto('/')
    await openSearch(page)
    const dialog = searchDialog(page)
    await searchInput(page).fill('sample')
    const more = dialog.getByRole('button', { name: 'Show more results', exact: true })
    await expect(more).toBeVisible()
    const initialCount = await dialog.getByRole('link').count()
    expect(initialCount).toBeGreaterThan(0)
    expect(initialCount).toBeLessThan(18)
    while (await more.isVisible()) await more.click()
    await expect(dialog.getByRole('link')).toHaveCount(18)
    const hrefs = await dialog.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')))
    expect(new Set(hrefs).size).toBe(18)
  })

  test('navigates to the original historical case study and closes the dialog', async ({ page }) => {
    await page.goto('/case-studies')
    await openSearch(page)
    const dialog = searchDialog(page)
    await searchInput(page).fill('Hombuzz')
    const historicalResult = dialog.locator('a[href="/case-studies/time2move"]')
    await expect(historicalResult).toBeVisible()
    await historicalResult.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/case-studies\/time2move$/)
    await expect(dialog).toBeHidden()
    const historicalWork = page.locator('main')
    await expect(historicalWork).toContainText('Past client project · Continued independently')
    await expect(historicalWork.getByRole('heading', { level: 1 })).toContainText('Time2Move')
    await expect(historicalWork.getByRole('link', { name: 'Current business website — Hombuzz' })).toHaveAttribute('href', 'https://hombuzz.com/')
  })

  test('keeps mobile search directly available and coordinates navigation menus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(searchTrigger(page)).toBeVisible()
    await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click()
    await expect(page.getByRole('navigation', { name: 'Mobile', exact: true })).toBeVisible()
    await openSearch(page)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Mobile', exact: true })).toBeHidden()
    await expect(searchTrigger(page)).toBeFocused()
    await expect(page.getByRole('button', { name: 'Open navigation menu', exact: true })).toBeVisible()

    await page.setViewportSize({ width: 1440, height: 900 })
    const researchMenu = page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('button', { name: 'Research navigation' })
    await researchMenu.click()
    await expect(researchMenu).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Control+k')
    await expect(searchDialog(page)).toBeVisible()
    await expect(page.locator('header button[aria-label="Research navigation"]')).toHaveAttribute('aria-expanded', 'false')
    await page.keyboard.press('Escape')
    await expect(searchDialog(page)).toBeHidden()
    await expect(researchMenu).toBeFocused()
  })

  test('reveals and focuses a closed experience disclosure on cross-route and same-route navigation', async ({ page }) => {
    for (const start of ['/', '/experience']) {
      await page.setViewportSize({ width: start === '/' ? 1440 : 390, height: 900 })
      await page.goto(start)
      const disclosure = page.locator('#experience-securian')
      if (start === '/experience') {
        await expect(disclosure).not.toHaveAttribute('open')
        await expect(disclosure.getByText('Authored and maintained Ansible playbooks for AWS server provisioning, configuration, and application deployment', { exact: true })).toBeHidden()
      }

      await openSearch(page)
      await searchInput(page).fill('Securian')
      const result = searchDialog(page).locator('a[href="/experience#experience-securian"]')
      await expect(result).toBeVisible()
      await result.click()
      await expect(page).toHaveURL(/\/experience#experience-securian$/)
      await expect(searchDialog(page)).toBeHidden()
      await expect(disclosure).toHaveAttribute('open', '')
      await expect(disclosure.getByText('Authored and maintained Ansible playbooks for AWS server provisioning, configuration, and application deployment', { exact: true })).toBeVisible()
      await expect(disclosure).toBeFocused()
      await expect.poll(() => disclosure.evaluate((element) => {
        const top = element.getBoundingClientRect().top
        const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
        return top >= headerBottom - 1 && top < window.innerHeight
      })).toBe(true)
    }
  })

  test('fits desktop and mobile headers and provides accessible light/dark dialogs', async ({ page }) => {
    await page.goto('/')
    for (const width of [320, 390, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(searchTrigger(page)).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), `${width}px header`).toBe(false)
    }
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme })
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: width === 390 ? 600 : 900 })
        await openSearch(page)
        await searchInput(page).fill('AWS')
        await expect(searchDialog(page).getByRole('link').first()).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false)
        const dialogBox = await searchDialog(page).boundingBox()
        expect(dialogBox).not.toBeNull()
        expect(dialogBox!.x).toBeGreaterThanOrEqual(0)
        expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(width + 1)
        expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(width === 390 ? 601 : 901)
        const audit = await new AxeBuilder({ page }).include('[role="dialog"]').analyze()
        const violations = audit.violations.filter(item => item.impact === 'critical' || item.impact === 'serious')
        expect(violations, `${colorScheme}, ${width}px`).toEqual([])
        await page.keyboard.press('Escape')
      }
    }
  })

  test('every indexed destination resolves and every section anchor exists visibly', async ({ page, request, baseURL }) => {
    const response = await request.get('/search-index.json')
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/json')
    const index: SearchIndex = await response.json()
    expect(index.records.length).toBeGreaterThan(0)
    const pages = new Map<string, Set<string>>()
    const pdfs = new Set<string>()
    const origin = new URL(baseURL!).origin

    for (const record of index.records) {
      const destination = new URL(record.href, origin)
      expect(destination.origin, record.title).toBe(origin)
      expect(destination.pathname, record.title).not.toMatch(/^\/(?:projects|blog|resume)(?:\/|$)/)
      const path = `${destination.pathname}${destination.search}`
      if (destination.pathname.endsWith('.pdf')) {
        pdfs.add(path)
        continue
      }
      const anchors = pages.get(path) ?? new Set<string>()
      if (destination.hash) anchors.add(decodeURIComponent(destination.hash.slice(1)))
      pages.set(path, anchors)
    }

    for (const pdf of pdfs) {
      const document = await request.get(pdf, { maxRedirects: 0 })
      expect(document.status(), pdf).toBe(200)
      expect(document.headers()['content-type'], pdf).toContain('application/pdf')
    }
    for (const [path, anchors] of pages) {
      const result = await page.goto(path)
      expect(result?.status(), path).toBe(200)
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
      for (const anchor of anchors) {
        // Public section IDs use plain identifiers, so no escaped or ambiguous selectors are needed.
        expect(anchor).toMatch(/^[a-zA-Z][\w-]*$/)
        const target = page.locator(`#${anchor}`)
        await expect(target, `${path}#${anchor}`).toHaveCount(1)
        await expect(target, `${path}#${anchor}`).toBeVisible()
      }
    }
  })
})
