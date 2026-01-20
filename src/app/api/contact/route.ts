import { NextResponse } from 'next/server'

// Simple in-memory rate limiter (resets on cold start)
// For production, consider Upstash Redis rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true
  }

  record.count++
  return false
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Escape HTML to prevent XSS in email content
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char])
}

// Sanitize and limit input length
function sanitizeInput(input: string, maxLength: number): string {
  return escapeHtml(input.trim().slice(0, maxLength))
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate and sanitize input lengths
    if (typeof name !== 'string' || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (typeof subject !== 'string' || subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be 200 characters or less' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be 5000 characters or less' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name, 100)
    const sanitizedSubject = sanitizeInput(subject, 200)
    const sanitizedMessage = sanitizeInput(message, 5000)
    const sanitizedEmail = email.trim().slice(0, 254) // Max email length per RFC

    // If Resend API key is configured, send email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'davidjbraun777@gmail.com',
        subject: `Portfolio Contact: ${sanitizedSubject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Subject:</strong> ${sanitizedSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        `,
        replyTo: sanitizedEmail,
      })
    } else {
      // Log for development (without sensitive details in production)
      console.log('Contact form submission received')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
