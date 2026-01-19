'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline'

interface BadgeProps extends Omit<HTMLMotionProps<'span'>, 'ref'> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  default:
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  primary:
    'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  secondary:
    'bg-accent-violet/10 text-accent-violet dark:bg-accent-violet/20',
  outline:
    'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <motion.span
        ref={ref}
        whileHover={{ scale: 1.05 }}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.span>
    )
  }
)

Badge.displayName = 'Badge'
