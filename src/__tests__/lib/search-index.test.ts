import { describe, expect, test } from 'vitest'
import { allSystems } from '@/data/systems'
import { time2Move } from '@/data/past-client-work'
import { resumeDocuments } from '@/data/resumes'
import { getAllPosts } from '@/lib/mdx'
import { buildSearchIndex, projectSearchRecord } from '@/lib/search/build-index'
import { extractReadableMdx } from '@/lib/search/readable-mdx'

describe('public search index', () => {
  test('extracts readable MDX without implementation, attributes, comments, or unrelated frontmatter', async () => {
    const source = [
      '---', 'internalNote: frontmatter-sentinel', '---',
      'import SecretComponent from "private-import-sentinel"', '',
      'export const internal = "export-sentinel"', '',
      '# Visible heading', '',
      'Searchable **public prose** and `Next.js` with [link text](https://private-url-sentinel.test).', '',
      '{/* comment-sentinel */}', '',
      '<!-- html-comment-sentinel -->', '',
      '{"expression-sentinel"}', '',
      '<Callout implementation="attribute-sentinel">Readable component children.</Callout>', '',
      '<div hidden>', '', '# hidden-heading-sentinel', '', '</div>', '',
      '<script>script-sentinel</script>', '',
      '```tsx', 'const implementation = "code-sentinel"', '```',
    ].join('\n')
    const readable = await extractReadableMdx(source)
    expect(readable.headings).toEqual(['Visible heading'])
    expect(readable.body).toContain('Searchable public prose and Next.js')
    expect(readable.body).toContain('Readable component children.')
    expect(readable.body).not.toContain('sentinel')
    expect(readable.body).not.toMatch(/import|export|implementation|https:/)
  })

  test('derives all public projects and published article detail URLs from their collections', async () => {
    const index = await buildSearchIndex()
    expect(index.version).toBe(1)
    expect(index.records.filter(record => record.type === 'Project').map(record => record.href))
      .toEqual(allSystems.map(system => `/case-studies/${system.id}`))
    expect(index.records.filter(record => record.type === 'Article').map(record => record.href))
      .toEqual(getAllPosts().map(post => `/writing/${post.slug}`))
    expect(index.records.find(record => record.href === '/writing/designing-automation-platforms-for-real-workflows')?.body)
      .toContain('work arrives unevenly')
    expect(new Set(index.records.map(record => record.href)).size).toBe(index.records.length)
    expect(index.records.every(record => !/^\/(?:blog|projects|resume)(?:\/|$)/.test(record.href))).toBe(true)
  })

  test('selects explicit public project fields rather than serializing whole data objects', () => {
    const project = { ...allSystems[0], internalNotes: 'private-sentinel', image: '/private-image-sentinel.png' }
    const record = projectSearchRecord(project)
    expect(record.body).toContain(project.myRole)
    expect(JSON.stringify(record)).not.toContain('sentinel')
    expect(Object.keys(record).sort()).toEqual(['body', 'description', 'headings', 'href', 'id', 'tags', 'title', 'type'])
  })

  test('preserves historical attribution and indexes only approved résumé destinations', async () => {
    const { records } = await buildSearchIndex()
    const historical = records.find(record => record.id === 'project-time2move')
    expect(historical?.title).toBe(time2Move.displayTitle ?? time2Move.name)
    expect(historical?.description).toBe(time2Move.summary)
    expect(`${historical?.headings.join(' ')} ${historical?.body}`).toContain(time2Move.currentState)
    expect(historical?.href).toBe('/case-studies/time2move')
    expect(records.filter(record => record.href === '/case-studies/time2move')).toHaveLength(1)
    expect(records.some(record => record.href === '/case-studies#past-client-work')).toBe(false)
    expect(records.filter(record => record.type === 'Résumé').map(record => record.href))
      .toEqual(resumeDocuments.map(document => document.href ?? document.requestHref))
    expect(records.some(record => /docs\/|audit|\.env|planning-notes/.test(record.href))).toBe(false)
    expect(JSON.stringify(records)).not.toContain('research:acceptedConferencePapers:')
    // Unused skill inventory is not public page content.
    expect(JSON.stringify(records)).not.toContain('Sign Language (Fluent)')
  })
})
