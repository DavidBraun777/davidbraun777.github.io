# dbraun.io

Consulting-focused website for David Braun. The site is a workflow automation
and systems consulting portfolio, not a generic personal homepage.

**Live site:** [dbraun.io](https://dbraun.io)

## Current Positioning

dbraun.io presents practical workflow automation, system integration, data
movement, and operational software work for small and midsized businesses. It
also keeps enough engineering detail to remain credible to technical reviewers.

The current proof hierarchy is intentional:

- [VIFG nonprofit platform](https://www.vifg.org/home) is the strongest public
  production proof.
- [time2move.io](https://time2move.io) and [arklandscaping.net](https://arklandscaping.net)
  are public delivery examples.
- `DealerFlow`, where shown, should be treated cautiously as pilot/proof work
  unless stronger artifacts and bounded pilot facts are added.
- `WeatherForge` is secondary technical proof. It should not be described as a
  production client system unless real deployment proof is added.
- `RAGeATM` is secondary academic/technical proof for retrieval and augmentation
  work. It should not be framed as production consulting delivery.
- `DGM` and `StormIQ`, where present, represent active or planned system
  direction rather than finished production products.

The site should become more convincing by adding real proof artifacts and
bounded facts, not by making stronger claims.

## Latest Audit Baseline

- [Current State Reassessment](docs/dbraun-current-state-reassessment.md)
- [Elite Audit - 2026-04-15](docs/audits/elite-audit-2026-04-15.md)
- [Security and Code Analysis](docs/security-and-analysis.md)

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

## Local Development

### Prerequisites

- Node.js 20 from `.nvmrc` (`package.json` requires `>=20.9.0`)
- npm

### Install and Run

```bash
nvm use
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` in the repo root. Do not commit real values.

```env
# Required in production for contact form delivery
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Preferred contact-form recipient
CONTACT_NOTIFICATION_EMAIL=you@example.com

# Legacy recipient fallback supported by code if CONTACT_NOTIFICATION_EMAIL is unset
# CONTACT_EMAIL=you@example.com

# Optional sender identity; CONTACT_FROM_EMAIL must be verified in Resend
CONTACT_FROM_EMAIL=contact@dbraun.io
CONTACT_FROM_NAME=dbraun.io Contact

# Optional scheduling link shown on the contact page
CAL_LINK=https://calendly.com/your-handle/intro-call

# Optional distributed rate limiting; set both or neither
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Optional Google Analytics 4 measurement ID; leave unset to disable GA
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Notes:

- `RESEND_API_KEY` is required for the contact API to send mail in production.
- `CONTACT_NOTIFICATION_EMAIL` is the preferred recipient variable.
- `CONTACT_EMAIL` remains supported as a fallback for older deployments.
- `CONTACT_FROM_EMAIL` defaults to `contact@dbraun.io`; if changed, the address
  or domain must be verified in Resend.
- `CONTACT_FROM_NAME` defaults to `dbraun.io Contact`.
- If `CAL_LINK` is set, the contact page shows a secondary optional call link.
- If both Upstash variables are set, distributed rate limiting is used. Without
  them, the app falls back to in-memory rate limiting.
- Google Analytics loads only when `NEXT_PUBLIC_GA_ID` is set. Leaving it unset
  disables GA without code changes.

## Verification

Use Node 20 and a clean install for verification:

```bash
nvm use
npm ci
npm run lint
npm test
npx tsc --noEmit
npm run build
npm run size-check
npx playwright test e2e/smoke.spec.ts e2e/a11y.spec.ts --project=chromium
```

## Security and Analysis

The repo uses GitHub CI, CodeQL, Dependabot alerts/security updates,
Dependabot malware alerting, SonarQube Cloud / SonarCloud analysis, and Vercel
preview deployment checks as separate signals. SonarCloud runs on pull requests
and pushes to `master`; it requires `SONAR_TOKEN` in both Actions secrets and
Dependabot secrets for Dependabot-originated pull requests.

See [Security and Code Analysis](docs/security-and-analysis.md) for setup notes
and the post-merge SonarCloud verification checklist.

## Proof and Honesty Rules

This repo intentionally separates:

- real public production proof
- public delivery examples
- pilot/prototype work
- academic or technical proof
- planned system direction

Do not add invented outcomes, testimonials, screenshots, metrics, or artifacts.
If a project needs stronger proof, add the real artifact or leave a TODO.
