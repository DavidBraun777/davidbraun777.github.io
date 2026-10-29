// @vitest-environment happy-dom
import { createElement, type ComponentType, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ArrowRight } from 'lucide-react'
import { describe, expect, test } from 'vitest'
import { ProjectCard } from '@/components/site/project-card'
import { PageIntro } from '@/components/site/page-intro'
import { SignalGrid } from '@/components/site/signal-grid'
import { CaseStudyStoryContent } from '@/components/site/case-study-story'
import { PostCard } from '@/components/blog/post-card'
import { mdxComponents } from '@/components/blog/mdx-components'
import { allSystems } from '@/data/systems'
import { createProjectContent } from '@/lib/search/project-destinations'

const render = (element: ReactNode) => {
  const root = document.createElement('div')
  root.innerHTML = renderToStaticMarkup(element)
  return root
}
const base = allSystems.find(system => system.id === 'rageatm')!

describe('public content components', () => {
  test('project cards preserve image attribution, optional names, preview fallbacks and compact navigation', () => {
    const cases = [
      { ...base, image: '/images/example.png', imageAlt: 'Original diagram', visualSurface: 'dark' as const },
      { ...base, image: '/images/example.png', imageAlt: undefined, visualSurface: 'light' as const, displayTitle: undefined, contextLabel: undefined },
      { ...base, image: undefined, proofSections: [base.proofSections[0]] },
      { ...base, image: undefined, proofSections: [] },
      { ...base, image: undefined },
    ]
    cases.forEach((system, index) => {
      const page = render(<ProjectCard system={system} {...(index % 2 ? { compact: true, href: '/custom-case' } : {})} />)
      expect(page.querySelector('h3')?.textContent).toBe(system.displayTitle ?? system.name)
      expect(page.querySelector('a')?.getAttribute('href')).toBe(index % 2 ? '/custom-case' : `/case-studies/${system.id}`)
      expect(page.textContent).toContain(system.myRole)
      expect(page.textContent).toContain(system.outcome)
      if (system.image) expect(page.querySelector('img')?.getAttribute('alt')).toBe(system.imageAlt ?? `${system.name} visual`)
      else expect(page.textContent).toContain(system.proofSections.find(item => item.id === 'architecture')?.title ?? system.proofSections[0]?.title ?? 'Architecture direction')
    })
  })

  test('intro and signal variants retain semantic headings and safe outbound actions', () => {
    const minimal = render(<PageIntro title="A focused page" description="Useful context." />)
    expect(minimal.querySelectorAll('a')).toHaveLength(0)
    expect(minimal.querySelectorAll('p')).toHaveLength(1)
    const intro = render(<PageIntro eyebrow="Context" title="Options" description="Choose an action." aside={<p>At a glance</p>} actions={[
      { label: 'External primary', href: 'https://example.com', external: true, icon: ArrowRight },
      { label: 'External secondary', href: 'https://example.com/docs', external: true, variant: 'secondary' },
      { label: 'Internal primary', href: '/contact' },
      { label: 'Internal secondary', href: '/experience', variant: 'secondary' },
    ]} />)
    expect(intro.querySelectorAll('a[target="_blank"]')).toHaveLength(2)
    expect([...intro.querySelectorAll('a[target="_blank"]')].every(link => link.getAttribute('rel') === 'noopener noreferrer')).toBe(true)
    expect(intro.textContent).toContain('At a glance')
    const signal = { title: 'Delivery', value: 'One shared system', detail: 'A bounded example.', icon: ArrowRight }
    expect(render(<SignalGrid items={[signal]} columns="two" headingLevel="h2" />).querySelector('h2')?.textContent).toBe(signal.value)
    expect(render(<SignalGrid items={[signal]} />).querySelector('h3')?.textContent).toBe(signal.value)
  })

  test('historical story sections render paragraphs, semantic lists and closing copy without evidence UI', () => {
    const system = allSystems.find(system => system.id === 'time2move')!
    const story = system.story!
    const page = render(<CaseStudyStoryContent story={story} content={createProjectContent(system)} />)
    expect(page.querySelectorAll('section')).toHaveLength(story.sections.length)
    expect(page.querySelectorAll('h2')).toHaveLength(story.sections.length)
    expect(page.querySelector('#content-capabilities ul')).toBeNull()
    const ai = page.querySelector('#content-ai-development')!
    expect(ai.querySelectorAll('ul li')).toHaveLength(story.sections[1].items!.length)
    expect(ai.querySelector('ul + p')?.textContent).toBe(story.sections[1].closing)
    expect(page.querySelector('details, figure, img, aside')).toBeNull()
  })

  test('post cards encode destinations, bound tags, and distinguish optional images and delays', () => {
    const post = { slug: 'notes & tools', title: 'Engineering notes', description: 'A practical record.', date: '2026-01-01', author: 'David', tags: ['AI', 'Cloud', 'Extra'], readingTime: '2 min read' }
    const plain = render(<PostCard post={post} />)
    expect(plain.querySelector('a')?.getAttribute('href')).toBe('/writing/notes%20%26%20tools')
    expect(plain.querySelector('article')?.style.animationDelay).toBe('0ms')
    expect(plain.querySelector('img')).toBeNull()
    expect(plain.textContent).not.toContain('Extra')
    const illustrated = render(<PostCard post={{ ...post, image: '/images/example.png' }} index={2} />)
    expect(illustrated.querySelector('img')?.getAttribute('alt')).toBe(post.title)
    expect(illustrated.querySelector('article')?.style.animationDelay).toBe('160ms')
  })

  test('MDX presentation forwards anchors, uses safe link defaults, and renders semantic content', () => {
    const mdx = (tag: string, props: Record<string, unknown> = {}, children?: ReactNode) => createElement(mdxComponents[tag] as ComponentType<Record<string, unknown>>, props, children)
    for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'pre', 'ul', 'ol', 'li']) {
      const page = render(mdx(tag, { id: `test-${tag}` }, 'Readable content'))
      expect(page.querySelector(`#test-${tag}`)?.textContent).toBe('Readable content')
    }
    for (const href of ['https://example.com', '/writing', undefined]) {
      const link = render(mdx('a', { href }, 'Read')).querySelector('a')!
      expect(link.getAttribute('href')).toBe(href ?? '#')
      expect(link.getAttribute('target')).toBe(href?.startsWith('http') ? '_blank' : null)
    }
    expect(render(mdx('code', {}, 'inline')).querySelector('code')?.className).toContain('font-mono')
    expect(render(mdx('code', { className: 'language-ts' }, 'const x = 1')).querySelector('code')?.className).toBe('language-ts')
    expect(render(mdx('hr')).querySelector('hr')).not.toBeNull()
    expect(render(mdx('img', { src: '/images/example.png', alt: 'Architecture' })).querySelector('img')?.alt).toBe('Architecture')
    // An authored image without attributes remains decorative rather than inventing alternate text.
    expect(render(mdx('img')).querySelector('img')?.getAttribute('alt')).toBe('')
  })
})
