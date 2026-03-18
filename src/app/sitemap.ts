import fs from 'fs'
import path from 'path'
import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

function getLatestModified(pathsToCheck: string[], fallback: Date): Date {
  const timestamps = pathsToCheck.flatMap((relativePath) => {
    try {
      const absolutePath = path.join(process.cwd(), relativePath)
      return [fs.statSync(absolutePath).mtime.getTime()]
    } catch {
      return []
    }
  })

  return timestamps.length > 0
    ? new Date(Math.max(...timestamps))
    : fallback
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dbraun.io'

  // Use real dates from blog post frontmatter
  const posts = getAllPosts()
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Derive the blog index lastModified from the most recent post
  const latestPostDate =
    posts.length > 0 ? new Date(posts[0].date) : new Date('2025-01-09')
  const homeLastModified = getLatestModified(
    [
      'src/app/page.tsx',
      'src/data/systems.ts',
      'src/components/sections/hero.tsx',
      'src/components/sections/what-i-build.tsx',
      'src/components/sections/selected-systems.tsx',
      'src/components/sections/how-i-build.tsx',
      'src/components/sections/engineering-principles.tsx',
      'src/components/sections/current-interests.tsx',
      'src/components/sections/contact.tsx',
    ],
    latestPostDate
  )
  const backgroundLastModified = getLatestModified(
    [
      'src/app/background/page.tsx',
      'src/data/experience.ts',
      'src/data/skills.ts',
      'src/data/education.ts',
    ],
    latestPostDate
  )

  return [
    {
      url: baseUrl,
      lastModified: homeLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/background`,
      lastModified: backgroundLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogUrls,
  ]
}
