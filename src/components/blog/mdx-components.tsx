import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'
import { ContentDetails, DisclosurePanel } from '@/components/site/disclosure-panel'

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 {...props} className="text-4xl font-bold text-text-primary mb-6 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 {...props} className="text-3xl font-bold text-text-primary mb-4 mt-8">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="text-2xl font-semibold text-text-primary mb-3 mt-6">
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => <h4 {...props} className="text-xl font-semibold text-text-primary mb-3 mt-6">{children}</h4>,
  h5: ({ children, ...props }) => <h5 {...props} className="text-lg font-semibold text-text-primary mb-3 mt-6">{children}</h5>,
  h6: ({ children, ...props }) => <h6 {...props} className="text-base font-semibold text-text-primary mb-3 mt-6">{children}</h6>,
  p: ({ children, ...props }) => (
    <p {...props} className="text-lg text-text-secondary mb-4 leading-relaxed">
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          {...props}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link-primary hover:underline"
        >
          {children}
        </a>
      )
    }
    return (
      <Link {...props} href={href || '#'} className="text-link-primary hover:underline">
        {children}
      </Link>
    )
  },
  ul: ({ children, ...props }) => (
    <ul {...props} className="list-disc list-inside space-y-2 mb-4 text-text-secondary">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="list-decimal list-inside space-y-2 mb-4 text-text-secondary">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => <li {...props} className="text-lg">{children}</li>,
  table: ({ children, ...props }) => <div data-content-table className="my-6 max-w-full overflow-x-auto"><table {...props} className="w-full border-collapse text-left text-text-secondary">{children}</table></div>,
  thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => <tr {...props} className="border-b border-border-subtle">{children}</tr>,
  th: ({ children, ...props }) => <th {...props} className="p-3 font-semibold text-text-primary">{children}</th>,
  td: ({ children, ...props }) => <td {...props} className="p-3">{children}</td>,
  details: ContentDetails,
  ContentDetails,
  DisclosurePanel,
  code: ({ children, className, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code {...props} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-link-primary text-sm font-mono">
          {children}
        </code>
      )
    }
    return (
      <code {...props} className={className}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }) => (
    <pre {...props} className="p-4 rounded-xl bg-slate-900 dark:bg-slate-800 overflow-x-auto mb-4 text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote {...props} className="border-l-4 border-primary-500 pl-4 italic text-text-muted my-4">
      {children}
    </blockquote>
  ),
  img: ({ src, alt }) => (
    <div className="relative w-full h-64 md:h-96 my-6 rounded-xl overflow-hidden">
      <Image
        src={src || ''}
        alt={alt || ''}
        fill
        className="object-cover"
      />
    </div>
  ),
  hr: () => <hr className="my-8 border-slate-200 dark:border-slate-800" />,
}
