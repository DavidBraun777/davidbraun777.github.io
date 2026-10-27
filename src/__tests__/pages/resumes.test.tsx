// @vitest-environment happy-dom

import type { ReactNode } from 'react'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import ExperiencePage from '@/app/experience/page'
import Home from '@/app/page'
import ResearchPage from '@/app/research/page'
import ResumesPage, { metadata } from '@/app/resumes/page'
import sitemap from '@/app/sitemap'
import { Footer } from '@/components/layout/footer'
import { ResumeCard } from '@/components/site/resume-card'
import { industryResume, legacyResumeUrls, researchCv, resumeDocuments, resumeUrl } from '@/data/resumes'
import reviewedResumes from '../fixtures/reviewed-resumes.json'

const industryPath = '/resumes/David-J-Braun-Resume-Software-Platform-2026.pdf'
const researchPath = '/resumes/David-J-Braun-CV-AI-Research-2026.pdf'

function render(component: ReactNode) {
  return new DOMParser().parseFromString(renderToStaticMarkup(component), 'text/html')
}

function expectExternal(link: Element | null) {
  expect(link?.getAttribute('target')).toBe('_blank')
  expect(link?.getAttribute('rel')?.split(/\s+/)).toEqual(
    expect.arrayContaining(['noopener', 'noreferrer'])
  )
}

