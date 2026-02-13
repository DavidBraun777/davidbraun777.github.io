// Strict email regex: allows common characters, rejects HTML-significant chars
const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Control character detection (includes CRLF for header injection prevention)
// Note: no 'g' flag — safe for repeated .test() calls (avoids lastIndex pitfall)
// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_REGEX = /[\x00-\x1f\x7f]/

// Allowlists for optional dropdowns
export const PROJECT_TYPES = ['home', 'business', 'school', 'fun', 'other'] as const
export const SERVICE_TYPES = ['bugfix', 'feature', 'infra', 'security', 'ai', 'other'] as const
export const URGENCY_LEVELS = ['today', 'this-week', 'this-month'] as const

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

/** Validate all contact form fields. Returns validated data or error string. */
export function validateContactForm(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const { name, email, subject, message, projectType, serviceNeeded, urgency } =
    body as Record<string, unknown>

  // Required fields — type + presence
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' }
  }
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return { valid: false, error: 'Subject is required' }
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'Message is required' }
  }

  // Length checks
  if (name.length > 100) {
    return { valid: false, error: 'Name must be 100 characters or less' }
  }
  if (subject.length > 200) {
    return { valid: false, error: 'Subject must be 200 characters or less' }
  }
  if (message.length > 2000) {
    return { valid: false, error: 'Message must be 2,000 characters or less' }
  }

  // Email format
  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email address' }
  }

  // Build validated data
  const data: ContactFormData = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  }

  // Optional dropdown validation (allowlist)
  if (projectType !== undefined && projectType !== '') {
    if (
      typeof projectType !== 'string' ||
      !(PROJECT_TYPES as readonly string[]).includes(projectType)
    ) {
      return { valid: false, error: 'Invalid project type' }
    }
    data.projectType = projectType as ProjectType
  }

  if (serviceNeeded !== undefined && serviceNeeded !== '') {
    if (
      typeof serviceNeeded !== 'string' ||
      !(SERVICE_TYPES as readonly string[]).includes(serviceNeeded)
    ) {
      return { valid: false, error: 'Invalid service type' }
    }
    data.serviceNeeded = serviceNeeded as ServiceType
  }

  if (urgency !== undefined && urgency !== '') {
    if (
      typeof urgency !== 'string' ||
      !(URGENCY_LEVELS as readonly string[]).includes(urgency)
    ) {
      return { valid: false, error: 'Invalid urgency level' }
    }
    data.urgency = urgency as UrgencyLevel
  }

  return { valid: true, data }
}

// --- Rate Limiting ---

interface RateLimitRecord {
  count: number
  resetAt: number
  lastSeen: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5
const MAX_MAP_SIZE = 10_000

/** Prune stale entries from the rate limit map */
function pruneStaleEntries(): void {
  const now = Date.now()
  for (const [key, record] of rateLimitMap) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}

export interface RateLimitResult {
  limited: boolean
  retryAfter?: number
  remaining?: number
}

/** Check rate limit for a given IP. Returns whether limited and retry info. */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now()

  // Prune expired entries when map is large
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    pruneStaleEntries()
  }

  // Look up existing record first, before any eviction
  const record = rateLimitMap.get(ip)

  // Only evict when we need to insert a brand-new key and capacity is reached.
  // This prevents evicting the current IP's own record and resetting its count.
  const isNewKey = !record || now > record.resetAt
  if (isNewKey && rateLimitMap.size >= MAX_MAP_SIZE) {
    let oldestKey: string | undefined
    let oldestSeen = Infinity
    for (const [key, rec] of rateLimitMap) {
      if (rec.lastSeen < oldestSeen) {
        oldestSeen = rec.lastSeen
        oldestKey = key
      }
    }
    if (oldestKey) rateLimitMap.delete(oldestKey)
  }

  if (isNewKey) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
      lastSeen: now,
    })
    return { limited: false, remaining: RATE_LIMIT_MAX - 1 }
  }

  record.lastSeen = now

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return { limited: true, retryAfter }
  }

  record.count++
  return { limited: false, remaining: RATE_LIMIT_MAX - record.count }
}

/** Extract client IP from request headers (Vercel-aware). */
export function getClientIp(headers: Headers): string {
  // x-real-ip is set by Vercel/nginx and is most trustworthy
  const realIp = headers.get('x-real-ip')
  if (realIp && !CONTROL_CHAR_REGEX.test(realIp)) {
    return realIp.trim()
  }

  // Fall back to x-forwarded-for; on Vercel the first entry is the client IP.
  // Validate to prevent control char injection.
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const firstIp = forwarded.split(',')[0]?.trim()
    if (firstIp && !CONTROL_CHAR_REGEX.test(firstIp)) {
      return firstIp
    }
  }

  return 'unknown'
}

/** Reset rate limit state (for testing) */
export function _resetRateLimits(): void {
  rateLimitMap.clear()
}
