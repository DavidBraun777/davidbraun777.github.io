import { expect, test, type Page } from '@playwright/test'
import type { SearchIndex, SearchRecord } from '../src/lib/search/types'

const dialog = (page: Page) => page.getByRole('dialog', { name: 'Search the site', exact: true })
async function openSearch(page: Page, query: string) {
  await page.getByRole('button', { name: 'Search site', exact: true }).click()
  await dialog(page).getByRole('searchbox', { name: 'Search site content' }).fill(query)
}
async function targetReached(page: Page, record: SearchRecord) {
  const destination = record.destination!
  await expect(page).toHaveURL(new RegExp(`${destination.page}#${destination.anchor}$`))
  for (const id of destination.disclosureIds) await expect(page.locator(`[id="${id}"]`)).toHaveAttribute('open', '')
  const target = page.locator(`[id="${destination.anchor}"]`)
  await expect(target).toBeFocused()
  await expect(target).toHaveAttribute('data-content-active', '')
  await expect.poll(() => target.evaluate(element => {
    const box = element.getBoundingClientRect()
    const headerBottom = document.querySelector('body header')?.getBoundingClientRect().bottom ?? 0
    return box.top >= headerBottom && box.top < innerHeight && box.bottom <= innerHeight
  })).toBe(true)
  return target
}
async function rowRecord(page: Page, title: string) {
  const index: SearchIndex = await (await page.request.get('/search-index.json')).json()
  return index.records.find(record => record.title === title && record.granularity === 'row' && (record.cells?.length ?? 0) > 1)!
}
async function select(page: Page, query: string, record: SearchRecord) {
  await openSearch(page, query)
  const result = dialog(page).locator(`a[href="${record.href}"]`)
  await expect(result).toBeVisible()
  await result.focus()
  await page.keyboard.press('Enter')
  await expect(dialog(page)).toBeHidden()
  return targetReached(page, record)
}
async function closeLadder(page: Page, record: SearchRecord) {
  const disclosure = page.locator(`[id="${record.destination!.disclosureIds[0]}"]`)
  await disclosure.locator(':scope > summary').click()
  await expect(disclosure).not.toHaveAttribute('open')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

test.describe('precise search destinations', () => {
  test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })

  test('BM25 from another page reveals and focuses the actual comparison cell with one history entry', async ({ page }) => {
    await page.goto('/services')
    const record = await rowRecord(page, 'BM25')
    expect(record).toBeDefined()
    const historyLength = await page.evaluate(() => history.length)
    await openSearch(page, 'BM25')
    await expect(dialog(page).getByRole('list', { name: 'Search results' }).getByRole('link').first()).toHaveAttribute('href', record.href)
    await expect(dialog(page).locator(`a[href="${record.href}"]`)).toContainText(/RAGeATM/)
    await dialog(page).locator(`a[href="${record.href}"]`).click()
    const target = await targetReached(page, record)
    await expect(target).toHaveText('BM25')
    await expect(target.locator('..')).toContainText('Improved keyword relevance')
    expect(await page.evaluate(() => history.length)).toBe(historyLength + 1)
    await expect(page.getByRole('button', { name: 'Search site', exact: true })).not.toBeFocused()
  })

  test('same-page, another row, and repeated collapsed destination all reveal the selected content', async ({ page }) => {
    await page.goto('/case-studies/rageatm')
    const bm25 = await rowRecord(page, 'BM25')
    const embeddings = await rowRecord(page, 'Static embeddings')
    await select(page, 'RAGeATM BM25', bm25)
    await select(page, 'Static embeddings', embeddings)
    await closeLadder(page, embeddings)
    await select(page, 'Static embeddings', embeddings)
    await closeLadder(page, embeddings)
    await select(page, 'BM25', bm25)
  })

  test('copied URLs, refresh, back and forward reveal content without loading search', async ({ page, context }) => {
    await page.goto('/services')
    const bm25 = await rowRecord(page, 'BM25')
    const embeddings = await rowRecord(page, 'Static embeddings')
    const fresh = await context.newPage()
    let indexRequests = 0
    fresh.on('request', request => { if (new URL(request.url()).pathname === '/search-index.json') indexRequests++ })
    await fresh.goto(bm25.href)
    await targetReached(fresh, bm25)
    await fresh.reload()
    await targetReached(fresh, bm25)
    expect(indexRequests).toBe(0)
    await fresh.close()
    await select(page, 'BM25', bm25)
    await select(page, 'Static embeddings', embeddings)
    await page.goBack()
    await targetReached(page, bm25)
    await page.goBack()
    await expect(page).toHaveURL(/\/services$/)
    await page.goForward()
    await targetReached(page, bm25)
    await page.goForward()
    await targetReached(page, embeddings)
  })

  test('Escape restores the trigger; middle-click preserves real new-tab navigation', async ({ page, context }) => {
    await page.goto('/')
    await openSearch(page, 'BM25')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Search site', exact: true })).toBeFocused()
    const bm25 = await rowRecord(page, 'BM25')
    await openSearch(page, 'BM25')
    const popupPromise = context.waitForEvent('page')
    await dialog(page).locator(`a[href="${bm25.href}"]`).click({ button: 'middle' })
    const popup = await popupPromise
    await targetReached(popup, bm25)
    await expect(dialog(page)).toBeVisible()
    await popup.close()
  })

  test('mobile matches move within the table to the relevant cell without page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const bm25 = await rowRecord(page, 'BM25')
    await select(page, 'BM25', bm25)
    const weakness = bm25.cells!.find(cell => cell.text.includes('synonyms'))!
    const cellRecord = { ...bm25, href: `${weakness.destination.page}#${weakness.destination.anchor}`, destination: weakness.destination }
    const target = await select(page, 'RAGeATM synonyms paraphrases', cellRecord)
    await expect(target).toContainText('synonyms')
    await expect.poll(() => target.evaluate(element => {
      const box = element.getBoundingClientRect()
      return box.left >= 0 && box.right <= innerWidth
    })).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false)
    expect(await target.evaluate(element => element.closest('[data-content-table]')!.scrollLeft)).toBeGreaterThan(0)
  })

  test('a real article-body match focuses its rendered paragraph rather than the article heading', async ({ page }) => {
    await page.goto('/services')
    const index: SearchIndex = await (await page.request.get('/search-index.json')).json()
    const article = index.records.find(record => record.type === 'Article' && record.granularity === 'block' && record.body.includes('The hard part is choosing'))
      ?? index.records.find(record => record.type === 'Article' && record.granularity === 'block' && record.body.length > 80)
    expect(article).toBeDefined()
    const query = article!.body.split(/\s+/).slice(0, 8).join(' ')
    const target = await select(page, query, article!)
    expect(await target.evaluate(element => ['P', 'LI', 'BLOCKQUOTE'].includes(element.tagName))).toBe(true)
  })

  test('an obsolete child fragment falls back to its enclosing section and stops cleanly', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/case-studies/rageatm#content-retrieval-ladder--obsolete-row')
    const parent = page.locator('#content-retrieval-ladder')
    await expect(parent).toHaveAttribute('open', '')
    await expect(parent).toBeFocused()
    await expect(parent).toHaveAttribute('data-content-active', '')
    await page.goto('/services')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(errors).toEqual([])
  })
})
