import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExternalLinkActionProps {
  href: string
  children?: ReactNode
  className?: string
  iconOnly?: boolean
  ariaLabel?: string
}

export function ExternalLinkAction({
  href,
  children,
  className,
  iconOnly = false,
  ariaLabel,
}: ExternalLinkActionProps) {
  if (iconOnly) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-background-subtle text-link-primary shadow-sm transition-colors hover:border-border-strong hover:bg-background-elevated hover:text-link-primary-hover',
          className
        )}
      >
        <ArrowUpRight className="h-4 w-4" />
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover',
        className
      )}
    >
      <span>{children}</span>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle bg-background-elevated text-link-primary shadow-sm transition-colors group-hover:border-border-strong group-hover:bg-background-subtle group-hover:text-link-primary-hover">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </a>
  )
}
