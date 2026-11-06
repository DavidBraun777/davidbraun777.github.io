import { expect, it } from 'vitest'
import { absoluteUrl, createPageMetadata } from '@/lib/seo'

it('builds canonical article metadata with separate publication and revision dates', () => {
  const metadata = createPageMetadata({ title: 'Article', description: 'Description', path: '/writing/article', type: 'article', publishedTime: '2026-10-28', modifiedTime: '2026-11-02', authors: ['David'], tags: ['Systems'], image: '/image.png', imageAlt: 'Diagram' })
  expect(metadata.openGraph).toMatchObject({ type: 'article', publishedTime: '2026-10-28', modifiedTime: '2026-11-02', authors: ['David'], tags: ['Systems'], images: [{ url: '/image.png', alt: 'Diagram' }] })
  expect(metadata.twitter).toMatchObject({ images: ['/image.png'] })
  expect(absoluteUrl()).toBe('https://www.dbraun.io/')
  expect(absoluteUrl('/writing/article')).toBe('https://www.dbraun.io/writing/article')
})

it('keeps ordinary pages on default social images without article-only fields', () => {
  const metadata = createPageMetadata({ title: 'About', description: 'Description', path: '/about' })
  expect(metadata.openGraph).toMatchObject({ type: 'website', images: [{ url: '/opengraph-image', alt: 'About' }] })
  expect(metadata.openGraph).not.toHaveProperty('publishedTime')
  expect(metadata.openGraph).not.toHaveProperty('modifiedTime')
  expect(metadata.openGraph).not.toHaveProperty('authors')
  expect(metadata.openGraph).not.toHaveProperty('tags')
  expect(metadata.twitter).toMatchObject({ images: ['/twitter-image'] })
})
