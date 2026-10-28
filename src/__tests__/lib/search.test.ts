import { describe, expect, it } from 'vitest'
import { normalizeSearchText, SEARCH_QUERY_LIMIT, searchContent, searchWords } from '@/lib/search/search'
import type { SearchRecord } from '@/lib/search/types'
import { destinationHref, type ContentDestination } from '@/lib/search/destinations'

function record(id: string, fields: Partial<SearchRecord> = {}): SearchRecord {
  return {
    id, title: id, href: `/case-studies/${id}`, type: 'Project',
    description: '', tags: [], headings: [], body: '', ...fields,
  }
}

function block(id: string, fields: Partial<SearchRecord> = {}): SearchRecord {
  const destination: ContentDestination = {
    page: '/case-studies/rageatm', anchor: `content-${id}`, label: fields.title ?? id,
    disclosureIds: ['content-retrieval-ladder'],
  }
  return record(id, { granularity: 'block', destination, href: destinationHref(destination), context: 'RAGeATM Retrieval capability ladder', ...fields })
}

const comparison = block('bm25', {
  title: 'BM25', granularity: 'row',
  body: 'Keyword relevance. Fatal weakness: No deep semantics. Best use case: Search engines.',
  cells: [
    { text: 'Fatal weakness: No deep semantics.', destination: { page: '/case-studies/rageatm', anchor: 'content-bm25-weakness', label: 'BM25: Fatal weakness', disclosureIds: ['content-retrieval-ladder'] } },
    { text: 'Best use case: Search engines.', destination: { page: '/case-studies/rageatm', anchor: 'content-bm25-use', label: 'BM25: Best use case', disclosureIds: ['content-retrieval-ladder'] } },
  ],
})

