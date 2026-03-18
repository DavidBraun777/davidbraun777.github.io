import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { ThemeProvider } from '@/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ScrollToTop } from '@/components/layout/scroll-to-top'
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

const initialScrollResetScript = `
  (() => {
    const resetScroll = () => {
      if (window.location.hash) return;
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    resetScroll();
    requestAnimationFrame(() => requestAnimationFrame(resetScroll));
    window.setTimeout(resetScroll, 180);
    window.addEventListener('load', resetScroll, { once: true });
    window.addEventListener('pageshow', resetScroll);
  })();
`

export const metadata: Metadata = {
  metadataBase: new URL('https://dbraun.io'),
  title: {
    default: 'David Braun | AI Systems Engineer',
    template: '%s | David Braun',
  },
  description:
    'AI systems engineer building automation platforms, AI workflow systems, and infrastructure-backed operational software.',
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
    title: 'AI Systems Engineer building automation platforms',
    description:
      'Systems that combine AI, workflow automation, and infrastructure to solve real operational problems.',
    siteName: 'David Braun Portfolio',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AI Systems Engineer building automation platforms and AI workflow systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Systems Engineer building automation platforms',
    description:
      'Systems that combine AI, workflow automation, and infrastructure to solve real operational problems.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <Script id="initial-scroll-reset" strategy="beforeInteractive">
          {initialScrollResetScript}
        </Script>
        <ThemeProvider>
          <ScrollToTop />
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
