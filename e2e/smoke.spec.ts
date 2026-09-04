import { test, expect, type Page } from '@playwright/test'

const keyBuyerRoutes = [
  '/',
  '/services',
  '/contact',
  '/case-studies',
  '/research',
  '/experience',
  '/experience/career-story',
  '/approach/evidence',
  '/writing',
] as const

const orcidUrl = 'https://orcid.org/0009-0003-9821-8349'
const googleScholarUrl =
  'https://scholar.google.com/citations?user=9CqMwqMAAAAJ&hl=en'
const researchGateUrl = 'https://www.researchgate.net/profile/David-Braun-5'
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
      'David Braun is an AI Systems & Platform Engineer building secure, deployable applications, APIs, workflows, cloud infrastructure, and applied AI systems.'

    await expect(page).toHaveTitle('David Braun | AI Systems & Platform Engineer')
    const main = page.locator('main')
    await expect(main).toBeVisible()
    await expect(
      main.getByRole('heading', {
        level: 1,
        name: 'AI Systems & Platform Engineer',
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
      'David Braun | AI Systems & Platform Engineer'
    )
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      canonicalDescription
    )
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'David Braun | AI Systems & Platform Engineer'
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
      main.getByRole('link', { name: 'View Experience', exact: true })
    ).toHaveAttribute('href', '/experience')
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByRole('link', { name: /^home$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^services$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /case studies/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^research$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^experience$/i })).toBeVisible()
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
      page.getByRole('heading', { name: /^peer-reviewed journal article$/i })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: /^book chapters$/i })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /^conference abstracts$/i })).toBeVisible()
    await expect(
      page.getByText(/it is not presented as full machine translation/i).first()
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /how i label and verify technical work/i })
    ).toHaveAttribute('href', '/approach/evidence')
    await expect(
      page.getByRole('link', { name: /^discuss research$/i })
    ).toHaveAttribute('href', '/contact?type=research')

    const orcidLink = page.getByRole('link', { name: /view orcid record/i })
    await expect(orcidLink).toHaveAttribute('href', orcidUrl)
    await expect(orcidLink).toHaveAttribute('target', '_blank')

    const googleScholarLink = page.getByRole('link', {
      name: /view google scholar profile/i,
    })
    await expect(googleScholarLink).toHaveAttribute('href', googleScholarUrl)
    await expect(googleScholarLink).toHaveAttribute('target', '_blank')

    const researchGateLink = page.getByRole('link', {
      name: /view researchgate profile/i,
    })
    await expect(researchGateLink).toHaveAttribute('href', researchGateUrl)
    await expect(researchGateLink).toHaveAttribute('target', '_blank')

    await expect(page.getByRole('link', { name: /view scopus profile/i })).toHaveCount(0)
    await expect(page.locator('main')).not.toContainText('Scopus')

    const aguLink = page.getByRole('link', { name: /view agu profile/i })
    await expect(aguLink).toHaveAttribute('href', aguProfileUrl)
    await expect(aguLink).toHaveAttribute('target', '_blank')

    const jgrDoiLink = page.locator('a[href="https://doi.org/10.1029/2018JA025505"]')
    const reptArticleDoiLink = page.locator(
      'a[href="https://doi.org/10.1007/s11214-012-9950-9"]'
    )
    const reptChapterDoiLink = page.locator(
      'a[href="https://doi.org/10.1007/978-1-4899-7433-4_11"]'
    )

    await expect(jgrDoiLink).toHaveCount(1)
    await expect(reptArticleDoiLink).toHaveCount(0)
    await expect(reptChapterDoiLink).toHaveCount(0)

    const jgrArticle = page.locator('article').filter({ has: jgrDoiLink })
    await expect(jgrArticle).toContainText('Peer-reviewed journal article')
    await expect(jgrArticle).toContainText('D. J. Braun')
    await expect(jgrArticle).toContainText('Augsburg University')
    await expect(jgrArticle).toContainText(/REPT and MagEIS/i)
    await expect(jgrArticle).toContainText(/Van Allen Probes/i)

    const main = page.locator('main')
    await expect(
      page.locator('aside[aria-label="Author identity clarification"]')
    ).toHaveCount(0)
    await expect(main).not.toContainText('different researcher')
    await expect(main).not.toContainText('Laboratory for Atmospheric and Space Physics')
    await expect(main).not.toContainText('University of Colorado Boulder')

    await expect(jgrDoiLink).toHaveAttribute('target', '_blank')

    for (const link of [
      orcidLink,
      googleScholarLink,
      researchGateLink,
      aguLink,
      jgrDoiLink,
    ]) {
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
    await expect(footer.getByRole('link', { name: /^researchgate$/i })).toHaveAttribute(
      'href',
      researchGateUrl
    )
    await expect(footer.getByRole('link', { name: /^scopus$/i })).toHaveCount(0)
    await expect(footer.getByRole('link', { name: /^agu profile$/i })).toHaveAttribute(
      'href',
      aguProfileUrl
    )
    await expect(footer).toContainText(
      'And whatsoever ye do, do it heartily, as to the Lord, and not unto men;'
    )
    await expect(footer).toContainText('Colossians 3:23 (KJV)')
    await expect(footer).toContainText(
      'My faith shapes how I work: honest communication, clear commitments, stewardship, and respect for the people who have to live with the system after launch.'
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
    expect(person.jobTitle).toBe('AI Systems & Platform Engineer')
    expect(person.description).toBe(
      'I build the production systems around AI and data, including applications, APIs, workflows, cloud infrastructure, security, evaluation, observability, and operational handoff.'
    )
    expect(person.sameAs).toEqual(
      expect.arrayContaining([
        'https://github.com/DavidBraun777',
        'https://www.linkedin.com/in/david-braun777/',
        orcidUrl,
        googleScholarUrl,
        researchGateUrl,
        aguProfileUrl,
      ])
    )
    expect(person.sameAs).not.toEqual(
      expect.arrayContaining([expect.stringContaining('scopus.com')])
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
      'David Braun is an AI Systems & Platform Engineer building secure, deployable applications, APIs, workflows, cloud infrastructure, and applied AI systems.'
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

  test('WeatherForge credits the team and states the established implementation role', async ({
    page,
  }) => {
    await page.goto('/case-studies/weatherforge')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /David served as lead developer and primary implementer, writing more than 90% of the application code/i
    )

    const main = page.locator('main')
    await expect(main).toContainText(
      'WeatherForge originated as a collaborative University of St. Thomas SEIS 745 project with Odin Lee and Jannah ElNemr.'
    )
    await expect(main).toContainText(
      'David Braun served as the lead developer and primary implementer, writing more than 90% of the application code, while the project as a whole was completed collaboratively by the three-person team.'
    )
    await expect(main.getByText('Lead developer and primary implementer', { exact: true })).toBeVisible()
    await expect(
      main.getByRole('heading', { name: 'Solution / Implementation', exact: true })
    ).toBeVisible()
    await expect(main).toContainText(
      'I wrote more than 90% of the WeatherForge application code across its data pipeline, analytics, and dashboard layers.'
    )
    await expect(main).toContainText(
      'My implementation work included filtering, cleaning, transforming, and packaging NOAA Storm Events and GHCN-Daily data'
    )
    await expect(main).not.toContainText('Sole builder')
    await expect(main).not.toContainText('Co-developer on the three-person SEIS 745 project team')
    await expect(main).not.toContainText('Solution / Collaborative Build')
    await expect(main).not.toContainText('The three-person project team filtered')
  })

  test('homepage primary actions lead to work and the shared contact page', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByText(
        'Turn AI and data capabilities into secure, deployable systems that hold up in production.',
        { exact: true }
      )
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /^view work$/i })).toHaveAttribute(
      'href',
      '/case-studies'
    )
    await page.getByRole('link', { name: /^contact me$/i }).first().click()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('contact supports typed inquiry preselection without duplicating the form', async ({ page }) => {
    const expectedTypeLabels = [
      'Select one',
      'Employment / Engineering Role',
      'Consulting / Project',
      'Research Collaboration',
      'Speaking / Professional',
      'Other',
    ]

    await page.goto('/contact?type=employment')
    await expect(
      page.getByRole('heading', { name: /start a focused conversation/i })
    ).toBeVisible()

    const inquiryType = page.locator('#contact-inquiry-type')
    await expect(inquiryType).toHaveValue('employment')
    await expect(inquiryType.locator('option')).toHaveText(expectedTypeLabels)
    await expect(page.locator('#contact-inquiry-guidance')).toContainText(
      /company, role, employment type/i
    )
    await expect(page.locator('#contact-service')).toHaveCount(0)

    for (const type of ['consulting', 'research', 'speaking', 'other']) {
      await page.goto(`/contact?type=${type}`)
      await expect(page.locator('#contact-inquiry-type')).toHaveValue(type)
    }

    await expect(page.locator('#contact-service')).toHaveCount(0)
    await page.goto('/contact?type=consulting')
    await expect(page.locator('#contact-service')).toBeVisible()

    await page.goto('/contact?type=invalid')
    await expect(page.locator('#contact-inquiry-type')).toHaveValue('')
  })

  test('experience resume link points to the versioned PDF', async ({ page }) => {
    await page.goto('/experience')

    const resumeLink = page.getByRole('link', { name: /^view resume pdf$/i })
    await expect(resumeLink).toBeVisible()
    await expect(resumeLink).toHaveAttribute(
      'href',
      '/David-J-Braun-Resume-2026.pdf'
    )
    await expect(resumeLink).toHaveAttribute('target', '_blank')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://dbraun.io/experience'
    )

    const rel = await resumeLink.getAttribute('rel')
    expect(rel).toContain('noopener')
    expect(rel).toContain('noreferrer')
  })

  test('experience shows current role, chronology, credentials, and deeper paths', async ({ page }) => {
    await page.goto('/experience')

    await expect(page.getByRole('heading', { name: /^career highlights$/i })).toBeVisible()
    await expect(page.getByText('50+ repositories', { exact: true })).toBeVisible()
    await expect(page.getByText('Approximately 40%', { exact: true })).toBeVisible()
    const securianPanel = page.locator('details').filter({
      has: page.getByRole('heading', {
        name: 'Infrastructure Engineer · Securian Financial',
      }),
    })
    await expect(securianPanel).toContainText('October 2022 to March 2024')

    const augsburgCard = page.locator('article').filter({
      has: page.getByRole('heading', {
        name: 'Bachelor of Science (B.S.) in Mathematics, Physics, and Computer Science',
      }),
    })
    await expect(augsburgCard).toContainText('2014 to 2020')
    await expect(
      page.getByRole('link', { name: /^discuss a role$/i }).first()
    ).toHaveAttribute('href', '/contact?type=employment')
    await expect(
      page.getByRole('link', { name: /read the full career through-line/i })
    ).toHaveAttribute('href', '/experience/career-story')

    const ustRole = page
      .getByRole('heading', {
        name: 'Graduate Tutor / Computer Systems Support',
        exact: true,
      })
      .locator('xpath=ancestor::article')
    await expect(ustRole).toContainText('University of St. Thomas')
    await expect(ustRole).toContainText('December 2025 to Present')
    await expect(ustRole).toContainText(
      'Department of Software Engineering and Data Science · Saint Paul, Minnesota'
    )

    const ustEducation = page
      .getByRole('heading', {
        name: 'Master of Science in Artificial Intelligence',
        exact: true,
      })
      .locator('xpath=ancestor::article')
    await expect(ustEducation).toContainText(
      'Department of Software Engineering and Data Science · Saint Paul, Minnesota'
    )
    await expect(
      page.getByText('Graduate Certificate in Big Data', { exact: true })
    ).toBeVisible()
    await expect(
      ustEducation.getByText('September 2024 to expected December 2026')
    ).toHaveCount(2)
    await expect(
      ustEducation.getByText(
        'The university is transitioning this program to the Data Engineering name.',
        { exact: true }
      )
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /verify on credly/i })).toHaveAttribute(
      'href',
      credlyUrl
    )
    await expect(
      page.getByRole('link', { name: /view current certificate program/i })
    ).toHaveAttribute(
      'href',
      'https://software.stthomas.edu/degree/certificates/data-engineering/index.html'
    )
    await expect(page.getByText(/target corporation/i).first()).toBeVisible()
  })

  test('career story preserves the five-chapter narrative off the primary navigation', async ({ page }) => {
    await page.goto('/experience/career-story')

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
      page.getByRole('heading', { name: 'Engineering roles', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Consulting engagements', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /how i label and verify technical work/i })
    ).toHaveAttribute('href', '/approach/evidence')
  })

  test('services exposes three scoped offers and the planning disclaimer', async ({ page }) => {
    await page.goto('/services')

    for (const offer of [
      'Architecture & Workflow Review',
      'Scoped System / Automation Build',
      'Ongoing Platform Stewardship',
    ]) {
      await expect(page.getByRole('heading', { name: offer, exact: true })).toBeVisible()
    }
    await expect(page.getByText('$1,500–$3,000', { exact: true })).toBeVisible()
    await expect(page.getByText('$5,000–$25,000+', { exact: true })).toBeVisible()
    await expect(page.getByText('$750–$3,000+/month', { exact: true })).toBeVisible()
    await expect(
      page.getByText(
        'Every engagement is scoped individually. These ranges are planning guides, not fixed quotes. Final pricing depends on scope, integrations, data quality, security requirements, urgency, and ongoing support. Fixed-price, milestone, hourly, and retainer arrangements may be used depending on the project.',
        { exact: true }
      )
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /^discuss a project$/i }).first()
    ).toHaveAttribute('href', '/contact?type=consulting')
  })

  test('evidence standards holds maturity, research, and quality policy', async ({ page }) => {
    await page.goto('/approach/evidence')

    await expect(
      page.getByRole('heading', { name: 'Engineering & Evidence Standards', exact: true })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: /^maturity labels$/i })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /ai-assisted engineering and human review/i })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: /^quality evidence$/i })).toBeVisible()
    await expect(page.getByText(/acceptance is meaningful/i)).toBeVisible()
  })

  test('sitemap contains canonical IA and omits the retired route', async ({ request }) => {
    const response = await request.get('/sitemap.xml')

    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('<loc>https://dbraun.io/research</loc>')
    expect(body).toContain('<loc>https://dbraun.io/experience</loc>')
    expect(body).toContain('<loc>https://dbraun.io/experience/career-story</loc>')
    expect(body).toContain('<loc>https://dbraun.io/approach/evidence</loc>')
    expect(body).not.toContain('<loc>https://dbraun.io/why-work-with-me</loc>')
  })

  test('versioned resume is served and legacy PDF URLs redirect permanently', async ({
    request,
  }) => {
    const response = await request.get('/David-J-Braun-Resume-2026.pdf')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')

    for (const legacyPath of ['/resume.pdf', '/Resume.pdf']) {
      const redirect = await request.get(legacyPath, { maxRedirects: 0 })
      expect(redirect.status()).toBe(308)
      expect(
        new URL(redirect.headers().location, 'http://localhost:3000').pathname
      ).toBe('/David-J-Braun-Resume-2026.pdf')
    }
  })

  test('legacy routes redirect directly to the new IA', async ({ page, request }) => {
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/writing$/)

    for (const alias of ['/about', '/background', '/resume', '/why-work-with-me']) {
      const response = await request.get(alias, { maxRedirects: 0 })
      expect(response.status()).toBe(308)
      expect(response.headers().location).toMatch(/\/experience$/)
    }

    await page.goto('/why-work-with-me')
    await expect(page).toHaveURL(/\/experience$/)

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

  test('rendered internal links resolve and external URLs are syntactically valid', async ({
    page,
    request,
  }) => {
    const internalLinks = new Set<string>()
    const obsoleteInternalPaths = new Set([
      '/about',
      '/background',
      '/resume',
      '/resume.pdf',
      '/why-work-with-me',
    ])

    for (const route of keyBuyerRoutes) {
      await page.goto(route)
      const hrefs = await page.locator('a[href]').evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')).filter(Boolean) as string[]
      )

      for (const href of hrefs) {
        if (/^https?:\/\//i.test(href)) {
          const url = new URL(href)
          expect(['http:', 'https:']).toContain(url.protocol)
          expect(url.hostname.length).toBeGreaterThan(0)
          continue
        }

        if (href.startsWith('/')) {
          const url = new URL(href, 'https://dbraun.io')
          expect(obsoleteInternalPaths.has(url.pathname)).toBe(false)
          internalLinks.add(`${url.pathname}${url.search}`)
        }
      }
    }

    for (const href of internalLinks) {
      const response = await request.get(href)
      expect(response.status(), `${href} should resolve`).toBeLessThan(400)
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
