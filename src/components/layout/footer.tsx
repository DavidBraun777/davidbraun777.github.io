import Link from 'next/link'
import { primaryNavigation, profile } from '@/data/profile'
import { resumeUrl, socialLinks } from '@/data/social-links'

const footerLinks = [
  ...primaryNavigation.filter((item) => item.href !== '/'),
  { label: 'Resume PDF', href: resumeUrl, external: true },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const linkClass = 'text-text-secondary transition-colors hover:text-text-primary'

  return (
    <footer className="border-t border-border-subtle bg-background-subtle">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-tight text-text-primary">
            {profile.name}
          </Link>
          <p className="mt-3 max-w-md text-sm leading-7 text-text-secondary">
            Personal authority site for projects, systems thinking, writing, resume details,
            and future consulting credibility.
          </p>
          <p className="mt-4 text-sm text-text-muted">
            {profile.graduateStatus} {profile.graduation}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
            Explore
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {footerLinks.map((item) => (
              <li key={item.href}>
                {'external' in item && item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
            Connect
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {socialLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={linkClass}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-text-muted">{profile.location}</p>
        </div>
      </div>

      <div className="border-t border-border-subtle px-4 py-5 text-sm text-text-muted sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} {profile.name}. All rights reserved.</p>
          <p>Built with Next.js, TypeScript, MDX, and a systems-first approach.</p>
        </div>
      </div>
    </footer>
  )
}
