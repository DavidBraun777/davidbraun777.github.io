'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { profile } from '@/data/profile'
import { getContactFailure, getSchedulingUrl } from '@/lib/contact-feedback'
import {
  parseInquiryType,
  type InquiryType,
  type ServiceType,
  type UrgencyLevel,
} from '@/lib/contact-validation'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface ContactProps {
  calLink?: string
  initialInquiryType?: InquiryType
  showSectionHeader?: boolean
  title?: string
  subtitle?: string
  sectionId?: string
}

const inquiryTypeOptions = [
  { value: 'employment', label: 'Employment / Engineering Role' },
  { value: 'consulting', label: 'Consulting / Project' },
  { value: 'research', label: 'Research Collaboration' },
  { value: 'speaking', label: 'Speaking / Professional' },
  { value: 'other', label: 'Other' },
]

const serviceOptions = [
  { value: 'workflow-automation', label: 'Workflow automation' },
  { value: 'platform-infra', label: 'System integration' },
  { value: 'product-delivery', label: 'Operational software build' },
  { value: 'applied-ai', label: 'Data, dashboard, or AI-assisted workflow' },
  { value: 'accessibility', label: 'Public-facing accessible system' },
  { value: 'other', label: 'Other' },
]

const urgencyOptions = [
  { value: 'exploring', label: 'Exploring / no fixed date' },
  { value: 'this-quarter', label: 'Within the next three months' },
  { value: 'this-month', label: 'Within the next month' },
  { value: 'urgent', label: 'Time-sensitive' },
]

interface InquiryCopy {
  heading: string
  guidance: string
  organizationLabel: string
  organizationPlaceholder: string
  subjectLabel: string
  subjectPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
}

const defaultInquiryCopy: InquiryCopy = {
  heading: 'What would you like to discuss?',
  guidance: 'Select an inquiry type so I can route the conversation appropriately.',
  organizationLabel: 'Organization (optional)',
  organizationPlaceholder: 'Company, institution, or organization',
  subjectLabel: 'Subject',
  subjectPlaceholder: 'A short summary of your inquiry',
  messageLabel: 'What context would help me understand the inquiry?',
  messagePlaceholder: 'Share the opportunity, relevant background, timing, and what a useful next step would look like.',
}

const inquiryCopy: Record<InquiryType, InquiryCopy> = {
  employment: {
    heading: 'Tell me about the engineering opportunity.',
    guidance: 'Helpful context includes the company, role, employment type, team, and hiring timeline.',
    organizationLabel: 'Company (optional)',
    organizationPlaceholder: 'Company or organization',
    subjectLabel: 'Role or opportunity',
    subjectPlaceholder: 'Example: Senior platform engineering role',
    messageLabel: 'What should I know about the role and team?',
    messagePlaceholder: 'Share the role, employment type, team context, hiring process, timeline, and any useful links.',
  },
  consulting: {
    heading: 'Tell me about the system or workflow.',
    guidance: 'Helpful context includes the current problem, users, integrations, constraints, timeline, and approximate scope.',
    organizationLabel: 'Organization (optional)',
    organizationPlaceholder: 'Company or organization',
    subjectLabel: 'System or workflow problem',
    subjectPlaceholder: 'Example: automate lead follow-up across forms and our CRM',
    messageLabel: 'What is happening now, and what do you want instead?',
    messagePlaceholder: 'Describe the workflow, what is breaking, who uses it, relevant data or AI constraints, timeline, and desired outcome.',
  },
  research: {
    heading: 'Tell me about the research collaboration.',
    guidance: 'Helpful context includes the institution, research topic, collaboration type, and relevant paper or project.',
    organizationLabel: 'Institution or organization (optional)',
    organizationPlaceholder: 'University, lab, or organization',
    subjectLabel: 'Research topic or collaboration',
    subjectPlaceholder: 'Example: hybrid retrieval evaluation collaboration',
    messageLabel: 'What research context and collaboration would be useful?',
    messagePlaceholder: 'Share the topic, collaboration type, relevant paper or project, expected contribution, and timing.',
  },
  speaking: {
    heading: 'Tell me about the speaking opportunity.',
    guidance: 'Helpful context includes the organization, audience, topic, format, date, and location or platform.',
    organizationLabel: 'Organization (optional)',
    organizationPlaceholder: 'Event host or organization',
    subjectLabel: 'Event or topic',
    subjectPlaceholder: 'Example: applied AI systems panel',
    messageLabel: 'What should I know about the event?',
    messagePlaceholder: 'Share the audience, topic, format, date, location or platform, and what you would like me to contribute.',
  },
  other: {
    ...defaultInquiryCopy,
    heading: 'Tell me what you have in mind.',
    guidance: 'Share the organization, context, timing, and the next step you are proposing.',
  },
}

