import { afterEach, expect, it, vi } from 'vitest'
import { formatFromAddress, getContactEmailConfig, getResendClient } from '@/lib/resend'
const constructor = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({ Resend: class { constructor(key: string) { constructor(key) } } }))
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })

it('requires an API key and passes only its trimmed configured value to the provider', () => {
  vi.stubEnv('RESEND_API_KEY', '')
  expect(() => getResendClient()).toThrow('RESEND_API_KEY is not configured')
  vi.stubEnv('RESEND_API_KEY', ' test-key ')
  getResendClient()
  expect(constructor).toHaveBeenCalledWith('test-key')
})

it('uses safe sender defaults and the legacy recipient fallback', () => {
  vi.stubEnv('CONTACT_NOTIFICATION_EMAIL', '')
  vi.stubEnv('CONTACT_EMAIL', ' legacy@example.com ')
  vi.stubEnv('CONTACT_FROM_EMAIL', '')
  vi.stubEnv('CONTACT_FROM_NAME', '')
  expect(getContactEmailConfig()).toEqual({ notificationEmail: 'legacy@example.com', fromEmail: 'contact@dbraun.io', fromName: 'dbraun.io Contact' })
  expect(formatFromAddress('Contact', 'contact@example.com')).toBe('Contact <contact@example.com>')
})

it('validates recipients and senders, sanitizes display names, and rejects an empty sanitized name', () => {
  vi.stubEnv('CONTACT_NOTIFICATION_EMAIL', '')
  vi.stubEnv('CONTACT_EMAIL', '')
  expect(() => getContactEmailConfig()).toThrow('CONTACT_NOTIFICATION_EMAIL is not configured')
  vi.stubEnv('CONTACT_NOTIFICATION_EMAIL', 'bad email')
  expect(() => getContactEmailConfig()).toThrow('CONTACT_NOTIFICATION_EMAIL must be a valid email')
  vi.stubEnv('CONTACT_NOTIFICATION_EMAIL', 'valid@example.com')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'bad')
  expect(() => getContactEmailConfig()).toThrow('CONTACT_FROM_EMAIL must be a valid email')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'sender@example.com')
  vi.stubEnv('CONTACT_FROM_NAME', '"\r\n')
  expect(() => getContactEmailConfig()).toThrow('CONTACT_FROM_NAME must not be empty')
  vi.stubEnv('CONTACT_FROM_NAME', '"A\nB"' + 'x'.repeat(100))
  expect(getContactEmailConfig().fromName).toBe(('AB' + 'x'.repeat(100)).slice(0, 64))
})
