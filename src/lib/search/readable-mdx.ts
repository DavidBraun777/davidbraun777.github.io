import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import {
  assertUniqueDestinations, contentFingerprint, contentId, destinationAttributes,
  type ContentDestination,
} from './destinations'

interface ContentNode {
  type: string
  value?: string
  name?: string
  depth?: number
  data?: { hProperties?: Record<string, unknown> }
  attributes?: { type: string; name?: string; value?: unknown }[]
  children?: ContentNode[]
}

export interface MdxContentBlock {
  granularity: 'section' | 'block' | 'row'
  destination: ContentDestination
  title: string
  text: string
  context: string
  cells?: { text: string; destination: ContentDestination }[]
}

export interface ReadableMdx {
  body: string
  headings: string[]
  blocks: MdxContentBlock[]
  destinations: ContentDestination[]
}

interface Heading {
  node: ContentNode
  text: string
  depth: number
  parent?: Heading
  scopes: string[]
  anchor?: string
}

interface Candidate {
  node: ContentNode
  kind: 'heading' | 'paragraph' | 'item' | 'row'
  text: string
  heading?: Heading
  parent?: Heading
  scopes: string[]
  disclosureIds: string[]
  cells?: ContentNode[]
  columns?: string[]
}

interface WalkContext {
  headings: Heading[]
  scopes: string[]
  disclosureIds: string[]
  inListItem?: boolean
}

const skippedNodes = new Set([
  'mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression', 'html', 'definition', 'code',
])

function hidesContent(attribute: NonNullable<ContentNode['attributes']>[number]): boolean {
  if (attribute.name !== 'hidden' && attribute.name !== 'aria-hidden') return false
  if (attribute.value === false) return false
  if (typeof attribute.value === 'string') {
    // HTML hidden="false" still hides; aria-hidden="false" does not.
    return attribute.name === 'hidden' || attribute.value.trim().toLowerCase() !== 'false'
  }
  if (attribute.value && typeof attribute.value === 'object') {
    const value = attribute.value as {
      type?: string
      data?: { estree?: { body?: { type?: string; expression?: { type?: string; value?: unknown } }[] } }
    }
    const statements = value.data?.estree?.body
    const expression = statements?.length === 1 && statements[0].type === 'ExpressionStatement' ? statements[0].expression : undefined
    if (value.type === 'mdxJsxAttributeValueExpression' && expression?.type === 'Literal') {
      if (expression.value === false) return false
      if (attribute.name === 'aria-hidden' && expression.value === 'false') return false
    }
  }
  // Boolean attributes and dynamic visibility expressions stay out of the index.
  // Reading a literal AST node is safe; compiled JavaScript is never evaluated.
  return true
}

function isExcluded(node: ContentNode): boolean {
  if (skippedNodes.has(node.type)) return true
  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    if (['script', 'style'].includes(node.name ?? '')) return true
    if (node.attributes?.some(hidesContent)) return true
  }
  return false
}

function readableText(node: ContentNode): string {
  if (isExcluded(node)) return ''
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? ''
  // Attributes, expression values, URLs, and component implementation never become text.
  return (node.children ?? []).map(readableText).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

function literalAttribute(node: ContentNode, name: string): string | undefined {
  const value = node.attributes?.find(attribute => attribute.name === name)?.value
  return typeof value === 'string' ? value : undefined
}

function isElement(node: ContentNode, markdownType: string, htmlName: string): boolean {
  return node.type === markdownType || node.name === htmlName
}

function headingAncestors(heading?: Heading): Heading[] {
  return heading ? [...headingAncestors(heading.parent), heading] : []
}

function setAttributes(node: ContentNode, attributes: Record<string, unknown>) {
  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    node.attributes = (node.attributes ?? []).filter(attribute => !(attribute.name && attribute.name in attributes))
    for (const [name, value] of Object.entries(attributes)) {
      node.attributes.push({ type: 'mdxJsxAttribute', name, value: String(value) })
    }
  } else {
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, ...attributes } }
  }
}

/** Comments are neither rendered nor indexed. The shared transform never evaluates MDX. */
export function prepareMdxSource(source: string): string {
  return source.replace(/<!--[\s\S]*?-->/g, '')
}

