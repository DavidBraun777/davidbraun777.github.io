import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Download, FileText } from 'lucide-react'
import type { ResumeDocument } from '@/data/resumes'

const actionClass =
  'inline-flex items-center gap-2 rounded-full border border-border-subtle px-5 py-3 text-sm font-medium text-link-primary transition-colors hover:border-border-strong hover:bg-background-subtle hover:text-link-primary-hover'

export function ResumeCard({ document }: Readonly<{ document: ResumeDocument }>) {
  return (
    <article
      aria-labelledby={`${document.id}-heading`}
      className="flex flex-col rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8"
    >
      <FileText aria-hidden="true" className="h-6 w-6 text-link-primary" />
      <p className="mt-4 text-sm font-medium text-link-primary">{document.audience}</p>
      <h2
        id={`${document.id}-heading`}
        className="mt-3 text-2xl font-semibold tracking-tight text-text-primary"
      >
        {document.title}
      </h2>
      <p className="mb-6 mt-4 text-sm leading-7 text-text-secondary">{document.description}</p>
      {document.href ? (
        <div className="mt-auto flex flex-wrap gap-3">
          <a
            href={document.href}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClass}
          >
            {document.viewLabel}
            <span className="sr-only">: {document.title} (opens in a new tab)</span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <a href={document.href} download className={actionClass}>
            {document.downloadLabel}
            <span className="sr-only">: {document.title}</span>
            <Download aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      ) : (
        <div className="mt-auto">
          <p className="mb-3 text-sm text-text-secondary">{document.kind} available upon request.</p>
          <Link href={document.requestHref} className={actionClass}>
            Request {document.kind}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      )}
    </article>
  )
}
