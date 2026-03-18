import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/contact/route'
import { _resetRateLimits, _resetUpstash } from '@/lib/rate-limit'

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
  return new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-real-ip': '127.0.0.1',
      'origin': 'http://localhost:3000',
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

const validBody = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'Hello, this is a test message.',
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    _resetRateLimits()
    _resetUpstash()
    mockSend.mockReset()
    mockSend.mockResolvedValue({ data: { id: 'test-id' }, error: null })
    // Ensure Upstash is never used in unit tests, regardless of env
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
  })

  afterEach(() => {
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

  it('returns 400 for invalid email', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(createRequest({ ...validBody, email: 'not-an-email' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for empty message', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(createRequest({ ...validBody, message: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for missing fields', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(createRequest({ name: 'Test' }))
    expect(res.status).toBe(400)
  })

  it('returns 429 when rate limited', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    // Exhaust rate limit (5 requests)
    for (let i = 0; i < 5; i++) {
      await POST(createRequest(validBody))
    }
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(429)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(res.headers.get('Retry-After')).toBeTruthy()
  })

  it('returns 200 and sends email on happy path', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it('escapes HTML in email payload', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
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
  })

  it('returns 400 for email with HTML injection', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(
      createRequest({ ...validBody, email: '<script>@evil.com' })
    )
    expect(res.status).toBe(400)
  })

  it('returns 500 when Resend returns an error', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    mockSend.mockResolvedValue({
      data: null,
      error: { message: 'API error' },
    })
    const res = await POST(createRequest(validBody))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('validates optional dropdown fields', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(
      createRequest({ ...validBody, projectType: 'invalid-type' })
    )
    expect(res.status).toBe(400)
  })

  it('accepts valid optional dropdown fields and includes them in email', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(
      createRequest({
        ...validBody,
        projectType: 'consulting',
        serviceNeeded: 'platform-infra',
        urgency: 'this-quarter',
      })
    )
    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalledOnce()
    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).toContain('Project Type')
    expect(callArgs.html).toContain('consulting')
    expect(callArgs.html).toContain('Service Needed')
    expect(callArgs.html).toContain('platform-infra')
  })

  it('uses x-real-ip for rate limiting over x-forwarded-for', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    // Exhaust rate limit for IP 10.0.0.1 via x-real-ip
    for (let i = 0; i < 5; i++) {
      await POST(
        createRequest(validBody, {
          'x-real-ip': '10.0.0.1',
          'x-forwarded-for': '192.168.1.1',
        })
      )
    }
    // Should be rate limited (using x-real-ip, not x-forwarded-for)
    const res = await POST(
      createRequest(validBody, {
        'x-real-ip': '10.0.0.1',
        'x-forwarded-for': '192.168.1.1',
      })
    )
    expect(res.status).toBe(429)

    // Different x-real-ip should not be rate limited
    const res2 = await POST(
      createRequest(validBody, { 'x-real-ip': '10.0.0.2' })
    )
    expect(res2.status).toBe(200)
  })

  it('returns 400 for invalid JSON body', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
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
  })

  it('returns 403 when origin is not allowed', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(
      createRequest(validBody, { origin: 'https://evil.com' })
    )
    expect(res.status).toBe(403)
  })

  it('returns 403 when no origin or referer is present', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
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
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(
      createRequest(validBody, { origin: 'https://dbraun.io' })
    )
    expect(res.status).toBe(200)
  })

  it('accepts localhost origins on non-default dev ports', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    const res = await POST(
      createRequest(validBody, { origin: 'http://localhost:3001' })
    )
    expect(res.status).toBe(200)
  })

  it('accepts requests with valid referer when origin is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key')
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
})
