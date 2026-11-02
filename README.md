# dbraun.io

David Braun's professional portfolio: **AI Systems & Platform Engineer**. The
site connects employment, consulting, and research inquiries with work whose
ownership, maturity, and limitations can be checked.

**Live site:** [dbraun.io](https://www.dbraun.io/) ·
**Documentation:** [docs index](docs/README.md) ·
**Remaining work:** [TODO.md](TODO.md)

## Run locally

Use Node.js **24.x**, as specified by `.nvmrc` and `package.json`, and npm with
the committed `package-lock.json`.

```bash
nvm use
npm ci --ignore-scripts
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). Browsing the site does not require
email or Redis credentials. To exercise contact delivery, configure the server
variables below; automated tests mock delivery and never send real inquiries.
Do not commit `.env.local` or real credentials.

Development output uses `.next-dev`; production output uses `.next`. Read
[AGENTS.md](AGENTS.md) and the installed Next.js documentation before changing
framework behavior.

## Stack and layout

| Area | Implementation |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling and motion | Tailwind CSS 4, CSS theme variables, Framer Motion |
| Writing | Local MDX, `gray-matter`, `next-mdx-remote` |
| Search | Static local index, fetched when search is first opened |
| Contact | Server validation, Resend, Upstash Redis rate limiting in production |
| Verification | ESLint, TypeScript, Vitest/V8, Playwright, axe, bundle budget |
| Delivery and analysis | Vercel, GitHub Actions, CodeQL, Dependabot, SonarQube Cloud |

Exact dependency versions belong in the lockfile; the table describes the
architecture, not an independently maintained package inventory.

| Source | Responsibility |
| --- | --- |
| `src/app/` | Pages, metadata, contact API, sitemap and search-index route |
| `src/components/layout/` | Header navigation, search entry point, full footer |
| `src/components/sections/contact.tsx` | Inquiry form, submission state and optional scheduling link |
| `src/data/systems.ts` | Project registry, evidence, stage labels and case-study content |
| `src/data/live-client-websites.json` | ARK Landscaping and Matt Laur client stories |
| `src/data/past-client-work.ts` | Historical Time2Move scope and privacy-safe attribution |
| `src/data/services.ts` | Consulting offers, deliverables and planning ranges |
| `src/data/research.ts`, `src/data/urarina-research.ts` | Authored research, status and attribution |
| `src/data/resumes.ts` | Approved document URLs and request fallbacks |
| `src/content/blog/` | MDX articles; public routes use `/writing` |
| `src/lib/search/`, `src/lib/content-navigation.ts` | Indexing, ranking and stable deep links |
| `src/__tests__/`, `e2e/` | Unit/integration tests and real-browser checks |
| `public/images/projects/`, `public/resumes/` | Cleared public evidence and approved PDFs |

## Intended visitor experience

Primary navigation is **Work → Experience → Services → Research → Contact**;
the David Braun brand links home. Research and Experience also expose contextual
links. Writing and the résumé directory remain available in the full footer.

The homepage deliberately keeps the wide desktop hero, contextual career and
research highlights, three audience pathways, capabilities, contact invitation,
and full footer. Phone layouts reflow those sections with compact spacing.
**Project cards and the live-client showcase belong on `/case-studies`, not the
homepage.** Preserve the footer's identity, faith statement, Explore, Connect,
and Research Profiles sections.

The [information architecture](docs/ia-sitemap.md) records canonical routes,
redirects, audience paths, and responsive intent.

## Evidence and privacy

The professional identity connects applications, APIs, workflows, cloud,
security, evaluation, and operations around AI and data. It is current
positioning, not a retroactive employer title or a claim of Staff/Principal rank.

| Work | Representation to preserve |
| --- | --- |
| VIFG | Public production nonprofit platform and deployment evidence |
| ARK Landscaping and Matt Laur | Live client websites built by David; specific delivery stories |
| Time2Move | Historical engagement through People's Connection LLC; original deployment inactive; wider roadmap and planned validation incomplete |
| DealerFlow | Pilot with a real mobile screenshot; no unverified production or adoption claims |
| WeatherForge | Collaborative SEIS 745 academic project; David's established lead implementation role remains explicit |
| RAGeATM | Bounded retrieval prototype; the small sanity check is not general retrieval accuracy |
| DGM, StormIQ and other work in progress | Planned or experimental scope, not finished production products |

Prefer actual artifacts, architecture decisions, and bounded outcomes over
technology lists. Do not invent metrics, client endorsements, screenshots,
benchmarks, deployment status, or leadership history. Missing evidence belongs
in the backlog; do not publish empty screenshot blocks or portfolio-editing notes.

Keep personal client identifiers, successor-business narratives, private source
archives, audit reports, and internal screenshots out of the historical Time2Move
story. Public client brands do not authorize publishing private correspondence
or data. Keep withheld research materials private and distinguish accepted work
from published proceedings. See [research identity](docs/RESEARCH_IDENTITY.md)
and the [maintenance guide](docs/maintenance.md).

## Résumés and research CV

`/resumes` is the document directory. Both current PDFs were explicitly cleared
by the owner on October 27, 2026 and remain unchanged:

- `/resumes/David-J-Braun-Resume-Software-Platform-2026.pdf`
- `/resumes/David-J-Braun-CV-AI-Research-2026.pdf`

The industry résumé is the default on Home, Experience, and the Experience menu.
`/resume.pdf` and `/David-J-Braun-Resume-2026.pdf` permanently redirect to it;
`/resume` redirects to `/experience`. Do not duplicate PDF bytes for aliases.

Before replacing an approved PDF, verify its source, disclosure clearance,
exactly two pages, extracted text, and rendered layout. Update the approved-asset
test hashes only after that review. If a future research CV is not cleared, set
`researchCv.href` to `null` to use the request fallback. Document URLs do not
belong in Person JSON-LD `sameAs`.

## Environment

[`.env.example`](.env.example) is the complete configuration template. Email and
Redis credentials stay server-only. The scheduling URL and optional analytics
identifier are public by design; never put secrets in those values.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Required for real contact email delivery |
| `CONTACT_NOTIFICATION_EMAIL` | Preferred recipient; `CONTACT_EMAIL` is the legacy fallback |
| `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME` | Verified Resend sender; defaults are in `src/lib/resend.ts` |
| `CAL_LINK` | Optional HTTP(S) scheduling URL; no booking link is shown without a valid URL |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Required rate-limit store when `NODE_ENV=production`, including Vercel Preview |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 measurement ID; unset disables the analytics component |

Production contact requests fail closed with HTTP 503 when Redis protection is
missing or unavailable; only development/tests use the memory fallback. Enable
Vercel system environment variables: only `VERCEL=1` deployments trust the managed
client-IP header. Do not set that flag manually on another host.

A successful build does **not** prove email delivery, valid service credentials,
or production rate limiting. Use the controlled deployment checks in
[security and analysis](docs/security-and-analysis.md) before claiming those work.

## Verification

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run size-check
npm run e2e:install
npm run e2e
```

`test:coverage` already runs the full unit/integration suite; a second `npm test`
is unnecessary for that verification pass. Use `npm test -- path/to/test` for
targeted work and `npm run test:watch` during implementation.

| Check | What it establishes |
| --- | --- |
| `lint`, `typecheck` | Static code checks and TypeScript contracts |
| `test:coverage` | Behavior tests plus 100% per-file lines, branches, statements and functions in the existing eligible scope |
| `coverage:check` | Revalidates an existing LCOV report's file inventory and raw hit counts |
| `build` | Production compilation and static route generation |
| `size-check` | Aggregate emitted JavaScript budget of 1,500 KB; not a page-speed or Core Web Vitals score |
| `e2e` | Chromium suite plus selected mobile WebKit journeys, including mocked contact recovery |
| `e2e:chromium`, `e2e:webkit` | Run one configured browser project |

Local browser tests use Playwright-managed browsers. GitHub CI uses the runner's
Chrome Stable for Chromium and installs WebKit. **Build before running E2E.**
The test-only `e2e/https-server.mjs` serves that production build at
`https://localhost:3000`, using an ephemeral certificate generated by OpenSSL.
Use OpenSSL 1.1.1 or newer with `req -addext` support; the CI runner includes it. Avoid
running another server on port 3000 during the tests.

HTTPS allows WebKit to load assets under the real `upgrade-insecure-requests`
policy. Playwright trusts the temporary local certificate; no production security
header is stripped or weakened. `npm run dev`, `npm run start`, and Vercel's
deployment entry point remain unchanged.

Coverage scope comes from `scripts/coverage-scope.mjs` and the existing Sonar
exclusions, including unimported runtime files, configuration and executable
scripts. Do not weaken gates or add exclusions to hide uncovered behavior.
Browser tests do not contribute to V8 coverage. Automated axe checks and device
emulation supplement manual review; they do not certify WCAG compliance or
replace testing on physical phones.

CI also runs `npm audit --audit-level=high` and
`npm audit --omit=dev --audit-level=moderate`, binds LCOV to the tested revision,
and supplies it to SonarCloud. See [security and analysis](docs/security-and-analysis.md).

## Keep the repository current

Update documentation in the same change that alters behavior, routes, content
contracts, scripts, or environment requirements. Start with:

- [Maintenance guide](docs/maintenance.md): sources of truth, change checklist,
  publication dates, privacy, evidence and review cadence.
- [Search guide](docs/search.md): content indexing, semantic destinations and
  compatibility expectations when wording changes.
- [Architecture inventory](docs/architecture/README.md): actual diagram paths and
  safe publication rules.
- [Documentation index](docs/README.md): active guides, optional plans and dated
  historical reports.

Historical audit results remain snapshots of their recorded revisions. They
must not override the current implementation, Node version, homepage decision,
or newer verification results.
