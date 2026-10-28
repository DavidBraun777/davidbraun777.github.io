// @vitest-environment happy-dom
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { allSystems as originalSystems } from '@/data/systems'
import type { Experience } from '@/data/experience'
import type { Education, Certification } from '@/data/education'

const dataModules = ['@/data/systems', '@/data/experience', '@/data/education', '@/data/research', '@/data/profile']
afterEach(() => { dataModules.forEach(path => vi.doUnmock(path)); vi.resetModules() })
const render = (node: ReactNode) => {
  const element = document.createElement('div')
  element.innerHTML = renderToStaticMarkup(node)
  return element
}
const base = originalSystems.find(system => system.id === 'rageatm')!

describe('optional portfolio content', () => {
  test('empty stage lists omit their headings and the production feature', async () => {
    vi.doMock('@/data/systems', () => ({ productionSystems: [], pilotSystems: [], researchSystems: [], historicalSystems: [] }))
    const { default: Page } = await import('@/app/case-studies/page')
    const page = render(<Page />)
    expect(page.querySelectorAll('article')).toHaveLength(0)
    expect(page.textContent).not.toContain('Featured public production proof')
    expect(page.textContent).toContain('Past client work')
  })

  test('case-study cards use semantic fallbacks and keep current-site links separate', async () => {
    const minimal = { ...base, contextLabel: undefined, externalUrl: undefined }
    vi.doMock('@/data/systems', () => ({
      productionSystems: [minimal],
      pilotSystems: [{ ...minimal, id: 'pilot-example', caseStudyStage: 'Pilot', externalUrl: 'https://example.com/live' }],
      researchSystems: [minimal, { ...minimal, id: 'applied', currentState: 'Applied dashboard prototype' }, { ...minimal, id: 'prototype', currentState: 'Prototype' }],
      historicalSystems: [{ ...minimal, id: 'past-example', caseStudyStage: 'Historical', displayTitle: undefined }],
    }))
    const { default: Page } = await import('@/app/case-studies/page')
    const page = render(<Page />)
    expect(page.querySelector('a[href="https://www.vifg.org/home"]')).not.toBeNull()
    expect(page.querySelector('a[href="https://example.com/live"]')?.textContent).toContain('Visit live site')
    expect(page.querySelector('#past-client-work h3')?.textContent).toBe(base.name)
  })

  test('a lone case study retains its title/image fallback and omits unrelated projects', async () => {
    const system = { ...base, id: 'standalone', displayTitle: undefined, image: '/images/example.png', imageAlt: undefined, visualSurface: 'light' }
    vi.doMock('@/data/systems', () => ({ allSystems: [system], getSystemById: (id: string) => id === system.id ? system : null }))
    const detail = await import('@/app/case-studies/[slug]/page')
    const page = render(await detail.default({ params: Promise.resolve({ slug: system.id }) }))
    expect(page.querySelector('h1')?.textContent).toBe(system.name)
    expect(page.querySelector('img')?.getAttribute('alt')).toBe(`${system.name} visual`)
    expect(page.textContent).not.toContain('Related Case Studies')
    expect((await detail.generateMetadata({ params: Promise.resolve({ slug: system.id }) })).title).toBe(system.name)
    expect(await detail.generateMetadata({ params: Promise.resolve({ slug: 'absent' }) })).toEqual({ title: 'Case Study Not Found' })
    await expect(detail.default({ params: Promise.resolve({ slug: 'absent' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/)
  })

  test('the homepage fails clearly if required production proof is missing from its data source', async () => {
    vi.doMock('@/data/systems', () => ({ getSystemById: () => null }))
    await expect(import('@/app/page')).rejects.toThrow('Missing selected homepage system: vifg-nonprofit-platform')
  })

  test('experience handles incomplete education dates, absent optional links and minimal roles honestly', async () => {
    const experiences: Experience[] = [{ id: 'role', company: 'Example', role: 'Engineer', department: 'Platform', location: 'Remote', startDate: '2020', endDate: null, description: 'A scoped role.', highlights: [] }]
    const education: Education[] = [
      { id: 'undated', institution: 'Example University', degree: 'Graduate study', field: 'Engineering', startDate: '2024', endDate: null },
      { id: 'secondary', institution: 'Example College', degree: 'BS', field: 'Computing', location: 'Minnesota', startDate: '2018', endDate: '2022', secondaryCredential: 'Certificate in Computing' },
      { id: 'ongoing-secondary', institution: 'Example School', degree: 'Study', field: 'Systems', startDate: '2025', endDate: null, secondaryCredential: 'Related certificate' },
    ]
    const certifications: Certification[] = [{ id: 'certificate', name: 'Certificate', issuer: 'Example', issueDate: '2023', badgeImage: '/badge.png' }]
    vi.doMock('@/data/experience', () => ({ experiences }))
    vi.doMock('@/data/education', () => ({ education, certifications }))
    const { default: Page } = await import('@/app/experience/page')
    const page = render(<Page />)
    expect(page.textContent).not.toContain('Current University of St. Thomas role')
    expect(page.querySelector('#experience-role')?.textContent).toContain('Platform · Remote')
    expect(page.querySelector('#experience-role ul')).toBeNull()
    expect(page.querySelector('#education-undated')?.textContent).toContain('2024 to Present')
    expect(page.querySelector('#education-secondary')?.textContent).toContain('2018 to 2022')
    expect(page.querySelector('#education-ongoing-secondary')?.textContent).toContain('2025 to Present')
    expect(page.querySelector('#certification-certificate a')).toBeNull()
    expect(page.querySelector('#certification-certificate')?.textContent).not.toContain('Expires')
  })

  test('accepted research without a public destination retains its status without fabricating a link', async () => {
    const actual = await vi.importActual<typeof import('@/data/research')>('@/data/research')
    vi.doMock('@/data/research', () => ({ ...actual, acceptedConferencePapers: actual.acceptedConferencePapers.map(paper => ({ ...paper, href: undefined })) }))
    const { default: Page } = await import('@/app/research/page')
    const page = render(<Page />)
    expect(page.textContent).toContain('Accepted Conference Paper')
    expect(page.textContent).not.toContain('Research status and project context')
  })

  test('services render their priced deliverables and optional scoping note', async () => {
    const { default: Page } = await import('@/app/services/page')
    const page = render(<Page />)
    expect(page.querySelectorAll('[id^="service-"]')).toHaveLength(3)
    expect(page.textContent).toContain('Substantial custom platforms or MVPs often begin')
    expect(page.querySelectorAll('a[href="/contact?type=consulting"]').length).toBeGreaterThan(0)
  })

  test('footer navigation distinguishes externally hosted document links from local pages', async () => {
    const actual = await vi.importActual<typeof import('@/data/profile')>('@/data/profile')
    vi.doMock('@/data/profile', () => ({ ...actual, primaryNavigation: [...actual.primaryNavigation, { label: 'External reference', href: 'https://example.com/reference', external: true }] }))
    const { Footer } = await import('@/components/layout/footer')
    const page = render(<Footer />)
    const link = page.querySelector('a[href="https://example.com/reference"]')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(page.querySelector('a[href="/contact"]')?.getAttribute('target')).toBeNull()
  })
})
