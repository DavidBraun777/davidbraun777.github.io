import { readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { resumeDocuments } from '../src/data/resumes'

const candidatePaths: Record<string, string> = {
  'software-platform': '/resumes/David-J-Braun-Resume-Software-Platform-2026.pdf',
  'ai-research': '/resumes/David-J-Braun-CV-AI-Research-2026.pdf',
}

test('directory offers requests for unpublished documents and downloads only published files', async ({ page, request }) => {
  await page.goto('/resumes')
  await expect(page.getByRole('heading', { level: 1, name: 'Résumés & CV', exact: true })).toBeVisible()
  await expect(page).toHaveTitle(/Résumés & CV/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://dbraun.io/resumes')
  await expect(page.locator('main article')).toHaveCount(2)

  for (const entry of resumeDocuments) {
    const card = page.getByRole('article', { name: entry.title, exact: true })
    await expect(card).toContainText(entry.description)
    await expect(card).toContainText(entry.audience)
    if (!entry.href) {
      await expect(card).toContainText(`${entry.kind} available upon request.`)
      const requestLink = card.getByRole('link', { name: `Request ${entry.kind}`, exact: true })
      await expect(requestLink).toHaveAttribute('href', entry.requestHref)
      await expect(requestLink).not.toHaveAttribute('target', '_blank')
      await expect(card.locator('a[download], a[href$=".pdf"]')).toHaveCount(0)
      const candidate = await request.get(candidatePaths[entry.id], { maxRedirects: 0 })
      expect(candidate.status(), `${entry.id} has not been published`).toBe(404)
      continue
    }

    expect(entry.href).toBe(candidatePaths[entry.id])
    const view = card.getByRole('link', { name: `${entry.viewLabel} : ${entry.title} (opens in a new tab)`, exact: true })
    const download = card.getByRole('link', { name: `${entry.downloadLabel} : ${entry.title}`, exact: true })
    await expect(view).toHaveAttribute('href', entry.href)
    await expect(view).toHaveAttribute('target', '_blank')
    await expect(view).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(download).toHaveAttribute('href', entry.href)
    await expect(download).toHaveAttribute('download', '')

    const source = await readFile(resolve(process.cwd(), 'public', entry.href.slice(1)))
    const response = await request.get(entry.href, { maxRedirects: 0 })
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
    const served = await response.body()
    expect(served.subarray(0, 5).toString('ascii')).toBe('%PDF-')
    expect(served).toEqual(source)

    const downloadEvent = page.waitForEvent('download')
    await download.click()
    const downloaded = await downloadEvent
    expect(await downloaded.failure()).toBeNull()
    expect(downloaded.suggestedFilename()).toBe(basename(entry.href))
    const downloadedPath = await downloaded.path()
    expect(downloadedPath).not.toBeNull()
    expect(await readFile(downloadedPath!)).toEqual(source)
  }
})

test('document cards stay accessible by keyboard on mobile and desktop in both themes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/resumes')
  const cards = page.locator('main article')
  const links = cards.getByRole('link')
  await expect(cards).toHaveCount(2)

  for (const dark of [false, true]) {
    if (dark) {
      await page.getByRole('button', { name: /switch to dark theme/i }).click()
      await expect(page.locator('html')).toHaveClass(/dark/)
    } else {
      await expect(page.locator('html')).not.toHaveClass(/dark/)
    }

    for (const width of [390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      await expect.poll(() => cards.evaluateAll((elements) => ({
        width: window.innerWidth,
        columns: new Set(elements.map((element) => Math.round(element.getBoundingClientRect().x))).size,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      }))).toEqual({ width, columns: width < 1024 ? 1 : 2, overflow: false })

      await links.first().focus()
      // Re-enter with the keyboard after pointer input such as the theme toggle.
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Tab')
      for (const [index, link] of (await links.all()).entries()) {
        if (index > 0) await page.keyboard.press('Tab')
        await expect(link).toBeFocused()
        await expect(link).toBeVisible()
        expect(await link.evaluate((element) => {
          const style = getComputedStyle(element)
          return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
            || style.boxShadow !== 'none'
        })).toBe(true)
      }

      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'),
        `${dark ? 'dark' : 'light'}, ${width}px`).toEqual([])
    }
  }
})
