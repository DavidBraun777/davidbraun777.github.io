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
  Clock,
  FileText,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { profile } from '@/data/profile'
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

const helpfulContextPoints = [
  'The company, institution, organization, team, or audience involved.',
  'The role, system, research topic, event, or other opportunity.',
  'Any timing, constraints, or links that would help me prepare.',
  'What a useful next step would look like for you.',
]

const nextStepPoints = [
  'I review the inquiry, context, constraints, and goal.',
  'If there is a fit, I follow up with a useful next step.',
  'If there is not a fit, I will say so directly.',
]

export function Contact({
  calLink,
  initialInquiryType,
  showSectionHeader = true,
  title = 'Start with the inquiry form',
  subtitle = 'Choose the kind of conversation, then share enough context for a useful next step.',
  sectionId = 'contact',
}: Readonly<ContactProps>) {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [formData, setFormData] = useState<ContactFormState>(() =>
    createInitialFormData(initialInquiryType)
  )
  const selectedInquiryCopy = formData.inquiryType
    ? inquiryCopy[formData.inquiryType]
    : defaultInquiryCopy
  const calendlyUrl =
    typeof calLink === 'string' && /^https?:\/\//i.test(calLink.trim())
      ? calLink.trim()
      : null

  const handleInquiryTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const inquiryType = parseInquiryType(event.target.value) ?? ''
    setFormData((current) => ({
      ...current,
      inquiryType,
      serviceNeeded:
        inquiryType === 'consulting' ? current.serviceNeeded : '',
    }))
  }

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
        setFormData(createInitialFormData(initialInquiryType))
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

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div
            initial={{ opacity: 1, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-5 lg:self-start"
          >
            <div className="rounded-[2rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                  Professional inquiry
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">
                  {selectedInquiryCopy.heading}
                </h2>
                <p className="mt-4 text-base leading-8 text-text-secondary">
                  The form is the main starting point. A few focused details help me
                  prepare before we talk.
                </p>
              </div>

              <form id={`${sectionId}-fields`} onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5">
                  <h3 className="text-lg font-semibold text-text-primary">Start here</h3>
                  <div className="mt-5">
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
                    <p
                      id="contact-inquiry-guidance"
                      aria-live="polite"
                      className="mt-3 text-sm leading-7 text-text-secondary"
                    >
                      {selectedInquiryCopy.guidance}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5">
                  <h3 className="text-lg font-semibold text-text-primary">Contact details</h3>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
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
                      onChange={(event) =>
                        setFormData({ ...formData, email: event.target.value })
                      }
                      maxLength={254}
                      autoComplete="email"
                      required
                    />
                    <div className="sm:col-span-2">
                      <Input
                        id="contact-organization"
                        label={selectedInquiryCopy.organizationLabel}
                        type="text"
                        placeholder={selectedInquiryCopy.organizationPlaceholder}
                        value={formData.organization}
                        onChange={(event) =>
                          setFormData({ ...formData, organization: event.target.value })
                        }
                        maxLength={150}
                        autoComplete="organization"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5">
                  <h3 className="text-lg font-semibold text-text-primary">Inquiry basics</h3>
                  <div className="mt-5 space-y-6">
                    <Input
                      id="contact-subject"
                      label={selectedInquiryCopy.subjectLabel}
                      type="text"
                      placeholder={selectedInquiryCopy.subjectPlaceholder}
                      value={formData.subject}
                      onChange={(event) =>
                        setFormData({ ...formData, subject: event.target.value })
                      }
                      maxLength={200}
                      required
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      {formData.inquiryType === 'consulting' ? (
                        <Select
                          id="contact-service"
                          label="Primary need (optional)"
                          placeholder="Select one"
                          options={serviceOptions}
                          value={formData.serviceNeeded}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              serviceNeeded: event.target.value as ServiceType | '',
                            })
                          }
                        />
                      ) : null}
                      <Select
                        id="contact-urgency"
                        label="Timing (optional)"
                        placeholder="Select one"
                        options={urgencyOptions}
                        value={formData.urgency}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            urgency: event.target.value as UrgencyLevel | '',
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5">
                  <h3 className="text-lg font-semibold text-text-primary">Additional context</h3>
                  <div className="mt-5">
                    <Textarea
                      id="contact-message"
                      label={selectedInquiryCopy.messageLabel}
                      placeholder={selectedInquiryCopy.messagePlaceholder}
                      rows={7}
                      value={formData.message}
                      onChange={(event) =>
                        setFormData({ ...formData, message: event.target.value })
                      }
                      maxLength={2000}
                      required
                    />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">After you send it</p>
                      <p className="mt-1 text-sm leading-7 text-text-secondary">
                        {profile.responseTime} Inquiry details stay private.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      size="md"
                      className="w-full rounded-xl px-5 sm:w-auto"
                      isLoading={formStatus === 'loading'}
                    >
                      Send inquiry
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {formStatus === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="status"
                      aria-live="polite"
                      className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400"
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
                      className="mt-4 flex items-start gap-2 text-red-600 dark:text-red-400"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5" />
                      <p className="text-sm leading-7">
                        Something went wrong. Try again, or use the optional call link in
                        the sidebar if you do not want the conversation to stall.
                      </p>
                    </motion.div>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    Prefer a short call?
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    If you would rather talk first, you can still book a short call. The
                    form above is the better default because it gives me context.
                  </p>
                  <a
                    href={calendlyUrl ?? `#${sectionId}-fields`}
                    target={calendlyUrl ? '_blank' : undefined}
                    rel={calendlyUrl ? 'noopener noreferrer' : undefined}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
                  >
                    Optional: book a short call
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
              <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                <Clock className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-text-primary">Response time</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {profile.responseTime}
              </p>
            </article>
          </motion.div>

          <motion.aside
            initial={{ opacity: 1, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-5 lg:self-start"
          >
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-4 shadow-sm sm:p-5">
              <div className="grid gap-5 sm:grid-cols-[168px_1fr] sm:items-start lg:grid-cols-1">
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-border-subtle bg-background-subtle">
                  <Image
                    src="/images/profile/Smolder.png"
                    alt="Portrait of David Braun."
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 168px, 100vw"
                    priority
                  />
                </div>

                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                    Who you&apos;ll work with
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-text-primary">
                    Direct contact with David Braun.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    You&apos;ll be talking directly with me about the role, project,
                    research collaboration, speaking opportunity, or other professional
                    inquiry you select.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {profile.responseTime} If it is not a fit, I will say so directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-text-primary">Helpful context</h2>
              <div className="mt-5 space-y-3">
                {helpfulContextPoints.map((point) => (
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
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

            <LinkHint />
          </motion.aside>
        </div>
      </div>
    </section>
  )
}

function LinkHint() {
  return (
    <div className="text-sm text-text-secondary">
      <span className="font-medium text-text-primary">Need background first?</span>{' '}
      <Link
        href="/experience"
        className="text-link-primary transition-colors hover:text-link-primary-hover"
      >
        See experience and resume details
      </Link>
      .
    </div>
  )
}
