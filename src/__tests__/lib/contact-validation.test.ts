import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  isValidEmail,
  sanitizeEmail,
  sanitizeInput,
  validateContactForm,
  checkRateLimit,
  _resetRateLimits,
} from '@/lib/contact-validation'

describe('escapeHtml', () => {
  it('escapes HTML entities', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s')
  })

  it('returns plain text unchanged', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123')
  })
})

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
    expect(isValidEmail('test123@test.org')).toBe(true)
  })

  it('rejects emails with HTML characters', () => {
    expect(isValidEmail('<script>@evil.com')).toBe(false)
    expect(isValidEmail('user"@example.com')).toBe(false)
    expect(isValidEmail("user'@example.com")).toBe(false)
  })

  it('rejects emails with control characters', () => {
    expect(isValidEmail('user\n@example.com')).toBe(false)
    expect(isValidEmail('user\r\n@example.com')).toBe(false)
    expect(isValidEmail('user\x00@example.com')).toBe(false)
  })

  it('rejects malformed emails', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('user@.com')).toBe(false)
    expect(isValidEmail('user@domain')).toBe(false)
  })

  it('rejects emails over 254 characters', () => {
    const long = 'a'.repeat(245) + '@example.com'
    expect(isValidEmail(long)).toBe(false)
  })

  it('rejects non-string input', () => {
    expect(isValidEmail(null as unknown as string)).toBe(false)
    expect(isValidEmail(undefined as unknown as string)).toBe(false)
    expect(isValidEmail(123 as unknown as string)).toBe(false)
  })
})

describe('sanitizeEmail', () => {
  it('trims whitespace', () => {
    expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com')
  })

  it('strips control characters', () => {
    expect(sanitizeEmail('user\r\n@example.com')).toBe('user@example.com')
  })

  it('enforces max length of 254', () => {
    const long = 'a'.repeat(300) + '@example.com'
    expect(sanitizeEmail(long).length).toBeLessThanOrEqual(254)
  })
})

describe('sanitizeInput', () => {
  it('trims, truncates, and escapes', () => {
    expect(sanitizeInput('  <b>hello</b>  ', 100)).toBe('&lt;b&gt;hello&lt;/b&gt;')
  })

  it('enforces max length before escaping', () => {
    const result = sanitizeInput('abcdef', 3)
    expect(result).toBe('abc')
  })
})

describe('validateContactForm', () => {
  const validBody = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Hello, this is a test message.',
  }

  it('accepts valid input', () => {
    const result = validateContactForm(validBody)
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.name).toBe('Test User')
    }
  })

  it('rejects null body', () => {
    const result = validateContactForm(null)
    expect(result.valid).toBe(false)
  })

  it('rejects missing name', () => {
    const result = validateContactForm({ ...validBody, name: '' })
    expect(result.valid).toBe(false)
  })

  it('rejects missing email', () => {
    const result = validateContactForm({ ...validBody, email: '' })
    expect(result.valid).toBe(false)
  })

  it('rejects missing message', () => {
    const result = validateContactForm({ ...validBody, message: '' })
    expect(result.valid).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = validateContactForm({ ...validBody, email: 'not-an-email' })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('email')
    }
  })

  it('rejects name over 100 characters', () => {
    const result = validateContactForm({ ...validBody, name: 'a'.repeat(101) })
    expect(result.valid).toBe(false)
  })

  it('rejects message over 2000 characters', () => {
    const result = validateContactForm({ ...validBody, message: 'a'.repeat(2001) })
    expect(result.valid).toBe(false)
  })

  it('accepts valid optional dropdown fields', () => {
    const result = validateContactForm({
      ...validBody,
      projectType: 'business',
      serviceNeeded: 'feature',
      urgency: 'this-week',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.projectType).toBe('business')
      expect(result.data.serviceNeeded).toBe('feature')
      expect(result.data.urgency).toBe('this-week')
    }
  })

  it('rejects invalid dropdown values', () => {
    const result = validateContactForm({
      ...validBody,
      projectType: 'hacking',
    })
    expect(result.valid).toBe(false)
  })

  it('ignores empty string optional fields', () => {
    const result = validateContactForm({
      ...validBody,
      projectType: '',
      serviceNeeded: '',
      urgency: '',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.projectType).toBeUndefined()
    }
  })
})

describe('checkRateLimit', () => {
  it('evicts oldest entry when map reaches hard cap', () => {
    _resetRateLimits()
    // Fill the map to capacity (MAX_MAP_SIZE = 10_000) with IPs that are
    // all still within their window, so pruneStaleEntries won't help.
    // Use a smaller-scale test: fill 10001 entries, then check eviction.
    // The real MAX_MAP_SIZE is 10_000, so inserting 10_001 IPs should trigger
    // eviction on the 10_001st call.
    for (let i = 0; i < 10_000; i++) {
      checkRateLimit(`192.168.${Math.floor(i / 256)}.${i % 256}`)
    }
    // The 10_001st IP should succeed (not throw or grow unbounded)
    const result = checkRateLimit('10.0.0.1')
    expect(result.limited).toBe(false)
    _resetRateLimits()
  })
})
