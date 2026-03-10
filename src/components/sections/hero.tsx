'use client'

import { motion } from 'framer-motion'
import { ArrowDown, MapPin } from 'lucide-react'
import Image from 'next/image'
import { socialLinks } from '@/data/social-links'
import { Button } from '@/components/ui/button'

const focusAreas = [
  'AI systems',
  'automation',
  'cloud & DevOps',
  'accessibility-minded engineering',
]

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-violet/10 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950" />

      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary-400/30 blur-3xl animate-pulse dark:bg-primary-600/20" />
      <div
        className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-accent-violet/20 blur-3xl animate-pulse dark:bg-accent-violet/10"
        style={{ animationDelay: '1s' }}
      />
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-5"
            >
              <span className="inline-flex rounded-full border border-primary-200/70 bg-white/80 px-4 py-2 text-sm font-semibold tracking-[0.08em] text-primary-700 uppercase shadow-sm dark:border-primary-900/60 dark:bg-slate-900/70 dark:text-primary-300">
                Applied AI &amp; Infrastructure Engineer
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-5 text-5xl font-bold md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-primary-600 via-accent-violet to-accent-cyan bg-clip-text text-transparent">
                David Braun
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-5 text-2xl leading-tight text-slate-800 dark:text-slate-100 md:text-3xl"
            >
              I build AI-powered products, automation systems, and production infrastructure that move from concept to working delivery.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0"
            >
              My work sits at the intersection of AI systems, backend services, developer infrastructure, and accessibility-minded product engineering.
              I&apos;m most useful when a team needs clear architecture, fast iteration, and someone willing to make the future happen instead of just describing it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400 lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Maple Grove, Minnesota
              </span>
              <span className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 dark:border-slate-800 dark:bg-slate-900/70">
                Open to full-time roles, consulting, and selected builds
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              {focusAreas.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                >
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Button size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Discuss a Role or Build
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                View Projects
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-4 lg:justify-start"
            >
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-white p-3 text-slate-600 shadow-lg transition-shadow hover:text-primary-600 hover:shadow-xl dark:bg-slate-800 dark:text-slate-400 dark:hover:text-primary-400"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 via-accent-violet to-accent-cyan p-1">
                <div className="h-full w-full rounded-full bg-white dark:bg-slate-900" />
              </div>
              <div className="absolute inset-2 overflow-hidden rounded-full">
                <Image
                  src="/images/profile/Smolder.png"
                  alt="David Braun"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-2 -bottom-2 rounded-2xl bg-white p-3 shadow-xl dark:bg-slate-800"
              >
                <span className="text-2xl">🚀</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.button
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="p-2 text-slate-400 transition-colors hover:text-primary-500"
            aria-label="Scroll down"
          >
            <ArrowDown className="h-6 w-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
