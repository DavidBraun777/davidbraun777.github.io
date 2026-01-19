import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 mt-8">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
      {children}
    </p>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href || '#'} className="text-primary-600 dark:text-primary-400 hover:underline">
        {children}
      </Link>
    )
  },
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-slate-600 dark:text-slate-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-600 dark:text-slate-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-lg">{children}</li>,
  code: ({ children, className }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-mono">
          {children}
        </code>
      )
    }
    return (
      <code className={className}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="p-4 rounded-xl bg-slate-900 dark:bg-slate-800 overflow-x-auto mb-4 text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4">
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
