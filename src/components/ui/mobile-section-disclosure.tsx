'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileSectionDisclosureProps {
  preview: string
  openLabel: string
  closeLabel?: string
  children: ReactNode
  className?: string
}

export function MobileSectionDisclosure({
  preview,
  openLabel,
  closeLabel = 'Hide details',
  children,
  className,
}: MobileSectionDisclosureProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="md:hidden">
        <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-text-secondary">
            {preview}
          </p>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
            aria-expanded={open}
          >
            {open ? closeLabel : openLabel}
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
            />
          </button>
        </div>
      </div>

      <div className={cn('hidden md:block', className)}>{children}</div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={cn('overflow-hidden md:hidden', className)}
          >
            <div className="pt-5">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
