// @vitest-environment happy-dom

import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import ResearchPage from '@/app/research/page'
import { primaryNavigation } from '@/data/profile'
import { resumeUrl } from '@/data/resumes'

vi.mock('next/navigation', () => ({ usePathname: () => '/research' }))

const expectedNavigation = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Research', href: '/research' },
  { label: 'Experience', href: '/experience' },
  { label: 'Contact', href: '/contact' },
]
const expectedResearch = [
  { label: 'Research Overview', href: '/research' },
  { label: 'Publications', href: '/research#publications' },
  { label: 'Research Profiles', href: '/research#research-profiles' },
  { label: 'Evidence Standards', href: '/approach/evidence' },
  { label: 'Writing', href: '/writing' },
]
const expectedExperience = [
  { label: 'Experience Overview', href: '/experience' },
  { label: 'Career Story', href: '/experience/career-story' },
  { label: 'Resume PDF', href: resumeUrl },
]
const expectedExplore = [
  ...expectedNavigation.slice(0, 5),
  { label: 'Writing', href: '/writing' },
  expectedNavigation[5],
  { label: 'Résumés & CV', href: '/resumes' },
]

function render(component: ReactNode) {
  return new DOMParser().parseFromString(renderToStaticMarkup(component), 'text/html')
}

function linksWithin(element: Element | null | undefined) {
  return Array.from(element?.querySelectorAll('a') ?? []).map((link) => ({
    label: link.textContent?.trim(),
    href: link.getAttribute('href'),
  }))
}

describe('navigation hierarchy', () => {
  test('preserves familiar top-level links and centralizes only the useful dropdown destinations', () => {
    expect(primaryNavigation.map(({ label, href }) => ({ label, href }))).toEqual(expectedNavigation)
    const research = primaryNavigation.find(({ label }) => label === 'Research')
    const experience = primaryNavigation.find(({ label }) => label === 'Experience')
    expect(research?.children?.map(({ label, href }) => ({ label, href }))).toEqual(expectedResearch)
    expect(experience?.children?.map(({ label, href }) => ({ label, href }))).toEqual(expectedExperience)
    expect(experience?.children?.find(({ label }) => label === 'Resume PDF')).toMatchObject({
      href: resumeUrl, external: true,
    })
    expect(primaryNavigation.filter(({ children }) => children?.length).map(({ label }) => label))
      .toEqual(['Research', 'Experience'])
    for (const links of [primaryNavigation, research?.children ?? [], experience?.children ?? []]) {
      expect(new Set(links.map(({ href }) => href)).size).toBe(links.length)
    }
  })

  test('retains explicit Home and brand links with collapsed semantic disclosure controls', () => {
    const page = render(<Header />)
    const header = page.querySelector('header')
    const primary = header?.querySelector('nav[aria-label="Primary"]')

    expect(linksWithin(primary)).toEqual(expectedNavigation)
    expect(header?.querySelectorAll('a[href="/"]')).toHaveLength(2)
    expect(header?.querySelector('a[href="/"]')?.textContent).toContain('David Braun')
    expect(header?.querySelector('a[href="/"]')?.textContent).toContain('AI Systems & Platform Engineer')
    expect(primary?.querySelector('[aria-current="page"]')?.textContent).toBe('Research')
    for (const label of ['Research', 'Experience']) {
      const button = primary?.querySelector(`button[aria-label="${label} navigation"]`)
      expect(button?.getAttribute('aria-expanded')).toBe('false')
      expect(button?.getAttribute('aria-controls')).toBe(`desktop-${label.toLowerCase()}-navigation`)
    }
    expect(primary?.querySelectorAll('button')).toHaveLength(2)
    expect(linksWithin(header).filter(({ label }) => label === 'Book a Call')).toEqual([
      { label: 'Book a Call', href: '/contact' },
    ])
    expect(header?.querySelector('button[aria-label*="theme"]')).not.toBeNull()
    expect(header?.querySelector('[role="menu"], [role="menuitem"]')).toBeNull()
  })

  test('keeps Explore, Connect and Research Profiles as independent footer areas', () => {
    const page = render(<Footer />)
    const headings = Array.from(page.querySelectorAll('footer h2'))
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Explore', 'Connect', 'Research Profiles',
    ])
    const [explore, connect, research] = headings.map((heading) => heading.parentElement)
    expect(linksWithin(explore)).toEqual(expectedExplore)
    expect(linksWithin(connect).map(({ label }) => label)).toEqual(['GitHub', 'LinkedIn'])
    expect(linksWithin(research).map(({ label }) => label)).toEqual([
      'ORCID', 'Google Scholar', 'IEEE DataPort', 'Scopus', 'Web of Science', 'ResearchGate', 'AGU',
    ])
    expect(connect?.contains(research)).toBe(false)
    expect(explore?.parentElement).toBe(connect?.parentElement)
    expect(research?.parentElement).toBe(connect?.parentElement)
    expect(connect?.parentElement?.children).toHaveLength(4)

    const links = Array.from(page.querySelectorAll('footer ul a'))
    const destinations = links.map((link) => link.getAttribute('href'))
    expect(new Set(destinations).size).toBe(destinations.length)
    for (const link of links) {
      const href = link.getAttribute('href') ?? ''
      if (href.startsWith('https://')) {
        expect(link.getAttribute('target')).toBe('_blank')
        expect(link.getAttribute('rel')?.split(/\s+/)).toEqual(
          expect.arrayContaining(['noopener', 'noreferrer'])
        )
      } else {
        expect(link.getAttribute('target')).toBeNull()
      }
    }
  })

  test('resolves research dropdown anchors to the intended existing sections', () => {
    const page = render(<ResearchPage />)
    expect(page.querySelectorAll('#publications')).toHaveLength(1)
    expect(page.querySelector('#publications h2')?.textContent).toBe('Peer-Reviewed Journal Article')
    expect(page.querySelectorAll('#research-profiles')).toHaveLength(1)
    expect(page.querySelector('#research-profiles h2')?.textContent).toBe('Research Profiles')
  })
})
