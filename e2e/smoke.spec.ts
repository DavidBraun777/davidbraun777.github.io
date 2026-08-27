import { test, expect, type Page } from '@playwright/test'

const keyBuyerRoutes = [
  '/',
  '/contact',
  '/case-studies',
  '/research',
  '/why-work-with-me',
  '/writing',
] as const

const orcidUrl = 'https://orcid.org/0009-0003-9821-8349'
const aguProfileUrl =
  'https://www.agu.org/user-profile?cstkey=BF392314-D7E6-40A7-ACDF-DC1318123068'
const credlyUrl =
  'https://www.credly.com/badges/9e9d0587-054e-44d4-9ab7-66bc451c85d2/public_url'

function trackConsoleErrors(page: Page) {
  const errors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  return errors
}

test.describe('Smoke tests', () => {
  test('homepage loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/David Braun/)
    // Hero section should be visible
    await expect(page.locator('main')).toBeVisible()
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByRole('link', { name: /^home$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^services$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /case studies/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^research$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /why work with me/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^contact$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /projects/i })).toHaveCount(0)
  })

  test('services page loads', async ({ page }) => {
    await page.goto('/services')
    await expect(page).toHaveTitle(/Services/)
  })

  test('writing page loads', async ({ page }) => {
    await page.goto('/writing')
    await expect(page).toHaveTitle(/Writing/)
  })

  test('research page keeps accepted work distinct and exposes verified records', async ({ page }) => {
    await page.goto('/research')

    await expect(page).toHaveTitle(/Research/)
    await expect(
      page.getByRole('heading', {
        name: /research across artificial intelligence, language, and physical systems/i,
      })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /^accepted conference paper$/i })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /^peer-reviewed publications$/i })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: /^conference abstracts$/i })).toBeVisible()

    const orcidLink = page.getByRole('link', { name: /view orcid record/i })
    await expect(orcidLink).toHaveAttribute('href', orcidUrl)
    await expect(orcidLink).toHaveAttribute('target', '_blank')

    const aguLink = page.getByRole('link', { name: /view agu profile/i })
    await expect(aguLink).toHaveAttribute('href', aguProfileUrl)
    await expect(aguLink).toHaveAttribute('target', '_blank')

    const doiLink = page.getByRole('link', { name: /view doi record/i })
    await expect(doiLink).toHaveAttribute('href', 'https://doi.org/10.1029/2018JA025505')
    await expect(doiLink).toHaveAttribute('target', '_blank')

    for (const link of [orcidLink, aguLink, doiLink]) {
      const rel = await link.getAttribute('rel')
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    }
  })

  test('footer exposes research navigation and professional profiles', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')

    await expect(footer.getByRole('link', { name: /^research$/i })).toHaveAttribute(
      'href',
      '/research'
    )
    await expect(footer.getByRole('link', { name: /^orcid$/i })).toHaveAttribute(
      'href',
      orcidUrl
    )
    await expect(footer.getByRole('link', { name: /^agu profile$/i })).toHaveAttribute(
      'href',
      aguProfileUrl
    )
  })

  test('professional profile links populate Person structured data', async ({ page }) => {
    await page.goto('/')
    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const records = structuredData.map((content) => JSON.parse(content))
    const person = records.find((record) => record['@type'] === 'Person')

    expect(person).toBeDefined()
    expect(person.sameAs).toEqual(
      expect.arrayContaining([
        'https://github.com/DavidBraun777',
        'https://linkedin.com/in/david-braun777',
        orcidUrl,
        aguProfileUrl,
      ])
    )
    expect(person.knowsAbout).toEqual(
      expect.arrayContaining([
        'Software engineering',
        'Workflow automation',
        'Data engineering',
        'Information Retrieval',
        'Natural Language Processing',
        'Multimodal AI',
        'Low-Resource Languages',
        'Computational Linguistics',
        'Magnetospheric Physics',
        'Space Weather',
      ])
    )
  })

  test('research is available in the mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await page.getByRole('button', { name: /open navigation menu/i }).click()
    const mobileNavigation = page.getByRole('navigation', { name: 'Mobile' })
    const researchLink = mobileNavigation.getByRole('link', { name: /^research$/i })
    await expect(researchLink).toBeVisible()
    await expect(researchLink).toHaveAttribute('href', '/research')
    await researchLink.click()
    await expect(page).toHaveURL(/\/research$/)
    await expect(mobileNavigation).toHaveCount(0)
  })

  test('case studies page shows VIFG before secondary technical proof', async ({ page }) => {
    await page.goto('/case-studies')
    await expect(page.getByRole('heading', { name: /featured public production proof/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /vifg nonprofit platform/i }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /weatherforge/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /rageatm/i })).toBeVisible()

    const mainText = await page.locator('main').innerText()
    expect(mainText.indexOf('VIFG Nonprofit Platform')).toBeLessThan(
      mainText.indexOf('WeatherForge')
    )
  })

  test('homepage primary CTA goes to contact', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', {
        name: /remove manual work from the workflows that keep slowing your business down/i,
      })
    ).toBeVisible()
    await page.getByRole('link', { name: /^book a call$/i }).first().click()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('contact path is workflow-first', async ({ page }) => {
    await page.goto('/contact')
    await expect(
      page.getByRole('heading', { name: /tell me about the workflow you want to improve/i }).first()
    ).toBeVisible()
  })

  test('why work with me resume link points to the static PDF', async ({ page }) => {
    await page.goto('/why-work-with-me')

    const resumeLink = page.getByRole('link', { name: /open resume pdf in a new tab/i })
    await expect(resumeLink).toBeVisible()
    await expect(resumeLink).toHaveAttribute('href', '/resume.pdf')
    await expect(resumeLink).toHaveAttribute('target', '_blank')

    const rel = await resumeLink.getAttribute('rel')
    expect(rel).toContain('noopener')
    expect(rel).toContain('noreferrer')
  })

  test('why work with me shows corrected credential links and research path', async ({ page }) => {
    await page.goto('/why-work-with-me')

    await expect(
      page.getByRole('link', { name: /review research and publications/i })
    ).toHaveAttribute('href', '/research')
    await expect(page.getByRole('link', { name: /verify on credly/i })).toHaveAttribute(
      'href',
      credlyUrl
    )
    await expect(
      page.getByRole('link', { name: /view certificate program/i })
    ).toHaveAttribute(
      'href',
      'https://software.stthomas.edu/degree/certificates/data-engineering/index.html'
    )
    await expect(page.getByText(/target corporation/i).first()).toBeVisible()
  })

  test('sitemap includes research', async ({ request }) => {
    const response = await request.get('/sitemap.xml')

    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('<loc>https://dbraun.io/research</loc>')
  })

  test('resume PDF static asset is served', async ({ request }) => {
    const response = await request.get('/resume.pdf')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
  })

  test('legacy routes redirect to the new IA', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/writing$/)

    await page.goto('/background')
    await expect(page).toHaveURL(/\/why-work-with-me$/)

    await page.goto('/projects')
    await expect(page).toHaveURL(/\/case-studies$/)
  })

  test('CSP header is set', async ({ page }) => {
    const response = await page.goto('/')
    const csp = response?.headers()['content-security-policy']
    expect(csp).toBeDefined()
    expect(csp).toContain("script-src")
    expect(csp).toContain("'unsafe-inline'")
    expect(csp).toContain('https://www.googletagmanager.com')
    expect(csp).toContain('https://www.google.com')
  })

  test('security headers are present', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers() ?? {}
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['strict-transport-security']).toContain('max-age=')
  })

  test('404 page works', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })

  test('key buyer pages do not emit browser console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page)

    for (const route of keyBuyerRoutes) {
      await page.goto(route)
      await expect(page.locator('main')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    }

    expect(errors).toEqual([])
  })

  test('key buyer pages render on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    for (const route of keyBuyerRoutes) {
      await page.goto(route)
      await expect(page.locator('main')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      )
      expect(hasHorizontalOverflow).toBe(false)
    }
  })

  test('expanded navigation stays compact until the desktop layout has room', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/')

    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden()
    await expect(page.getByRole('button', { name: /open navigation menu/i })).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    )
    expect(hasHorizontalOverflow).toBe(false)

    await page.setViewportSize({ width: 1280, height: 768 })
    const primaryNavigation = page.getByRole('navigation', { name: 'Primary' })
    await expect(primaryNavigation).toBeVisible()

    const linkHeights = await primaryNavigation.locator('a').evaluateAll((links) =>
      links.map((link) => link.getBoundingClientRect().height)
    )
    expect(linkHeights.every((height) => height < 48)).toBe(true)
  })

  test('research page supports dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/research')

    await page.getByRole('button', { name: /switch to dark theme/i }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
