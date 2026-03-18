# David Braun | Portfolio

A modern, responsive portfolio website built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Framer Motion.

**Live Site:** [dbraun.io](https://dbraun.io)

---

## Audit Snapshots

- [Extreme / Elite Audit Baseline - 2026-03-17](docs/audits/elite-audit-baseline-2026-03-17.md)

---

## Current Audit State

**Last audit:** 2026-03-17
**Overall grade:** 8.5 → **9.1** (post-implementation)

| Category | Before | After | Notes |
|----------|--------|-------|-------|
| Engineering Quality | 8.5 | 9.2 | Middleware activation, CSRF origin validation, sanitization pipeline, separation of concerns |
| Security Posture | 7.0 | 9.0 | CSP via security headers, origin/referer validation, explicit sanitize → escape → template pipeline |
| Portfolio Trust / Proof Density | 7.5 | 8.5 | Proof block (role/constraint/outcome) always visible, experience rewritten for ownership clarity |
| SEO / Correctness | 8.0 | 9.0 | Sitemap uses real blog dates, image sizes specified, dead files removed |
| Accessibility | 8.5 | 9.0 | Backdrop overlay is now a button, subtitle alignment conditional, badge hover removed |
| Code Hygiene | 8.0 | 9.0 | Rate-limit separated from validation, dead proxy deleted, dead image removed |

---

## Completed Improvements

### Security & Correctness (Part 1A)

- **CSP activation:** Removed the dead `src/proxy.ts` path and now serve CSP directly through `next.config.ts` security headers, which applies consistently in development, tests, and production.
- **CSRF origin validation:** Contact API now validates `Origin`/`Referer` against an allowlist (`dbraun.io`, `www.dbraun.io`, `localhost:3000`, Vercel preview URLs). Returns 403 for unknown origins.
- **Sanitization pipeline:** Extracted `sanitizeContactData()` and `buildEmailHtml()` as explicit named functions with documented escape boundaries (HTML-escaped vs plain text).
- **Sitemap dates:** `src/app/sitemap.ts` now reads real dates from blog post frontmatter via `getAllPosts()` instead of using `new Date()`.
- **Image sizes:** Added `sizes="96px"` to certification badge `<Image>` in `/background`.

### Codebase Hygiene (Part 1B)

- **Rate-limit separation:** All rate-limiting code moved from `contact-validation.ts` to `rate-limit.ts`. Validation module now owns only validation/sanitization. Shared `CONTROL_CHAR_REGEX` exported cleanly.
- **Dead file removal:** Deleted `src/proxy.ts` (dead middleware), removed `public/images/projects/heart_hand.jpg` (only referenced by unused `projects.ts`).
- **Accessibility fixes:** Mobile menu backdrop overlay changed from `<div>` to `<button>` with `aria-label`. Badge `whileHover` scale removed; added `cursor-default`. Section header subtitle `mx-auto` now conditional on `align` prop.

### Portfolio Trust / Proof Density (Part 2)

- **Proof fields on systems:** Added `myRole`, `coreConstraint`, `outcome` as required fields on `SystemCaseStudy` interface. Populated all 6 systems with truthful, verifiable data.
- **Always-visible proof block:** `selected-systems.tsx` now renders a 3-column proof grid (My Role / Core Constraint / Outcome) between the summary and problem sections. Visible by default; no click required.
- **Experience rewrite:** Top 5 experience entries rewritten to emphasize ownership scope and technical depth. Removed filler highlights. Language pattern: "Owned...", "Sole engineer responsible for...", "Built and maintained...at enterprise scale".

### Test Coverage

- 4 new tests added for origin validation (403 on unknown origin, 403 on missing origin/referer, accepts production origin, accepts valid referer fallback).
- All existing tests updated for new module boundaries (imports moved from `contact-validation` to `rate-limit`).
- **65 tests passing**, 4 test files, 0 failures.

---

## Remaining High-ROI Improvements

These are changes that would further close the proof gap. Ordered by impact.

| Priority | Task | Expected Uplift | Owner |
|----------|------|-----------------|-------|
| P0 | Add real screenshots/diagrams for all flagship systems | +0.3 overall | Human |
| P0 | Add deployment URLs or live demo links where systems are accessible | +0.2 overall | Human |
| P1 | Add verified metrics to flagship systems (uptime, users, latency, volume) | +0.2 overall | Human |
| P1 | Record a 60-second video walkthrough of one flagship system | +0.2 trust | Human |
| P1 | Publish 2–3 technical blog posts that cross-link to flagship systems | +0.2 authority | Human |
| P2 | Add testimonials from colleagues or clients (real names/roles) | +0.15 trust | Human |
| P2 | Add architecture decision records for top 2 systems | +0.1 depth | Human |

---

## Proof Gap Tracker

Each flagship system's proof density. **Green** = evidence exists and is visible. **Yellow** = claim is made but not yet backed by artifact. **Red** = missing entirely.

| System | Architecture Diagram | Screenshot / Visual | Live URL | Metrics | Role + Constraint + Outcome |
|--------|---------------------|--------------------:|----------|---------|----------------------------|
| StormIQ | 🟢 SVG | 🟢 PNG | 🔴 Not deployed yet | 🔴 None | 🟢 Populated |
| RoboReceptionist | 🟢 SVG | 🟢 SVG | 🔴 Not deployed yet | 🔴 None | 🟢 Populated |
| Lecture Stream | 🟢 PNG | 🟢 PNG | 🔴 Not deployed yet | 🔴 None | 🟢 Populated |
| NAICS Planning | 🟢 SVG | 🟢 SVG | 🔴 Not deployed yet | 🔴 None | 🟢 Populated |
| VIFG Platform | 🟢 SVG | 🟢 SVG | 🟢 [vifg.org](https://www.vifg.org/home) | 🟡 No uptime/traffic data shown | 🟢 Populated |
| DealerFlow | 🟡 No diagram | 🟢 PNG | 🔴 Not public yet | 🔴 None | 🟢 Populated |

### What requires human-supplied evidence

These items cannot be generated or inferred; they require real artifacts from the project owner.

| Item | Why it matters | Estimated uplift |
|------|---------------|-----------------|
| Live deployment URLs for StormIQ, RoboReceptionist, NAICS | A reviewer who can click through a system trusts it 3× more than one who reads about it | +0.3 |
| Real screenshots of DealerFlow mobile app in use | Mobile screenshots are the strongest proof for a mobile-first system | +0.15 |
| Uptime, traffic, or usage data for VIFG | Production claims without metrics feel incomplete | +0.1 |
| Architecture diagram for DealerFlow | Only flagship system without a dedicated architecture visual | +0.1 |
| Testimonial from VIFG nonprofit stakeholder | Third-party validation of production delivery | +0.15 |
| Video walkthrough of any one system | Video is the highest-bandwidth proof format | +0.2 |

---

## Dependency Maintenance Notes

### Blocked Dependabot PRs: ESLint 10 Migration

Two Dependabot PRs are intentionally **not safe to merge yet**:

- `#27`: `deps: bump @eslint/js from 9.39.2 to 10.0.1`
- `#19`: `deps: bump the linting group with 2 updates`

These are blocked by the current lint stack, not by application code.

#### Why `#27` is blocked

The repo uses a flat ESLint config in `eslint.config.mjs` and imports the top-level `@eslint/js` package directly:

```js
import eslint from "@eslint/js";
```

That means the root `@eslint/js` version must stay aligned with the root `eslint` version.

When `@eslint/js` is upgraded to `10.x` while `eslint` remains on `9.x`, package installation fails during deploys with an `ERESOLVE` peer dependency conflict:

- `@eslint/js@10` expects `eslint@^10`
- this repo currently uses `eslint@^9.39.2`

This failure was reproduced on Vercel during `npm install`, so `@eslint/js` must remain on the ESLint 9 line until the full lint stack moves together.

#### Why `#19` is blocked

The linting group PR attempts to move the repo onto ESLint 10, but the current plugin stack is not ready for that jump.

The immediate blocker is:

- `eslint-plugin-react@7.37.5`

That plugin currently supports ESLint 9 but not ESLint 10 in this repository's dependency graph, so `npm ci` fails before linting even runs.

In other words:

- `#27` fails because `@eslint/js` was upgraded **without** upgrading `eslint`
- `#19` fails because upgrading `eslint` to `10.x` requires additional plugin/config upgrades that are not yet in place

#### Current safe state

The safe, deployable state is:

- `eslint` on `^9.39.2`
- `@eslint/js` on `^9.39.2`

This alignment was restored after Vercel failed with a dependency resolution error.

#### Future upgrade path

Do **not** merge piecemeal ESLint 10 PRs into `master`.

When revisiting ESLint 10, upgrade and validate the lint stack together:

1. `eslint`
2. `@eslint/js`
3. `typescript-eslint`
4. `eslint-plugin-react`
5. `eslint-config-next` and related Next lint packages

Then re-run:

1. `npm ci`
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm test`
5. `npm run build`

Also note:

- ESLint 10 requires a newer Node baseline than ESLint 9
- if the repo adopts ESLint 10 later, confirm local, CI, and Vercel Node versions are all compatible before merging

## Features

- **Modern Stack:** Next.js 16 with App Router, TypeScript, Tailwind CSS v4
- **Dark Mode:** Dark theme by design for optimal readability
- **Animations:** Smooth scroll-reveal and hover effects with Framer Motion and GSAP
- **MDX Blog:** Write blog posts in Markdown with React component support
- **Contact Form:** Server-side email handling with Resend, CSRF origin validation, sanitization pipeline, and rate limiting
- **Responsive:** Mobile-first design with collapsible navigation
- **SEO Optimized:** Metadata, Open Graph, structured data, real sitemap dates
- **Accessible:** Semantic HTML, keyboard navigation, reduced motion support, ARIA attributes
- **Security:** CSP security headers, origin validation, HTML sanitization, Upstash rate limiting with circuit breaker fallback
- **Tested:** 65 unit and integration tests with Vitest; E2E and accessibility tests with Playwright

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Blog | [MDX](https://mdxjs.com/) via next-mdx-remote |
| Email | [Resend](https://resend.com/) |
| Rate Limiting | [Upstash Redis](https://upstash.com/) with in-memory fallback |
| Testing | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/DavidBraun777/davidbraun777.github.io.git
cd davidbraun777.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Email configuration (Resend): required in production
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional: override recipient (defaults to davidjbraun777@gmail.com)
CONTACT_EMAIL=your-email@example.com

# Optional: direct scheduling link shown alongside the contact form
CAL_LINK=https://calendly.com/your-handle/intro-call

# Optional: Upstash Redis for distributed rate limiting
# Falls back to in-memory rate limiting when not set
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

Get your Resend API key at [resend.com](https://resend.com). For distributed rate limiting, create a free Redis database at [upstash.com](https://upstash.com).

**Notes:**

- The contact form returns a 500 error if `RESEND_API_KEY` is not set.
- If `CAL_LINK` is set, the contact section adds a second option so visitors can either send the form or open the Calendly event directly.

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles + Tailwind
│   ├── api/contact/         # Contact form API route (CSRF + sanitization + rate limiting)
│   ├── sitemap.ts           # Dynamic sitemap with real blog post dates
│   └── blog/                # Blog listing and post pages
├── components/
│   ├── ui/                  # Reusable UI components (Badge, SectionHeader, ImageLightbox)
│   ├── layout/              # Header, Footer, CurrentStatus
│   ├── sections/            # Page sections (Hero, SelectedSystems, Contact, etc.)
│   └── blog/                # Blog-specific components
├── content/blog/            # MDX blog posts
├── data/                    # Static data (experience, systems, skills, etc.)
├── hooks/                   # Custom React hooks (useScrollSpy, useGSAP)
├── lib/                     # Utility functions, validation, rate limiting
└── providers/               # React context providers
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit & integration tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run size-check` | Check bundle size budget |
| `npx playwright test` | Run E2E smoke & accessibility tests |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/new)
3. Add environment variables in Project Settings
4. Deploy

Vercel will automatically deploy on every push to `master`.

### Custom Domain

1. In Vercel, go to Project Settings → Domains
2. Add your domain (e.g., `dbraun.io`)
3. Update DNS records as instructed
4. Update `metadataBase` in `src/app/layout.tsx`

## Performance

The site is optimized for Core Web Vitals:

- **Static Generation:** Pages are pre-rendered at build time
- **Image Optimization:** Automatic WebP/AVIF conversion via `next/image`
- **Font Optimization:** Self-hosted fonts via `next/font`
- **Code Splitting:** Automatic route-based splitting

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**David Braun**
- Email: [davidjbraun777@gmail.com](mailto:davidjbraun777@gmail.com)
- LinkedIn: [david-braun777](https://linkedin.com/in/david-braun777)
- GitHub: [DavidBraun777](https://github.com/DavidBraun777)
