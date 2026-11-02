// @vitest-environment happy-dom

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import CaseStudyDetailPage from '@/app/case-studies/[slug]/page'
import { getSystemById, type ProofSection } from '@/data/systems'
import { projectSearchRecord } from '@/lib/search/build-index'
import { createProjectContent } from '@/lib/search/project-destinations'

async function renderPage(slug: string) {
  const page = document.createElement('div')
  page.innerHTML = renderToStaticMarkup(await CaseStudyDetailPage({ params: Promise.resolve({ slug }) }))
  return page
}

describe('case-study evidence boundaries', () => {
  test('describes RAG retrieval tradeoffs without invented capability scores or a universal ladder', async () => {
    const page = await renderPage('rageatm')
    const comparison = page.querySelector('#content-retrieval-ladder')!
    expect(comparison.textContent).toContain('RAGeATM implements TF-IDF')
    expect(comparison.textContent).toContain('not implemented features or a universal ranking')
    expect(comparison.textContent).not.toMatch(/\d\s*%|human\s+reason|capability ladder/i)
    expect(comparison.querySelectorAll('thead th')).toHaveLength(4)
    expect(page.textContent).toContain('The 7/7 result is a sanity benchmark, not broad accuracy.')
    expect(page.querySelector('a[href="https://github.com/DavidBraun777/RAGeATM/blob/master/docs/evaluation_results.md"]')).not.toBeNull()

    const system = getSystemById('rageatm')!
    const indexed = JSON.stringify([projectSearchRecord(system), ...createProjectContent(system).records])
    expect(indexed).not.toMatch(/\d\s*%|human\s+reason|meaningCaptured|personalContextAbility/)
  })

  test.each(['weatherforge', 'dealerflow', 'vifg-nonprofit-platform'])(
    '%s publishes available evidence without screenshot placeholders or editorial tasks',
    async slug => {
      const page = await renderPage(slug)
      expect(page.textContent).not.toMatch(/screenshot placeholder|to be added|still needs|believable flagship|strongest current evidence|add polished screenshot/i)
      const evidence = page.querySelector('#content-proof')!
      expect(evidence).not.toBeNull()
      expect(evidence.querySelectorAll('a[href]').length).toBeGreaterThan(0)
      expect(evidence.textContent).not.toContain('Planned')
    },
  )

  test('retains actual visuals, project stages, and the academic collaborators', async () => {
    const dealerflow = await renderPage('dealerflow')
    expect(dealerflow.querySelector('img[alt="DealerFlow mobile feed showing newly published wholesale inventory."]')).not.toBeNull()
    expect(dealerflow.textContent).toContain('Beta Pilot')
    const vifg = await renderPage('vifg-nonprofit-platform')
    expect(vifg.querySelector('img[src*="vifg-deployment.svg"]')).not.toBeNull()
    expect(vifg.querySelector('a[href="https://www.vifg.org/home"]')).not.toBeNull()
    const weatherforge = await renderPage('weatherforge')
    expect(weatherforge.textContent).toContain('Prototype / Academic Project')
    expect(weatherforge.textContent).toContain('Odin Lee and Jannah ElNemr')
    expect(weatherforge.querySelector('a[href="https://github.com/DavidBraun777/WeatherForge/blob/master/docs/dashboard-guide.md"]')).not.toBeNull()
    expect(weatherforge.querySelector('a[href="https://github.com/DavidBraun777/WeatherForge/blob/master/docs/data-pipeline.md"]')).not.toBeNull()
  })

  test('excludes planned evidence from both detailed search targets and page-level search text', () => {
    const planned: ProofSection = {
      id: 'artifacts',
      title: 'unpublished-title-sentinel',
      summary: 'unpublished-summary-sentinel',
      items: ['unpublished-item-sentinel'],
      status: 'planned',
      links: [{ label: 'unpublished-link-sentinel', href: 'https://example.com/' }],
    }
    const base = getSystemById('dealerflow')!
    const system = { ...base, proofSections: [...base.proofSections, planned] }
    const content = createProjectContent(system)
    expect(JSON.stringify([projectSearchRecord(system), content.records, content.destinations])).not.toContain('sentinel')
    expect(() => content.get('proof', planned.id)).toThrow('Missing project destination')
  })
})
