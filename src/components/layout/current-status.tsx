'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code, BookOpen, Rocket } from 'lucide-react'

const statuses = [
  { icon: BookOpen, label: 'Studying', value: 'AI Master\'s @ St. Thomas' },
  { icon: Code, label: 'Building', value: 'Automation Platforms' },
  { icon: Rocket, label: 'Shipping', value: 'Operational Software' },
  { icon: Sparkles, label: 'Exploring', value: 'Applied AI Workflows' },
]

export function CurrentStatus() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statuses.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const current = statuses[currentIndex]
  const Icon = current.icon

  return (
    <motion.div
      className="flex h-[38px] w-[248px] items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 whitespace-nowrap backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/60"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex w-full items-center justify-center gap-1.5 text-center"
        >
          <Icon className="h-3 w-3 shrink-0 text-primary-500/80 dark:text-primary-400/80" />
          <span className="shrink-0 text-[13px] text-slate-500 dark:text-slate-400">
            {current.label}:
          </span>
          <span className="max-w-[150px] truncate text-[13px] font-medium text-slate-800 dark:text-slate-200">
            {current.value}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
