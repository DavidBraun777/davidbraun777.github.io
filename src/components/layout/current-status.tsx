'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code, BookOpen, Rocket } from 'lucide-react'

const statuses = [
  { icon: BookOpen, label: 'Learning', value: 'Machine Learning' },
  { icon: Code, label: 'Building', value: 'AI-Powered Apps' },
  { icon: Rocket, label: 'Exploring', value: 'Kubernetes & DevOps' },
  { icon: Sparkles, label: 'Studying', value: 'Cloud Architecture' },
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
      className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Icon className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-sm text-slate-400">
            {current.label}:
          </span>
          <span className="text-sm font-medium text-primary-400">
            {current.value}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
