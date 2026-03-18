import { NextResponse } from 'next/server'
import {
  validateContactForm,
  sanitizeInput,
  sanitizeEmail,
  escapeHtml,
  type ContactFormData,
} from '@/lib/contact-validation'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

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

function logRequest(status: number, start: number, errorType?: string) {
  console.log(
    JSON.stringify({
      event: 'contact_submission',
      status,
      duration_ms: Math.round(performance.now() - start),
      ...(errorType && { error: errorType }),
    })
  )
}

// ---------------------------------------------------------------------------
// Sanitization pipeline: every field is sanitized in one explicit step.
// sanitizeInput: trim → truncate → HTML-escape (returns safe HTML string)
// sanitizeEmail: trim → truncate → strip control chars (returns plain text)
//
// After this step, `name`, `subject`, and `message` are HTML-safe strings.
// `email` is plain text and must be HTML-escaped separately when embedded
// in the email body template.
// ---------------------------------------------------------------------------
interface SanitizedContact {
  name: string       // HTML-escaped
  email: string      // plain text (safe for replyTo, must escape for HTML)
  subject: string    // HTML-escaped
  message: string    // HTML-escaped
}

function sanitizeContactData(data: ContactFormData): SanitizedContact {
  return {
    name: sanitizeInput(data.name, 100),
    email: sanitizeEmail(data.email),
    subject: sanitizeInput(data.subject, 200),
    message: sanitizeInput(data.message, 2000),
  }
}

// ---------------------------------------------------------------------------
// Build email HTML body.
// All interpolated values are already HTML-escaped by the sanitization step
// above, except `email` which is escaped inline via escapeHtml().
// The `.replace(/\n/g, '<br>')` on `message` is safe because the message
// has already been HTML-escaped, so no raw `<` or `>` characters remain.
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
    <p><strong>Name:</strong> ${sanitized.name}</p>
    <p><strong>Email:</strong> ${escapeHtml(sanitized.email)}</p>
    <p><strong>Subject:</strong> ${sanitized.subject}</p>
    ${optionalFields.join('\n    ')}
    <p><strong>Message:</strong></p>
    <p>${sanitized.message.replace(/\n/g, '<br>')}</p>
  `
}

export async function POST(request: Request) {
  const start = performance.now()

  try {
    // 1. Origin / Referer validation: reject cross-site submissions
    if (!isAllowedOrigin(request)) {
      logRequest(403, start, 'origin_rejected')
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // 2. Rate limiting (Upstash Redis when configured, in-memory fallback)
    const ip = getClientIp(request.headers)
    const rateLimit = await checkRateLimit(ip)

    if (rateLimit.limited) {
      logRequest(429, start, 'rate_limited')
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
      logRequest(400, start, 'invalid_json')
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // 4. Validate
    const result = validateContactForm(body)

    if (!result.valid) {
      logRequest(400, start, 'validation_failed')
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // 5. Sanitize: explicit pipeline, all in one step
    const { data } = result
    const sanitized = sanitizeContactData(data)

    // 6. Require mail service configuration
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      logRequest(500, start, 'missing_api_key')
      return NextResponse.json(
        { success: false, error: 'Mail service misconfigured' },
        { status: 500 }
      )
    }

    // 7. Send email
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'davidjbraun777@gmail.com',
      subject: `Portfolio Contact: ${sanitized.subject}`,
      html: buildEmailHtml(sanitized, data),
      replyTo: sanitized.email,
    })

    if (error) {
      console.error('Resend error:', error.message)
      logRequest(500, start, 'resend_error')
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      )
    }

    logRequest(200, start)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      'Contact form error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    logRequest(500, start, 'unhandled_error')
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
