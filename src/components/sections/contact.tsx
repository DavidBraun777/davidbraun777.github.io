'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Send,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { profile } from '@/data/profile'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface ContactProps {
  calLink?: string
  showSectionHeader?: boolean
  title?: string
  subtitle?: string
  sectionId?: string
}

const conversationTypeOptions = [
  { value: 'consulting', label: 'Workflow automation project' },
  { value: 'build', label: 'New system or internal tool' },
  { value: 'architecture', label: 'System integration or reliability review' },
  { value: 'other', label: 'Other' },
]

const serviceOptions = [
  { value: 'applied-ai', label: 'Lead automation' },
  { value: 'workflow-automation', label: 'Workflow automation' },
  { value: 'platform-infra', label: 'System integration' },
  { value: 'product-delivery', label: 'Operational software build' },
  { value: 'accessibility', label: 'Public-facing accessible system' },
  { value: 'other', label: 'Other' },
]

const urgencyOptions = [
  { value: 'exploring', label: 'Researching options' },
  { value: 'this-quarter', label: 'Need it this quarter' },
  { value: 'this-month', label: 'Need it this month' },
  { value: 'urgent', label: 'Urgent' },
]

const fitPoints = [
  'A repeated workflow is taking too much manual effort.',
  'Important information has to move across multiple tools or systems.',
  'Leads or requests are slipping because follow-up is inconsistent.',
]

const nextStepPoints = [
  'We talk through the workflow, the bottleneck, and the goal.',
  'If there is a fit, I follow up with a scoped next step.',
  'If there is not a fit, I will say so directly.',
]

export function Contact({
  calLink,
  showSectionHeader = true,
  title = 'Book a call',
  subtitle = 'Use this page if you want to reduce manual work, connect systems, or clean up an unreliable workflow.',
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
  const formAnchorId = `${sectionId}-fields`

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
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
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }

    clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => setFormStatus('idle'), 5000)
  }

  useEffect(() => {
    return () => clearTimeout(resetTimerRef.current)
  }, [])

  return (
    <section id={sectionId} className="section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showSectionHeader ? <SectionHeader title={title} subtitle={subtitle} /> : null}

        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                      Start with a short call
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                      Primary path
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    Best for owners and operators who already know a workflow is too
                    manual, too messy, or too unreliable.
                  </p>
                  <a
                    href={calendlyUrl ?? `#${formAnchorId}`}
                    target={calendlyUrl ? '_blank' : undefined}
                    rel={calendlyUrl ? 'noopener noreferrer' : undefined}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
                  >
                    Book a Call
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-text-primary">Good fit if</h2>
              <div className="mt-5 space-y-3">
                {fitPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-border-subtle bg-background-subtle px-4 py-3 text-sm leading-7 text-text-secondary"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-text-primary">What happens next</h2>
              <div className="mt-5 space-y-4">
                {nextStepPoints.map((point, index) => (
                  <div key={point} className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 font-mono text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                      {index + 1}
                    </div>
                    <p className="flex-1 pt-0.5 text-sm leading-7 text-text-secondary">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
                <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-text-primary">Response time</h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {profile.responseTime}
                </p>
              </article>

              <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
                <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-text-primary">Privacy</h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  Anything you share here is used only to evaluate fit for the conversation.
                </p>
              </article>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                Prefer to send details first?
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Use the form if you want to share the workflow, the systems involved,
                and the timing before booking.
              </p>
            </div>

            <form id={formAnchorId} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  id="contact-name"
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  maxLength={100}
                  required
                />
                <Input
                  id="contact-email"
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  maxLength={254}
                  required
                />
              </div>

              <Input
                id="contact-subject"
                label="What do you need help with?"
                type="text"
                placeholder="Example: automate lead follow-up across forms and our CRM"
                value={formData.subject}
                onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                maxLength={200}
                required
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  id="contact-project-type"
                  label="Project type"
                  placeholder="Select one"
                  options={conversationTypeOptions}
                  value={formData.projectType}
                  onChange={(event) =>
                    setFormData({ ...formData, projectType: event.target.value })
                  }
                />
                <Select
                  id="contact-service"
                  label="Primary need"
                  placeholder="Select one"
                  options={serviceOptions}
                  value={formData.serviceNeeded}
                  onChange={(event) =>
                    setFormData({ ...formData, serviceNeeded: event.target.value })
                  }
                />
                <Select
                  id="contact-urgency"
                  label="Timeline"
                  placeholder="Select one"
                  options={urgencyOptions}
                  value={formData.urgency}
                  onChange={(event) => setFormData({ ...formData, urgency: event.target.value })}
                />
              </div>

              <Textarea
                id="contact-message"
                label="Project details"
                placeholder="Describe the workflow, what is breaking, and what outcome you want."
                rows={7}
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                maxLength={2000}
                required
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  isLoading={formStatus === 'loading'}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Project Details
                </Button>

                <p className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Mail className="h-4 w-4" />
                  Private intake. Direct reply from David.
                </p>
              </div>

              {formStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2 text-green-600 dark:text-green-400"
                >
                  <CheckCircle className="h-5 w-5" />
                  Message sent. I&apos;ll follow up soon.
                </motion.div>
              ) : null}

              {formStatus === 'error' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-start gap-2 text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5" />
                  <p className="text-sm leading-7">
                    Something went wrong. Try again, or use the booking option above so
                    the conversation does not stall.
                  </p>
                </motion.div>
              ) : null}
            </form>

            <a
              href={calendlyUrl ?? `#${formAnchorId}`}
              target={calendlyUrl ? '_blank' : undefined}
              rel={calendlyUrl ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
            >
              Use the faster path and book a call
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
