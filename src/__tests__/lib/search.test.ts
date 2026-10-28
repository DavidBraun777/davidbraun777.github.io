import { describe, expect, it } from 'vitest'
import { normalizeSearchText, SEARCH_QUERY_LIMIT, searchContent, searchWords } from '@/lib/search/search'
import type { SearchRecord } from '@/lib/search/types'

function record(id: string, fields: Partial<SearchRecord> = {}): SearchRecord {
  return {
    id, title: id, href: `/case-studies/${id}`, type: 'Project',
    description: '', tags: [], headings: [], body: '', ...fields,
  }
}

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
})
