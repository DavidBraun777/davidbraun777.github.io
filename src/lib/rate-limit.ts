import {
  checkRateLimit as inMemoryCheckRateLimit,
  getClientIp,
  type RateLimitResult,
} from './contact-validation'

export { getClientIp, type RateLimitResult }

// Lazily-initialized Upstash rate limiter (singleton across requests)
let upstashLimiter: {
  limit: (id: string) => Promise<{ success: boolean; reset: number; remaining: number }>
} | null = null
let upstashInitAttempted = false

async function getUpstashLimiter() {
  if (upstashInitAttempted) return upstashLimiter
  upstashInitAttempted = true

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')

    upstashLimiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, '60 s'),
      prefix: 'portfolio:contact',
    })
    return upstashLimiter
  } catch {
    console.error('Failed to initialize Upstash rate limiter, using in-memory fallback')
    return null
  }
}

/**
 * Check rate limit for a client IP.
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * are set; otherwise falls back to the in-memory rate limiter.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const limiter = await getUpstashLimiter()

  if (limiter) {
    try {
      const { success, reset, remaining } = await limiter.limit(ip)
      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000)
        return { limited: true, retryAfter }
      }
      return { limited: false, remaining }
    } catch (error) {
      console.error('Upstash rate limit error, falling back to in-memory:', error)
    }
  }

  return inMemoryCheckRateLimit(ip)
}

/** Reset module state (for testing) */
export function _resetUpstash(): void {
  upstashLimiter = null
  upstashInitAttempted = false
}
