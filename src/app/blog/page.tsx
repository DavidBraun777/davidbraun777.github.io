import { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { SectionHeader } from '@/components/ui/section-header'
import { PostCard } from '@/components/blog/post-card'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Engineering notes on AI systems, workflow automation, operational software, and the tradeoffs involved in building them for real use.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          title="Blog"
          subtitle="Engineering notes on AI systems, automation platforms, and the tradeoffs that appear once the software has to operate in practice."
        />

        <div className="mb-10 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">
            Systems Thesis
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            This writing is about building systems that use AI, not collecting AI demos.
            The focus is on workflow architecture, automation design, production
            constraints, and the engineering choices that make a system reliable.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
              Blog posts coming soon!
            </p>
            <p className="text-slate-500 dark:text-slate-500">
              I&apos;m publishing essays on architecture, automation, and building systems
              that use AI in real operational workflows.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
