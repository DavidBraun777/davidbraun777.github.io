import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { PostDate } from '@/components/blog/post-date'
import { Badge } from '@/components/ui/badge'
import type { BlogPostMeta } from '@/lib/mdx'

interface PostCardProps {
  readonly post: BlogPostMeta
  readonly index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <article
      className="group overflow-hidden rounded-[1.75rem] border border-border-subtle bg-background-elevated shadow-sm transition-transform duration-200 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link href={`/writing/${encodeURIComponent(post.slug)}`}>
        <div>
          {post.image && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 24vw, (min-width: 768px) 42vw, 100vw"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {post.title}
            </h3>

            <p className="text-text-secondary mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="space-y-3 text-sm text-text-muted">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1">
                  <Calendar aria-hidden="true" className="w-4 h-4 shrink-0" />
                  <PostDate date={post.date} label="Published" />
                </span>
                {post.updated ? <PostDate date={post.updated} label="Updated" /> : null}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-1">
                  <Clock aria-hidden="true" className="w-4 h-4" />
                  {post.readingTime}
                </span>
                <span className="flex items-center gap-1 text-link-primary group-hover:gap-2 transition-all">
                  Read more
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
