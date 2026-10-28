// @vitest-environment happy-dom

import { renderToStaticMarkup } from 'react-dom/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { describe, expect, test } from 'vitest'
import { mdxComponents } from '@/components/blog/mdx-components'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { extractReadableMdx, prepareMdxSource, remarkContentDestinations } from '@/lib/search/readable-mdx'

const page = '/writing/destination-fixture'

async function renderMdx(source: string, articleTitle?: string) {
  const element = await MDXRemote({
    source: prepareMdxSource(source), components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm, [remarkContentDestinations, { page, articleTitle }]] } },
  })
  const container = document.createElement('main')
  container.innerHTML = renderToStaticMarkup(element)
  return container
}

describe('MDX content destinations', () => {
  test('renders every published article target as a focusable element using the shared transform', async () => {
    for (const post of getAllPosts()) {
      const source = getPostBySlug(post.slug)!.content
      const content = await extractReadableMdx(source, page)
      const rendered = await renderMdx(source)
      expect(content.blocks.some(block => block.granularity === 'block')).toBe(true)
      for (const destination of content.destinations) {
        const matches = rendered.querySelectorAll(`[id="${destination.anchor}"]`)
        expect(matches.length, `${post.slug}: ${destination.label}`).toBe(1)
        expect(matches[0].getAttribute('tabindex')).toBe('-1')
        expect(matches[0].hasAttribute('data-content-target')).toBe(true)
      }
    }
  })

  test('keeps paragraph and list-item matches local and stable after unrelated insertion', async () => {
    const source = '## Operations\n\nQueue lag reveals bottlenecks.\n\n- Retry failed jobs carefully.\n- Record durable checkpoints.'
    const before = await extractReadableMdx(source, page)
    const after = await extractReadableMdx(`## New introduction\n\nUnrelated introductory material.\n\n${source}`, page)
    for (const block of before.blocks) {
      expect(after.blocks.find(item => item.text === block.text)?.destination).toEqual(block.destination)
    }
    expect(before.blocks).toHaveLength(4)
    const paragraph = before.blocks.find(block => block.text === 'Queue lag reveals bottlenecks.')!
    expect(paragraph.context).toBe('Operations')
    expect(paragraph.title).not.toContain('Operations')
    expect(paragraph.destination.fallbackAnchor).toBe(before.blocks[0].destination.anchor)
    const rendered = await renderMdx(source)
    expect(rendered.querySelector(`[id="${paragraph.destination.anchor}"]`)?.tagName).toBe('P')
    expect(rendered.querySelector(`[id="${before.blocks[2].destination.anchor}"]`)?.tagName).toBe('LI')
  })

  test('scopes repeated headings semantically and refuses ambiguous duplicate targets', async () => {
    const source = '## Results\n\nFirst experiment findings.\n\n## Results\n\nSecond experiment findings.'
    const before = await extractReadableMdx(source, page)
    const after = await extractReadableMdx(`# Overview\n\nOverview description.\n\n${source}`, page)
    expect(new Set(before.destinations.map(destination => destination.anchor)).size).toBe(4)
    // The new parent heading deliberately changes scope; a separate sibling section does not.
    const sibling = await extractReadableMdx(`## Background\n\nBackground description.\n\n${source}`, page)
    before.blocks.forEach(block => expect(sibling.blocks.some(item => item.text === block.text && item.destination.anchor === block.destination.anchor)).toBe(true))
    expect(after.blocks).toHaveLength(6)
    await expect(extractReadableMdx('## Results\n\nSame prose.\n\nSame prose.', page)).rejects.toThrow('Duplicate content destination')
    await expect(extractReadableMdx('## Results\n\nSame prose.\n\n## Results\n\nSame prose.', page)).rejects.toThrow('Duplicate content destination')
    const explicit = await extractReadableMdx('<p id="first-finding">Same prose.</p>\n\n<p id="second-finding">Same prose.</p>', page)
    expect(explicit.destinations.map(destination => destination.anchor)).toEqual(['first-finding', 'second-finding'])
  })

  test('retains existing targets when a same-label section or an unrelated child section is added', async () => {
    const original = '## Notes\n\nOriginal operational guidance.\n\n### Recovery\n\nPersist the durable checkpoint.'
    const before = await extractReadableMdx(original, page)
    const repeated = await extractReadableMdx(`## Notes\n\nIndependent observations.\n\n${original}`, page)
    const child = await extractReadableMdx(original.replace('### Recovery', '### Scheduling\n\nAn independent scheduling policy.\n\n### Recovery'), page)
    for (const block of before.blocks) {
      for (const expanded of [repeated, child]) {
        expect(expanded.blocks.some(item => item.text === block.text && item.destination.anchor === block.destination.anchor), block.text).toBe(true)
      }
    }
    expect(repeated.blocks.filter(block => block.text === 'Notes').map(block => block.destination.anchor)).toHaveLength(2)
    expect(new Set(repeated.destinations.map(destination => destination.anchor)).size).toBe(repeated.destinations.length)
  })

  test('renders table row and cell targets with semantic IDs that survive row insertion', async () => {
    const source = '## Retrieval comparison\n\n| Method | Score |\n| --- | --- |\n| BM25 | 0.81 |\n| Dense | 0.87 |'
    const before = await extractReadableMdx(source, page, 'Retrieval experiments')
    const after = await extractReadableMdx(source.replace('| BM25', '| Hybrid | 0.91 |\n| BM25'), page, 'Retrieval experiments')
    const row = before.blocks.find(block => block.title === 'BM25')!
    expect(row.granularity).toBe('row')
    expect(row.context).toBe('Retrieval comparison · Method · Score')
    expect(after.blocks.find(block => block.title === 'BM25')?.destination).toEqual(row.destination)
    expect(row.destination.label).toBe('Retrieval experiments › Retrieval comparison › BM25')
    const rendered = await renderMdx(source, 'Retrieval experiments')
    expect(rendered.querySelector(`[id="${row.destination.anchor}"]`)?.tagName).toBe('TR')
    for (const cell of row.cells!) {
      expect(rendered.querySelector(`[id="${cell.destination.anchor}"]`)?.textContent).toBe(cell.text)
      expect(rendered.querySelector(`[id="${cell.destination.anchor}"]`)?.getAttribute('data-content-label')).toBe(cell.destination.label)
      const scroller = rendered.querySelector(`[id="${cell.destination.anchor}"]`)?.closest('[data-content-table]')
      expect(scroller?.classList.contains('overflow-x-auto')).toBe(true)
      expect(scroller?.classList.contains('max-w-full')).toBe(true)
      expect(cell.destination.fallbackAnchor).toBe(row.destination.anchor)
    }
  })

  test('records nested registered disclosures and requires author-supplied stable disclosure IDs', async () => {
    const source = [
      '## Details', '', '<details id="outer-panel">', '<summary>More information</summary>', '',
      'Outer-panel context.', '', '<details id="inner-panel">', '<summary>Technical notes</summary>', '',
      'A nested durable workflow.', '', '</details>', '</details>',
    ].join('\n')
    const content = await extractReadableMdx(source, page)
    const nested = content.blocks.find(block => block.text === 'A nested durable workflow.')!
    expect(nested.destination.disclosureIds).toEqual(['outer-panel', 'inner-panel'])
    const rendered = await renderMdx(source)
    const target = rendered.querySelector(`[id="${nested.destination.anchor}"]`)!
    expect(target.closest('details')?.id).toBe('inner-panel')
    expect(rendered.querySelector('#outer-panel')?.contains(target)).toBe(true)
    await expect(extractReadableMdx('<details>\n<summary>More</summary>\n\nParagraph.\n\n</details>', page)).rejects.toThrow('explicit, stable id')
    await expect(extractReadableMdx(source.replace('id="inner-panel"', 'id="outer-panel"'), page)).rejects.toThrow('Duplicate MDX disclosure id')
  })

  test('keeps hidden content, attributes, code, imports and expressions out of granular records', async () => {
    const source = [
      'import Private from "private-sentinel"', '', '## Visible', '',
      'Public searchable prose.', '', '<div hidden>hidden-sentinel</div>', '',
      '<div aria-hidden="true">aria-sentinel</div>', '', '<script>script-sentinel</script>', '',
      '{"expression-sentinel"}', '', '<!-- comment-sentinel -->', '',
      '```js', 'const privateData = "code-sentinel"', '```', '',
      '<p implementation="attribute-sentinel">Readable component prose.</p>',
    ].join('\n')
    const content = await extractReadableMdx(source, page)
    expect(JSON.stringify(content)).not.toContain('sentinel')
    expect(content.blocks.map(block => block.text)).toEqual(['Visible', 'Public searchable prose.', 'Readable component prose.'])
  })

  test('excludes hidden expression values without evaluating them and preserves literal false', async () => {
    const source = [
      '<div aria-hidden={true}>', '', '## aria-expression-sentinel', '', 'aria-body-sentinel', '', '</div>', '',
      '<div hidden={true}>', '', 'hidden-expression-sentinel', '', '</div>', '',
      '<div aria-hidden={visibilityFlag}>', '', 'dynamic-aria-sentinel', '', '</div>', '',
      '<div hidden={readPrivateVisibility()}>', '', 'dynamic-hidden-sentinel', '', '</div>', '',
      '<div hidden="false">', '', 'hidden-string-sentinel', '', '</div>', '',
      '<p aria-hidden={false}>Visible false ARIA attribute.</p>', '',
      '<p hidden={false}>Visible false hidden attribute.</p>', '',
      '<p aria-hidden={/* literal */ false}>Visible commented literal.</p>', '',
      '<p aria-hidden="false">Visible string ARIA attribute.</p>',
    ].join('\n')
    const content = await extractReadableMdx(source, page)
    expect(content.body).not.toContain('sentinel')
    expect(JSON.stringify(content.blocks)).not.toContain('sentinel')
    expect(JSON.stringify(content.destinations)).not.toContain('sentinel')
    expect(content.headings).toEqual([])
    expect(content.blocks.map(block => block.text)).toEqual([
      'Visible false ARIA attribute.', 'Visible false hidden attribute.',
      'Visible commented literal.', 'Visible string ARIA attribute.',
    ])
  })
})
