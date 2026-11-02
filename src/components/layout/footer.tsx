import Link from 'next/link'
import { primaryNavigation, profile, resumeDirectoryLink, writingLink } from '@/data/profile'
import { socialLinks } from '@/data/social-links'

const footerLinks = [...primaryNavigation, writingLink, resumeDirectoryLink]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const linkClass =
    'inline-flex min-h-11 min-w-11 items-center rounded-sm text-[var(--theme-frame-text-muted)] transition-colors hover:text-[var(--theme-frame-text)]'

  return (
    <footer className="border-t border-[var(--theme-frame-border)] bg-[var(--theme-frame-bg-strong)] text-[var(--theme-frame-text)]">
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-4 px-4 py-5 text-sm sm:grid-cols-[1fr_auto] sm:gap-y-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_1.15fr_auto] lg:gap-x-16 lg:px-8 lg:py-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-lg font-semibold tracking-tight">{profile.name}</Link>
          <figure className="max-w-sm text-xs leading-5 text-[var(--theme-frame-text-muted)] sm:mt-2">
            <blockquote>And whatsoever ye do, do it heartily, as to the Lord, and not unto men;</blockquote>
            <figcaption>Colossians 3:23 (KJV)</figcaption>
          </figure>
        </div>

        <nav aria-labelledby="footer-explore" className="lg:border-l lg:border-[var(--theme-frame-border)] lg:pl-8">
          <h2 id="footer-explore" className="text-sm font-semibold">Explore</h2>
          <ul className="mt-1 flex flex-wrap gap-x-4 sm:mt-2 sm:block sm:max-w-sm sm:columns-[2_8rem] sm:gap-x-8">
            {footerLinks.map((item) => (
              <li key={item.href} className="break-inside-avoid">
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

        <div className="flex flex-wrap items-center gap-x-4 sm:block lg:border-l lg:border-[var(--theme-frame-border)] lg:pl-8">
          <h2 className="text-sm font-semibold">Connect</h2>
          <ul className="flex flex-wrap gap-x-4 sm:mt-2 sm:block">
            {socialLinks.filter((item) => item.group === 'professional').map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="basis-full text-xs text-[var(--theme-frame-text-muted)] sm:mt-4">&copy; {currentYear} {profile.name}</p>
        </div>
      </div>
    </footer>
  )
}
