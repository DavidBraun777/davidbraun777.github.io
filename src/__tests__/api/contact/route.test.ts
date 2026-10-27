import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/contact/route'
import * as rateLimit from '@/lib/rate-limit'

// Mock resend: vi.hoisted ensures mockSend is available when vi.mock factory runs
const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}))
vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend }
  },
}))

function createRequest(
  body: Record<string, unknown>,
  headers?: Record<string, string>
): Request {
  return createRawRequest(JSON.stringify(body), headers)
}

function createRawRequest(
  body: string | ReadableStream<Uint8Array>,
  headers?: Record<string, string>
): Request {
  const init: RequestInit & { duplex: 'half' } = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-real-ip': '127.0.0.1',
      'origin': 'http://localhost:3000',
      ...headers,
    },
    body,
    duplex: 'half',
  }
  return new Request('http://localhost:3000/api/contact', init)
}

const validBody = {
  name: 'Test User',
  email: 'test@example.com',
  inquiryType: 'employment',
  subject: 'Test Subject',
  message: 'Hello, this is a test message.',
}
const legacyBody = {
  name: validBody.name,
  email: validBody.email,
  subject: validBody.subject,
  message: validBody.message,
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    rateLimit._resetRateLimits()
    rateLimit._resetUpstash()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSend.mockReset()
    mockSend.mockResolvedValue({ data: { id: 'test-id' }, error: null })
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubEnv('CONTACT_NOTIFICATION_EMAIL', 'owner@example.com')
    vi.stubEnv('CONTACT_FROM_EMAIL', 'contact@dbraun.io')
    vi.stubEnv('CONTACT_FROM_NAME', 'dbraun.io Contact')
    vi.stubEnv('VERCEL_URL', '')
    vi.stubEnv('VERCEL', '')
    vi.stubEnv('NODE_ENV', 'test')
    // Ensure Upstash is never used in unit tests, regardless of env
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('returns 500 when RESEND_API_KEY is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('misconfigured')
  })

  it('returns 500 when contact recipient email is missing', async () => {
    vi.stubEnv('CONTACT_NOTIFICATION_EMAIL', '')
    vi.stubEnv('CONTACT_EMAIL', '')
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('misconfigured')
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(createRequest({ ...validBody, email: 'not-an-email' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for empty message', async () => {
    const res = await POST(createRequest({ ...validBody, message: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for missing fields', async () => {
    const res = await POST(createRequest({ name: 'Test' }))
    expect(res.status).toBe(400)
  })

  it('returns 429 when rate limited', async () => {
    // Exhaust rate limit (5 requests)
    for (let i = 0; i < 5; i++) {
      await POST(createRequest(validBody))
    }
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(429)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0)
    expect(Number(res.headers.get('Retry-After'))).toBeLessThanOrEqual(60)
    expect(mockSend).toHaveBeenCalledTimes(5)
  })

  it('fails closed with 503 when production distributed protection is not configured', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const res = await POST(createRequest(validBody, { origin: 'https://dbraun.io' }))

    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({
      success: false,
      error: 'Contact service temporarily unavailable. Please try again later.',
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('maps distributed protection failures to a generic 503 without leaking service details', async () => {
    const detail = 'provider credential and internal endpoint must stay private'
    const unavailable = new rateLimit.RateLimitUnavailableError()
    unavailable.message = detail
    vi.spyOn(rateLimit, 'checkRateLimit').mockRejectedValueOnce(unavailable)
    vi.stubEnv('NODE_ENV', 'production')

    const res = await POST(createRequest(validBody, { origin: 'https://dbraun.io' }))
    expect(res.status).toBe(503)
    expect(await res.text()).not.toContain(detail)
    expect(JSON.stringify(vi.mocked(console.log).mock.calls)).not.toContain(detail)
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(detail)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('returns 200 and sends email on happy path', async () => {
    const res = await POST(
      createRequest(validBody, {
        'x-contact-submission-id': '00000000-0000-4000-8000-000000000001',
      })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'dbraun.io Contact <contact@dbraun.io>',
        to: ['owner@example.com'],
        subject: '[dbraun.io contact] Test Subject',
        replyTo: 'test@example.com',
      }),
      { idempotencyKey: 'contact-form/00000000-0000-4000-8000-000000000001' }
    )
  })

  it('ignores an invalid submission ID for idempotency and observability', async () => {
    const invalidSubmissionId = 'not-a-valid-submission-id'
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    try {
      const res = await POST(
        createRequest(validBody, {
          'x-contact-submission-id': invalidSubmissionId,
        })
      )

      expect(res.status).toBe(200)
      expect(mockSend).toHaveBeenCalledWith(expect.any(Object), undefined)

      const submissionLog = logSpy.mock.calls
        .map(([message]) => JSON.parse(String(message)))
        .find((entry) => entry.event === 'contact_submission')

      expect(submissionLog).toEqual(
        expect.objectContaining({ event: 'contact_submission', status: 200 })
      )
      expect(submissionLog).not.toHaveProperty('submission_id')
      expect(JSON.stringify(submissionLog)).not.toContain(invalidSubmissionId)
    } finally {
      logSpy.mockRestore()
    }
  })

  it('forwards the same idempotency key for duplicate submission IDs', async () => {
    const submissionId = '00000000-0000-4000-8000-000000000001'
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await POST(createRequest(validBody, {
        'x-contact-submission-id': submissionId,
      }))
      expect(res.status).toBe(200)
    }
    expect(mockSend).toHaveBeenCalledTimes(2)
    expect(mockSend.mock.calls.map(([, options]) => options)).toEqual([
      { idempotencyKey: `contact-form/${submissionId}` },
      { idempotencyKey: `contact-form/${submissionId}` },
    ])
  })

  it('escapes HTML in email payload', async () => {
    const xssBody = {
      ...validBody,
      name: '<script>alert("xss")</script>',
      message: '<img src=x onerror=alert(1)>',
    }
    await POST(createRequest(xssBody))
    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).not.toContain('<script>')
    expect(callArgs.html).toContain('&lt;script&gt;')
    expect(callArgs.html).not.toContain('<img')
    expect(callArgs.html).toContain('&lt;img')
    expect(callArgs.html).not.toContain('&amp;lt;')
    expect(callArgs.text).toContain('<img src=x onerror=alert(1)>')
  })

  it('keeps subjects single-line and recipients server-controlled while escaping HTML once', async () => {
    const res = await POST(createRequest({
      ...validBody,
      name: 'Alice & Bob',
      organization: '<Example & Company>',
      subject: 'Review <draft>\r\nBcc: attacker@example.com',
      message: 'First & second\r\n<script>alert(1)</script>\u0000',
      to: 'attacker@example.com',
      from: 'attacker@example.com',
    }))
    expect(res.status).toBe(200)
    const sent = mockSend.mock.calls[0][0]
    expect(sent.to).toEqual(['owner@example.com'])
    expect(sent.from).toBe('dbraun.io Contact <contact@dbraun.io>')
    expect(sent.subject).toBe('[dbraun.io contact] Review <draft>  Bcc: attacker@example.com')
    expect(sent.html).toContain('Alice &amp; Bob')
    expect(sent.html).toContain('&lt;Example &amp; Company&gt;')
    expect(sent.html).toContain('First &amp; second<br>&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(sent.html).not.toContain('&amp;lt;')
    expect(sent.text).toContain('First & second\n<script>alert(1)</script>')
    expect(sent.text).not.toContain('\u0000')
  })

  it('returns 400 for email with HTML injection', async () => {
    const res = await POST(
      createRequest({ ...validBody, email: '<script>@evil.com' })
    )
    expect(res.status).toBe(400)
  })

  it('returns 500 when Resend returns an error', async () => {
    const detail = 'provider secret and recipient information'
    mockSend.mockResolvedValue({
      data: null,
      error: { message: detail },
    })
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json).toEqual({ success: false, error: 'Failed to send message' })
    expect(JSON.stringify(vi.mocked(console.log).mock.calls)).not.toContain(detail)
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(detail)
  })

  it('returns a generic 500 when Resend throws without logging private error contents', async () => {
    const detail = 'private transport credentials'
    mockSend.mockRejectedValueOnce(new Error(detail))
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ success: false, error: 'Failed to send message' })
    expect(JSON.stringify(vi.mocked(console.log).mock.calls)).not.toContain(detail)
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(detail)
  })

  it('validates optional dropdown fields', async () => {
    const res = await POST(
      createRequest({ ...validBody, inquiryType: 'invalid-type' })
    )
    expect(res.status).toBe(400)
  })

  it('includes canonical inquiry context and optional fields in email', async () => {
    const res = await POST(
      createRequest({
        ...validBody,
        inquiryType: 'consulting',
        organization: 'Example Company',
        serviceNeeded: 'platform-infra',
        urgency: 'this-quarter',
      })
    )
    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalledOnce()
    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).toContain('Inquiry Type')
    expect(callArgs.html).toContain('consulting')
    expect(callArgs.html).toContain('Organization')
    expect(callArgs.html).toContain('Example Company')
    expect(callArgs.html).toContain('Service Needed')
    expect(callArgs.html).toContain('platform-infra')
    expect(callArgs.text).toContain('Inquiry Type: consulting')
    expect(callArgs.text).toContain('Organization: Example Company')
  })

  it('accepts a legacy projectType and normalizes it in email', async () => {
    const res = await POST(
      createRequest({ ...legacyBody, projectType: 'full-time' })
    )

    expect(res.status).toBe(200)
    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).toContain('Inquiry Type')
    expect(callArgs.html).toContain('employment')
    expect(callArgs.html).not.toContain('Project Type')
  })

  it('uses the Vercel-controlled client IP instead of client-supplied forwarding headers', async () => {
    vi.stubEnv('VERCEL', '1')
    for (let i = 0; i < 5; i++) {
      await POST(
        createRequest(validBody, {
          'x-vercel-forwarded-for': '10.0.0.1',
          'x-real-ip': '192.168.1.1',
          'x-forwarded-for': '192.168.1.1',
        })
      )
    }
    const res = await POST(
      createRequest(validBody, {
        'x-vercel-forwarded-for': '10.0.0.1',
        'x-real-ip': '192.168.1.2',
        'x-forwarded-for': '192.168.1.1',
      })
    )
    expect(res.status).toBe(429)

    const res2 = await POST(
      createRequest(validBody, { 'x-vercel-forwarded-for': '10.0.0.2' })
    )
    expect(res2.status).toBe(200)
  })

  it('shares the unknown-client limit when callers rotate untrusted forwarding headers', async () => {
    for (let i = 1; i <= 6; i++) {
      const res = await POST(createRequest(validBody, {
        'x-real-ip': `192.0.2.${i}`,
        'x-forwarded-for': `192.0.2.${i}`,
        'x-vercel-forwarded-for': `192.0.2.${i}`,
      }))
      expect(res.status).toBe(i <= 5 ? 200 : 429)
    }
    expect(mockSend).toHaveBeenCalledTimes(5)
  })

  it('returns 400 for invalid JSON body', async () => {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': '127.0.0.1',
        'origin': 'http://localhost:3000',
      },
      body: '{not valid json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('Invalid JSON')
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('rejects a bodyless POST without calling the email service', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      success: false,
      error: 'Invalid JSON in request body',
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it.each([undefined, '1', '999999'])('rejects oversized bytes with Content-Length %s', async (contentLength) => {
    const headers = contentLength === undefined ? undefined : { 'Content-Length': contentLength }
    const res = await POST(createRawRequest(' '.repeat(16 * 1024 + 1), headers))
    expect(res.status).toBe(413)
    expect(await res.json()).toEqual({ success: false, error: 'Request body is too large' })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it.each([false, true])('stops reading oversized streams even when cancellation rejects: %s', async (rejectCancellation) => {
    let pulls = 0
    const cancel = vi.fn(() => rejectCancellation
      ? Promise.reject(new Error('private transport cancellation error'))
      : Promise.resolve())
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls++
        if (pulls > 2) throw new Error('The rest of an oversized body must not be consumed')
        controller.enqueue(new Uint8Array(pulls === 1 ? 16 * 1024 : 1))
      },
      cancel,
    }, { highWaterMark: 0 })

    const res = await POST(createRawRequest(stream, { 'Content-Length': '1' }))
    expect(res.status).toBe(413)
    expect(await res.json()).toEqual({ success: false, error: 'Request body is too large' })
    expect(pulls).toBe(2)
    expect(cancel).toHaveBeenCalledOnce()
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('measures encoded bytes instead of character count', async () => {
    const body = JSON.stringify({ ...validBody, ignored: '界'.repeat(6000) })
    expect(body.length).toBeLessThan(16 * 1024)
    expect(new TextEncoder().encode(body).byteLength).toBeGreaterThan(16 * 1024)
    const res = await POST(createRawRequest(body))
    expect(res.status).toBe(413)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('accepts a valid JSON payload exactly at the byte limit', async () => {
    const body = JSON.stringify(validBody).padEnd(16 * 1024, ' ')
    const res = await POST(createRawRequest(body))
    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it.each(['UTF-8', 'JSON unicode escapes'])('fits all maximum-length fields encoded as %s', async (encoding) => {
    const maxFields = {
      name: '界'.repeat(100),
      email: `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(57)}.com`,
      organization: '界'.repeat(150),
      subject: '界'.repeat(200),
      message: '界'.repeat(2000),
      inquiryType: 'consulting',
      serviceNeeded: 'workflow-automation',
      urgency: 'this-quarter',
    }
    const json = JSON.stringify(maxFields)
    const body = encoding === 'UTF-8' ? json : json.replaceAll('界', '\\u754c')
    expect(maxFields.email).toHaveLength(254)
    expect(new TextEncoder().encode(body).byteLength).toBeLessThan(16 * 1024)
    const res = await POST(createRawRequest(body))
    expect(res.status).toBe(200)
    expect(mockSend.mock.calls[0][0].text).toContain(maxFields.message)
  })

  it('decodes a UTF-8 character split across stream chunks', async () => {
    const bytes = new TextEncoder().encode(JSON.stringify({ ...validBody, message: 'Hi 界' }))
    const split = bytes.indexOf(0xe7) + 1
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytes.slice(0, split))
        controller.enqueue(bytes.slice(split))
        controller.close()
      },
    })
    const res = await POST(createRawRequest(stream))
    expect(res.status).toBe(200)
    expect(mockSend.mock.calls[0][0].text).toContain('Hi 界')
  })

  it('keeps unreadable bodies on the existing generic invalid-JSON error path', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) { controller.error(new Error('private transport detail')) },
    })
    const res = await POST(createRawRequest(stream))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ success: false, error: 'Invalid JSON in request body' })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('returns 403 when origin is not allowed', async () => {
    const res = await POST(
      createRequest(validBody, { origin: 'https://evil.com' })
    )
    expect(res.status).toBe(403)
  })

  it.each(['https://evil.com', 'null', '', 'not-an-origin'])('does not allow a trusted Referer to override explicit Origin %s', async (origin) => {
    const res = await POST(createRequest(validBody, {
      origin, referer: 'https://dbraun.io/contact',
    }))
    expect(res.status).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it.each(['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'])('rejects local Origin %s in production before mail delivery', async (origin) => {
    vi.stubEnv('NODE_ENV', 'production')
    const res = await POST(createRequest(validBody, { origin }))
    expect(res.status).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('rejects a local Referer in production when Origin is absent', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const request = createRequest(validBody, { referer: 'http://localhost:3000/contact' })
    request.headers.delete('origin')
    const res = await POST(request)
    expect(res.status).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('returns 403 when no origin or referer is present', async () => {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': '127.0.0.1',
      },
      body: JSON.stringify(validBody),
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('accepts production origin', async () => {
    const res = await POST(
      createRequest(validBody, { origin: 'https://dbraun.io' })
    )
    expect(res.status).toBe(200)
  })

  it('accepts the configured Vercel preview origin', async () => {
    vi.stubEnv('VERCEL_URL', 'portfolio-preview.vercel.app')

    const res = await POST(
      createRequest(validBody, {
        origin: 'https://portfolio-preview.vercel.app',
      })
    )
    expect(res.status).toBe(200)
  })

  it('accepts localhost origins on non-default dev ports', async () => {
    const res = await POST(
      createRequest(validBody, { origin: 'http://localhost:3001' })
    )
    expect(res.status).toBe(200)
  })

  it('accepts the IPv4 loopback origin during local development', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const response = await POST(
      createRequest(validBody, { origin: 'http://127.0.0.1:3001' })
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true })
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it('accepts requests with valid referer when origin is missing', async () => {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': '127.0.0.1',
        'referer': 'https://dbraun.io/contact',
      },
      body: JSON.stringify(validBody),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('accepts the configured Vercel preview referer when origin is missing', async () => {
    vi.stubEnv('VERCEL_URL', 'portfolio-preview.vercel.app')

    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': '127.0.0.1',
        'referer': 'https://portfolio-preview.vercel.app/contact',
      },
      body: JSON.stringify(validBody),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('rejects a malformed referer when origin is missing', async () => {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': '127.0.0.1',
        'referer': 'not-a-valid-url',
      },
      body: JSON.stringify(validBody),
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })
})
