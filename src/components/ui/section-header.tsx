'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        {title}
      </h2>
      <div
        className={cn(
          'h-1 w-20 bg-gradient-to-r from-primary-500 to-accent-violet rounded-full',
          align === 'center' && 'mx-auto'
        )}
      />
      {subtitle && (
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
