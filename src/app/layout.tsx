import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
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
    default: 'David Braun | AI Systems Engineer',
    template: '%s | David Braun',
  },
  description:
    'AI systems engineer building automation platforms, workflow software, and infrastructure-backed operational systems.',
  keywords: [
    'AI Systems Engineer',
    'Workflow Automation',
    'Operational Software',
    'Applied AI Systems',
    'Automation Platforms',
    'Infrastructure-backed Applications',
    'System Architecture',
    'Minnesota',
  ],
  authors: [{ name: 'David Braun' }],
  creator: 'David Braun',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dbraun.io',
    title: 'David Braun | AI Systems Engineer',
    description:
      'AI systems engineer building automation platforms, workflow software, and infrastructure-backed applications.',
    siteName: 'David Braun Portfolio',
    images: [
      {
        url: '/images/profile/Smolder.png',
        width: 400,
        height: 400,
        alt: 'David Braun',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'David Braun | AI Systems Engineer',
    description:
      'AI systems engineer building automation platforms, workflow software, and infrastructure-backed applications.',
    images: ['/images/profile/Smolder.png'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
