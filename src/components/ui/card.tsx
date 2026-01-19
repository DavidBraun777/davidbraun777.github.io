'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
        transition={{ type: 'spring', stiffness: 300 }}
        className={cn(
          'rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
  )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)

CardFooter.displayName = 'CardFooter'
