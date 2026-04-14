'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Send,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { socialLinks } from '@/data/social-links'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface ContactProps {
  calLink?: string
  showSectionHeader?: boolean
  title?: string
  subtitle?: string
  sectionId?: string
}

const conversationTypeOptions = [
  { value: 'full-time', label: 'Full-time role' },
  { value: 'consulting', label: 'Consulting engagement' },
  { value: 'build', label: 'Product or platform build' },
  { value: 'architecture', label: 'Architecture / technical review' },
  { value: 'other', label: 'Other' },
]

const serviceOptions = [
  { value: 'applied-ai', label: 'Applied AI systems' },
  { value: 'workflow-automation', label: 'Workflow automation' },
  { value: 'platform-infra', label: 'Platform / infrastructure' },
  { value: 'product-delivery', label: 'Domain-specific software' },
  { value: 'accessibility', label: 'Accessibility-minded product work' },
  { value: 'other', label: 'Other' },
]

const urgencyOptions = [
  { value: 'exploring', label: 'Exploring' },
  { value: 'this-quarter', label: 'This quarter' },
  { value: 'this-month', label: 'This month' },
  { value: 'urgent', label: 'Urgent' },
]

export function Contact({
  calLink,
  showSectionHeader = true,
  title = 'Get In Touch',
  subtitle = 'For systems work where architecture, implementation, and product judgment all need to show up in the same project.',
  sectionId = 'contact',
}: ContactProps) {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: '',
    serviceNeeded: '',
    urgency: '',
  })
  const calendlyUrl =
    typeof calLink === 'string' && /^https?:\/\//i.test(calLink.trim())
      ? calLink.trim()
      : null
  const linkedinUrl =
    socialLinks.find((link) => link.name === 'LinkedIn')?.url ??
    'https://linkedin.com/in/david-braun777'
  const formAnchorId = `${sectionId}-fields`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearTimeout(resetTimerRef.current)
    setFormStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-contact-submission-id': crypto.randomUUID(),
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          projectType: '',
          serviceNeeded: '',
          urgency: '',
        })
      } else {
        const data = await response.json()
        console.error('Contact form error:', data.error)
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }

    clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => setFormStatus('idle'), 5000)
  }

  // Clean up pending timer on unmount
  useEffect(() => {
    return () => clearTimeout(resetTimerRef.current)
  }, [])

  return (
    <section id={sectionId} className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {showSectionHeader ? <SectionHeader title={title} subtitle={subtitle} /> : null}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Start a conversation
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                If you need someone who can turn complex ideas into working systems,
                automate real workflows, and build with both speed and engineering rigor,
                let&apos;s talk. I&apos;m open to full-time roles, consulting engagements,
                and selected builds.
              </p>
              <Link
                href="/resume"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
              >
                View resume, skills, and credentials
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                  <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Private inbox</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    Use the form below for direct replies
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Messages route through a private mailbox and I reply directly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent-violet/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-accent-violet" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    Maple Grove, Minnesota
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent-emerald/10 rounded-xl">
                    <Calendar className="w-6 h-6 text-accent-emerald" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Quick chat</p>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                        Preferred
                      </span>
                    </div>
                    <a
                      href={calendlyUrl ?? `#${formAnchorId}`}
                      target={calendlyUrl ? '_blank' : undefined}
                      rel={calendlyUrl ? 'noopener noreferrer' : undefined}
                      className="mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-slate-900 transition-colors hover:text-accent-emerald dark:text-white"
                    >
                      {calendlyUrl ? 'Book a 15-minute meeting' : 'Request a 15-minute meeting'}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Best for role fit, system scope, or project next steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Profiles</p>
              <div className="flex gap-4">
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
                      className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label={link.name}
                    >
                      <Icon aria-hidden="true" className="w-5 h-5" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <form id={formAnchorId} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  id="contact-name"
                  label="Your name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                  required
                />
                <Input
                  id="contact-email"
                  label="Your email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={254}
                  required
                />
              </div>
              <Input
                id="contact-subject"
                label="Subject"
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                maxLength={200}
                required
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <Select
                  id="contact-project-type"
                  label="Conversation type"
                  placeholder="What is this about?"
                  options={conversationTypeOptions}
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                />
                <Select
                  id="contact-service"
                  label="Focus area"
                  placeholder="What kind of work?"
                  options={serviceOptions}
                  value={formData.serviceNeeded}
                  onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                />
                <Select
                  id="contact-urgency"
                  label="Timeline"
                  placeholder="Timeline"
                  options={urgencyOptions}
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                />
              </div>

              <Textarea
                id="contact-message"
                label="Your message"
                placeholder="What workflow, product, or system are you trying to build?"
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                maxLength={2000}
                required
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  isLoading={formStatus === 'loading'}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>

                <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  I typically reply within 24 hours
                </p>
              </div>

              {formStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2 text-green-600 dark:text-green-400"
                >
                  <CheckCircle className="w-5 h-5" />
                  Message sent successfully! I&apos;ll get back to you soon.
                </motion.div>
              )}
              {formStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex flex-col gap-2 text-red-600 dark:text-red-400"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Something went wrong. Please try again or reach out on LinkedIn.
                  </div>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-7 text-sm text-primary-600 hover:underline dark:text-primary-400"
                  >
                    linkedin.com/in/david-braun777
                  </a>
                </motion.div>
              )}
            </form>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
