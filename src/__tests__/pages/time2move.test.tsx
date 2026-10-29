// @vitest-environment happy-dom

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import CaseStudiesPage from '@/app/case-studies/page'
import CaseStudyDetailPage, { generateMetadata, generateStaticParams } from '@/app/case-studies/[slug]/page'
import ExperiencePage from '@/app/experience/page'
import sitemap from '@/app/sitemap'
import { allSystems, featuredSystems, getSystemById, pilotSystems, productionSystems, researchSystems } from '@/data/systems'
import { buildSearchIndex } from '@/lib/search/build-index'
import { searchContent } from '@/lib/search/search'

const title = 'Time2Move: Real Estate Automation & AI Development'
const path = '/case-studies/time2move'
const status = 'Past client project · Engagement concluded'
const successorLabel = 'Current business website — Hombuzz'

function renderPage(element: React.ReactNode) {
  const container = document.createElement('div')
  container.innerHTML = renderToStaticMarkup(element)
  return container
}

const detailPage = (slug = 'time2move') => CaseStudyDetailPage({ params: Promise.resolve({ slug }) })

describe('Time2Move historical case study', () => {
  test('uses the shared registry without promoting historical work to current production proof', () => {
    const system = getSystemById('time2move')
    expect(system).not.toBeNull()
    expect(allSystems.filter(item => item.id === 'time2move')).toHaveLength(1)
    expect(system?.caseStudyStage).toBe('Historical')
    expect(system?.currentState).toBe(status)
    for (const collection of [featuredSystems, productionSystems, pilotSystems, researchSystems]) {
      expect(collection.some(item => item.id === 'time2move')).toBe(false)
    }
    expect(system?.externalUrl).toBeUndefined()
    expect(system?.githubUrl).toBeUndefined()
    expect(system?.successorLink?.href).toBe('https://hombuzz.com/')
    expect(system?.successorLink?.label).toBe(successorLabel)
    expect(system?.successorLink?.context).toMatch(/independent|subsequent/i)
  })

  test('generates canonical metadata, breadcrumbs, static params and sitemap through existing mechanisms', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'time2move' }) })
    expect(metadata.title).toBe(title)
    expect(metadata.alternates?.canonical).toBe(path)
    expect(metadata.openGraph?.title).toBe(title)
    expect(metadata.twitter?.title).toBe(title)
    expect(metadata.description).toContain('original Time2Move')
    expect(generateStaticParams()).toContainEqual({ slug: 'time2move' })
    expect(sitemap().filter(item => item.url === `https://dbraun.io${path}`)).toHaveLength(1)
    const page = renderPage(await detailPage())
    const breadcrumb = JSON.parse(page.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}')
    expect(breadcrumb.itemListElement.at(-1)).toMatchObject({ name: title, item: `https://dbraun.io${path}` })
  })

  test('presents the concise concluded engagement without public audit or failure artifacts', async () => {
    const page = renderPage(await detailPage())
    const text = page.textContent ?? ''
    expect(page.querySelector('h1')?.textContent).toBe(title)
    expect(text).toContain(status)
    expect(page.querySelector('#content-technical-details, #content-illustration, #content-scope, #content-workflows')).toBeNull()
    expect(text).not.toMatch(/Technical evidence|Local form feedback|Evidence and status|One engineering decision|515deb2|29 errors|12 warnings|simulated|Recorded local audit|paused/i)
    expect(page.querySelectorAll('a[href="https://hombuzz.com/"]')).toHaveLength(1)
    const headings = Array.from(page.querySelectorAll('h2, h3')).map(heading => heading.textContent)
    expect(headings).not.toContain('Live Proof')
    expect(headings).not.toContain('Quantified Outcomes')
    expect(text).not.toMatch(/screenshot placeholder|production verified|guaranteed reliable delivery|all checks passing/i)
    expect(page.querySelector('a[href*="time2move.io"]')).toBeNull()
  })

  test('makes the case study the primary historical card and experience destination with a contextual successor link', () => {
    const index = renderPage(<CaseStudiesPage />)
    const historical = index.querySelector('#past-client-work')
    expect(historical?.querySelectorAll(`a[href="${path}"]`)).toHaveLength(1)
    const successor = historical?.querySelector('a[href="https://hombuzz.com/"]')
    expect(successor?.textContent).toBe(successorLabel)
    expect(successor?.getAttribute('rel')).toBe('noopener noreferrer')
    expect(successor?.getAttribute('target')).toBe('_blank')
    expect(historical?.textContent).toMatch(/independent|subsequent/i)
    const experience = renderPage(<ExperiencePage />)
    expect(experience.querySelector(`a[href="${path}"]`)).not.toBeNull()
    expect((index.textContent ?? '').indexOf('VIFG Nonprofit Platform')).toBeLessThan((index.textContent ?? '').indexOf(title))
  })

  test('indexes only the public historical account and keeps original-project titles for successor searches', async () => {
    const { records } = await buildSearchIndex()
    const historical = records.find(record => record.href === path)
    expect(historical?.title).toBe(title)
    for (const query of ['Time2Move', 'CRM workflows', 'LLM review', 'regional housing-news', 'Hombuzz']) {
      const matches = searchContent(records, query).filter(result => result.record.href.split('#')[0] === path)
      expect(matches.length, query).toBeGreaterThan(0)
      for (const { record } of matches) {
        expect(record.destination?.label ?? record.title).toContain(title)
      }
    }
    const successor = searchContent(records, 'Hombuzz').find(result => result.record.href.split('#')[0] === path)
    expect(successor?.record.destination?.label ?? successor?.record.title).toContain(title)
    const page = renderPage(await detailPage())
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'time2move' }) })
    const publicOutput = `${page.innerHTML} ${JSON.stringify(records.filter(record => record.href.split('#')[0] === path))} ${JSON.stringify(metadata)}`
    expect(publicOutput).not.toMatch(/\/Users\/|prime-location-site|docs\/audits|technical-audit\.md|case-study-brief\.md|source-manifest\.json|\bE\d{2}\b|api\.vercel\.com\/v1\/integrations\/deploy/i)
    expect(publicOutput).not.toMatch(/Technical evidence|Local form feedback|Recorded local audit|515deb2|29 errors|12 warnings|time2move-contact-simulated-error|paused/i)
    expect(page.querySelector('#content-results')?.textContent).toMatch(/independent direction.*Hombuzz, outside/i)
    expect(page.querySelector('img[src*="simulated-error"]')).toBeNull()
  })

  test('retains the original live-proof behavior for existing production projects', async () => {
    const vifg = renderPage(await detailPage('vifg-nonprofit-platform'))
    expect(vifg.textContent).toContain('Live Proof')
    expect(vifg.querySelector('a[href="https://www.vifg.org/home"]')?.textContent).toBe('Visit Live Site')
    expect(vifg.textContent).not.toContain(successorLabel)
  })
})
