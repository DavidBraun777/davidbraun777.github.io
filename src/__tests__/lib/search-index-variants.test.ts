import { afterEach, expect, it, vi } from 'vitest'
import fs from 'node:fs'

vi.mock('@/data/research', async importOriginal => {
  const actual = await importOriginal<typeof import('@/data/research')>()
  const paper = actual.acceptedConferencePapers[0]
  return { ...actual, acceptedConferencePapers: [
    { ...paper, id: 'new-accepted', title: 'New accepted work', href: undefined },
    { ...paper, id: 'dedicated-accepted', title: 'Dedicated accepted work', href: '/research/new-work' },
  ] }
})
vi.mock('@/data/education', async importOriginal => {
  const actual = await importOriginal<typeof import('@/data/education')>()
  return { ...actual, education: [{ ...actual.education[0], endDate: undefined }], certifications: [{ ...actual.certifications[0], expirationDate: undefined }] }
})
vi.mock('@/data/resumes', async importOriginal => {
  const actual = await importOriginal<typeof import('@/data/resumes')>()
  return { ...actual, resumeDocuments: actual.resumeDocuments.map(document => ({ ...document, href: null })) }
})

import { assembleSearchIndex, buildSearchIndex, projectSearchRecord } from '@/lib/search/build-index'
import { allSystems } from '@/data/systems'
afterEach(() => vi.restoreAllMocks())

it('indexes accepted-work fallbacks, unfinished education, nonexpiring certificates and requested documents', async () => {
  const { records } = await buildSearchIndex()
  expect(records.find(record => record.id === 'research-new-accepted')?.href).toBe('/research#research-new-accepted')
  expect(records.find(record => record.id === 'research-dedicated-accepted')?.href).toBe('/research/new-work')
  expect(records.find(record => record.id === 'research-urarina')?.tags).toContain('Urarina')
  expect(records.find(record => record.id.startsWith('education-'))?.body).toContain('Present')
  expect(records.find(record => record.id.startsWith('certification-'))?.description).not.toContain('Expires')
  expect(records.filter(record => record.type === 'Résumé').every(record => record.href.startsWith('/contact?') && record.body.includes('available upon request'))).toBe(true)
})

it('indexes real MDX table cells from the publishing source and fails a disappeared published article', async () => {
  const originalRead = fs.readFileSync.bind(fs)
  const originalList = fs.readdirSync.bind(fs)
  const source = '---\ntitle: Example article\ndescription: Table example\n---\n\n| Method | Meaning |\n| --- | --- |\n| BM25 | Lexical search |'
  vi.spyOn(fs, 'readdirSync').mockImplementation(((path: fs.PathLike, options?: unknown) => String(path).endsWith('src/content/blog') ? ['table-example.mdx'] : originalList(path, options as never)) as typeof fs.readdirSync)
  let removed = false
  vi.spyOn(fs, 'readFileSync').mockImplementation(((path: fs.PathOrFileDescriptor, options?: unknown) => {
    if (String(path).endsWith('table-example.mdx')) {
      if (removed) throw new Error('Article removed after listing')
      return source
    }
    return originalRead(path, options as never)
  }) as typeof fs.readFileSync)
  const { records } = await buildSearchIndex()
  const row = records.find(record => record.type === 'Article' && record.title === 'BM25')!
  expect(row.cells?.map(cell => cell.text)).toEqual(['BM25', 'Lexical search'])
  expect(row.destination?.label).toContain('Example article')
  let reads = 0
  vi.mocked(fs.readFileSync).mockImplementation(((path: fs.PathOrFileDescriptor, options?: unknown) => {
    if (String(path).endsWith('table-example.mdx')) {
      if (++reads > 1) { removed = true; throw new Error('Article removed after listing') }
      return source
    }
    return originalRead(path, options as never)
  }) as typeof fs.readFileSync)
  await expect(buildSearchIndex()).rejects.toThrow('Published article cannot be read: table-example')
})

it('rejects two legacy records attempting to claim the same fragment', () => {
  const first = { ...projectSearchRecord(allSystems[0]), href: '/research#duplicate' }
  expect(() => assembleSearchIndex([first, { ...first, id: 'different-record' }])).toThrow('Duplicate search destination')
})
