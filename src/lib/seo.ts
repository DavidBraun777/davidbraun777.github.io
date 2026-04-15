import type { Metadata } from 'next'

export const siteUrl = 'https://dbraun.io'
export const siteName = 'dbraun.io'
export const defaultOpenGraphImage = '/opengraph-image'
export const defaultTwitterImage = '/twitter-image'

interface CreatePageMetadataOptions {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  authors?: string[]
  tags?: string[]
}

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = 'website',
  publishedTime,
  authors,
  tags,
}: CreatePageMetadataOptions): Metadata {
  const openGraphImage = image ?? defaultOpenGraphImage
  const twitterImage = image ?? defaultTwitterImage

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      type,
      images: [
        {
          url: openGraphImage,
          alt: imageAlt ?? title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [twitterImage],
    },
  }
}
