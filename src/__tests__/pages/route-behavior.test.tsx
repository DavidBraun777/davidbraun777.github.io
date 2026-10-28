// @vitest-environment happy-dom
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { BlogPost } from '@/lib/mdx'

vi.mock('next-mdx-remote/rsc', () => ({ MDXRemote: ({ source }: { source: string }) => <div data-mdx-source>{source}</div> }))

afterEach(() => {
  vi.doUnmock('@/lib/mdx')
  vi.unstubAllEnvs()
  vi.resetModules()
})

const render = (element: ReactNode) => {
  const root = document.createElement('div')
  root.innerHTML = renderToStaticMarkup(element)
  return root
}
const post: BlogPost = {
  slug: 'engineering-notes', title: 'Engineering notes', description: 'A practical example.',
  author: 'David Braun', date: '2026-01-15', tags: ['Engineering'], image: '/images/example.png',
  content: '# A useful article\n\nA readable implementation account.', readingTime: '1 min read',
}

describe('canonical routes and response contracts', () => {
  test('legacy routes retain permanent or temporary redirects and the requested slug', async () => {
    const redirects = [
      ['about', '/experience', 308], ['background', '/experience', 308], ['blog', '/writing', 308],
      ['projects', '/case-studies', 307], ['resume', '/experience', 308], ['systems', '/case-studies', 307],
      ['why-work-with-me', '/experience', 308],
    ] as const
    for (const [route, target, status] of redirects) {
      const page = await import(`../../app/${route}/page.tsx`)
      expect(() => page.default()).toThrowError(expect.objectContaining({ digest: expect.stringContaining(`;${target};${status};`) }))
    }
    const blog = await import('@/app/blog/[slug]/page')
    await expect(blog.default({ params: Promise.resolve({ slug: 'engineering-notes' }) })).rejects.toMatchObject({ digest: expect.stringContaining(';/writing/engineering-notes;308;') })
    const project = await import('@/app/projects/[slug]/page')
    await expect(project.default({ params: Promise.resolve({ slug: 'rageatm' }) })).rejects.toMatchObject({ digest: expect.stringContaining(';/case-studies/rageatm;307;') })
  })

  test('robots and the real generated search endpoint expose the canonical public contract', async () => {
    const { default: robots } = await import('@/app/robots')
    expect(robots()).toEqual({ rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, host: 'https://dbraun.io', sitemap: 'https://dbraun.io/sitemap.xml' })
    const { GET, dynamic } = await import('@/app/search-index.json/route')
    const response = await GET()
    expect(dynamic).toBe('force-static')
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    expect(response.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate')
    const payload = await response.json()
    expect(payload.version).toBe(1)
    expect(payload.records.some((record: { title: string; href: string }) => record.title === 'BM25' && record.href.includes('/case-studies/rageatm#'))).toBe(true)
  })

  test('contact query input selects a valid inquiry type and safely falls back for invalid input', async () => {
    vi.stubEnv('CAL_LINK', 'https://example.com/schedule')
    const { default: ContactPage } = await import('@/app/contact/page')
    for (const type of ['consulting', 'invalid']) {
      const tree = await ContactPage({ searchParams: Promise.resolve({ type }) })
      const page = render(tree)
      const select = page.querySelector('select')
      expect(select?.querySelector('option[selected]')?.getAttribute('value')).toBe(type === 'consulting' ? 'consulting' : '')
      expect(page.querySelector('#contact-form')).not.toBeNull()
      expect(page.querySelector('a[href="https://example.com/schedule"]')).not.toBeNull()
    }
  })
})

describe('writing pages with published and absent content', () => {
  test('published posts produce canonical metadata, structured data, tags and rendered source', async () => {
    vi.doMock('@/lib/mdx', () => ({ getAllPostSlugs: () => [post.slug], getAllPosts: () => [post], getPostBySlug: () => post }))
    const detail = await import('@/app/writing/[slug]/page')
    expect(detail.generateStaticParams()).toEqual([{ slug: post.slug }])
    const metadata = await detail.generateMetadata({ params: Promise.resolve({ slug: post.slug }) })
    expect(metadata.title).toBe(post.title)
    expect(metadata.alternates?.canonical).toBe(`/writing/${post.slug}`)
    const page = render(await detail.default({ params: Promise.resolve({ slug: post.slug }) }))
    expect(page.querySelector('h1')?.textContent).toBe(post.title)
    expect(page.querySelector('[data-mdx-source]')?.textContent).toContain('A readable implementation account.')
    const article = JSON.parse(page.querySelectorAll('script[type="application/ld+json"]')[1].textContent!)
    expect(article.image).toBe('https://dbraun.io/images/example.png')
    expect(article.keywords).toBe('Engineering')
    const index = await import('@/app/writing/page')
    expect(render(<index.default />).textContent).toContain('Published posts')
    const { default: sitemap } = await import('@/app/sitemap')
    expect(sitemap().find(item => item.url === 'https://dbraun.io/writing')?.lastModified).toEqual(new Date(post.date))
  })

  test('an unillustrated, untagged post omits absent structured-data fields', async () => {
    vi.doMock('@/lib/mdx', () => ({ getAllPostSlugs: () => [post.slug], getPostBySlug: () => ({ ...post, image: undefined, tags: [] }) }))
    const detail = await import('@/app/writing/[slug]/page')
    const page = render(await detail.default({ params: Promise.resolve({ slug: post.slug }) }))
    const article = JSON.parse(page.querySelectorAll('script[type="application/ld+json"]')[1].textContent!)
    expect(article).not.toHaveProperty('image')
    expect(article).not.toHaveProperty('keywords')
    expect(page.textContent).toContain('By David Braun')
  })

  test('missing articles fail as not-found while the empty directory and sitemap remain useful', async () => {
    vi.doMock('@/lib/mdx', () => ({ getAllPostSlugs: () => [], getAllPosts: () => [], getPostBySlug: () => null }))
    const detail = await import('@/app/writing/[slug]/page')
    expect(await detail.generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })).toEqual({ title: 'Post Not Found' })
    await expect(detail.default({ params: Promise.resolve({ slug: 'missing' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/)
    const { default: WritingPage } = await import('@/app/writing/page')
    const empty = render(<WritingPage />)
    expect(empty.textContent).toContain('Writing is in progress.')
    expect(empty.querySelector('article')).toBeNull()
    const { default: sitemap } = await import('@/app/sitemap')
    expect(sitemap().find(item => item.url === 'https://dbraun.io/writing')?.lastModified).toEqual(new Date('2026-03-24'))
  })
})
