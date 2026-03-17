'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { resumeUrl, socialLinks } from '@/data/social-links'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Experience', href: '/background' },
  { label: 'Resume', href: resumeUrl, external: true },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-violet bg-clip-text text-transparent">
              David Braun
            </Link>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              AI systems engineer building automation platforms, applied AI workflows, and infrastructure-backed software.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary-600 dark:hover:text-primary-300"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-primary-600 dark:hover:text-primary-300"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
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
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                  aria-label={link.name}
                >
                  <Icon aria-hidden="true" className="w-5 h-5" />
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Built with Next.js, Tailwind CSS, and MDX.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            &copy; {currentYear} David Braun. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
