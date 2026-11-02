import Link from 'next/link'
import { primaryNavigation, profile, resumeDirectoryLink, writingLink } from '@/data/profile'
import { socialLinks } from '@/data/social-links'

const footerLinks = [...primaryNavigation, writingLink, resumeDirectoryLink]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const linkClass =
    'inline-block py-1 text-[var(--theme-frame-text-muted)] transition-colors hover:text-[var(--theme-frame-text)]'

  return (
    <footer className="border-t border-[var(--theme-frame-border)] bg-[var(--theme-frame-bg-strong)] text-[var(--theme-frame-text)]">
      <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-5 px-4 py-7 text-sm sm:grid-cols-[1fr_auto] sm:px-6 lg:grid-cols-[1.1fr_1.2fr_auto] lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="text-lg font-semibold tracking-tight">{profile.name}</Link>
          <figure className="mt-2 max-w-sm text-xs leading-5 text-[var(--theme-frame-text-muted)]">
            <blockquote>And whatsoever ye do, do it heartily, as to the Lord, and not unto men;</blockquote>
            <figcaption>Colossians 3:23 (KJV)</figcaption>
          </figure>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="text-sm font-semibold">Explore</h2>
          <ul className="mt-1 flex flex-wrap gap-x-4">
            {footerLinks.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className={linkClass}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Connect</h2>
          <ul className="mt-1 flex gap-x-4">
            {socialLinks.filter((item) => item.group === 'professional').map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--theme-frame-text-muted)]">&copy; {currentYear} {profile.name}</p>
        </div>
      </div>
    </footer>
  )
}
