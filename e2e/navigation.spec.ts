import { expect, test, type Locator, type Page } from '@playwright/test'

const researchLinks = [
  ['Research Overview', '/research'],
  ['Publications', '/research#publications'],
  ['Research Profiles', '/research#research-profiles'],
  ['Evidence Standards', '/approach/evidence'],
  ['Writing', '/writing'],
]
const experienceLabels = ['Experience Overview', 'Career Story', 'Resume PDF']

async function expectResearchLinks(list: Locator) {
  await expect(list.getByRole('link')).toHaveText(researchLinks.map(([label]) => label))
  for (const [label, href] of researchLinks) {
    await expect(list.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href)
  }
}

async function expectAnchorClearOfHeader(page: Page, id: string) {
  await expect.poll(() => page.evaluate((targetId) => {
    const target = document.getElementById(targetId)
    const header = document.querySelector('header')
    if (!target || !header) return false
    const top = target.getBoundingClientRect().top
    return top >= header.getBoundingClientRect().bottom - 1 && top < window.innerHeight
  }, id)).toBe(true)
}

test.describe('contextual header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('desktop dropdown supports hover across the popup gap, click and outside dismissal', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const primary = page.getByRole('navigation', { name: 'Primary', exact: true })
    const trigger = primary.getByRole('button', { name: 'Research navigation', exact: true })
    const list = primary.getByRole('list', { name: 'Research links', exact: true })

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await trigger.hover()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expectResearchLinks(list)
    const triggerBox = await trigger.boundingBox()
    const firstLink = list.getByRole('link').first()
    const linkBox = await firstLink.boundingBox()
    expect(triggerBox).not.toBeNull()
    expect(linkBox).not.toBeNull()
    if (!triggerBox || !linkBox) throw new Error('Dropdown geometry unavailable')
    await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height + 3)
    await expect(list).toBeVisible()
    await page.mouse.move(linkBox.x + linkBox.width / 2, linkBox.y + linkBox.height / 2, { steps: 5 })
    await expect(list).toBeVisible()

    await page.getByRole('heading', { level: 1 }).hover()
    await expect(list).toBeHidden()
    await trigger.click()
    await expect(list).toBeVisible()
    await page.getByRole('heading', { level: 1 }).click()
    await expect(list).toBeHidden()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await primary.getByRole('link', { name: 'Research', exact: true }).click()
    await expect(page).toHaveURL(/\/research$/)
    await primary.getByRole('link', { name: 'Experience', exact: true }).click()
    await expect(page).toHaveURL(/\/experience$/)
  })

  test('desktop keyboard navigation opens on focus, tabs through links and restores focus on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const primary = page.getByRole('navigation', { name: 'Primary', exact: true })
    const research = primary.getByRole('button', { name: 'Research navigation', exact: true })
    const researchList = primary.getByRole('list', { name: 'Research links', exact: true })

    await research.focus()
    await expect(researchList).toBeVisible()
    for (const [name] of researchLinks) {
      await page.keyboard.press('Tab')
      await expect(researchList.getByRole('link', { name, exact: true })).toBeFocused()
    }
    await page.keyboard.press('Tab')
    await expect(primary.getByRole('link', { name: 'Experience', exact: true })).toBeFocused()
    await expect(researchList).toBeHidden()

    await research.focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')
    await expect(researchList).toBeHidden()
    await expect(research).toBeFocused()
    await expect(research).toHaveAttribute('aria-expanded', 'false')

    const experience = primary.getByRole('button', { name: 'Experience navigation', exact: true })
    const experienceList = primary.getByRole('list', { name: 'Experience links', exact: true })
    await experience.focus()
    await expect(experienceList.getByRole('link')).toHaveText([
      'Experience Overview', 'Career Story', /^Resume PDF/,
    ])
    for (const name of experienceLabels) {
      await page.keyboard.press('Tab')
      await expect(experienceList.getByRole('link', { name: new RegExp(`^${name}`) })).toBeFocused()
    }
    const resume = experienceList.getByRole('link', { name: /^Resume PDF/ })
    await expect(resume).toHaveAttribute('target', '_blank')
    await expect(resume).toHaveAttribute('rel', 'noopener noreferrer')
    await page.keyboard.press('Tab')
    await expect(primary.getByRole('link', { name: 'Contact', exact: true })).toBeFocused()
    await expect(experienceList).toBeHidden()
  })

  test('mobile disclosures use taps and close after same-page anchors and a PDF selection', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/research')
    const mobile = page.getByRole('navigation', { name: 'Mobile', exact: true })
    const openMenu = () => page.getByRole('button', { name: 'Open navigation menu', exact: true }).click()
    const research = mobile.getByRole('button', { name: 'Research navigation', exact: true })
    const researchList = mobile.getByRole('list', { name: 'Research links', exact: true })

    await openMenu()
    await research.hover()
    await expect(research).toHaveAttribute('aria-expanded', 'false')
    await expect(research).toHaveAttribute('aria-controls', 'mobile-research-navigation')
    expect(await research.evaluate((button) => {
      const { width, height } = button.getBoundingClientRect()
      return width >= 44 && height >= 44
    })).toBe(true)
    await research.click()
    await expectResearchLinks(researchList)
    await research.click()
    await expect(researchList).toBeHidden()
    await research.click()
    await page.keyboard.press('Escape')
    await expect(researchList).toBeHidden()
    await expect(research).toBeFocused()
    await expect(mobile).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(mobile).toBeHidden()
    await expect(page.getByRole('button', { name: 'Open navigation menu', exact: true })).toBeFocused()

    for (const [name, id] of [
      ['Research Profiles', 'research-profiles'],
      ['Publications', 'publications'],
      ['Publications', 'publications'],
    ]) {
      if (!(await mobile.isVisible())) await openMenu()
      await research.click()
      await researchList.getByRole('link', { name, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`/research#${id}$`))
      await expect(mobile).toBeHidden()
      await expectAnchorClearOfHeader(page, id)
    }

    await openMenu()
    const experience = mobile.getByRole('button', { name: 'Experience navigation', exact: true })
    await experience.click()
    const experienceList = mobile.getByRole('list', { name: 'Experience links', exact: true })
    await expect(experienceList.getByRole('link')).toHaveText([
      'Experience Overview', 'Career Story', /^Resume PDF/,
    ])
    const resume = experienceList.getByRole('link', { name: /^Resume PDF/ })
    await expect(resume).toHaveAttribute('target', '_blank')
    await expect(resume).toHaveAttribute('rel', 'noopener noreferrer')
    const popupPromise = page.waitForEvent('popup')
    await resume.click()
    const popup = await popupPromise
    await expect(mobile).toBeHidden()
    await popup.close()
  })
})

