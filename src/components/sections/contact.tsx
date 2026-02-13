'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, CheckCircle, AlertCircle, Calendar, Clock } from 'lucide-react'
import { socialLinks } from '@/data/social-links'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const projectTypeOptions = [
  { value: 'home', label: 'Personal / Home' },
  { value: 'business', label: 'Business' },
  { value: 'school', label: 'School / Academic' },
  { value: 'fun', label: 'Side Project / Fun' },
  { value: 'other', label: 'Other' },
]

const serviceOptions = [
  { value: 'bugfix', label: 'Bug Fix' },
  { value: 'feature', label: 'New Feature' },
  { value: 'infra', label: 'Infrastructure' },
  { value: 'security', label: 'Security' },
  { value: 'ai', label: 'AI / ML' },
  { value: 'other', label: 'Other' },
]

const urgencyOptions = [
  { value: 'today', label: 'ASAP' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
]

export function Contact() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>()
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
          subtitle="Have a question or want to work together?"
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
                Let&apos;s connect
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                I&apos;m always open to discussing new opportunities, interesting projects, or just having a conversation about technology and innovation.
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
                    href="mailto:davidjbraun777@gmail.com?subject=Let's%20Chat%20-%2015min%20Call"
                    className="text-lg font-medium text-slate-900 dark:text-white hover:text-accent-emerald transition-colors"
                  >
                    Book a 15-min call
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
                      <Icon className="w-5 h-5" />
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
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={254}
                  required
                />
              </div>
              <Input
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
                  placeholder="What are you building?"
                  options={projectTypeOptions}
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                />
                <Select
                  placeholder="What do you need?"
                  options={serviceOptions}
                  value={formData.serviceNeeded}
                  onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                />
                <Select
                  placeholder="Urgency"
                  options={urgencyOptions}
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                />
              </div>

              <Textarea
                placeholder="Your message"
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

              {/* Status messages */}
              {formStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
