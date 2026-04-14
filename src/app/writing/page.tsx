import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { PostCard } from '@/components/blog/post-card'
import { Badge } from '@/components/ui/badge'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Essays and technical notes from David Braun on AI systems, workflow automation, product engineering, and software architecture.',
}

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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            Writing is in progress. Posts will appear here as they are published.
          </div>
        )}
      </div>
    </div>
  )
}
