import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ScrollToTop } from '@/components/layout/scroll-to-top'
import { profile } from '@/data/profile'
import { socialLinks } from '@/data/social-links'
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
  metadataBase: new URL('https://dbraun.io'),
  title: {
    default: 'David Braun | AI Systems, Software, and Infrastructure',
    template: '%s | David Braun',
  },
  description:
    "David Braun is a master's student in Artificial Intelligence at the University of St. Thomas building systems across software, AI, infrastructure, and applied product development.",
  keywords: [
    'AI Systems Engineer',
    'Applied AI',
    'Software Engineering',
    'Workflow Automation',
    'Infrastructure',
    'Portfolio',
    'Systems Design',
    'Minnesota',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  applicationName: 'dbraun.io',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dbraun.io',
    title: 'David Braun | AI systems, software, and infrastructure',
    description:
      "Master's student in Artificial Intelligence at the University of St. Thomas building systems across software, AI, infrastructure, and applied product development.",
    siteName: 'dbraun.io',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'David Braun portfolio site',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Braun | AI systems, software, and infrastructure',
    description:
      "Master's student in Artificial Intelligence at the University of St. Thomas building systems across software, AI, infrastructure, and applied product development.",
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
  alternates: {
    canonical: '/',
  },
}

const personStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: 'https://dbraun.io',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Maple Grove',
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
    url: 'https://dbraun.io/contact',
    availableLanguage: ['English'],
  },
  knowsAbout: [
    'Artificial intelligence',
    'Software engineering',
    'Workflow automation',
    'Infrastructure',
    'Cloud engineering',
    'Applied product development',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider>
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
          <ScrollToTop />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
