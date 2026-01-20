import { MetadataRoute } from 'next'
import { getAllPostSlugs } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dbraun.io'

  // Get all blog post slugs
  const blogSlugs = getAllPostSlugs()
  const blogUrls = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ]
}
