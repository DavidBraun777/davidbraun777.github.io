import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  isValidEmail,
  sanitizeEmail,
  sanitizeInput,
  validateContactForm,
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

  it('accepts an email at the 254-character limit', () => {
    const atLimit = `${'a'.repeat(242)}@example.com`
    expect(atLimit).toHaveLength(254)
    expect(isValidEmail(atLimit)).toBe(true)
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
    expect(result).toEqual({ valid: true, data: validBody })
  })

  it.each([null, undefined, 'not-an-object', 42])(
    'rejects a non-object request body: %j',
    (body) => {
      expect(validateContactForm(body)).toEqual({
        valid: false,
        error: 'Invalid request body',
      })
    }
  )

  it.each([
    ['name', '   ', 'Name is required'],
    ['email', '', 'Email is required'],
    ['subject', null, 'Subject is required'],
    ['message', 42, 'Message is required'],
  ] as const)('rejects invalid required field %s', (field, value, error) => {
    expect(validateContactForm({ ...validBody, [field]: value })).toEqual({
      valid: false,
      error,
    })
  })

  it('preserves required-field precedence over length errors', () => {
    expect(
      validateContactForm({
        ...validBody,
        name: 'a'.repeat(101),
        email: '',
      })
    ).toEqual({ valid: false, error: 'Email is required' })
  })

  it('trims required text fields in validated data', () => {
    expect(
      validateContactForm({
        ...validBody,
        name: '  Test User  ',
        subject: '  Test Subject  ',
        message: '  Hello, this is a test message.  ',
      })
    ).toEqual({ valid: true, data: validBody })
  })

  it('rejects invalid email format', () => {
    const result = validateContactForm({ ...validBody, email: 'not-an-email' })
    expect(result).toEqual({ valid: false, error: 'Invalid email address' })
  })

  it('applies strict email validation before trimming', () => {
    expect(
      validateContactForm({ ...validBody, email: ' test@example.com ' })
    ).toEqual({ valid: false, error: 'Invalid email address' })
  })

  it('accepts required text fields at their exact length limits', () => {
    const result = validateContactForm({
      ...validBody,
      name: 'a'.repeat(100),
      subject: 'b'.repeat(200),
      message: 'c'.repeat(2000),
    })
    expect(result.valid).toBe(true)
  })

  it('applies length limits before trimming required text', () => {
    expect(
      validateContactForm({ ...validBody, name: ` ${'a'.repeat(100)} ` })
    ).toEqual({
      valid: false,
      error: 'Name must be 100 characters or less',
    })
  })

  it.each([
    ['name', 101, 'Name must be 100 characters or less'],
    ['subject', 201, 'Subject must be 200 characters or less'],
    ['message', 2001, 'Message must be 2,000 characters or less'],
  ] as const)('rejects %s over its length limit', (field, length, error) => {
    expect(
      validateContactForm({ ...validBody, [field]: 'a'.repeat(length) })
    ).toEqual({ valid: false, error })
  })

  it('accepts valid optional dropdown fields', () => {
    const result = validateContactForm({
      ...validBody,
      projectType: 'consulting',
      serviceNeeded: 'platform-infra',
      urgency: 'this-quarter',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data.projectType).toBe('consulting')
      expect(result.data.serviceNeeded).toBe('platform-infra')
      expect(result.data.urgency).toBe('this-quarter')
    }
  })

  it.each([
    ['projectType', 'hacking', 'Invalid project type'],
    ['serviceNeeded', null, 'Invalid service type'],
    ['urgency', ' ', 'Invalid urgency level'],
  ] as const)('rejects invalid optional field %s', (field, value, error) => {
    expect(validateContactForm({ ...validBody, [field]: value })).toEqual({
      valid: false,
      error,
    })
  })

  it('ignores empty string optional fields', () => {
    const result = validateContactForm({
      ...validBody,
      projectType: '',
      serviceNeeded: '',
      urgency: '',
    })
    expect(result).toEqual({ valid: true, data: validBody })
  })
})
