import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const primaryActionClass =
  'inline-flex items-center gap-2 rounded-full border border-primary-800/10 bg-primary-700 px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-26px_rgba(10,41,104,0.5)] transition-colors hover:bg-primary-800'

const secondaryActionClass =
  'inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary'

interface Action {
  label: string
  href: string
  icon?: LucideIcon
  external?: boolean
  variant?: 'primary' | 'secondary'
}

interface PageIntroProps {
  eyebrow?: string
  title: string
  description: string
  actions?: Action[]
  aside?: ReactNode
  className?: string
}

export function PageIntro({
  eyebrow,
  title,
  description,
  actions = [],
  aside,
  className,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        'rounded-[2rem] border border-border-subtle bg-background-elevated px-6 py-8 shadow-sm sm:px-8 sm:py-10',
        className
      )}
    >
      <div className={cn('grid gap-8', aside && 'xl:grid-cols-[1.15fr_0.85fr] xl:items-start')}>
        <div>
          {eyebrow ? (
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
            {description}
          </p>

          {actions.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => {
                const Icon = action.icon ?? ArrowRight

                return action.external ? (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      action.variant === 'secondary'
                        ? secondaryActionClass
                        : primaryActionClass
                    )}
                  >
                    {action.label}
                    <Icon className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={cn(
                      action.variant === 'secondary'
                        ? secondaryActionClass
                        : primaryActionClass
                    )}
                  >
                    {action.label}
                    <Icon className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>
          ) : null}
        </div>

        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  )
}
