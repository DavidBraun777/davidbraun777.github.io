import { NextResponse } from 'next/server'
import {
  validateContactForm,
  sanitizeEmail,
  escapeHtml,
  type ContactFormData,
} from '@/lib/contact-validation'
import { checkRateLimit, getClientIp, RateLimitUnavailableError } from '@/lib/rate-limit'
import {
  formatFromAddress,
  getContactEmailConfig,
  getResendClient,
} from '@/lib/resend'

// ---------------------------------------------------------------------------
// Allowed origins for cross-site abuse prevention.
// Requests without a recognised Origin or Referer are rejected with 403.
// Vercel preview URLs are accepted when VERCEL_URL is set.
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = new Set([
  'https://dbraun.io',
  'https://www.dbraun.io',
])
// The form's bounded text fields total 2,450 UTF-16 code units. Even six-byte
// JSON escapes plus the email, selections and field names fit within 16 KiB.
const MAX_CONTACT_BODY_BYTES = 16 * 1024
const SUBMISSION_ID_HEADER = 'x-contact-submission-id'
const SUBMISSION_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isAllowedLocalDevOrigin(origin: string): boolean {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    return false
  }

  try {
    const url = new URL(origin)
    return (
      url.protocol === 'http:' &&
      url.origin === origin &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    )
  } catch {
    return false
  }
}

function isAllowedOriginValue(origin: string, vercelUrl?: string): boolean {
  const isVercelPreviewOrigin = Boolean(
    vercelUrl && origin === `https://${vercelUrl}`
  )

  return (
    ALLOWED_ORIGINS.has(origin) ||
    isAllowedLocalDevOrigin(origin) ||
    isVercelPreviewOrigin
  )
}

function getRefererOrigin(request: Request): string | null {
  const referer = request.headers.get('referer')
  if (!referer) return null

  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

function isAllowedOrigin(request: Request): boolean {
  const vercelUrl = process.env.VERCEL_URL
  const origin = request.headers.get('origin')
  if (origin !== null) return isAllowedOriginValue(origin, vercelUrl)

  // Fallback: check Referer header (some clients omit Origin on same-origin)
  const refererOrigin = getRefererOrigin(request)
  return (
    refererOrigin !== null && isAllowedOriginValue(refererOrigin, vercelUrl)
  )
}

class ContactBodyTooLargeError extends Error {}

async function readContactJson(request: Request): Promise<unknown> {
  if (!request.body) throw new SyntaxError('Empty request body')

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let bytes = 0
  let text = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_CONTACT_BODY_BYTES) {
        // Stop consuming immediately; transport cleanup must not delay the 413.
        void reader.cancel().catch(() => {})
        throw new ContactBodyTooLargeError()
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } finally {
    reader.releaseLock()
  }
}

function getSubmissionId(request: Request): string | null {
  const rawValue = request.headers.get(SUBMISSION_ID_HEADER)?.trim()
  if (!rawValue) return null
  return SUBMISSION_ID_REGEX.test(rawValue) ? rawValue : null
}

function getIdempotencyOptions(submissionId: string | null) {
  return submissionId
    ? { idempotencyKey: `contact-form/${submissionId}` }
    : undefined
}

function logRequest(
  status: number,
  start: number,
  options?: { errorType?: string; submissionId?: string | null }
) {
  console.log(
    JSON.stringify({
      event: 'contact_submission',
      status,
      duration_ms: Math.round(performance.now() - start),
      ...(options?.errorType && { error: options.errorType }),
      ...(options?.submissionId && { submission_id: options.submissionId }),
    })
  )
}

// ---------------------------------------------------------------------------
// Sanitization pipeline: every field is normalized in one explicit step.
// name/subject: single-line plain text safe for headers and text output
// message: multiline plain text with non-printable control chars removed
// email: plain text safe for replyTo
//
// HTML escaping happens only at render time inside the email template.
// ---------------------------------------------------------------------------
interface SanitizedContact {
  name: string // plain text, escaped at render time
  email: string // plain text (safe for replyTo, must escape for HTML)
  organization?: string // plain text, escaped at render time
  subject: string // plain text, safe for email headers
  message: string // plain text, escaped at render time
}

function sanitizeSingleLine(input: string, maxLength: number): string {
  // eslint-disable-next-line no-control-regex
  return input.trim().slice(0, maxLength).replace(/[\x00-\x1f\x7f]/g, ' ')
}

function sanitizeMultiline(input: string, maxLength: number): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
}

function sanitizeContactData(data: ContactFormData): SanitizedContact {
  return {
    name: sanitizeSingleLine(data.name, 100),
    email: sanitizeEmail(data.email),
    ...(data.organization && {
      organization: sanitizeSingleLine(data.organization, 150),
    }),
    subject: sanitizeSingleLine(data.subject, 200),
    message: sanitizeMultiline(data.message, 2000),
  }
}

