// @vitest-environment happy-dom

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import CaseStudyDetailPage from '@/app/case-studies/[slug]/page'
import { allSystems } from '@/data/systems'
import { createProjectContent, projectContentRecords } from '@/lib/search/project-destinations'
import { assertUniqueDestinations } from '@/lib/search/destinations'

describe('case-study search destinations', () => {
  test('supports public proof and concise story sections, and rejects invalid target lookups', () => {
    const production = { ...allSystems[0], githubUrl: 'https://github.com/example/project', externalUrl: 'https://example.com/' }
    expect(projectContentRecords(production).find(record => record.title === 'Public Repository and Live Proof')).toBeDefined()
    const system = allSystems.find(item => item.id === 'time2move')!
    const content = createProjectContent(system)
    expect(content.records.some(record => record.title === 'Local form feedback capture')).toBe(false)
    expect(content.records.find(record => record.title === 'AI development and tool use')?.destination?.disclosureIds).toEqual([])
    expect(() => content.get('nonexistent-target')).toThrow('Missing project destination')
    expect(() => assertUniqueDestinations([{ page: '/example', anchor: 'invalid anchor', label: 'Example', disclosureIds: [] }])).toThrow('Invalid content anchor')
  })
  test('renders every indexed target once, with its declared disclosure ancestors', async () => {
    for (const system of allSystems) {
      const content = createProjectContent(system)
      const element = await CaseStudyDetailPage({ params: Promise.resolve({ slug: system.id }) })
      const page = document.createElement('div')
      page.innerHTML = renderToStaticMarkup(element)
      for (const destination of content.destinations) {
        const matches = page.querySelectorAll(`[id="${destination.anchor}"]`)
        expect(matches.length, `${system.id}: ${destination.anchor}`).toBe(1)
        const target = matches[0]
        expect(target.getAttribute('tabindex')).toBe('-1')
        expect(target.hasAttribute('data-content-target')).toBe(true)
        for (const id of destination.disclosureIds) {
          const details = page.querySelector(`details[id="${id}"]`)
          expect(details, `${destination.anchor} requires ${id}`).not.toBeNull()
          expect(details === target || details?.contains(target)).toBe(true)
        }
      }
    }
  })

  test('distinguishes BM25 tables and provides semantic header/cell destinations', async () => {
    const system = allSystems.find(item => item.id === 'rageatm')!
    const rows = projectContentRecords(system).filter(record => record.title === 'BM25')
    expect(rows).toHaveLength(2)
    expect(new Set(rows.map(record => record.href)).size).toBe(2)
    expect(rows.every(record => record.granularity === 'row')).toBe(true)
    expect(rows.every(record => record.context?.includes('RAGeATM'))).toBe(true)
    const page = document.createElement('div')
    page.innerHTML = renderToStaticMarkup(await CaseStudyDetailPage({ params: Promise.resolve({ slug: system.id }) }))
    for (const row of rows) {
      const header = page.querySelector(`[id="${row.destination!.anchor}"]`)
      expect(header?.tagName).toBe('TH')
      expect(header?.getAttribute('scope')).toBe('row')
      expect(header?.textContent).toBe('BM25')
      expect(header?.closest('[data-content-table]')).not.toBeNull()
      for (const cell of row.cells ?? []) {
        expect(cell.destination.anchor).not.toBe(row.destination!.anchor)
        expect(page.querySelector(`[id="${cell.destination.anchor}"]`)?.tagName).toBe('TD')
      }
    }
  })

  test('keeps repeated labels distinct and anchors stable when unrelated content is inserted', () => {
    const system = allSystems.find(item => item.id === 'time2move')!
    const story = system.story!
    const duplicateLabel = { id: 'another-capability', title: story.sections[0].title, paragraphs: ['Another independently described capability.'] }
    const extended = { ...system, story: { ...story, sections: [duplicateLabel, ...story.sections] } }
    const before = projectContentRecords(system)
    const after = projectContentRecords(extended)
    for (const record of before) {
      expect(after.find(item => item.id === record.id)?.href).toBe(record.href)
    }
    const repeated = after.filter(record => record.title === duplicateLabel.title)
    expect(repeated).toHaveLength(2)
    expect(repeated[0].href).not.toBe(repeated[1].href)
    expect(() => createProjectContent({ ...system, story: { ...story, sections: [...story.sections, story.sections[0]] } })).toThrow(/Duplicate project anchor/)
    expect(JSON.stringify(after)).not.toMatch(/\/Users\/|docs\/audits|technical-audit\.md|case-study-brief\.md/)
  })

  test('keeps ladder row and cell links stable when an earlier capability is inserted and levels renumbered', () => {
    const system = allSystems.find(item => item.id === 'rageatm')!
    const ladder = system.retrievalCapabilityLadder!
    const extended = {
      ...system,
      retrievalCapabilityLadder: {
        ...ladder,
        levels: [
          { ...ladder.levels[0], level: 1, systemType: 'A separate capability' },
          ...ladder.levels.map(level => ({ ...level, level: level.level + 1 })),
        ],
      },
    }
    const before = projectContentRecords(system).filter(record => record.granularity === 'row')
    const after = projectContentRecords(extended)
    for (const record of before) {
      const updated = after.find(item => item.id === record.id)
      expect(updated?.href).toBe(record.href)
      expect(updated?.cells?.map(cell => cell.destination)).toEqual(record.cells?.map(cell => cell.destination))
    }
  })

  test('requires and accepts an explicit semantic key for repeated ladder labels', () => {
    const system = allSystems.find(item => item.id === 'rageatm')!
    const ladder = system.retrievalCapabilityLadder!
    const repeated = { ...ladder.levels[0], level: 13 }
    const withLevels = (levels: typeof ladder.levels) => ({ ...system, retrievalCapabilityLadder: { ...ladder, levels } })
    expect(() => createProjectContent(withLevels([...ladder.levels, repeated]))).toThrow(/Duplicate project anchor/)
    const records = projectContentRecords(withLevels([...ladder.levels, { ...repeated, id: 'keyword-search-alternative' }]))
    const rows = records.filter(record => record.title === repeated.systemType && record.granularity === 'row')
    expect(rows).toHaveLength(2)
    expect(rows[0].href).not.toBe(rows[1].href)
  })
})
