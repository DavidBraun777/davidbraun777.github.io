'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, CheckCircle, AlertCircle, Calendar, Clock } from 'lucide-react'
import { socialLinks } from '@/data/social-links'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

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

export function Contact() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearTimeout(resetTimerRef.current)
    setFormStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <section id="contact" className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Get In Touch"
          subtitle="For roles and projects where architecture, implementation, and product judgment all matter."
        />

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
                If you need someone who can move from system design to working delivery across applied AI, workflow software, and infrastructure, let&apos;s talk. I&apos;m open to full-time roles, consulting engagements, and selected builds.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                  <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <a
                    href="mailto:davidjbraun777@gmail.com"
                    className="text-lg font-medium text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    davidjbraun777@gmail.com
                  </a>
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

              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent-emerald/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-accent-emerald" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Quick chat</p>
                  <a
                    href="mailto:davidjbraun777@gmail.com?subject=Request%20a%2015-minute%20intro%20call"
                    className="text-lg font-medium text-slate-900 dark:text-white hover:text-accent-emerald transition-colors"
                  >
                    Request a 15-min call
                  </a>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Find me on social media
              </p>
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
          >
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Optional structured dropdowns */}
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

              {/* Status messages — live regions for screen readers */}
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
                    Something went wrong. Please try again or email me directly.
                  </div>
                  <a
                    href="mailto:davidjbraun777@gmail.com"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline ml-7"
                  >
                    davidjbraun777@gmail.com
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