describe('résumé and CV directory', () => {
  test('keeps the industry default and both distinct documents in one registry', () => {
    expect(resumeDocuments).toEqual([industryResume, researchCv])
    expect(resumeDocuments.map(({ id }) => id)).toEqual(['software-platform', 'ai-research'])
    expect(resumeDocuments.map(({ title }) => title)).toEqual([
      'Software & Platform Engineering Résumé',
      'AI & Autonomous Systems Research CV',
    ])
    expect(industryResume.href).toBe(industryPath)
    expect(legacyResumeUrls).toEqual(['/resume.pdf', '/David-J-Braun-Resume-2026.pdf'])
    expect(resumeUrl).toBe(industryPath)
    expect([null, researchPath]).toContain(researchCv.href)
    expect(industryResume.kind).toBe('Résumé')
    expect(researchCv.kind).toBe('Research CV')
    expect(industryResume.requestHref).toBe('/contact?type=employment')
    expect(researchCv.requestHref).toBe('/contact?type=research')
  })

  test('publishes only the two reviewed PDFs without editable sources, staging files, or manuscripts', () => {
    const reviewedPaths = reviewedResumes.documents.map(({ href }) => href)
    expect(resumeDocuments.map(({ href }) => href)).toEqual(reviewedPaths)
    const publicFiles = readdirSync(resolve(process.cwd(), 'public'), { recursive: true, encoding: 'utf8' })
      .map((path) => `/${path.replace(/\\/g, '/')}`)
    expect(publicFiles.filter((path) => /\.pdf$/i.test(path)).sort()).toEqual([...reviewedPaths].sort())
    expect(publicFiles.filter((path) => /\.(?:docx?|odt|tex)$|staging|manuscript/i.test(path))).toEqual([])
  })

  // On 2026-10-27, pdfinfo and strict pypdf parsing confirmed two pages each;
  // extracted text and all rendered pages were reviewed before user clearance.
  // The hash pins those exact reviewed bytes rather than pretending to parse PDFs.
  test.each(reviewedResumes.documents)('preserves the reviewed $pages-page file $href', ({ href, sha256 }) => {
    const bytes = readFileSync(resolve(process.cwd(), 'public', href.slice(1)))
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(sha256)
  })

  test.each([
    { ...industryResume, href: industryPath },
    { ...researchCv, href: researchPath },
  ])('gives the published $id document separate view and download actions', (entry) => {
    const page = render(<ResumeCard document={entry} />)
    const card = page.querySelector('article')
    const heading = page.querySelector('h2')
    const links = Array.from(page.querySelectorAll('a'))

    expect(card?.getAttribute('aria-labelledby')).toBe(heading?.id)
    expect(heading?.textContent).toBe(entry.title)
    expect(card?.textContent).toContain(entry.description)
    expect(card?.textContent).toContain(entry.audience)
    expect(links).toHaveLength(2)
    const [view, download] = links
    expect(view.getAttribute('href')).toBe(entry.href)
    expect(view.textContent).toContain(entry.viewLabel)
    expect(view.textContent).toContain(entry.title)
    expect(view.textContent).toContain('opens in a new tab')
    expectExternal(view)
    expect(view.hasAttribute('download')).toBe(false)
    expect(download.getAttribute('href')).toBe(entry.href)
    expect(download.hasAttribute('download')).toBe(true)
    expect(download.getAttribute('target')).toBeNull()
    expect(download.textContent).toContain(entry.downloadLabel)
    expect(download.textContent).toContain(entry.title)
    expect(card?.textContent).not.toContain('available upon request')
  })

  test.each([
    { ...industryResume, href: null },
    { ...researchCv, href: null },
  ])('offers the correct request link without a PDF when $id is unavailable', (entry) => {
    const page = render(<ResumeCard document={entry} />)
    const links = Array.from(page.querySelectorAll('a'))

    expect(page.body.textContent).toContain(`${entry.kind} available upon request.`)
    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe(`Request ${entry.kind}`)
    expect(links[0].getAttribute('href')).toBe(entry.requestHref)
    expect(links[0].getAttribute('target')).toBeNull()
    expect(page.querySelector('a[download], a[href$=".pdf"]')).toBeNull()
  })

  test('renders exactly the two configured documents and their publication states', () => {
    const page = render(<ResumesPage />)
    const cards = Array.from(page.querySelectorAll('article'))

    expect(page.querySelectorAll('h1')).toHaveLength(1)
    expect(page.querySelector('h1')?.textContent).toBe('Résumés & CV')
    expect(cards).toHaveLength(2)
    for (const [index, entry] of resumeDocuments.entries()) {
      const card = cards[index]
      expect(card.querySelector('h2')?.textContent).toBe(entry.title)
      expect(Array.from(card.querySelectorAll('a')).map((link) => link.getAttribute('href')))
        .toEqual(entry.href ? [entry.href, entry.href] : [entry.requestHref])
      expect(card.querySelectorAll('a[download]')).toHaveLength(entry.href ? 1 : 0)
    }
  })

  test('uses the directory as its canonical metadata and sitemap destination', () => {
    expect(metadata.title).toBe('Résumés & CV')
    expect(metadata.alternates?.canonical).toBe('/resumes')
    expect(metadata.openGraph).toMatchObject({ url: '/resumes', type: 'website' })
    const urls = sitemap().map(({ url }) => url)
    expect(urls.filter((url) => url === 'https://dbraun.io/resumes')).toHaveLength(1)
    expect(urls).not.toContain('https://dbraun.io/resume')
    expect(urls.some((url) => url.endsWith('.pdf'))).toBe(false)
  })

  test('keeps direct industry access on Home and Experience and directory access in Experience and Footer', () => {
    for (const component of [<Home key="home" />, <ExperiencePage key="experience" />]) {
      const page = render(component)
      const pdfLinks = Array.from(page.querySelectorAll('a[href$=".pdf"]'))
      expect(pdfLinks.length).toBeGreaterThan(0)
      for (const link of pdfLinks) {
        expect(link.getAttribute('href')).toBe(resumeUrl)
        expectExternal(link)
      }
    }
    const experience = render(<ExperiencePage />)
    const versions = experience.querySelector('a[href="/resumes"]')
    expect(versions?.textContent).toBe('Other Résumé & CV Versions')
    expect(versions?.getAttribute('target')).toBeNull()
    const footer = render(<Footer />)
    const directory = footer.querySelector('a[href="/resumes"]')
    expect(directory?.textContent).toBe('Résumés & CV')
    expect(directory?.getAttribute('target')).toBeNull()
    expect(footer.querySelector('a[href$=".pdf"]')).toBeNull()
  })

  test.each([
    { state: 'published', href: researchPath },
    { state: 'available upon request', href: null },
  ])('directs Research to the CV when $state, never the industry document', ({ href }) => {
    const previousHref = researchCv.href
    try {
      researchCv.href = href
      const page = render(<ResearchPage />)
      const hero = page.querySelector('h1')?.closest('section')
      const links = Array.from(hero?.querySelectorAll('a') ?? [])
      const cvLink = links.find((link) => link.textContent?.startsWith('AI Research CV'))

      expect(cvLink).toBeDefined()
      expect(cvLink?.getAttribute('href')).toBe(href ?? '/contact?type=research')
      expect(links.some((link) => [industryPath, ...legacyResumeUrls].includes(link.getAttribute('href') ?? '')))
        .toBe(false)
      if (href) {
        expect(cvLink?.textContent).toBe('AI Research CV')
        expectExternal(cvLink ?? null)
      } else {
        expect(cvLink?.textContent).toBe('AI Research CV (available upon request)')
        expect(cvLink?.getAttribute('target')).toBeNull()
      }
    } finally {
      researchCv.href = previousHref
    }
  })
})
