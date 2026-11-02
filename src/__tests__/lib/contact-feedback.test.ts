import { describe, expect, test } from 'vitest'
import { getContactFailure, getSchedulingUrl } from '@/lib/contact-feedback'

describe('contact scheduling destinations', () => {
  test.each([undefined, '', ' ', '/contact', 'https://', 'not a URL', 'javascript:alert(1)', 'mailto:someone@example.test', 'https://user@example.test/call', 'https://:secret@example.test/call'])('omits an unusable booking destination: %s', value => {
    expect(getSchedulingUrl(value)).toBeNull()
  })

  test.each(['https://example.test/call', 'http://example.test/call'])('preserves a valid configured destination: %s', url => {
    expect(getSchedulingUrl(' ' + url + ' ')).toBe(url)
  })
})

describe('contact failure guidance', () => {
  test.each([
    ['1', 'Wait 1 second before sending again.', 1],
    ['30', 'Wait 30 seconds before sending again.', 30],
    [null, 'Please wait a moment before trying again.', 0],
    ['invalid', 'Please wait a moment before trying again.', 0],
    ['-1', 'Please wait a moment before trying again.', 0],
    ['0', 'Please wait a moment before trying again.', 0],
    ['1.5', 'Please wait a moment before trying again.', 0],
    ['9007199254740992', 'Please wait a moment before trying again.', 0],
    ['2147484', 'Please wait a moment before trying again.', 0],
  ])('uses whole-second Retry-After guidance without an invalid lockout: %s', (header, message, seconds) => {
    const headers = new Headers()
    if (header !== null) headers.set('Retry-After', header)
    const failure = getContactFailure({ status: 429, headers })
    expect(failure.retryAfterSeconds).toBe(seconds)
    expect(failure.message).toContain(message)
    expect(failure.message).toContain('Your draft is still here.')
  })

  test.each([
    [400, 'check your inquiry details'],
    [403, 'could not be accepted'],
    [413, 'Shorten the message'],
    [500, 'temporarily unavailable'],
    [503, 'temporarily unavailable'],
  ])('offers useful safe guidance for HTTP %s', (status, message) => {
    const failure = getContactFailure({ status, headers: new Headers() })
    expect(failure.message).toContain(message)
    expect(failure.message).toContain('Your draft is still here.')
    expect(failure.retryAfterSeconds).toBe(0)
  })
})