describe('local content search', () => {
  it('ranks exact titles, title phrases, title words, metadata, then body mentions', () => {
    const records = [
      record('body', { body: 'VIFG platform '.repeat(30) }),
      record('metadata', { tags: ['VIFG platform'] }),
      record('words', { title: 'Platform delivery for VIFG' }),
      record('phrase', { title: 'The VIFG platform case study' }),
      record('exact', { title: 'VIFG platform' }),
    ]
    expect(searchContent(records, 'VIFG platform').map(({ record }) => record.id))
      .toEqual(['exact', 'phrase', 'words', 'metadata', 'body'])
  })

  it('requires each distinct query term so weak partial matches cannot overwhelm the list', () => {
    const records = [
      record('title-only', { title: 'VIFG' }),
      record('complete', { title: 'VIFG platform', tags: ['AWS'], body: 'Docker deployment' }),
      record('aws-only', { title: 'AWS' }),
    ]
    expect(searchContent(records, 'VIFG AWS Docker').map(({ record }) => record.id)).toEqual(['complete'])
    expect(searchContent(records, 'VIFG AWS AWS')).toEqual(searchContent(records, 'VIFG AWS'))
    expect(searchContent(records, 'VIFG nonexistent')).toEqual([])
  })

  it('breaks title-phrase ties in favor of the named destination at the start of a title', () => {
    const records = [
      record('board-service', { title: 'Treasurer · VIFG Nonprofit' }),
      record('vifg', { title: 'VIFG Nonprofit Platform' }),
    ]
    expect(searchContent(records, 'VIFG').map(({ record }) => record.id)).toEqual(['vifg', 'board-service'])
  })

  it('normalizes accents, case and whitespace while keeping technology punctuation', () => {
    expect(normalizeSearchText('  RÉSUMÉ\n Information  ')).toBe('resume information')
    expect(searchWords('.NET C++ C# Next.js, RAG/AWS; AI & ML')).toEqual(['.net', 'c++', 'c#', 'next.js', 'rag', 'aws', 'ai', 'ml'])
    const records = [record('resumes', { title: 'Résumés & CV', href: '/resumes' })]
    expect(searchContent(records, 'resume')).toEqual(searchContent(records, ' RÉSUMÉ '))
  })

  it('keeps short queries precise and permits useful word prefixes', () => {
    const records = [
      record('unrelated', { title: 'Daily maintenance', body: 'A fragment of a trail.' }),
      record('ai', { title: 'AI systems', tags: ['Machine Learning'] }),
      record('rag', { title: 'RAGeATM' }),
      record('cpp', { tags: ['C++', '.NET', 'Next.js', 'AWS'] }),
    ]
    expect(searchContent(records, 'AI').map(({ record }) => record.id)).toEqual(['ai'])
    expect(searchContent(records, 'ML').map(({ record }) => record.id)).toEqual(['ai'])
    expect(searchContent(records, 'RAG').map(({ record }) => record.id)).toEqual(['rag'])
    expect(searchContent(records, 'sys').map(({ record }) => record.id)).toEqual(['ai'])
    for (const term of ['C++', '.NET', 'Next.js', 'AWS']) {
      expect(searchContent(records, term).map(({ record }) => record.id)).toEqual(['cpp'])
    }
    expect(searchContent([record('c', { tags: ['C'] })], 'C++')).toEqual([])
  })

  it('supports explicit public aliases and deduplicates equivalent destinations', () => {
    const records = [
      record('writing', { title: 'Writing', href: '/writing', type: 'Page', tags: ['blog', 'articles'] }),
      record('duplicate', { title: 'Blog overview', href: '/writing', type: 'Page' }),
      record('case-studies', { title: 'Case Studies', href: '/case-studies', type: 'Page', tags: ['projects'] }),
    ]
    expect(searchContent(records, 'blog').map(({ record }) => record.href)).toEqual(['/writing'])
    expect(searchContent(records, 'projects')[0].record.href).toBe('/case-studies')
  })

  it('returns an intelligible contextual snippet for a phrase found only in article body text', () => {
    const article = record('article', {
      title: 'Workflow design', type: 'Article', href: '/writing/workflow-design',
      description: 'A guide to operational software.',
      body: `${'Introductory context. '.repeat(20)}Use a queue because work arrives unevenly. ${'Additional detail. '.repeat(20)}`,
    })
    const result = searchContent([article], 'work arrives unevenly')[0]
    expect(result.snippet).toContain('work arrives unevenly')
    expect(result.snippet.length).toBeLessThanOrEqual(192)
    expect(result.record.href).toBe('/writing/workflow-design')
  })

  it('handles empty, punctuation-only, nonsensical and bounded long input', () => {
    const records = [record('VIFG')]
    for (const query of ['', ' \t\n ', '!?<>+=', 'zqxw987654321']) expect(searchContent(records, query)).toEqual([])
    expect(searchContent(records, 'v'.repeat(20_000))).toEqual([])
    expect(searchContent(records, 'VIFG'.padEnd(SEARCH_QUERY_LIMIT, ' ') + 'ignored')).toEqual(searchContent(records, 'VIFG'))
  })

  it('ranks a precise row above aggregate prose and allows the project name to qualify it', () => {
    const records = [
      record('rageatm', { title: 'RAGeATM', body: comparison.body + ' BM25' }),
      block('bm25-interpretation', { title: 'BM25', body: 'Important words in a search-optimized way.', granularity: 'row' }),
      comparison,
      block('unrelated', { title: 'Overview', body: 'A small prototype.' }),
    ]
    for (const query of ['BM25', 'RAGeATM BM25']) {
      expect(searchContent(records, query)[0].record.href).toBe(comparison.href)
    }
    expect(searchContent(records, 'BM25').some(result => result.record.id === 'rageatm')).toBe(false)
    expect(searchContent(records, 'RAGeATM').map(result => result.record.id)).toEqual(['rageatm'])
    expect(searchContent(records, 'RAGeATM nonexistent')).toEqual([])
  })

  it('selects the matching cell without changing subsequent row-label queries or cached records', () => {
    const records = [comparison]
    for (const query of ['BM25 no deep semantics', 'RAGeATM BM25 fatal weakness']) {
      const result = searchContent(records, query)[0]
      expect(result.record.href).toBe('/case-studies/rageatm#content-bm25-weakness')
      expect(result.record.destination?.label).toBe('BM25: Fatal weakness')
      expect(result.snippet).toBe('Fatal weakness: No deep semantics.')
    }
    expect(searchContent(records, 'BM25 search engines')[0].record.href).toBe('/case-studies/rageatm#content-bm25-use')
    expect(searchContent(records, 'BM25')[0].record.href).toBe(comparison.href)
    expect(comparison.destination?.anchor).toBe('content-bm25')
    expect(searchContent(records, 'BM25 no deep semantics')).toEqual(searchContent(records, 'BM25 no deep semantics'))
  })

  it('limits granular results per page while retaining named page navigation and other pages', () => {
    const records = [
      record('rageatm', { title: 'RAGeATM', tags: ['retrieval'] }),
      ...['a', 'b', 'c', 'd', 'e'].map(id => block(id, { title: `Retrieval ${id}` })),
      block('other', { title: 'Retrieval elsewhere', href: '/writing/retrieval#content-other', destination: { page: '/writing/retrieval', anchor: 'content-other', label: 'Retrieval elsewhere', disclosureIds: [] } }),
    ]
    const results = searchContent(records, 'retrieval')
    expect(results.filter(result => result.record.destination?.page === '/case-studies/rageatm')).toHaveLength(3)
    expect(results.some(result => result.record.id === 'rageatm')).toBe(true)
    expect(results.some(result => result.record.id === 'other')).toBe(true)
    expect(searchContent(records, 'RAGeATM')[0].record.id).toBe('rageatm')
  })

  it('keeps duplicate visible labels distinguishable and deterministic across pages', () => {
    const first = block('first', { title: 'Limitations', body: 'Bounded prototype.' })
    const second = block('second', { title: 'Limitations', body: 'Bounded prototype.', context: 'Time2Move', href: '/case-studies/time2move#content-limitations', destination: { page: '/case-studies/time2move', anchor: 'content-limitations', label: 'Limitations', disclosureIds: [] } })
    expect(searchContent([first, second], 'Limitations').map(result => result.record.id)).toEqual(['first', 'second'])
    expect(searchContent([second, first], 'Limitations').map(result => result.record.id)).toEqual(['first', 'second'])
    expect(searchContent([first, second], 'Time2Move limitations').map(result => result.record.id)).toEqual(['second'])
  })

  it('does not boost children whose local match only repeats inherited article-title context', () => {
    const title = 'Designing Automation Platforms for Real Workflows'
    const records = [
      record('article', { title, type: 'Article', href: '/writing/platforms' }),
      block('example', { title: 'For example:', context: title }),
      block('automation', { title: 'Automation platforms need a queue.', context: title }),
    ]
    expect(searchContent(records, title).map(result => result.record.id)).toEqual(['article'])
    expect(searchContent(records, 'for example').map(result => result.record.id)).toEqual(['example'])
    expect(searchContent(records, 'workflows queue').map(result => result.record.id)).toEqual(['automation'])
  })
})
