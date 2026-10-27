import { isIP } from 'node:net'

// ---------------------------------------------------------------------------
// In-memory rate limiter (development/test fallback only)
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

/**
 * Trust only Vercel's platform-managed client address, and only on Vercel.
 * System environment variables must be enabled for the deployment. Other hosts
 * deliberately share an unknown bucket until their proxy trust is configured.
 * https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for
 */
export function getClientIp(headers: Headers): string {
  if (process.env.VERCEL !== '1') return 'unknown'

  const ip = headers.get('x-vercel-forwarded-for')?.trim()
  if (!ip || ip.length > 45 || ip.includes('%')) return 'unknown'

  const version = isIP(ip)
  if (version === 4) return ip
  if (version !== 6) return 'unknown'

  // URL canonicalization folds casing, leading zeros, and IPv6 compression.
  const normalized = new URL(`http://[${ip}]/`).hostname.slice(1, -1)
  const mapped = /^::ffff:([\da-f]{1,4}):([\da-f]{1,4})$/.exec(normalized)
  if (mapped) {
    const high = Number.parseInt(mapped[1], 16)
    const low = Number.parseInt(mapped[2], 16)
    return [high >> 8, high & 255, low >> 8, low & 255].join('.')
  }
  return normalized
}

/** Reset in-memory rate limit state (for testing) */
export function _resetRateLimits(): void {
  rateLimitMap.clear()
}

// ---------------------------------------------------------------------------
// Distributed rate limiter (required in production)
// ---------------------------------------------------------------------------

interface DistributedLimiter {
  limit: (id: string) => Promise<{
    success: boolean
    reset: number
    remaining: number
    reason?: string
  }>
}

export class RateLimitUnavailableError extends Error {
  constructor() {
    super('Contact rate limiting is temporarily unavailable')
    this.name = 'RateLimitUnavailableError'
  }
}

let upstashLimiter: DistributedLimiter | null = null
let upstashInitialization: Promise<DistributedLimiter> | null = null
let upstashDisabledUntil = 0
const UPSTASH_COOLDOWN_MS = 60_000
const UPSTASH_TIMEOUT_MS = 2_000

function markUpstashUnavailable(): void {
  if (Date.now() >= upstashDisabledUntil) {
    // Do not log upstream errors: they may include credentials or request data.
    console.error('Distributed contact rate limiter unavailable')
  }
  upstashLimiter = null
  upstashDisabledUntil = Date.now() + UPSTASH_COOLDOWN_MS
}

async function withDeadline<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new RateLimitUnavailableError()), UPSTASH_TIMEOUT_MS)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

async function getUpstashLimiter(): Promise<DistributedLimiter> {
  if (Date.now() < upstashDisabledUntil) throw new RateLimitUnavailableError()
  if (upstashLimiter) return upstashLimiter
  if (upstashInitialization) return upstashInitialization

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') markUpstashUnavailable()
    throw new RateLimitUnavailableError()
  }

  upstashInitialization = withDeadline((async () => {
    const endpoint = new URL(url)
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) {
      throw new RateLimitUnavailableError()
    }
    const [{ Ratelimit }, { Redis }] = await Promise.all([
      import('@upstash/ratelimit'),
      import('@upstash/redis'),
    ])

    return new Ratelimit({
      redis: new Redis({
        url,
        token,
        retry: false,
        signal: () => AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
      }),
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, '60 s'),
      prefix: 'portfolio:contact',
      // Upstash's built-in timeout returns success. Enforce our own deadline.
      timeout: 0,
    })
  })())
    .then((limiter) => {
      upstashLimiter = limiter
      return limiter
    })
    .catch(() => {
      markUpstashUnavailable()
      throw new RateLimitUnavailableError()
    })
    .finally(() => {
      upstashInitialization = null
    })

  return upstashInitialization
}

/**
 * Check rate limit for a client IP.
 *
 * Production requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
 * Failed checks throw instead of allowing email submissions without distributed
 * protection. A one-minute cooldown bounds outage retries, then initialization
 * is retried. Only development/testing may use the in-memory fallback.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const limiter = await getUpstashLimiter()
    try {
      const { success, reset, remaining, reason } = await withDeadline(limiter.limit(ip))
      if (reason === 'timeout' || typeof success !== 'boolean' || !Number.isFinite(reset) || !Number.isFinite(remaining)) {
        throw new RateLimitUnavailableError()
      }
      if (!success) {
        const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
        return { limited: true, retryAfter }
      }
      return { limited: false, remaining }
    } catch {
      markUpstashUnavailable()
      throw new RateLimitUnavailableError()
    }
  } catch {
    if (process.env.NODE_ENV === 'production') throw new RateLimitUnavailableError()
    return inMemoryCheckRateLimit(ip)
  }
}

/** Reset module state (for testing) */
export function _resetUpstash(): void {
  upstashLimiter = null
  upstashInitialization = null
  upstashDisabledUntil = 0
}
