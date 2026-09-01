import { test, expect, type Page } from '@playwright/test'

const keyBuyerRoutes = [
  '/',
  '/services',
  '/contact',
  '/case-studies',
  '/research',
  '/why-work-with-me',
  '/writing',
] as const

const orcidUrl = 'https://orcid.org/0009-0003-9821-8349'
const googleScholarUrl =
  'https://scholar.google.com/citations?user=9CqMwqMAAAAJ&hl=en'
const aguProfileUrl =
  'https://www.agu.org/user-profile?cstkey=BF392314-D7E6-40A7-ACDF-DC1318123068'
const credlyUrl =
  'https://www.credly.com/badges/9e9d0587-054e-44d4-9ab7-66bc451c85d2/public_url'
const previousPrimaryIdentity =
  'AI Systems Engineer · Full-Stack & Platform Engineer · Researcher'

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
    const canonicalDescription =
      'David Braun is an AI Systems / Platform Architect who takes AI and data capabilities into secure, deployable, measurable operational systems.'

    await expect(page).toHaveTitle('David Braun | AI Systems / Platform Architect')
    const main = page.locator('main')
    await expect(main).toBeVisible()
    await expect(
      main.getByRole('heading', {
        level: 1,
        name: 'AI Systems / Platform Architect',
        exact: true,
      })
    ).toBeVisible()
    await expect(
      main.getByText(previousPrimaryIdentity, { exact: true })
    ).toHaveCount(0)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      canonicalDescription
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'David Braun | AI Systems / Platform Architect'
    )
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      canonicalDescription
    )
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'David Braun | AI Systems / Platform Architect'
    )
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      canonicalDescription
    )
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/opengraph-image/
    )
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      /\/twitter-image/
    )
    await expect(
      main.getByRole('link', { name: 'For Employers & Partners', exact: true })
    ).toHaveAttribute('href', '/why-work-with-me')
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
    await expect(
      page.getByRole('heading', { name: 'How research informs systems work', exact: true })
    ).toBeVisible()
    await expect(
      page.getByText(/it is not presented as full machine translation/i).first()
    ).toBeVisible()

    const orcidLink = page.getByRole('link', { name: /view orcid record/i })
    await expect(orcidLink).toHaveAttribute('href', orcidUrl)
    await expect(orcidLink).toHaveAttribute('target', '_blank')

    const googleScholarLink = page.getByRole('link', {
      name: /view google scholar profile/i,
    })
    await expect(googleScholarLink).toHaveAttribute('href', googleScholarUrl)
    await expect(googleScholarLink).toHaveAttribute('target', '_blank')

    const aguLink = page.getByRole('link', { name: /view agu profile/i })
    await expect(aguLink).toHaveAttribute('href', aguProfileUrl)
    await expect(aguLink).toHaveAttribute('target', '_blank')

    const doiLink = page.getByRole('link', { name: /view doi record/i })
    await expect(doiLink).toHaveAttribute('href', 'https://doi.org/10.1029/2018JA025505')
    await expect(doiLink).toHaveAttribute('target', '_blank')

    for (const link of [orcidLink, googleScholarLink, aguLink, doiLink]) {
      const rel = await link.getAttribute('rel')
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    }

    const affiliationLinks = [
      {
        name: 'Visit Institute of Electrical and Electronics Engineers',
        href: 'https://www.ieee.org/',
      },
      {
        name: 'Visit Association for Computing Machinery',
        href: 'https://www.acm.org/',
      },
      {
        name: 'Visit Toastmasters International',
        href: 'https://www.toastmasters.org/',
      },
    ]

    for (const affiliation of affiliationLinks) {
      const link = page.getByRole('link', { name: affiliation.name, exact: true })
      await expect(link).toHaveAttribute('href', affiliation.href)
      await expect(link).toHaveAttribute('target', '_blank')
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
    await expect(
      footer.getByRole('link', { name: /^google scholar$/i })
    ).toHaveAttribute('href', googleScholarUrl)
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
    const website = records.find((record) => record['@type'] === 'WebSite')

    expect(person).toBeDefined()
    expect(person.jobTitle).toBeUndefined()
    expect(person.description).toBe(
      'I design the systems around AI and data, including applications, APIs, workflows, cloud infrastructure, security, evaluation, observability, and human handoff, so they can operate reliably in production.'
    )
    expect(person.sameAs).toEqual(
      expect.arrayContaining([
        'https://github.com/DavidBraun777',
        'https://linkedin.com/in/david-braun777',
        orcidUrl,
        googleScholarUrl,
        aguProfileUrl,
      ])
    )
    expect(person.knowsAbout).toEqual(
      expect.arrayContaining([
        'Software engineering',
        'AI systems architecture',
        'AI platform engineering',
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
    expect(website).toBeDefined()
    expect(website.description).toBe(
      'David Braun is an AI Systems / Platform Architect who takes AI and data capabilities into secure, deployable, measurable operational systems.'
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
    await expect(
      page.getByRole('link', { name: /view google scholar profile/i })
    ).toHaveAttribute('href', googleScholarUrl)
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
      page.getByText(
        'Turn AI and data capabilities into secure, deployable systems that hold up in production.',
        { exact: true }
      )
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

    for (const stage of [
      'Scientific and computational foundation',
      'Enterprise software systems',
      'Security and platform engineering',
      'End-to-end production ownership',
      'AI and data specialization',
    ]) {
      await expect(page.getByRole('heading', { name: stage, exact: true })).toBeVisible()
    }
    await expect(
      page.getByRole('heading', { name: 'Full-Time / Embedded', exact: true })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Consulting', exact: true })).toBeVisible()

    const currentWork = page.getByText('Current public work', { exact: true }).locator('..')
    await expect(currentWork).not.toContainText('time2move.io')
    await expect(
      currentWork.getByRole('link', { name: 'Visit arklandscaping.net', exact: true })
    ).toHaveAttribute('href', 'https://arklandscaping.net')
    await expect(
      page.getByText(
        /past client delivery has also included time2move\.io, which is currently paused/i
      )
    ).toBeVisible()

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
      await expect(page.getByText(previousPrimaryIdentity, { exact: true })).toHaveCount(0)
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
