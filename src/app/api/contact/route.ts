import { NextResponse } from 'next/server'
import {
  validateContactForm,
  sanitizeInput,
  sanitizeEmail,
  escapeHtml,
  checkRateLimit,
  getClientIp,
} from '@/lib/contact-validation'

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request.headers)
    const rateLimit = checkRateLimit(ip)

    if (rateLimit.limited) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }

    const body = await request.json()
    const result = validateContactForm(body)

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    const { data } = result
    const sanitizedName = sanitizeInput(data.name, 100)
    const sanitizedEmail = sanitizeEmail(data.email)
    const sanitizedSubject = sanitizeInput(data.subject, 200)
    const sanitizedMessage = sanitizeInput(data.message, 2000)

    // Build optional fields for email body
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

    // Require RESEND_API_KEY — missing key means misconfigured mail service
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { success: false, error: 'Mail service misconfigured' },
        { status: 500 }
      )
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'davidjbraun777@gmail.com',
      subject: `Portfolio Contact: ${sanitizedSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        ${optionalFields.join('\n        ')}
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: sanitizedEmail,
    })

    if (error) {
      console.error('Resend error:', error.message)
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      'Contact form error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
