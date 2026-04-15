'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Binary, Braces, MapPin, Network, Workflow } from 'lucide-react'
import { socialLinks } from '@/data/social-links'
import { Button } from '@/components/ui/button'

const exampleSystems = [
  'AI-powered automation platforms',
  'retrieval and knowledge systems',
  'workflow automation tools',
  'production AI infrastructure',
]

const systemSignals = [
  {
    title: 'Workflow Design',
    detail:
      'Start with the operational path: how requests enter the system, how tasks are routed, and where humans or downstream services need clean handoffs.',
    icon: Workflow,
  },
  {
    title: 'AI Application Layer',
    detail:
      'Use models inside structured pipelines for retrieval, classification, generation, or guidance, with validation around the output instead of trust by default.',
    icon: Braces,
  },
  {
    title: 'Infrastructure and State',
    detail:
      'Back the workflow with queues, persistence, observability, and service boundaries so the system can be operated like software instead of a demo.',
    icon: Network,
  },
]

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36 lg:pb-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(6,182,212,0.14),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-5 sm:flex-row sm:items-center"
            >
              <div className="relative h-64 w-64 overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/75 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.95)] backdrop-blur sm:h-40 sm:w-40 lg:h-40 lg:w-40">
                <Image
                  src="/images/profile/Smolder.png"
                  alt="David Braun portrait"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 160px, 256px"
                  priority
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium tracking-[0.08em] text-primary-200 uppercase backdrop-blur">
                  <Binary className="h-4 w-4" />
                  Applied AI + Infrastructure
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.9rem]">
                  David Braun
                </p>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.7 }}
              className="mt-8 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              <span className="block">AI Systems Engineer</span>
              <span className="mt-2 block text-slate-200">building automation platforms</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7 }}
              className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-200"
            >
              I design and build systems that combine AI, workflow automation, and
              infrastructure to solve real operational problems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300"
            >
              The work is systems-first: architecture, orchestration, validation, state,
              and delivery paths that turn AI capability into usable software.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur"
            >
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-200">
                Examples of systems I build
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {exampleSystems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 backdrop-blur">
                <MapPin className="h-4 w-4 text-primary-300" />
                White Bear Lake, MN
              </span>
              <span className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 dark:border-slate-800 dark:bg-slate-900/70">
                Open to full-time roles, consulting, and selected systems work
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.6 }}
              className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="min-w-[190px]"
                onClick={() =>
                  document
                    .getElementById('selected-systems')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                View Systems
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Start a Conversation
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.66, duration: 0.6 }}
              className="mt-8 flex items-center gap-3"
            >
              {socialLinks.map((link) => {
                const Icon = link.icon

                return (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.06, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full border border-white/10 bg-white/6 p-3 text-slate-200 transition-colors hover:border-primary-300/30 hover:text-white"
                    aria-label={link.name}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary-500/20 via-accent-violet/10 to-accent-cyan/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_120px_-40px_rgba(2,6,23,0.8)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary-300">
                    System Lens
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    AI is one layer in the architecture
                  </h2>
                </div>
                <div className="hidden rounded-[1.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(15,23,42,0.52))] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:flex sm:flex-col sm:items-end">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">
                    Framing
                  </span>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-300">
                    <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5">
                      problem
                    </span>
                    <span className="h-1 w-1 rounded-full bg-primary-300/70" />
                    <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5">
                      system
                    </span>
                    <span className="h-1 w-1 rounded-full bg-primary-300/70" />
                    <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5">
                      outcome
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {systemSignals.map((signal, index) => {
                  const Icon = signal.icon

                  return (
                    <div
                      key={signal.title}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex rounded-2xl bg-primary-500/15 p-3 text-primary-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                            Layer {index + 1}
                          </p>
                          <h3 className="text-lg font-semibold text-white">{signal.title}</h3>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">
                        {signal.detail}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                    Operating Pattern
                  </p>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    systems first
                  </span>
                </div>
                <div className="mt-4 grid gap-3 font-mono text-sm text-slate-300 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    + automation platforms
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    + retrieval systems
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    + workflow tooling
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    + production infrastructure
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
