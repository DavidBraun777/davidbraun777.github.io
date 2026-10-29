import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  checkRateLimit, getClientIp, RateLimitUnavailableError,
  _resetRateLimits, _resetUpstash,
} from '@/lib/rate-limit'

const { mockLimit, mockInitialize, mockRedis } = vi.hoisted(() => ({
  mockLimit: vi.fn(), mockInitialize: vi.fn(), mockRedis: vi.fn(),
}))

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class MockRatelimit {
    constructor(config: unknown) { mockInitialize(config) }
    static slidingWindow() { return 'sliding-window' }
    limit = mockLimit
  },
}))
vi.mock('@upstash/redis', () => ({
  Redis: class MockRedis {
    constructor(config: unknown) { mockRedis(config) }
  },
}))

beforeEach(() => {
  _resetUpstash()
  _resetRateLimits()
  mockLimit.mockReset()
  mockInitialize.mockReset()
  mockRedis.mockReset()
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('VERCEL', '')
  vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io')
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token')
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-10-26T12:00:00Z'))
  vi.spyOn(console, 'error').mockImplementation(() => {})
  mockLimit.mockImplementation(async () => ({
    success: true, reset: Date.now() + 60_000, remaining: 4,
  }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('distributed production rate limiting', () => {
  it('uses Redis and disables the SDK fail-open timeout', async () => {
    await expect(checkRateLimit('192.0.2.1')).resolves.toEqual({ limited: false, remaining: 4 })
    expect(mockLimit).toHaveBeenCalledWith('192.0.2.1')
    expect(mockInitialize).toHaveBeenCalledWith(expect.objectContaining({ timeout: 0 }))
    expect(mockRedis).toHaveBeenCalledWith(expect.objectContaining({ retry: false, signal: expect.any(Function) }))
    expect(vi.getTimerCount()).toBe(0)
  })

  it('shares initialization between concurrent first requests', async () => {
    const results = await Promise.all([
      checkRateLimit('192.0.2.1'), checkRateLimit('192.0.2.2'), checkRateLimit('192.0.2.3'),
    ])
    expect(results.every(({ limited }) => !limited)).toBe(true)
    expect(mockInitialize).toHaveBeenCalledOnce()
    expect(mockRedis).toHaveBeenCalledOnce()
    expect(mockLimit).toHaveBeenCalledTimes(3)
  })

  it('provides each Redis request a fresh transport deadline after an earlier signal expires', async () => {
    // AbortSignal.timeout uses Node's native timer rather than Vitest's fake clock.
    vi.useRealTimers()
    const signals: AbortSignal[] = []
    mockRedis.mockImplementation(({ signal }: { signal: () => AbortSignal }) => {
      mockLimit.mockImplementation(async () => {
        signals.push(signal())
        return { success: true, reset: Date.now() + 60_000, remaining: 4 }
      })
    })

    await expect(checkRateLimit('192.0.2.1')).resolves.toMatchObject({ limited: false })
    expect(signals[0].aborted).toBe(false)
    await new Promise<void>((resolve) => {
      signals[0].addEventListener('abort', () => resolve(), { once: true })
    })
    expect(signals[0].reason).toMatchObject({ name: 'TimeoutError' })

    await expect(checkRateLimit('192.0.2.2')).resolves.toMatchObject({ limited: false })
    expect(signals[1]).not.toBe(signals[0])
    expect(signals[1].aborted).toBe(false)
    expect(mockRedis).toHaveBeenCalledOnce()
  })

  it('preserves actual limit exhaustion and a positive Retry-After', async () => {
    mockLimit.mockResolvedValue({ success: false, reset: Date.now() + 30_000, remaining: 0 })
    await expect(checkRateLimit('192.0.2.1')).resolves.toEqual({ limited: true, retryAfter: 30 })
    mockLimit.mockResolvedValue({ success: false, reset: Date.now() - 1, remaining: 0 })
    await expect(checkRateLimit('192.0.2.1')).resolves.toEqual({ limited: true, retryAfter: 1 })
  })

  it.each(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'])(
    'fails closed when %s is missing, then recovers after configuration and cooldown', async (name) => {
      const configured = process.env[name]!
      vi.stubEnv(name, ' ')
      await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
      expect(mockLimit).not.toHaveBeenCalled()
      vi.stubEnv(name, configured)
      await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
      vi.advanceTimersByTime(60_001)
      await expect(checkRateLimit('192.0.2.1')).resolves.toMatchObject({ limited: false })
    }
  )

  it.each(['not-a-url', 'http://fake.upstash.io', 'https://user:secret@fake.upstash.io'])(
    'rejects unsafe or malformed Redis endpoint configuration', async (url) => {
      vi.stubEnv('UPSTASH_REDIS_REST_URL', url)
      await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
      expect(mockRedis).not.toHaveBeenCalled()
      expect(mockLimit).not.toHaveBeenCalled()
    }
  )

  it('retries failed initialization after cooldown instead of permanently latching', async () => {
    mockInitialize.mockImplementationOnce(() => { throw new Error('private initialization details') })
    const results = await Promise.allSettled([checkRateLimit('192.0.2.1'), checkRateLimit('192.0.2.2')])
    for (const result of results) {
      expect(result.status).toBe('rejected')
      if (result.status === 'rejected') expect(result.reason).toBeInstanceOf(RateLimitUnavailableError)
    }
    expect(mockInitialize).toHaveBeenCalledOnce()
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    expect(mockInitialize).toHaveBeenCalledOnce()
    vi.advanceTimersByTime(60_001)
    await expect(checkRateLimit('192.0.2.1')).resolves.toMatchObject({ limited: false })
    expect(mockInitialize).toHaveBeenCalledTimes(2)
  })

  it('fails closed during a runtime outage and retries after cooldown', async () => {
    await checkRateLimit('192.0.2.1')
    mockLimit.mockRejectedValueOnce(new Error('Redis unavailable'))
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    vi.advanceTimersByTime(30_000)
    await expect(checkRateLimit('192.0.2.2')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    expect(mockLimit).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(30_001)
    await expect(checkRateLimit('192.0.2.1')).resolves.toMatchObject({ limited: false })
    expect(mockInitialize).toHaveBeenCalledTimes(2)
  })

  it('re-enters cooldown if a recovery attempt also fails', async () => {
    mockLimit.mockRejectedValue(new Error('Redis unavailable'))
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    vi.advanceTimersByTime(60_001)
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    vi.advanceTimersByTime(30_000)
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    expect(mockLimit).toHaveBeenCalledTimes(2)
  })

  it('bounds a hanging Redis operation and recovers after timeout cooldown', async () => {
    await checkRateLimit('192.0.2.1')
    mockLimit.mockImplementationOnce(() => new Promise(() => {}))
    const unavailable = expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    await vi.advanceTimersByTimeAsync(2_001)
    await unavailable
    vi.advanceTimersByTime(60_001)
    await expect(checkRateLimit('192.0.2.1')).resolves.toMatchObject({ limited: false })
  })

  it('rejects an SDK timeout response even if it claims success', async () => {
    mockLimit.mockResolvedValue({ success: true, reset: Date.now() + 60_000, remaining: 4, reason: 'timeout' })
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
  })

  it('rejects malformed Redis results rather than accepting a request', async () => {
    mockLimit.mockResolvedValue({ success: true, reset: Number.NaN, remaining: 4 })
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
  })

  it('never logs raw upstream errors or credentials', async () => {
    mockLimit.mockRejectedValue(new Error('Authorization: fake-token https://private-endpoint'))
    await expect(checkRateLimit('192.0.2.1')).rejects.toEqual(new RateLimitUnavailableError())
    expect(console.error).toHaveBeenCalledExactlyOnceWith('Distributed contact rate limiter unavailable')
  })

  it('fails all concurrent outage checks while emitting only one diagnostic per cooldown', async () => {
    mockLimit.mockRejectedValue(new Error('private Redis outage details'))

    const results = await Promise.allSettled([
      checkRateLimit('192.0.2.1'),
      checkRateLimit('192.0.2.2'),
    ])

    expect(results).toEqual([
      { status: 'rejected', reason: new RateLimitUnavailableError() },
      { status: 'rejected', reason: new RateLimitUnavailableError() },
    ])
    expect(mockLimit).toHaveBeenCalledTimes(2)
    expect(console.error).toHaveBeenCalledExactlyOnceWith('Distributed contact rate limiter unavailable')

    await expect(checkRateLimit('192.0.2.3')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    expect(mockLimit).toHaveBeenCalledTimes(2)
    expect(console.error).toHaveBeenCalledOnce()

    vi.advanceTimersByTime(60_001)
    await expect(checkRateLimit('192.0.2.1')).rejects.toBeInstanceOf(RateLimitUnavailableError)
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})

describe('development and test fallback', () => {
  it('prunes expired local identities if an empty identity has allowed overflow', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    // The exported API accepts an empty string as an identity. It can become
    // the oldest key, so exercise overflow cleanup without accessing module state.
    await checkRateLimit('')
    for (let index = 0; index < 10_000; index++) await checkRateLimit(`client-${index}`)
    await expect(checkRateLimit('client-0')).resolves.toEqual({ limited: false, remaining: 3 })
    vi.advanceTimersByTime(60_001)
    await expect(checkRateLimit('new-client')).resolves.toEqual({ limited: false, remaining: 4 })
    await expect(checkRateLimit('client-0')).resolves.toEqual({ limited: false, remaining: 4 })
  })
  it.each(['development', 'test'])('allows bounded local requests without Redis in %s', async (environment) => {
    vi.stubEnv('NODE_ENV', environment)
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    for (let index = 0; index < 5; index++) {
      await expect(checkRateLimit('192.0.2.1')).resolves.toMatchObject({ limited: false })
    }
    await expect(checkRateLimit('192.0.2.1')).resolves.toEqual({ limited: true, retryAfter: 60 })
    vi.advanceTimersByTime(60_001)
    await expect(checkRateLimit('192.0.2.1')).resolves.toEqual({ limited: false, remaining: 4 })
    expect(mockLimit).not.toHaveBeenCalled()
  })

  it('retains local fallback after configured Redis fails', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    mockLimit.mockRejectedValue(new Error('Redis unavailable'))
    for (let index = 0; index < 5; index++) await checkRateLimit('192.0.2.1')
    await expect(checkRateLimit('192.0.2.1')).resolves.toMatchObject({ limited: true })
    expect(mockLimit).toHaveBeenCalledOnce()
  })

  it('keeps unknown clients in one bucket despite forged forwarding headers', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    for (let index = 0; index < 5; index++) {
      const identity = getClientIp(new Headers({ 'x-real-ip': `192.0.2.${index}`, 'x-forwarded-for': `192.0.2.${index}` }))
      expect(identity).toBe('unknown')
      await checkRateLimit(identity)
    }
    await expect(checkRateLimit(getClientIp(new Headers({ 'x-real-ip': '192.0.2.99' }))))
      .resolves.toMatchObject({ limited: true })
  })

  it('evicts at the local map capacity without resetting an existing client', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    for (let index = 0; index < 10_000; index++) {
      await checkRateLimit(`192.168.${Math.floor(index / 256)}.${index % 256}`)
    }
    await expect(checkRateLimit('192.168.0.0')).resolves.toEqual({ limited: false, remaining: 3 })
    await expect(checkRateLimit('10.0.0.1')).resolves.toMatchObject({ limited: false })
  })
})

describe('trusted client identities', () => {
  it('does not trust platform-shaped headers outside Vercel', () => {
    expect(getClientIp(new Headers({
      'x-vercel-forwarded-for': '192.0.2.1', 'x-real-ip': '192.0.2.2', 'x-forwarded-for': '192.0.2.3',
    }))).toBe('unknown')
  })

  it('uses the validated Vercel header rather than generic forwarding headers', () => {
    vi.stubEnv('VERCEL', '1')
    expect(getClientIp(new Headers({
      'x-vercel-forwarded-for': '192.0.2.1', 'x-real-ip': '192.0.2.2',
      'x-forwarded-for': '192.0.2.3, 192.0.2.4',
    }))).toBe('192.0.2.1')
    expect(getClientIp(new Headers({ 'x-real-ip': '192.0.2.2' }))).toBe('unknown')
  })

  it.each([
    '', 'attacker', '999.0.0.1', '012.0.0.1', '192.0.2.1:1234',
    '192.0.2.1, 192.0.2.2', '[2001:db8::1]', '2001:db8::zz', 'fe80::1%eth0', 'a'.repeat(100),
  ])('rejects malformed or ambiguous platform address %j', (address) => {
    vi.stubEnv('VERCEL', '1')
    expect(getClientIp(new Headers({ 'x-vercel-forwarded-for': address, 'x-real-ip': '192.0.2.1' })))
      .toBe('unknown')
  })

  it.each(['2001:db8::1', '2001:0DB8:0:0:0:0:0:1', '2001:0db8:0000:0000:0000:0000:0000:0001'])(
    'normalizes equivalent IPv6 addresses %s', (address) => {
      vi.stubEnv('VERCEL', '1')
      expect(getClientIp(new Headers({ 'x-vercel-forwarded-for': address }))).toBe('2001:db8::1')
    }
  )

  it.each(['192.0.2.1', '::ffff:192.0.2.1', '0:0:0:0:0:ffff:c000:201'])(
    'uses one identity for IPv4 and its mapped IPv6 representation %s', (address) => {
      vi.stubEnv('VERCEL', '1')
      expect(getClientIp(new Headers({ 'x-vercel-forwarded-for': address }))).toBe('192.0.2.1')
    }
  )
})
