import Link from 'next/link'
import { primaryNavigation, profile, resumeDirectoryLink, writingLink, type NavigationLink } from '@/data/profile'
import { socialLinks, type SocialLink } from '@/data/social-links'

const footerLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  ...primaryNavigation.flatMap((item) => item.href === '/contact' ? [writingLink, item] : [item]),
  resumeDirectoryLink,
]

const linkClass =
  'inline-flex min-h-11 min-w-11 items-center rounded-sm text-[var(--theme-frame-text-muted)] transition-colors hover:text-[var(--theme-frame-text)]'
const listClass = 'mt-1 flex flex-wrap gap-x-4 sm:mt-3 lg:block'
const headingClass = 'text-sm font-semibold uppercase tracking-[0.14em]'

function FooterProfiles({ group }: Readonly<{ group: SocialLink['group'] }>) {
  return (
    <ul className={listClass}>
      {socialLinks.filter((item) => item.group === group).map((item) => (
        <li key={item.url}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {item.shortName ?? item.name}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function Footer() {
  return (
    <footer className="wrap-anywhere border-t border-[var(--theme-frame-border)] bg-[var(--theme-frame-bg-strong)] text-[var(--theme-frame-text)]">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-6 px-4 py-7 text-sm sm:grid-cols-2 sm:px-6 sm:py-10 lg:grid-cols-[1.6fr_0.7fr_0.8fr_0.9fr] lg:px-8 lg:py-12 xl:gap-x-12">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-2xl font-semibold tracking-tight">{profile.name}</Link>
          <p className="font-medium">{profile.title}</p>
          <p className="mt-3 max-w-md leading-6 text-[var(--theme-frame-text-muted)]">
            Designing the applications, workflows, cloud platforms, security controls, evaluation,
            and operating paths around AI and data capabilities.
          </p>
          <figure className="mt-4 max-w-md border-l-2 border-[var(--theme-frame-border-strong)] pl-4">
            <blockquote className="leading-6">And whatsoever ye do, do it heartily, as to the Lord, and not unto men;</blockquote>
            <figcaption className="mt-1 text-xs text-[var(--theme-frame-text-muted)]">Colossians 3:23 (KJV)</figcaption>
          </figure>
          <p className="mt-3 max-w-md leading-6 text-[var(--theme-frame-text-muted)]">{profile.faithStatement}</p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className={headingClass}>Explore</h2>
          <ul className={listClass}>
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
          <h2 className={headingClass}>Connect</h2>
          <FooterProfiles group="professional" />
          <p className="mt-2 text-[var(--theme-frame-text-muted)]">{profile.location}</p>
        </div>

        <div>
          <h2 className={headingClass}>Research Profiles</h2>
          <FooterProfiles group="research" />
        </div>
      </div>

      <div className="border-t border-[var(--theme-frame-border)] text-xs text-[var(--theme-frame-text-muted)]">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-x-6 gap-y-1 px-4 py-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p>Built with Next.js, TypeScript, and a delivery-first approach.</p>
        </div>
      </div>
    </footer>
  )
}
