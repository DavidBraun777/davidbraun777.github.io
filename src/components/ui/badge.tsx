import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  default:
    'bg-background-subtle text-text-secondary',
  primary:
    'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
  secondary:
    'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200',
  outline:
    'border border-border-subtle text-text-secondary',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-default',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
