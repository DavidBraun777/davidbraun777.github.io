'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { socialLinks } from '@/data/social-links'
import { Heart } from 'lucide-react'

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
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Software Engineer & AI Enthusiast
            </p>
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
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using Next.js & Tailwind
          </p>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            &copy; {currentYear} David Braun. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