interface ContactFormState {
  name: string
  email: string
  inquiryType: InquiryType | ''
  organization: string
  subject: string
  message: string
  serviceNeeded: ServiceType | ''
  urgency: UrgencyLevel | ''
}

function createInitialFormData(
  initialInquiryType?: InquiryType
): ContactFormState {
  return {
    name: '',
    email: '',
    inquiryType: initialInquiryType ?? '',
    organization: '',
    subject: '',
    message: '',
    serviceNeeded: '',
    urgency: '',
  }
}

export function Contact({
  calLink,
  initialInquiryType,
  showSectionHeader = true,
  title = 'Start with the inquiry form',
  subtitle = 'Choose the kind of conversation, then share enough context for a useful next step.',
  sectionId = 'contact',
}: Readonly<ContactProps>) {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0)
  const lastSubmissionRef = useRef<{ body: string; id: string } | null>(null)
  const [formData, setFormData] = useState<ContactFormState>(() =>
    createInitialFormData(initialInquiryType)
  )
  const selectedInquiryCopy = formData.inquiryType
    ? inquiryCopy[formData.inquiryType]
    : defaultInquiryCopy
  const calendlyUrl = getSchedulingUrl(calLink)

  const handleInquiryTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const inquiryType = parseInquiryType(event.target.value) ?? ''
    setFormData((current) => ({
      ...current,
      inquiryType,
      serviceNeeded: inquiryType === 'consulting' ? current.serviceNeeded : '',
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (formStatus === 'loading' || retryAfterSeconds > 0) return
    setFormStatus('loading')

    try {
      const body = JSON.stringify(formData)
      if (lastSubmissionRef.current?.body !== body) {
        lastSubmissionRef.current = { body, id: crypto.randomUUID() }
      }
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-contact-submission-id': lastSubmissionRef.current.id,
        },
        body,
      })

      if (response.ok) {
        lastSubmissionRef.current = null
        setFormData(createInitialFormData(initialInquiryType))
        setFormStatus('success')
      } else {
        const failure = getContactFailure(response)
        setErrorMessage(failure.message)
        setRetryAfterSeconds(failure.retryAfterSeconds)
        setFormStatus('error')
      }
    } catch {
      setErrorMessage('We couldn’t confirm delivery. Check your connection and try again. Your draft is still here.')
      setFormStatus('error')
    }
  }

  useEffect(() => {
    if (retryAfterSeconds === 0) return
    const timer = setTimeout(() => {
      setRetryAfterSeconds(0)
      setErrorMessage('You can try sending your inquiry again now. Your draft is still here.')
    }, retryAfterSeconds * 1000)
    return () => clearTimeout(timer)
  }, [retryAfterSeconds])

  return (
    <section id={sectionId} className="section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showSectionHeader ? <SectionHeader title={title} subtitle={subtitle} /> : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] lg:items-start lg:gap-8">
          <motion.div
            initial={{ opacity: 1, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-w-0 rounded-[2rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-8"
          >
            <h2 id={sectionId + '-heading'} className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              {selectedInquiryCopy.heading}
            </h2>

            <form
              id={sectionId + '-fields'}
              aria-labelledby={sectionId + '-heading'}
              onSubmit={handleSubmit}
              onChange={() => {
                if (formStatus === 'success') setFormStatus('idle')
              }}
              className="mt-6 space-y-6"
            >
              <fieldset disabled={formStatus === 'loading'} aria-label="Inquiry details" className="min-w-0 space-y-5">
                <div>
                  <Select
                    id="contact-inquiry-type"
                    label="Inquiry type"
                    placeholder="Select one"
                    options={inquiryTypeOptions}
                    value={formData.inquiryType}
                    onChange={handleInquiryTypeChange}
                    aria-describedby="contact-inquiry-guidance"
                    required
                  />
                  <p id="contact-inquiry-guidance" aria-live="polite" className="mt-2 text-sm leading-6 text-text-secondary">
                    {selectedInquiryCopy.guidance}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    id="contact-name"
                    label="Name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    maxLength={100}
                    autoComplete="name"
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
                    autoComplete="email"
                    required
                  />
                </div>

                <Input
                  id="contact-organization"
                  label={selectedInquiryCopy.organizationLabel}
                  type="text"
                  placeholder={selectedInquiryCopy.organizationPlaceholder}
                  value={formData.organization}
                  onChange={(event) => setFormData({ ...formData, organization: event.target.value })}
                  maxLength={150}
                  autoComplete="organization"
                />
                <Input
                  id="contact-subject"
                  label={selectedInquiryCopy.subjectLabel}
                  type="text"
                  placeholder={selectedInquiryCopy.subjectPlaceholder}
                  value={formData.subject}
                  onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                  maxLength={200}
                  required
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  {formData.inquiryType === 'consulting' ? (
                    <Select
                      id="contact-service"
                      label="Primary need (optional)"
                      placeholder="Select one"
                      options={serviceOptions}
                      value={formData.serviceNeeded}
                      onChange={(event) => setFormData({ ...formData, serviceNeeded: event.target.value as ServiceType | '' })}
                    />
                  ) : null}
                  <Select
                    id="contact-urgency"
                    label="Timing (optional)"
                    placeholder="Select one"
                    options={urgencyOptions}
                    value={formData.urgency}
                    onChange={(event) => setFormData({ ...formData, urgency: event.target.value as UrgencyLevel | '' })}
                  />
                </div>

                <Textarea
                  id="contact-message"
                  label={selectedInquiryCopy.messageLabel}
                  placeholder={selectedInquiryCopy.messagePlaceholder}
                  rows={6}
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  maxLength={2000}
                  required
                />
              </fieldset>

              <div className="border-t border-border-subtle pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-text-secondary">{profile.responseTime}</p>
                  <Button
                    type="submit"
                    size="md"
                    className="w-full rounded-xl px-5 sm:w-auto"
                    isLoading={formStatus === 'loading'}
                    disabled={retryAfterSeconds > 0}
                  >
                    {retryAfterSeconds > 0 ? 'Please wait to retry' : 'Send inquiry'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {formStatus === 'success' ? (
                  <div role="status" aria-live="polite" aria-atomic="true" className="mt-4 flex items-start gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm leading-6">Message sent. I&apos;ll follow up soon.</p>
                  </div>
                ) : null}

                {formStatus === 'error' ? (
                  <div role="alert" aria-atomic="true" className="mt-4 flex items-start gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm leading-6">{errorMessage}</p>
                  </div>
                ) : null}
              </div>
            </form>
          </motion.div>

          <motion.aside
            initial={{ opacity: 1, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-w-0 space-y-5"
          >
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
              <div className="grid gap-5 sm:grid-cols-[128px_1fr] sm:items-start lg:grid-cols-1">
                <div className="relative aspect-square max-w-48 overflow-hidden rounded-[1.5rem] border border-border-subtle bg-background-subtle sm:max-w-none">
                  <Image
                    src="/images/profile/Smolder.png"
                    alt="Portrait of David Braun."
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 128px, 192px"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">Direct contact with David Braun.</h2>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    I review each inquiry and follow up with a useful next step. If it is not a fit, I will say so directly.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    I use the information in this form to respond to your inquiry.
                  </p>
                </div>
              </div>
            </div>

            {calendlyUrl ? (
              <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
                  <Calendar aria-hidden="true" className="h-5 w-5 shrink-0" />
                  Prefer a short call?
                </h2>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-border-subtle bg-background-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
                >
                  Book a short call <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            ) : null}

            <Link href="/experience" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover">
              Experience and résumé <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
