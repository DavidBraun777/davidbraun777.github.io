import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { allSystems } from '@/data/systems'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dbraun.io'
  const posts = getAllPosts()
  const latestPostDate =
    posts.length > 0 ? new Date(posts[0].date) : new Date('2026-03-24')

  const coreRoutes = [
    {
      url: baseUrl,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/why-work-with-me`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: latestPostDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  const projectRoutes = allSystems.map((system) => ({
    url: `${baseUrl}/case-studies/${system.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const writingRoutes = posts.map((post) => ({
    url: `${baseUrl}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...coreRoutes, ...projectRoutes, ...writingRoutes]
}
