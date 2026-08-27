// Strict email regex: allows common characters, rejects HTML-significant chars
const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Control character detection (includes CRLF for header injection prevention)
// Note: no 'g' flag; safe for repeated .test() calls (avoids lastIndex pitfall)
// eslint-disable-next-line no-control-regex
export const CONTROL_CHAR_REGEX = /[\x00-\x1f\x7f]/

// Allowlists for optional dropdowns
export const PROJECT_TYPES = [
  'full-time',
  'consulting',
  'build',
  'architecture',
  'other',
] as const
export const SERVICE_TYPES = [
  'applied-ai',
  'workflow-automation',
  'platform-infra',
  'product-delivery',
  'accessibility',
  'other',
] as const
export const URGENCY_LEVELS = [
  'exploring',
  'this-quarter',
  'this-month',
  'urgent',
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type ServiceType = (typeof SERVICE_TYPES)[number]
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number]

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  projectType?: ProjectType
  serviceNeeded?: ServiceType
  urgency?: UrgencyLevel
}

export type ValidationResult =
  | { valid: true; data: ContactFormData }
  | { valid: false; error: string }

/** Validate email: strict format, no control chars, max 254 chars */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  if (email.length > 254) return false
  if (CONTROL_CHAR_REGEX.test(email)) return false
  return STRICT_EMAIL_REGEX.test(email)
}

/** Escape HTML entities to prevent XSS in email content */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char])
}

/** Sanitize input: trim, enforce max length, escape HTML */
export function sanitizeInput(input: string, maxLength: number): string {
  return escapeHtml(input.trim().slice(0, maxLength))
}

/** Sanitize email for use in replyTo: trim, enforce length, strip control chars */
export function sanitizeEmail(email: string): string {
  // eslint-disable-next-line no-control-regex
  return email.trim().slice(0, 254).replace(/[\x00-\x1f\x7f]/g, '')
}

type ValidationError = Extract<ValidationResult, { valid: false }>
type RequiredFieldResult =
  | { valid: true; value: string }
  | ValidationError
type OptionalFieldResult<T extends string> =
  | { valid: true; value?: T }
  | ValidationError
type OptionalFieldKey = 'projectType' | 'serviceNeeded' | 'urgency'

function validationError(error: string): ValidationError {
  return { valid: false, error }
}

function validateRequiredText(
  value: unknown,
  error: string
): RequiredFieldResult {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return validationError(error)
  }

  return { valid: true, value }
}

function validateRequiredEmail(value: unknown): RequiredFieldResult {
  if (!value || typeof value !== 'string') {
    return validationError('Email is required')
  }

  return { valid: true, value }
}

function validateRequiredFieldLengths(
  name: string,
  subject: string,
  message: string
): ValidationError | undefined {
  if (name.length > 100) {
    return validationError('Name must be 100 characters or less')
  }
  if (subject.length > 200) {
    return validationError('Subject must be 200 characters or less')
  }
  if (message.length > 2000) {
    return validationError('Message must be 2,000 characters or less')
  }

  return undefined
}

function validateOptionalSelection<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  error: string
): OptionalFieldResult<T> {
  if (value === undefined || value === '') {
    return { valid: true }
  }
  if (
    typeof value !== 'string' ||
    !(allowedValues as readonly string[]).includes(value)
  ) {
    return validationError(error)
  }

  return { valid: true, value: value as T }
}

function toOptionalField<K extends OptionalFieldKey>(
  key: K,
  value: ContactFormData[K]
): Partial<Pick<ContactFormData, K>> {
  if (value === undefined) return {}
  return { [key]: value } as Pick<ContactFormData, K>
}

/** Validate all contact form fields. Returns validated data or error string. */
export function validateContactForm(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return validationError('Invalid request body')
  }

  const { name, email, subject, message, projectType, serviceNeeded, urgency } =
    body as Record<string, unknown>

  // Required fields: type + presence
  const nameResult = validateRequiredText(name, 'Name is required')
  if (!nameResult.valid) return nameResult

  const emailResult = validateRequiredEmail(email)
  if (!emailResult.valid) return emailResult

  const subjectResult = validateRequiredText(subject, 'Subject is required')
  if (!subjectResult.valid) return subjectResult

  const messageResult = validateRequiredText(message, 'Message is required')
  if (!messageResult.valid) return messageResult

  // Length checks
  const lengthError = validateRequiredFieldLengths(
    nameResult.value,
    subjectResult.value,
    messageResult.value
  )
  if (lengthError) return lengthError

  // Email format
  if (!isValidEmail(emailResult.value)) {
    return validationError('Invalid email address')
  }

  // Optional dropdown validation (allowlist)
  const projectTypeResult = validateOptionalSelection(
    projectType,
    PROJECT_TYPES,
    'Invalid project type'
  )
  if (!projectTypeResult.valid) return projectTypeResult

  const serviceNeededResult = validateOptionalSelection(
    serviceNeeded,
    SERVICE_TYPES,
    'Invalid service type'
  )
  if (!serviceNeededResult.valid) return serviceNeededResult

  const urgencyResult = validateOptionalSelection(
    urgency,
    URGENCY_LEVELS,
    'Invalid urgency level'
  )
  if (!urgencyResult.valid) return urgencyResult

  return {
    valid: true,
    data: {
      name: nameResult.value.trim(),
      email: emailResult.value.trim(),
      subject: subjectResult.value.trim(),
      message: messageResult.value.trim(),
      ...toOptionalField('projectType', projectTypeResult.value),
      ...toOptionalField('serviceNeeded', serviceNeededResult.value),
      ...toOptionalField('urgency', urgencyResult.value),
    },
  }
}
