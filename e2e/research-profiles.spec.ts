import { expect, test } from '@playwright/test'

test('research profile cards retain responsive layout and keyboard access in both themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' })
  await page.goto('/research')
  const profiles = page.getByRole('region', { name: 'Research Profiles' })
  const cards = profiles.getByRole('link')
  const names = ['ORCID', 'Google Scholar', 'Scopus', 'Web of Science', 'ResearchGate', 'AGU Profile']

  await expect(cards).toHaveCount(names.length)
  for (const name of names) {
    await expect(profiles.getByRole('link', { name: new RegExp(name) })).toBeVisible()
  }

  for (const dark of [false, true]) {
    if (dark) {
      await page.getByRole('button', { name: /switch to dark theme/i }).click()
      await expect(page.locator('html')).toHaveClass(/dark/)
    }
    for (const [width, columns] of [[390, 1], [768, 2], [1280, 3]]) {
      await page.setViewportSize({ width, height: 900 })
      const positions = await cards.evaluateAll((links) => links.map((link) => {
        const { x, y } = link.getBoundingClientRect()
        return { x: Math.round(x), y: Math.round(y) }
      }))
      expect(new Set(positions.map(({ x }) => x)).size).toBe(columns)
      expect(new Set(positions.map(({ y }) => y)).size).toBe(6 / columns)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    }

    await page.getByRole('link', { name: 'Discuss Research', exact: true }).focus()
    for (const card of await cards.all()) {
      await page.keyboard.press('Tab')
      await expect(card).toBeFocused()
      expect(await card.evaluate((element) => {
        const style = getComputedStyle(element)
        return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
          || style.boxShadow !== 'none'
      })).toBe(true)
    }
  }
})
