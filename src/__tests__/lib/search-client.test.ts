import { afterEach, describe, expect, it, vi } from 'vitest'
import { isSearchIndex } from '@/lib/search/client'
import type { SearchIndex, SearchRecord } from '@/lib/search/types'

const row: SearchRecord = {
  id: 'row', title: 'BM25', type: 'Project', description: 'Lexical retrieval', tags: [], headings: [], body: 'Fatal weakness: No deep semantics.',
  href: '/case-studies/rageatm#content-bm25', granularity: 'row', context: 'RAGeATM',
  destination: { page: '/case-studies/rageatm', anchor: 'content-bm25', label: 'BM25', disclosureIds: ['content-retrieval-ladder'] },
  cells: [{ text: 'No deep semantics.', destination: { page: '/case-studies/rageatm', anchor: 'content-weakness', label: 'Fatal weakness', disclosureIds: ['content-retrieval-ladder'], fallbackAnchor: 'content-bm25' } }],
}
const index = (record: unknown): unknown => ({ version: 1, records: [record] })

afterEach(() => vi.unstubAllGlobals())

describe('search index client contract', () => {
  it('accepts broad canonical links and complete local content destinations', () => {
    expect(isSearchIndex(index(row))).toBe(true)
    const broad = { ...row, destination: undefined, cells: undefined, granularity: undefined, context: undefined }
    expect(isSearchIndex(index({ ...broad, href: '/contact?type=research' }))).toBe(true)
  })

  it.each(['https://example.test/', '//example.test/', '/\\example.test', '/%5cexample.test', '/%2fexample.test', '/bad%00path', '/bad%zzpath'])(
    'rejects unsafe or malformed local destinations: %s', href => {
      expect(isSearchIndex(index({ ...row, href, destination: undefined, cells: undefined, granularity: undefined }))).toBe(false)
    }
  )

  it('rejects inconsistent anchors, nonlocal cells, and malformed optional fields', () => {
    const malformed = [
      { ...row, href: '/case-studies/rageatm#different-anchor' },
      { ...row, context: ['RAGeATM'] },
      { ...row, granularity: 'page' },
      { ...row, destination: { ...row.destination, page: '/case-studies/rageatm#another' } },
      { ...row, destination: { ...row.destination, page: '/case-studies/../rageatm' } },
      { ...row, destination: { ...row.destination, anchor: 'bad anchor' } },
      { ...row, destination: { ...row.destination, disclosureIds: ['bad anchor'] } },
      { ...row, destination: { ...row.destination, fallbackAnchor: '' } },
      { ...row, destination: { ...row.destination, label: '' } },
      { ...row, cells: [{ text: 'elsewhere', destination: { ...row.destination, page: '/another-page' } }] },
      { ...row, cells: [{ text: 42, destination: row.destination }] },
      { ...row, cells: [null] },
      { ...row, cells: {}, destination: undefined },
    ]
    malformed.forEach(record => expect(isSearchIndex(index(record))).toBe(false))
  })

  it('rejects encoded traversal and normalized page mismatches while accepting safe encoded paths', () => {
    const withPage = (page: string) => ({
      ...row, href: `${page}#content-bm25`,
      destination: { ...row.destination, page }, cells: undefined,
    })
    for (const page of ['/case-studies/%2e%2e/contact', '/case-studies/.%2E/contact', '/case-studies/%2E/contact', '/case-studies/%2e%2e%2fcontact', '/writing/notes ']) {
      expect(isSearchIndex(index(withPage(page))), page).toBe(false)
    }
    for (const page of ['/writing/caf%C3%A9%20notes', '/writing/notes%23example', '/writing/notes%2Fexample']) {
      expect(isSearchIndex(index(withPage(page))), page).toBe(true)
    }
  })

  it('shares one lazy request and retries after a rejected index', async () => {
    vi.resetModules()
    vi.stubGlobal('window', { setTimeout, clearTimeout })
    const fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => index({ ...row, href: '//example.test' }) })
      .mockResolvedValueOnce({ ok: true, json: async (): Promise<SearchIndex> => ({ version: 1, records: [row] }) })
    vi.stubGlobal('fetch', fetch)
    const { loadSearchIndex } = await import('@/lib/search/client')
    expect(fetch).not.toHaveBeenCalled()
    const failed = loadSearchIndex()
    expect(loadSearchIndex()).toBe(failed)
    await expect(failed).rejects.toThrow('Invalid search index')
    const retried = loadSearchIndex()
    await expect(retried).resolves.toEqual([row])
    expect(loadSearchIndex()).toBe(retried)
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
