import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

export default function nextConfig(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com" + (isDev ? ' http: ws: wss:' : ''),
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    'upgrade-insecure-requests',
  ].join('; ')

  return {
    // Keep dev and production build artifacts separate so `next dev`
    // never has to reuse or reconcile a recent `next build` output tree.
    distDir: isDev ? '.next-dev' : '.next',
    images: {
      formats: ['image/avif', 'image/webp'],
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: cspHeader,
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ],
        },
      ]
    },
    async redirects() {
      return [
        {
          source: '/about',
          destination: '/why-work-with-me',
          permanent: true,
        },
        {
          source: '/resume',
          destination: '/why-work-with-me',
          permanent: true,
        },
        {
          source: '/background',
          destination: '/why-work-with-me',
          permanent: true,
        },
        {
          source: '/projects',
          destination: '/case-studies',
          permanent: true,
        },
        {
          source: '/projects/:slug',
          destination: '/case-studies/:slug',
          permanent: true,
        },
        {
          source: '/blog',
          destination: '/writing',
          permanent: true,
        },
        {
          source: '/blog/:slug',
          destination: '/writing/:slug',
          permanent: true,
        },
        {
          source: '/systems',
          destination: '/case-studies',
          permanent: true,
        },
      ]
    },
  }
}