/** Both extraction and MDXRemote use this transform, so every indexed ID is rendered. */
export function remarkContentDestinations(options: {
  page: string
  articleTitle?: string
  collect?: (content: ReadableMdx) => void
}) {
  return (tree: ContentNode) => {
    const body = readableText(tree)
    const headings: Heading[] = []
    const candidates: Candidate[] = []
    const disclosureIds = new Set<string>()

    function visit(node: ContentNode, context: WalkContext): void {
      if (isExcluded(node)) return
      const text = readableText(node)
      const depth = node.type === 'heading' ? node.depth : /^h[1-6]$/.test(node.name ?? '') ? Number(node.name?.slice(1)) : undefined
      if (depth && text) {
        while (context.headings.at(-1) && context.headings.at(-1)!.depth >= depth) context.headings.pop()
        const heading: Heading = { node, text, depth, parent: context.headings.at(-1), scopes: context.scopes }
        headings.push(heading)
        candidates.push({ node, kind: 'heading', text, heading, parent: heading.parent, scopes: context.scopes, disclosureIds: context.disclosureIds })
        context.headings.push(heading)
        return
      }
      if (['details', 'ContentDetails', 'DisclosurePanel'].includes(node.name ?? '')) {
        const id = literalAttribute(node, 'id')
        if (!id || !/^[a-zA-Z][\w-]*$/.test(id)) throw new Error('Searchable MDX disclosures require an explicit, stable id.')
        if (disclosureIds.has(id)) throw new Error(`Duplicate MDX disclosure id: ${id}`)
        disclosureIds.add(id)
        // Explicit JSX names otherwise bypass the MDX intrinsic component mapping.
        if (node.name === 'details') node.name = 'ContentDetails'
        const nested = { ...context, headings: [...context.headings], scopes: [...context.scopes, id], disclosureIds: [...context.disclosureIds, id] }
        node.children?.forEach(child => visit(child, nested))
        return
      }
      if (isElement(node, 'table', 'table')) {
        const rows = (node.children ?? []).flatMap(child => ['thead', 'tbody', 'tfoot'].includes(child.name ?? '') ? child.children ?? [] : [child])
          .filter(child => isElement(child, 'tableRow', 'tr'))
        const columns = rows[0]?.children?.map(readableText) ?? []
        const tableScope = literalAttribute(node, 'id') ?? contentId('table', ...columns)
        rows.slice(1).forEach(row => {
          const rowText = readableText(row)
          if (rowText) candidates.push({ node: row, kind: 'row', text: rowText, parent: context.headings.at(-1), scopes: [...context.scopes, tableScope], disclosureIds: context.disclosureIds, cells: row.children, columns })
        })
        return
      }
      if (isElement(node, 'listItem', 'li')) {
        const ownText = (node.children ?? []).filter(child => !['list', 'ul', 'ol'].includes(child.type) && !['ul', 'ol'].includes(child.name ?? '')).map(readableText).filter(Boolean).join(' ')
        if (ownText) candidates.push({ node, kind: 'item', text: ownText, parent: context.headings.at(-1), scopes: context.scopes, disclosureIds: context.disclosureIds })
        node.children?.forEach(child => visit(child, { ...context, inListItem: true }))
        return
      }
      if (isElement(node, 'paragraph', 'p')) {
        if (text && !context.inListItem) candidates.push({ node, kind: 'paragraph', text, parent: context.headings.at(-1), scopes: context.scopes, disclosureIds: context.disclosureIds })
        return
      }
      const id = literalAttribute(node, 'id')
      const nested = id ? { ...context, headings: [...context.headings], scopes: [...context.scopes, id] } : context
      node.children?.forEach(child => visit(child, nested))
    }

    visit(tree, { headings: [], scopes: [], disclosureIds: [] })
    function headingAnchor(heading: Heading): string {
      if (heading.anchor) return heading.anchor
      const explicitId = literalAttribute(heading.node, 'id')
      // Always use directly owned prose, even before a repeated label exists.
      // Lists, tables, disclosures and child sections have separate identities.
      const ownText = candidates.filter(candidate => candidate.parent === heading && candidate.kind === 'paragraph' && candidate.scopes.join('|') === heading.scopes.join('|')).map(candidate => candidate.text).join(' ')
      heading.anchor = explicitId ?? contentId('article', 'heading', heading.parent ? headingAnchor(heading.parent) : 'root', ...heading.scopes, heading.text, contentFingerprint(ownText))
      return heading.anchor
    }

    const destinations: ContentDestination[] = []
    const blocks = candidates.map((candidate): MdxContentBlock => {
      const parentAnchor = candidate.parent ? headingAnchor(candidate.parent) : undefined
      const anchor = candidate.heading ? headingAnchor(candidate.heading) : literalAttribute(candidate.node, 'id') ?? contentId('article', candidate.kind, parentAnchor ?? 'intro', ...candidate.scopes, contentFingerprint(candidate.text))
      // Local titles do not make every paragraph match its containing heading.
      const title = candidate.kind === 'row' ? readableText(candidate.cells?.[0] ?? candidate.node) : candidate.text.slice(0, 100)
      const ancestors = headingAncestors(candidate.parent).map(item => item.text)
      const label = [options.articleTitle, ...ancestors, title].filter(Boolean).join(' › ')
      const destination: ContentDestination = { page: options.page, anchor, label, disclosureIds: [...candidate.disclosureIds], ...(parentAnchor ? { fallbackAnchor: parentAnchor } : {}) }
      setAttributes(candidate.node, destinationAttributes(destination))
      destinations.push(destination)
      const cells = candidate.cells?.map((cell, column) => {
        const cellText = readableText(cell)
        const columnName = candidate.columns?.[column] || cellText
        const cellDestination: ContentDestination = { page: options.page, anchor: literalAttribute(cell, 'id') ?? contentId(anchor, 'cell', columnName), label: `${label} › ${columnName}`, disclosureIds: [...candidate.disclosureIds], fallbackAnchor: anchor }
        setAttributes(cell, destinationAttributes(cellDestination))
        destinations.push(cellDestination)
        return { text: cellText, destination: cellDestination }
      })
      return { granularity: candidate.kind === 'heading' ? 'section' : candidate.kind === 'row' ? 'row' : 'block', destination, title, text: candidate.text, context: [...ancestors, ...(candidate.columns ?? [])].join(' · '), ...(cells ? { cells } : {}) }
    })
    assertUniqueDestinations(destinations)
    if (destinations.some(destination => disclosureIds.has(destination.anchor))) throw new Error('MDX disclosure id duplicates a content destination.')
    options.collect?.({ body, headings: headings.map(heading => heading.text), blocks, destinations })
  }
}

/** Build-side only: reuse the site's MDX parser without evaluating compiled JavaScript. */
export async function extractReadableMdx(source: string, page = '/writing', articleTitle?: string): Promise<ReadableMdx> {
  let readable: ReadableMdx = { body: '', headings: [], blocks: [], destinations: [] }
  await serialize(prepareMdxSource(source), {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm, [remarkContentDestinations, { page, articleTitle, collect(content: ReadableMdx) { readable = content } }]],
    },
  })
  return readable
}
