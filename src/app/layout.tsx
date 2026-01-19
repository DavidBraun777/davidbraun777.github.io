import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://dbraun.io'),
  title: {
    default: 'David Braun | Software Engineer',
    template: '%s | David Braun',
  },
  description:
    'Software Engineer specializing in full-stack development, cybersecurity, and artificial intelligence. 5+ years of experience building impactful software solutions.',
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    'Cybersecurity',
    'Artificial Intelligence',
    'React',
    'Next.js',
    'Java',
    'Python',
    'Minneapolis',
  ],
  authors: [{ name: 'David Braun' }],
  creator: 'David Braun',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dbraun.io',
    title: 'David Braun | Software Engineer',
    description:
      'Software Engineer specializing in full-stack development, cybersecurity, and artificial intelligence.',
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
    title: 'David Braun | Software Engineer',
    description:
      'Software Engineer specializing in full-stack development, cybersecurity, and AI.',
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
    <html lang="en" suppressHydrationWarning>
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
