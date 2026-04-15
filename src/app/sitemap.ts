import fs from 'fs'
import path from 'path'
import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { allSystems } from '@/data/systems'

function getLatestModified(pathsToCheck: string[], fallback: Date): Date {
  const timestamps = pathsToCheck.flatMap((relativePath) => {
    try {
      const absolutePath = path.join(process.cwd(), relativePath)
      return [fs.statSync(absolutePath).mtime.getTime()]
    } catch {
      return []
    }
  })

  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : fallback
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dbraun.io'
  const posts = getAllPosts()
  const latestPostDate =
    posts.length > 0 ? new Date(posts[0].date) : new Date('2026-03-24')

  const coreRoutes = [
    {
      url: baseUrl,
      lastModified: getLatestModified(
        ['src/app/page.tsx', 'src/data/profile.ts', 'src/data/systems.ts'],
        latestPostDate
      ),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: getLatestModified(
        ['src/app/services/page.tsx', 'src/data/profile.ts'],
        latestPostDate
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/why-work-with-me`,
      lastModified: getLatestModified(
        ['src/app/why-work-with-me/page.tsx', 'src/data/experience.ts', 'src/data/education.ts'],
        latestPostDate
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: getLatestModified(
        [
          'src/app/case-studies/page.tsx',
          'src/app/case-studies/[slug]/page.tsx',
          'src/data/systems.ts',
        ],
        latestPostDate
      ),
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
      lastModified: getLatestModified(
        ['src/app/contact/page.tsx', 'src/components/sections/contact.tsx'],
        latestPostDate
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  const projectRoutes = allSystems.map((system) => ({
    url: `${baseUrl}/case-studies/${system.id}`,
    lastModified: getLatestModified(
      ['src/app/case-studies/[slug]/page.tsx', 'src/data/systems.ts'],
      latestPostDate
    ),
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
