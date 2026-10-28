import { serialize } from 'next-mdx-remote/serialize'

interface ContentNode {
  type: string
  value?: string
  name?: string
  attributes?: { type: string; name?: string; value?: unknown }[]
  children?: ContentNode[]
}

const skippedNodes = new Set([
  'mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression', 'html', 'definition', 'code',
])

function isExcluded(node: ContentNode): boolean {
  if (skippedNodes.has(node.type)) return true
  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    if (['script', 'style'].includes(node.name ?? '')) return true
    if (node.attributes?.some((attribute) =>
      attribute.name === 'hidden' ||
      (attribute.name === 'aria-hidden' && attribute.value === 'true')
    )) return true
  }
  return false
}

function readableText(node: ContentNode): string {
  if (isExcluded(node)) return ''
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? ''
  // Attributes, expression values, URLs, and component implementation never become text.
  return (node.children ?? []).map(readableText).filter(Boolean).join(' ')
}

/** Build-side only: reuse the site's MDX parser without evaluating compiled JavaScript. */
export async function extractReadableMdx(source: string) {
  let body = ''
  const headings: string[] = []
  await serialize(source.replace(/<!--[\s\S]*?-->/g, ''), {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [() => (tree: ContentNode) => {
        body = readableText(tree).replace(/\s+/g, ' ').trim()
        const collectHeadings = (node: ContentNode) => {
          if (isExcluded(node)) return
          if (node.type === 'heading') headings.push(readableText(node).trim())
          node.children?.forEach(collectHeadings)
        }
        collectHeadings(tree)
      }],
    },
  })
  return { body, headings }
}
