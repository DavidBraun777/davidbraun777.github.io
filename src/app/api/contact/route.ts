import { NextResponse } from 'next/server'
import {
  validateContactForm,
  sanitizeEmail,
  escapeHtml,
  type ContactFormData,
} from '@/lib/contact-validation'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
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
  'http://localhost:3000',
])
const SUBMISSION_ID_HEADER = 'x-contact-submission-id'
const SUBMISSION_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isAllowedLocalDevOrigin(origin: string): boolean {
  if (process.env.NODE_ENV === 'production') return false

  try {
    const url = new URL(origin)
    return (
      url.protocol === 'http:' &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    )
  } catch {
    return false
  }
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (origin && ALLOWED_ORIGINS.has(origin)) return true
  if (origin && isAllowedLocalDevOrigin(origin)) return true

  // Accept Vercel preview deployments (*.vercel.app)
  const vercelUrl = process.env.VERCEL_URL
  if (origin && vercelUrl && origin === `https://${vercelUrl}`) return true

  // Fallback: check Referer header (some clients omit Origin on same-origin)
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      if (ALLOWED_ORIGINS.has(refererOrigin)) return true
      if (isAllowedLocalDevOrigin(refererOrigin)) return true
      if (vercelUrl && refererOrigin === `https://${vercelUrl}`) return true
    } catch {
      // malformed Referer: reject
    }
  }

  return false
}

function getSubmissionId(request: Request): string | null {
  const rawValue = request.headers.get(SUBMISSION_ID_HEADER)?.trim()
  if (!rawValue) return null
  return SUBMISSION_ID_REGEX.test(rawValue) ? rawValue : null
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
  name: string       // plain text, escaped at render time
  email: string      // plain text (safe for replyTo, must escape for HTML)
  subject: string    // plain text, safe for email headers
  message: string    // plain text, escaped at render time
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
  const optionalFields: string[] = []
  if (data.projectType) {
    optionalFields.push(
      `<p><strong>Project Type:</strong> ${escapeHtml(data.projectType)}</p>`
    )
  }
  if (data.serviceNeeded) {
    optionalFields.push(
      `<p><strong>Service Needed:</strong> ${escapeHtml(data.serviceNeeded)}</p>`
    )
  }
  if (data.urgency) {
    optionalFields.push(
      `<p><strong>Urgency:</strong> ${escapeHtml(data.urgency)}</p>`
    )
  }

  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(sanitized.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(sanitized.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(sanitized.subject)}</p>
    ${optionalFields.join('\n    ')}
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
  ]

  if (data.projectType) lines.push(`Project Type: ${data.projectType}`)
  if (data.serviceNeeded) lines.push(`Service Needed: ${data.serviceNeeded}`)
  if (data.urgency) lines.push(`Urgency: ${data.urgency}`)

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

    // 2. Rate limiting (Upstash Redis when configured, in-memory fallback)
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

    // 3. Parse JSON body
    let body: unknown
    try {
      body = await request.json()
    } catch {
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
    } catch (error) {
      console.error(
        'Contact mail configuration error:',
        error instanceof Error ? error.message : 'Unknown error'
      )
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
      submissionId
        ? { idempotencyKey: `contact-form/${submissionId}` }
        : undefined
    )

    if (error) {
      console.error('Resend error:', error.message)
      logRequest(500, start, { errorType: 'resend_error', submissionId })
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      )
    }

    logRequest(200, start, { submissionId })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      'Contact form error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    logRequest(500, start, { errorType: 'unhandled_error', submissionId })
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
