// @vitest-environment happy-dom

import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'
import RootLayout from '@/app/layout'
import ResearchPage from '@/app/research/page'
import { Footer } from '@/components/layout/footer'
import { researchProfileLinks } from '@/data/research'
import { researchCv } from '@/data/resumes'
import { socialLinks } from '@/data/social-links'

vi.mock('next/font/local', () => ({ default: () => ({ variable: '' }) }))
vi.mock('@/providers/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('@/components/layout/header', () => ({ Header: () => null }))
vi.mock('@/components/layout/scroll-to-top', () => ({ ScrollToTop: () => null }))
vi.mock('@/components/analytics/google-analytics', () => ({ GoogleAnalytics: () => null }))

const expectedProfiles = [
  {
    name: 'ORCID',
    url: 'https://orcid.org/0009-0003-9821-8349',
    description: 'Researcher identifier',
  },
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?user=9CqMwqMAAAAJ&hl=en',
    description: 'Publications and citations',
  },
  {
    name: 'IEEE DataPort',
    url: 'https://ieee-dataport.org/authors/david-braun',
    description: 'Researcher profile on IEEE DataPort',
  },
  {
    name: 'Scopus',
    url: 'https://www.scopus.com/authid/detail.uri?authorId=57197365260',
    description: 'Author profile and citation index',
  },
  {
    name: 'Web of Science',
    url: 'https://www.webofscience.com/wos/author/record/QXI-2995-2026',
    description: 'Researcher profile and citation index',
  },
  {
    name: 'ResearchGate',
    url: 'https://www.researchgate.net/profile/David-Braun-5',
    description: 'Academic profile',
  },
  {
    name: 'AGU Profile',
    url: 'https://www.agu.org/user-profile?cstkey=BF392314-D7E6-40A7-ACDF-DC1318123068',
    description: 'Space-physics and AGU profile',
  },
]

function renderPage(page: ReactNode) {
  return new DOMParser().parseFromString(renderToStaticMarkup(page), 'text/html')
}

function expectExternalLink(link: Element) {
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')?.split(/\s+/)).toEqual(
    expect.arrayContaining(['noopener', 'noreferrer'])
  )
}

describe('research profile discovery', () => {
  test('keeps each verified URL once and groups research separately from professional profiles', () => {
    expect(socialLinks.filter(({ group }) => group === 'professional').map(({ name }) => name))
      .toEqual(['GitHub', 'LinkedIn'])
    expect(researchProfileLinks.map(({ name }) => name))
      .toEqual(expectedProfiles.map(({ name }) => name))

    for (const profile of expectedProfiles) {
      const matches = socialLinks.filter(({ url }) => url === profile.url)
      expect(matches).toHaveLength(1)
      expect(matches[0]).toMatchObject({ ...profile, group: 'research' })
      expect(researchProfileLinks).toContainEqual(expect.objectContaining(profile))
    }
    expect(new Set(socialLinks.map(({ name }) => name)).size).toBe(socialLinks.length)
    expect(new Set(socialLinks.map(({ url }) => url)).size).toBe(socialLinks.length)
  })

  test('places seven descriptive external cards after the publication evidence', () => {
    const page = renderPage(<ResearchPage />)
    const hero = page.querySelector('h1')?.closest('section')
    const profiles = page.querySelector('section[aria-labelledby="research-profiles-heading"]')
    const heroLinks = Array.from(hero?.querySelectorAll('a') ?? [])

    expect(heroLinks.map((link) => link.textContent?.trim())).toEqual([
      'Discuss Research',
      researchCv.href ? 'AI Research CV' : 'AI Research CV (available upon request)',
    ])
    expect(heroLinks[0]?.getAttribute('href')).toBe('/contact?type=research')
    expect(heroLinks[1]?.getAttribute('href')).toBe(researchCv.href ?? researchCv.requestHref)
    expect(hero?.nextElementSibling?.querySelector('h2')?.textContent).toBe('Research context')
    expect(profiles?.previousElementSibling?.querySelector('h2')?.textContent).toBe('Research and evidence standards')
    expect(profiles?.nextElementSibling).toBeNull()
    expect(profiles?.querySelector('h2')?.textContent).toBe('Research Profiles')
    expect(profiles?.textContent).toContain(
      'Persistent identifiers, citation indexes, and academic profiles associated with my research record.'
    )

    const cards = Array.from(profiles?.querySelectorAll('a') ?? [])
    expect(cards.map((card) => card.getAttribute('href')))
      .toEqual(expectedProfiles.map(({ url }) => url))
    for (const [index, card] of cards.entries()) {
      expect(card.textContent).toContain(expectedProfiles[index].name)
      expect(card.textContent).toContain(expectedProfiles[index].description)
      expect(card.querySelector('a, button')).toBeNull()
      expectExternalLink(card)
    }
  })

  test('links the footer to Research and keeps the external directory on that page', () => {
    const page = renderPage(<Footer />)
    expect(page.querySelector('a[href="/research"]')?.textContent).toBe('Research')
    const external = Array.from(page.querySelectorAll('footer a[target="_blank"]'))
    expect(external.map((link) => link.textContent?.trim())).toEqual(['GitHub', 'LinkedIn'])
    for (const link of external) expectExternalLink(link)
    for (const { url } of expectedProfiles) {
      expect(page.querySelector(`footer a[href="${url}"]`)).toBeNull()
    }
  })

  test('includes all profiles in the existing root Person schema and preserves identity relationships', () => {
    const page = renderPage(<RootLayout><ResearchPage /></RootLayout>)
    const schemas = Array.from(page.querySelectorAll('script[type="application/ld+json"]'))
      .map((script) => JSON.parse(script.textContent ?? '{}'))
    const people = schemas.filter((schema) => schema['@type'] === 'Person')

    expect(people).toHaveLength(1)
    expect(people[0].sameAs).toEqual(socialLinks.map(({ url }) => url))
    expect(people[0].sameAs).toEqual(expect.arrayContaining(expectedProfiles.map(({ url }) => url)))
    expect(new Set(people[0].sameAs).size).toBe(socialLinks.length)
    expect(people[0]).toMatchObject({
      jobTitle: 'AI Systems & Platform Engineer',
      alumniOf: [{ name: 'Augsburg University' }],
      affiliation: { name: 'University of St. Thomas' },
    })
  })

  test('renders without React key warnings or public profile-correction notices', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const page = renderPage(<RootLayout><ResearchPage /></RootLayout>)
      expect(page.body.textContent).not.toMatch(/pending correction|metadata corrections|incorrect author merge|must remain excluded/i)
      expect(errors.mock.calls.flat().join(' ')).not.toMatch(/unique.*key|same key/i)
    } finally {
      errors.mockRestore()
    }
  })
})
