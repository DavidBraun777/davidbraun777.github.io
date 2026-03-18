import { CONTROL_CHAR_REGEX } from './contact-validation'

// ---------------------------------------------------------------------------
// In-memory rate limiter (used as fallback when Upstash is unavailable)
// ---------------------------------------------------------------------------

interface RateLimitRecord {
  count: number
  resetAt: number
  lastSeen: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5
const MAX_MAP_SIZE = 10_000

export interface RateLimitResult {
  limited: boolean
  retryAfter?: number
  remaining?: number
}

/** Prune stale entries from the rate limit map */
function pruneStaleEntries(): void {
  const now = Date.now()
  for (const [key, record] of rateLimitMap) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}

/** In-memory rate limit check for a given IP */
function inMemoryCheckRateLimit(ip: string): RateLimitResult {
  const now = Date.now()

  // Prune expired entries when map is large
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    pruneStaleEntries()
  }

  // Look up existing record first, before any eviction
  const record = rateLimitMap.get(ip)

  // Only evict when we need to insert a brand-new key and capacity is reached.
  // This prevents evicting the current IP's own record and resetting its count.
  const isNewKey = !record || now > record.resetAt
  if (isNewKey && rateLimitMap.size >= MAX_MAP_SIZE) {
    let oldestKey: string | undefined
    let oldestSeen = Infinity
    for (const [key, rec] of rateLimitMap) {
      if (rec.lastSeen < oldestSeen) {
        oldestSeen = rec.lastSeen
        oldestKey = key
      }
    }
    if (oldestKey) rateLimitMap.delete(oldestKey)
  }

  if (isNewKey) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
      lastSeen: now,
    })
    return { limited: false, remaining: RATE_LIMIT_MAX - 1 }
  }

  record.lastSeen = now

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return { limited: true, retryAfter }
  }

  record.count++
  return { limited: false, remaining: RATE_LIMIT_MAX - record.count }
}

/** Extract client IP from request headers (Vercel-aware). */
export function getClientIp(headers: Headers): string {
  // x-real-ip is set by Vercel/nginx and is most trustworthy
  const realIp = headers.get('x-real-ip')
  if (realIp && !CONTROL_CHAR_REGEX.test(realIp)) {
    return realIp.trim()
  }

  // Fall back to x-forwarded-for; on Vercel the first entry is the client IP.
  // Validate to prevent control char injection.
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const firstIp = forwarded.split(',')[0]?.trim()
    if (firstIp && !CONTROL_CHAR_REGEX.test(firstIp)) {
      return firstIp
    }
  }

  return 'unknown'
}

/** Reset in-memory rate limit state (for testing) */
export function _resetRateLimits(): void {
  rateLimitMap.clear()
}

// ---------------------------------------------------------------------------
// Upstash rate limiter (used when UPSTASH_REDIS_REST_URL is configured)
// ---------------------------------------------------------------------------

// Lazily-initialized Upstash rate limiter (singleton across requests)
let upstashLimiter: {
  limit: (id: string) => Promise<{ success: boolean; reset: number; remaining: number }>
} | null = null
let upstashInitAttempted = false

// Circuit breaker: after a runtime failure, disable Upstash for a cooldown
// period to avoid adding latency to every request during an outage.
let upstashDisabledUntil = 0
const UPSTASH_COOLDOWN_MS = 60_000 // 1 minute

async function getUpstashLimiter() {
  // Circuit breaker: skip Upstash while in cooldown
  if (Date.now() < upstashDisabledUntil) return null

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
 *
 * On Upstash failure, engages a circuit breaker (1 min cooldown) so subsequent
 * requests fall back to in-memory immediately without retrying the failing call.
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
      upstashDisabledUntil = Date.now() + UPSTASH_COOLDOWN_MS
    }
  }

  return inMemoryCheckRateLimit(ip)
}

/** Reset module state (for testing) */
export function _resetUpstash(): void {
  upstashLimiter = null
  upstashInitAttempted = false
  upstashDisabledUntil = 0
}
