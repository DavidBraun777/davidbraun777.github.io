import { describe, expect, test } from 'vitest'
import { contentFingerprint } from '@/lib/search/destinations'

describe('content fingerprint Unicode compatibility', () => {
  // Recorded from ba84b4d before replacing UTF-16 code units with code points.
  test.each([
    ['', 'ztntfp'],
    ['BM25 lexical retrieval', 'aiqk0l'],
    ['Café', '1dq41b0'],
    ['Cafe\u0301', '1dq41b0'],
    ['  durable\n workflows  ', '1okw7xu'],
  ])('preserves the existing normalized fingerprint of %j', (text, fingerprint) => {
    expect(contentFingerprint(text)).toBe(fingerprint)
  })

  test('distinguishes supplementary characters that previously shared a leading surrogate', () => {
    // Both were fegh9k in ba84b4d, which hashed only their shared high surrogate.
    expect(contentFingerprint('😀')).toBe('1r2uqn')
    expect(contentFingerprint('😁')).toBe('1h391o')
    expect(contentFingerprint('😀')).not.toBe(contentFingerprint('😁'))
    expect(contentFingerprint('🧠')).toBe('sdj0hr')
  })
})
