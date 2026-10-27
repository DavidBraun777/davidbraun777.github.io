import { describe, expect, it } from 'vitest'
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from 'next/constants'
import nextConfig from '../../../next.config'

async function securityPolicy(phase: string) {
  const rules = await nextConfig(phase).headers?.()
  const rule = rules?.find(({ source }) => source === '/(.*)')
  expect(rule).toBeDefined()

  const headers = new Map(rule?.headers.map(({ key, value }) => [key, value]))
  const csp = headers.get('Content-Security-Policy')
  expect(csp).toBeDefined()

  const directives = new Map(
    csp!.split(';').map((directive) => {
      const [name, ...sources] = directive.trim().split(/\s+/)
      return [name, sources]
    })
  )

  return { headers, directives }
}

describe('HTTP security headers', () => {
  it.each([PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER])(
    'blocks embedded objects and framing without development allowances in %s',
    async (phase) => {
      const { headers, directives } = await securityPolicy(phase)

      expect(directives.get('object-src')).toEqual(["'none'"])
      expect(directives.get('frame-ancestors')).toEqual(["'none'"])
      expect(directives.get('base-uri')).toEqual(["'self'"])
      expect(directives.get('form-action')).toEqual(["'self'"])
      expect(directives.get('script-src')).not.toContain("'unsafe-eval'")
      expect(directives.get('script-src')).not.toContain('*')
      for (const source of ['http:', 'ws:', 'wss:', '*']) {
        expect(directives.get('connect-src')).not.toContain(source)
      }

      // Static Next.js hydration, theme initialization, and GA use inline scripts.
      expect(directives.get('script-src')).toContain("'unsafe-inline'")
      expect(directives.get('script-src')).toContain('https://www.googletagmanager.com')
      expect(headers.get('X-Frame-Options')).toBe('DENY')
      expect(headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
      expect(headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()')
      expect(headers.get('Strict-Transport-Security')).toBe(
        'max-age=63072000; includeSubDomains; preload'
      )
    }
  )

  it('keeps development debugging and hot reload compatible', async () => {
    const { directives } = await securityPolicy(PHASE_DEVELOPMENT_SERVER)

    expect(directives.get('script-src')).toContain("'unsafe-eval'")
    expect(directives.get('connect-src')).toEqual(
      expect.arrayContaining(['http:', 'ws:', 'wss:'])
    )
    expect(directives.get('object-src')).toEqual(["'none'"])
    expect(directives.get('frame-ancestors')).toEqual(["'none'"])
  })
})
