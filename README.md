# dbraun.io

Consulting-focused website for David Braun. The site is built to do two things at once without pretending they are the same thing:

- present credible public proof of real delivery work
- show the direction of serious systems currently under active development

**Live site:** [dbraun.io](https://dbraun.io)

## Current positioning

This is no longer a generic portfolio site.

It is a consulting-capable systems site for workflow automation, system integration, and operational software work, with enough proof and engineering signal to remain credible to hiring managers and technical reviewers.

Current public proof and delivery work:

- [VIFG nonprofit platform](https://www.vifg.org/home)
- [time2move.io](https://time2move.io)
- [arklandscaping.net](https://arklandscaping.net)

Current in-progress systems shaping the next proof layer:

- `WeatherForge`
- `DGM`

Those systems are being positioned as real in-progress builds that will become part of the broader `StormIQ` direction. They are intentionally not presented as finished or deployed products before the proof exists.

## Current proof posture

- `VIFG` is still the strongest public production proof.
- `DealerFlow` remains visible as pilot work, but it is not the current flagship priority.
- `WeatherForge` and `DGM` now have case-study structure in place so walkthroughs, diagrams, operational surfaces, and artifacts can be added later without redesigning the site.
- `StormIQ` is framed honestly as the broader system direction these builds support, not as a finished flagship pretending to be more proven than it is.

## Latest audit baseline

- [Elite Audit - 2026-04-15](docs/audits/elite-audit-2026-04-15.md)

## Stack

| Category | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) |
| UI | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Motion | [Framer Motion](https://www.framer.com/motion/) |
| Content | MDX via `next-mdx-remote` |
| Email | [Resend](https://resend.com/) |
| Rate limiting | [Upstash Redis](https://upstash.com/) with in-memory fallback |
| Testing | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

## Local development

### Prerequisites

- Node.js 20.9 or later
- npm

### Install and run

```bash
git clone https://github.com/DavidBraun777/davidbraun777.github.io.git
cd davidbraun777.github.io
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` in the repo root:

```env
# Email configuration (required in production)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional: recipient override for contact form submissions
CONTACT_EMAIL=your-email@example.com

# Optional: secondary scheduling link shown on the contact page
CAL_LINK=https://calendly.com/your-handle/intro-call

# Optional: distributed rate limiting
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Optional: GA4 measurement ID override
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Notes:

- The contact form returns a `500` if `RESEND_API_KEY` is missing.
- If `CAL_LINK` is set, the contact page shows a secondary optional call link. The form remains the primary contact path.
- If Upstash variables are not set, the app falls back to in-memory rate limiting.

## Validation

Run the full local validation set:

```bash
npm run lint
npm test
npm run build
npx playwright test e2e/smoke.spec.ts e2e/a11y.spec.ts --project=chromium
```

## Notes on proof and honesty

This repo intentionally separates:

- what is already real and visible
- what is real but still under active development
- what still needs stronger artifacts before it should be treated as flagship proof

That constraint matters. The site should get more convincing over time because more real evidence gets added, not because the copy gets more aggressive.