// ---------------------------------------------------------------------------
// Build email HTML body.
// All interpolated values are escaped inline via escapeHtml().
// The `.replace(/\n/g, '<br>')` on `message` is safe because escapeHtml()
// runs first, so no raw `<` or `>` characters remain in the rendered markup.
// ---------------------------------------------------------------------------
function buildEmailHtml(
  sanitized: SanitizedContact,
  data: ContactFormData
): string {
  const contextualFields: string[] = [
    `<p><strong>Inquiry Type:</strong> ${escapeHtml(data.inquiryType)}</p>`,
  ]
  if (sanitized.organization) {
    contextualFields.push(
      `<p><strong>Organization:</strong> ${escapeHtml(sanitized.organization)}</p>`
    )
  }
  if (data.serviceNeeded) {
    contextualFields.push(
      `<p><strong>Service Needed:</strong> ${escapeHtml(data.serviceNeeded)}</p>`
    )
  }
  if (data.urgency) {
    contextualFields.push(
      `<p><strong>Timing:</strong> ${escapeHtml(data.urgency)}</p>`
    )
  }

  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(sanitized.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(sanitized.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(sanitized.subject)}</p>
    ${contextualFields.join('\n    ')}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(sanitized.message).replace(/\n/g, '<br>')}</p>
  `
}

function buildEmailText(
  sanitized: SanitizedContact,
  data: ContactFormData
): string {
  const lines = [
    'New contact form submission',
    '',
    `Name: ${sanitized.name}`,
    `Email: ${sanitized.email}`,
    `Subject: ${sanitized.subject}`,
    `Inquiry Type: ${data.inquiryType}`,
  ]

  if (sanitized.organization) {
    lines.push(`Organization: ${sanitized.organization}`)
  }
  if (data.serviceNeeded) lines.push(`Service Needed: ${data.serviceNeeded}`)
  if (data.urgency) lines.push(`Timing: ${data.urgency}`)

  lines.push('', 'Message:', sanitized.message)
  return lines.join('\n')
}

export async function POST(request: Request) {
  const start = performance.now()
  const submissionId = getSubmissionId(request)

  try {
    // 1. Origin / Referer validation: reject cross-site submissions
    if (!isAllowedOrigin(request)) {
      logRequest(403, start, { errorType: 'origin_rejected', submissionId })
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // 2. Rate limiting (distributed protection is required in production)
    const ip = getClientIp(request.headers)
    const rateLimit = await checkRateLimit(ip)

    if (rateLimit.limited) {
      logRequest(429, start, { errorType: 'rate_limited', submissionId })
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }

    // 3. Bound actual bytes read, including absent or misleading Content-Length.
    let body: unknown
    try {
      body = await readContactJson(request)
    } catch (error) {
      if (error instanceof ContactBodyTooLargeError) {
        logRequest(413, start, { errorType: 'body_too_large', submissionId })
        return NextResponse.json(
          { success: false, error: 'Request body is too large' },
          { status: 413 }
        )
      }
      logRequest(400, start, { errorType: 'invalid_json', submissionId })
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // 4. Validate
    const result = validateContactForm(body)

    if (!result.valid) {
      logRequest(400, start, { errorType: 'validation_failed', submissionId })
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // 5. Sanitize: explicit pipeline, all in one step
    const { data } = result
    const sanitized = sanitizeContactData(data)

    // 6. Require mail service configuration
    let resend: ReturnType<typeof getResendClient>
    let emailConfig: ReturnType<typeof getContactEmailConfig>
    try {
      resend = getResendClient()
      emailConfig = getContactEmailConfig()
    } catch {
      logRequest(500, start, { errorType: 'mail_config_error', submissionId })
      return NextResponse.json(
        { success: false, error: 'Mail service misconfigured' },
        { status: 500 }
      )
    }

    // 7. Send email
    const { error } = await resend.emails.send(
      {
        from: formatFromAddress(emailConfig.fromName, emailConfig.fromEmail),
        to: [emailConfig.notificationEmail],
        subject: `[dbraun.io contact] ${sanitized.subject}`,
        html: buildEmailHtml(sanitized, data),
        text: buildEmailText(sanitized, data),
        replyTo: sanitized.email,
        tags: [{ name: 'source', value: 'contact-form' }],
      },
      getIdempotencyOptions(submissionId)
    )

    if (error) {
      logRequest(500, start, { errorType: 'resend_error', submissionId })
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      )
    }

    logRequest(200, start, { submissionId })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof RateLimitUnavailableError) {
      logRequest(503, start, { errorType: 'rate_limit_unavailable', submissionId })
      return NextResponse.json(
        { success: false, error: 'Contact service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }
    logRequest(500, start, { errorType: 'unhandled_error', submissionId })
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
