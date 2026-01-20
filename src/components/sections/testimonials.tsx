'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Image from 'next/image'
import { testimonials } from '@/data/testimonials'
import { SectionHeader } from '@/components/ui/section-header'

export function Testimonials() {
  // Don't render section if no real testimonials
  if (testimonials.length === 0 || testimonials[0].name === 'Coming Soon') {
    return null
  }

  return (
    <section id="testimonials" className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Testimonials"
          subtitle="What colleagues say about working with me"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-100 dark:text-primary-900" />

              <p className="text-slate-600 dark:text-slate-300 mb-6 relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {testimonial.image ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
