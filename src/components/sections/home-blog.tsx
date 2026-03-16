import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllPosts } from '@/lib/mdx'
import { SectionHeader } from '@/components/ui/section-header'
import { PostCard } from '@/components/blog/post-card'

export function HomeBlog() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section id="blog" className="section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Blog"
          subtitle="Writing focused on building real AI systems, automation platforms, and the tradeoffs that show up once software has to operate reliably."
        />

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/45 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">
                Authority Layer
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                The writing here is about system design, automation, and engineering
                tradeoffs from real builds. It is meant to clarify how I think, not act
                like generic content marketing.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
            >
              Browse all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
