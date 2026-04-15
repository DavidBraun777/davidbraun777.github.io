import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/blog/mdx-components'
import { Badge } from '@/components/ui/badge'
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx'
import { createPageMetadata, absoluteUrl } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    path: `/writing/${slug}`,
    image: post.image,
    imageAlt: post.title,
    type: 'article',
    publishedTime: post.date,
    authors: [post.author],
    tags: post.tags,
  })
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Writing',
        item: absoluteUrl('/writing'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: absoluteUrl(`/writing/${slug}`),
      },
    ],
  }
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Person',
      name: post.author,
      url: absoluteUrl('/'),
    },
    mainEntityOfPage: absoluteUrl(`/writing/${slug}`),
    url: absoluteUrl(`/writing/${slug}`),
    ...(post.image ? { image: absoluteUrl(post.image) } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {}),
  }

  return (
    <article className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-link-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Writing
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-text-secondary">
            {post.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
            <span>By {post.author}</span>
          </div>
        </header>

        <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </div>
    </article>
  )
}
