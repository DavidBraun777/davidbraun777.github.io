import { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { SectionHeader } from '@/components/ui/section-header'
import { PostCard } from '@/components/blog/post-card'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles about software engineering, cybersecurity, and AI.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          title="Blog"
          subtitle="Thoughts on software engineering, cybersecurity, and AI"
        />

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
              I&apos;m working on some exciting content about software engineering, AI, and cybersecurity.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
