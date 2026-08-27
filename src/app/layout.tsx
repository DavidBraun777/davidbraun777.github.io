import type { Metadata } from 'next'
import { Suspense } from 'react'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ScrollToTop } from '@/components/layout/scroll-to-top'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import {
  canonicalSeoDescription,
  northStarIdentity,
  northStarStatement,
} from '@/data/career-story'
import { profile } from '@/data/profile'
import { researchAreas } from '@/data/research'
import { socialLinks } from '@/data/social-links'
import { absoluteUrl, siteUrl } from '@/lib/seo'
import './globals.css'

const inter = localFont({
  src: '../fonts/inter-latin-var.woff2',
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: '../fonts/jetbrains-mono-latin-var.woff2',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `David Braun | ${northStarIdentity}`,
    template: '%s | David Braun',
  },
  description: canonicalSeoDescription,
  keywords: [
    'AI Systems Architect',
    'AI Platform Architect',
    'AI Systems Engineering',
    'AI Platform Engineering',
    'Platform Architecture',
    'System Integration',
    'Workflow Automation',
    'Data Pipelines',
    'Cloud Engineering',
    'AI Evaluation',
    'Operational Software',
    'Retrieval-Augmented Generation',
    'Minnesota',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  applicationName: 'dbraun.io',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dbraun.io',
    title: `David Braun | ${northStarIdentity}`,
    description: canonicalSeoDescription,
    siteName: 'dbraun.io',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `David Braun | ${northStarIdentity}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `David Braun | ${northStarIdentity}`,
    description: canonicalSeoDescription,
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/user-icon.png',
    apple: '/user-icon.png',
  },
}

const personStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: siteUrl,
  description: northStarStatement,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'White Bear Lake',
    addressRegion: 'MN',
    addressCountry: 'US',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Augsburg University',
    },
  ],
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'University of St. Thomas',
  },
  sameAs: socialLinks
    .map((link) => link.url)
    .filter((url) => url.startsWith('http')),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'professional inquiries',
    url: absoluteUrl('/contact'),
    availableLanguage: ['English'],
  },
  knowsAbout: Array.from(new Set([
    'Artificial Intelligence',
    'AI systems architecture',
    'AI platform engineering',
    'Software engineering',
    'Workflow automation',
    'System integration',
    'Data engineering',
    'Retrieval-Augmented Generation (RAG)',
    'Decision-support dashboards',
    'Cloud engineering',
    'Operational software',
    ...researchAreas,
  ])),
}

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'dbraun.io',
  url: siteUrl,
  description: canonicalSeoDescription,
  author: {
    '@type': 'Person',
    name: profile.name,
    url: siteUrl,
  },
  inLanguage: 'en-US',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white dark:focus:bg-white dark:focus:text-slate-950"
          >
            Skip to content
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
          />
          <ScrollToTop />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