test('footer columns stay independent, readable and keyboard accessible across themes and viewports', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' })
  await page.goto('/')
  const footer = page.locator('footer')
  const links = footer.getByRole('link')
  const brand = footer.getByRole('link', { name: 'David Braun', exact: true })

  await expect(footer.getByRole('heading')).toHaveText(['Explore', 'Connect', 'Research Profiles'])
  const hrefs = await footer.locator('ul a').evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))
  expect(new Set(hrefs).size).toBe(hrefs.length)

  for (const dark of [false, true]) {
    if (dark) {
      await page.getByRole('button', { name: /switch to dark theme/i }).click()
      await expect(page.locator('html')).toHaveClass(/dark/)
    }
    for (const [width, columns] of [[390, 1], [768, 2], [1280, 4]]) {
      await page.setViewportSize({ width, height: 900 })
      await expect.poll(() => footer.evaluate((element) => {
        const children = Array.from(element.firstElementChild?.children ?? [])
        const positions = children.map((column) => Math.round(column.getBoundingClientRect().x))
        return { viewportWidth: window.innerWidth, areas: children.length, columns: new Set(positions).size }
      })).toEqual({ viewportWidth: width, areas: 4, columns })
      if (columns === 4) {
        const headingRows = await footer.getByRole('heading').evaluateAll((headings) =>
          headings.map((heading) => Math.round(heading.getBoundingClientRect().y))
        )
        expect(new Set(headingRows).size).toBe(1)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
      expect(await links.evaluateAll((elements) => elements.every((element) => {
        const range = document.createRange()
        range.selectNodeContents(element)
        return new Set(Array.from(range.getClientRects()).map(({ y }) => Math.round(y))).size === 1
      }))).toBe(true)
    }

    await brand.focus()
    for (const link of (await links.all()).slice(1)) {
      await page.keyboard.press('Tab')
      await expect(link).toBeFocused()
      expect(await link.evaluate((element) => {
        const style = getComputedStyle(element)
        return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
          || style.boxShadow !== 'none'
      })).toBe(true)
    }
  }
})
