import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { _resetRateLimits } from '@/lib/contact-validation'

// Mock Upstash modules — vi.hoisted ensures mockLimit is available in vi.mock factory
const { mockLimit } = vi.hoisted(() => ({
  mockLimit: vi.fn(),
}))

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class MockRatelimit {
    static slidingWindow() {
      return 'sliding-window'
    }
    limit = mockLimit
  },
}))

vi.mock('@upstash/redis', () => ({
  Redis: class MockRedis {},
}))

import { checkRateLimit, _resetUpstash } from '@/lib/rate-limit'

describe('rate-limit circuit breaker', () => {
  beforeEach(() => {
    _resetUpstash()
    _resetRateLimits()
    mockLimit.mockReset()
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token')
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  it('uses Upstash when configured and healthy', async () => {
    mockLimit.mockResolvedValue({ success: true, reset: Date.now() + 60_000, remaining: 4 })

    const result = await checkRateLimit('1.2.3.4')

    expect(result.limited).toBe(false)
    expect(result.remaining).toBe(4)
    expect(mockLimit).toHaveBeenCalledWith('1.2.3.4')
  })

  it('returns limited when Upstash reports over limit', async () => {
    const reset = Date.now() + 30_000
    mockLimit.mockResolvedValue({ success: false, reset, remaining: 0 })

    const result = await checkRateLimit('1.2.3.4')

    expect(result.limited).toBe(true)
    expect(result.retryAfter).toBe(30)
  })

  it('falls back to in-memory on Upstash runtime failure', async () => {
    mockLimit.mockRejectedValue(new Error('Connection refused'))

    const result = await checkRateLimit('1.2.3.4')

    // In-memory limiter allows the first request
    expect(result.limited).toBe(false)
    expect(mockLimit).toHaveBeenCalledOnce()
  })

  it('skips Upstash during cooldown window after failure', async () => {
    mockLimit.mockRejectedValueOnce(new Error('Connection refused'))
    await checkRateLimit('1.2.3.4') // triggers 60s cooldown

    mockLimit.mockClear()

    // Advance 30s — still within cooldown
    vi.advanceTimersByTime(30_000)
    await checkRateLimit('5.6.7.8')

    expect(mockLimit).not.toHaveBeenCalled() // Upstash was skipped
  })

  it('retries Upstash after cooldown expires', async () => {
    mockLimit.mockRejectedValueOnce(new Error('Connection refused'))
    await checkRateLimit('1.2.3.4') // triggers 60s cooldown

    mockLimit.mockClear()
    mockLimit.mockResolvedValue({ success: true, reset: Date.now() + 120_000, remaining: 4 })

    // Advance past the 60s cooldown
    vi.advanceTimersByTime(61_000)
    const result = await checkRateLimit('5.6.7.8')

    expect(mockLimit).toHaveBeenCalledWith('5.6.7.8')
    expect(result.limited).toBe(false)
  })

  it('re-engages cooldown on repeated failure after recovery attempt', async () => {
    // First failure → cooldown
    mockLimit.mockRejectedValueOnce(new Error('Timeout'))
    await checkRateLimit('1.2.3.4')

    // Advance past cooldown
    vi.advanceTimersByTime(61_000)

    // Retry fails again → new cooldown
    mockLimit.mockRejectedValueOnce(new Error('Still broken'))
    await checkRateLimit('1.2.3.4')

    mockLimit.mockClear()

    // Within new cooldown — should skip Upstash
    vi.advanceTimersByTime(30_000)
    await checkRateLimit('1.2.3.4')

    expect(mockLimit).not.toHaveBeenCalled()
  })

  it('falls back to in-memory when Upstash env vars are not set', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    _resetUpstash()

    const result = await checkRateLimit('1.2.3.4')

    expect(result.limited).toBe(false)
    expect(mockLimit).not.toHaveBeenCalled()
  })

  it('_resetUpstash clears cooldown state', async () => {
    mockLimit.mockRejectedValueOnce(new Error('Connection refused'))
    await checkRateLimit('1.2.3.4') // triggers cooldown

    _resetUpstash()

    mockLimit.mockResolvedValue({ success: true, reset: Date.now() + 60_000, remaining: 4 })
    await checkRateLimit('1.2.3.4')

    // After reset, Upstash should be retried immediately (no cooldown)
    expect(mockLimit).toHaveBeenCalled()
  })
})
