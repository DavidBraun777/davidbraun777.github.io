import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { PostCard } from '@/components/blog/post-card'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { getAllPosts } from '@/lib/mdx'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Writing',
  description:
    'Essays and technical notes from David Braun on AI systems, workflow automation, product engineering, and software architecture.',
  path: '/writing',
})

export default function WritingPage() {
  const posts = getAllPosts()
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 8)

  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Writing"
          title="Notes, essays, and technical thinking behind the work."
          description="The writing is about building systems that have to operate in practice: workflow architecture, AI boundaries, delivery constraints, and the engineering tradeoffs that matter once software leaves the demo phase."
          actions={[
            { label: 'View Case Studies', href: '/case-studies', variant: 'secondary' },
            { label: 'Contact', href: '/contact' },
          ]}
        />

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {posts.length > 0 ? (
          <section>
            <SectionHeader
              align="left"
              title="Published posts"
              subtitle="Writing that supports the case studies and explains how the systems are designed to operate in practice."
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </section>
        ) : (
          <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-8 text-text-secondary shadow-sm">
            Writing is in progress. Posts will appear here as they are published.
          </div>
        )}
      </div>
    </div>
  )
}
