# dbraun.io

Professional portfolio for David Braun, organized around a single systems-level
identity while retaining consulting, delivery, enterprise, and research proof.

**Live site:** [dbraun.io](https://dbraun.io)

## Résumés and Research CV

`/resumes` is the document directory. `src/data/resumes.ts` defines the document
descriptions, public URLs, and research-CV request fallback. The industry résumé
remains the default on Home, Experience, and the Experience navigation menu.
Résumé documents are not researcher identities and do not belong in JSON-LD `sameAs`.

Approved PDFs belong in `public/resumes/`:

- `David-J-Braun-Resume-Software-Platform-2026.pdf`
- `David-J-Braun-CV-AI-Research-2026.pdf`

Both `/resume.pdf` and `/David-J-Braun-Resume-2026.pdf` permanently redirect to the
canonical industry PDF through the shared configuration, without duplicate PDF
copies. `/resume` still permanently redirects to `/experience`.

Before replacing a PDF, verify provenance, disclosure clearance, exactly two
pages, readable extracted text, and rendered layout. Keep staging files and editable
sources private. Leave `researchCv.href` null until a safe public release is approved;
the directory and Research page then offer contact links. Refresh the approved-asset
hashes in the résumé tests only after this review to protect the approved bytes
and verified page count. Both current PDFs were reviewed and explicitly cleared
by the owner on October 27, 2026; their contents are unchanged from the supplied files.

## Professional North Star

**Primary identity:** AI Systems & Platform Engineer

**North-star statement:** A systems-level engineer who can take AI/data
capabilities and turn them into secure, deployable, measurable operational
systems.

The identity synthesizes software, APIs, workflows, data, cloud infrastructure,
security, evaluation, observability, and operational ownership. These are layers
of one professional story, not competing titles. Workflow automation, system
integration, operational software, and SMB consulting remain valid commercial
applications of the broader identity.

This is David's current professional positioning, not a retroactive employer
title. Preserve historical job titles and describe role scope with evidence.
Future website changes should strengthen the north star through deployed systems,
bounded outcomes, architecture artifacts, and verifiable technical decisions.

## Evidence Ladder

Use this order when deciding what should receive the most emphasis:

1. Production systems with real operational ownership
2. Measured business, user, or reliability outcomes
3. Architecture and platform artifacts
4. Production AI/data systems with evaluation
5. Enterprise engineering evidence
6. Research and reproducibility
7. Credentials and memberships
8. Technology lists

Higher-level evidence should dominate lower-level evidence. A real deployed
system is more persuasive than ten technology badges, and a measured outcome is
more persuasive than a vague claim.

The current project evidence remains deliberately classified:

- [VIFG nonprofit platform](https://www.vifg.org/home) is the strongest public
  production proof.
- [arklandscaping.net](https://arklandscaping.net) is a current public delivery
  example.
- Time2Move is past client work: David designed and developed the original real
  estate website, including its site structure and lead-capture workflows. The
  original `time2move.io` deployment is inactive. The client has since continued
  the project independently as [Hombuzz](https://hombuzz.com/), with changes to its
  brand, design, implementation, and direction. The compact entry under "Past
  client work" links to `/case-studies/time2move`, a historical case study of the
  original website and inquiry workflows. It belongs to the shared case-study
  registry with stage `Historical`, outside featured/current production proof.
  Its optional `story` supplies the long-form account, and `successorLink` labels
  Hombuzz as the current business website without routing it through "Live Proof."
  Keep the original engagement named Time2Move and preserve dated audit findings.

  The public account records the October 27, 2026 local audit of source revision
  `515deb2` plus dependency-lock changes: 34 tests, type checking and build passed;
  lint failed with 29 errors and 12 warnings. These are historical source-project
  checks, separate from portfolio validation. Handoff/involvement dates and live
  provider receipt remain unconfirmed. Only the manifest-cleared synthetic form
  failure capture is included, with its simulation/date caption; other captures
  were omitted. Do not add private audit reports, source paths, evidence IDs or
  operational hooks to tracked portfolio content. The portfolio builds independently
  of the source project and its private audit folder.
- `DealerFlow`, where shown, should be treated cautiously as pilot/proof work
  unless stronger artifacts and bounded pilot facts are added.
- `WeatherForge` is a collaborative University of St. Thomas SEIS 745 project on
  which David served as lead developer and primary implementer, writing more than
  90% of the application code. Do not describe the academic project as exclusively
  solo, but do not treat its collaborative status as evidence of equal implementation
  contribution. State individual contributions where established, and do not describe
  it as a production client system unless deployment evidence is added.
- `RAGeATM` is secondary academic/technical proof for retrieval and augmentation
  work. It should not be framed as production consulting delivery.
- `DGM` and `StormIQ`, where present, represent active or planned system
  direction rather than finished production products.

## What Is Still Missing

This is an evidence roadmap, not a list of claims. Check an item only after the
artifact or outcome exists and can be represented truthfully.

### Production AI Proof

- [ ] One genuinely deployed AI/retrieval/data system used in a real workflow
- [ ] Real evaluation dataset
- [ ] Retrieval/model quality metrics
- [ ] Acceptance, refusal, and error behavior
- [ ] Latency measurements
- [ ] Cost measurements where relevant
- [ ] Production monitoring
- [ ] Real operational or user outcome

### Platform Architecture Proof

- [ ] High-quality architecture diagram for at least one flagship system
- [ ] Design/RFC-style explanation of major architecture choices
- [ ] Alternatives considered
- [ ] Tradeoff analysis
- [ ] Infrastructure-as-code evidence where appropriate
- [ ] Environment and deployment architecture
- [ ] Failure-mode analysis
- [ ] Capacity and performance considerations

### Reliability & Operations Proof

- [ ] Logs, metrics, or traces examples
- [ ] Defined SLI/SLO where a real system warrants it
- [ ] Incident or failure lesson documented
- [ ] Recovery and degradation strategy
- [ ] Load or performance evidence where meaningful
- [ ] Cost/reliability tradeoff example

### AI Evaluation Proof

- [ ] Regression evaluation
- [ ] Grounding or hallucination measurement
- [ ] Retrieval benchmark
- [ ] Failure taxonomy
- [ ] Model/system comparison where relevant
- [ ] Human-review boundary documented

### Security Architecture Proof

- [ ] Threat model for a real system
- [ ] Authentication and authorization design
- [ ] Data classification or sensitive-data handling
- [ ] Security-boundary diagram
- [ ] Concrete remediation or hardening case study

### Business / Client Outcome Proof

- [ ] Before/after workflow measurement
- [ ] Manual effort reduced
- [ ] Time saved
- [ ] Reliability improved
- [ ] Adoption or use evidence
- [ ] Revenue or conversion evidence only when verified
- [ ] Real testimonials only with permission

### Technical Leadership Proof

Add these only when they are real; do not manufacture leadership artifacts.

- [ ] Architecture RFC
- [ ] Design review
- [ ] Mentoring evidence
- [ ] Cross-team technical decision
- [ ] Migration plan
- [ ] Standards or process improvement
- [ ] Technical leadership outcome

### Research Proof

- [ ] IEEE proceedings/Xplore link when available
- [ ] DOI when available
- [ ] arXiv/preprint if actually published
- [ ] Reproducibility instructions
- [ ] Public code/data where allowed
- [ ] Evaluation artifacts
- [ ] Citation/profile synchronization
- [ ] Additional peer-reviewed work as it occurs

### Professional Identity Hygiene

- [x] Version the current resume as `David-J-Braun-Resume-2026.pdf` and align it
  with the AI Systems & Platform Engineer positioning
- [ ] Synchronize LinkedIn
- [ ] Synchronize ORCID
- [ ] Synchronize the GitHub profile
- [ ] Review dead and live project links periodically
- [ ] Label paused projects accurately
- [ ] Update expired credentials
- [ ] Update completed degrees immediately

## Claim Upgrade Rules

### Production AI

Do not call a prototype "production AI" until it is genuinely deployed into a
real operational workflow.

### Architecture

The AI Systems & Platform Engineer identity must increasingly be backed by
architecture artifacts, cross-layer decisions, deployed systems,
security/reliability evidence, and measurable outcomes. Architecture remains a
legitimate capability; it is not a fabricated historical appointment.

### Staff / Principal

Do not self-assign Staff or Principal seniority. Let employment history, scope,
and evidence justify future seniority.

### Scale

Do not claim scale without measured evidence.

### Outcomes

Do not replace evidence with adjectives. Prefer a verified, bounded measure such
as "40% reduction in manual processing" over "highly efficient automation."

### Technology Lists

Do not promote a technology into a headline merely because it was used once.
The site should increasingly explain what was designed, why it was designed that
way, which tradeoff was made, and what happened.

## Growth Priority

1. Stronger production proof
2. One production-quality AI system
3. Measured outcomes
4. Architecture and RFC artifacts
5. Reliability and observability evidence
6. Security architecture evidence
7. Research reproducibility
8. Technical leadership evidence
9. New technologies or certifications
10. Cosmetic website polish

Do not spend significant time polishing the website when stronger real-world
evidence can be created instead.

## Career Filter

Prefer opportunities that increase systems-level ownership across AI/data,
software, infrastructure, security, reliability, and operations. Good future
opportunities should ideally strengthen at least two or three of:

- AI/data
- software architecture
- platform/cloud
- security
- reliability
- operations
- technical leadership
- measurable outcomes

This keeps future work compounding toward the professional north star.

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
| Rate limiting | [Upstash Redis](https://upstash.com/), required in production; memory fallback for development/tests |
| Testing | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

## Local Development

### Site Search

The header search uses a local, typed index at `/search-index.json`, generated
statically by each normal `npm run build`. It is fetched on first opening search
and reused for the browser session. No queries are sent to a search service or
recorded by this feature. A new session revalidates the index after deployment.

`src/lib/search/build-index.ts` explicitly selects public fields from the same
collections used by the site. New case studies and published MDX articles enter
search automatically. Articles marked `draft: true` or `published: false` are
excluded from both public article routes and search. Readable MDX text and headings
are extracted at build time; imports, expressions, comments, implementation code,
hidden content, and unrelated frontmatter are omitted. Résumé records use approved
metadata and destinations, without extracting PDF contents.

Page records provide broad navigation. Granular records add a `destination` with
the canonical `page`, semantic `anchor`, readable location `label`, ordered
`disclosureIds`, and an optional `fallbackAnchor`. A table row can supply `cells`
so a match in a distant column reveals that cell within its scroll container.
Only public displayed text belongs in these fields. Parent `context` qualifies a
local match without making every child match the project or article name.

`src/lib/search/destinations.ts` owns ID construction and duplicate validation.
`createProjectContent` in `project-destinations.ts` supplies both indexed records
and rendered attributes for case-study sections, narrative blocks and table cells.
Use semantic keys, scoped by section/table. An optional ladder-row `id` handles
duplicate labels; displayed level numbers are not identities. Never use array
positions or a separate renderer slug function. Duplicate destinations fail the
build/tests rather than silently pointing visitors to the wrong occurrence.

Published MDX uses the same `remarkContentDestinations` transform during indexing
and rendering. It anchors headings, paragraphs, list items and table rows/cells.
Text fingerprints keep blocks stable when unrelated content is inserted. Explicit
IDs resolve otherwise ambiguous repeated content; native MDX disclosures require
stable `id` attributes and render through the registered `ContentDetails` component.
Hidden nodes, executable expressions, source code and unrelated metadata remain
excluded. Changing a block's own wording can change a generated fingerprint;
use an explicit ID when a long-lived editorial link must survive those rewrites.

For a new static page, add its public overview to `static-pages.ts`. For precise
targets, build metadata once with the shared helpers, apply `destinationAttributes`
to the meaningful rendered element, and render a `ContentDestinationManifest`
outside any disclosures that may unmount their children. Add its public records
through an explicit adapter in the builder. Table targets use semantic row headers
and `data-content-table` on the horizontal overflow wrapper. Validate every declared
anchor against rendered output. Historical entries follow the same path and retain
their clearly labeled successor context.

The existing scroll controller owns fragment navigation through
`src/lib/content-navigation.ts`. Search records intent before closing the dialog;
its close lifecycle releases navigation without restoring header focus. Disclosures
register React state callbacks, then layout readiness reveals and focuses the exact
target with sticky-header clearance and a temporary outline. Page-local manifests
support copied URLs, refresh and history without loading the search index. Escape
still restores the search trigger. Stale targets fall back to an available parent
or page heading, and observers are bounded and canceled on superseding navigation.

Ranking requires every query term and prioritizes exact titles, title phrases,
title words/prefixes, tags/headings/descriptions, then body text. Case, accents, and
whitespace are normalized while technology punctuation is retained. Short terms
match whole words; longer terms can match prefixes. The small aliases are Blog
and Articles for Writing, Projects for Case Studies, and ML for Machine Learning.
Precise matches outrank aggregate body mentions, and at most three granular hits
per page keep the list compact. Destinations, including fragments, are deduplicated.
There is no fuzzy matching or added search dependency. Run the search and destination
unit tests plus `npm run e2e -- e2e/search.spec.ts e2e/search-destinations.spec.ts`
when changing search behavior or destinations.

`published-search-compatibility.test.ts` also preserves compact digests captured
from published revision `ba84b4d` before the Sonar cleanup: the full index,
destination inventory, project manifests, and representative ranked results.
Algorithm-only refactors must pass these recorded expectations unchanged. When
deliberately editing public content, review the actual old/new destination and
ranking differences before updating the affected expectations; retain explicit
compatibility for published links that need to survive. The fixture revision is
provenance, not permission to regenerate expectations from a failing implementation.

### Prerequisites

- Node.js 24 LTS from `.nvmrc` (`package.json` requires `24.x`)
- npm

### Install and Run

```bash
nvm use
npm ci --ignore-scripts
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

# Required distributed rate limiting in production, including Vercel Preview
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
- Both Upstash variables are required when `NODE_ENV=production`, including
  Vercel Preview deployments. Missing configuration, outages, and timeouts fail
  closed with HTTP 503 before email delivery. Only development/tests use the
  in-memory fallback. Failed initialization/checks retry after a 60-second cooldown.
- Enable Vercel system environment variables. Only `VERCEL=1` deployments trust
  Vercel's managed `x-vercel-forwarded-for` client IP; other hosts share an
  `unknown` bucket until a trusted proxy integration is explicitly implemented.
- Production contact setup is **not verified by a successful build**. Follow the
  [deployment checklist](docs/security-hardening-report.md#deployment-prerequisites)
  before deploying. Keep all Resend/Upstash credentials server-only.
- Google Analytics loads only when `NEXT_PUBLIC_GA_ID` is set. Leaving it unset
  disables GA without code changes.

## Verification

Use Node 24 LTS and a clean install for verification:

```bash
nvm use
npm ci --ignore-scripts
npm run lint
npm run typecheck
npm run test:coverage
npm test
npm run build
npm run size-check
npm run e2e:install
npm run e2e
```

Local E2E tests use Playwright-managed Chromium; run `npm run e2e:install`
when that browser needs installing or updating. With `CI` set, the same
`chromium` project uses preinstalled Google Chrome Stable on GitHub's
`ubuntu-24.04` runner. CI logs the Chrome version and browser launch path.
The runner updates Chrome independently of the installed Playwright version.

`npm run test:coverage` generates fresh V8/LCOV coverage, enforces 100% per-file
lines, branches, statements and functions, then validates raw LCOV counts and
source-file completeness. `scripts/coverage-scope.mjs` derives the eligible
tracked and untracked JavaScript/TypeScript inventory from the existing Sonar
scope and exclusions, including production configuration and executable scripts.
New runtime files receive coverage even before a test imports them. Keep new tests
under `src/__tests__`; do not add exclusions to bypass uncovered behavior.
Use `npm run coverage:check` to revalidate an existing report. Browser tests
verify real navigation but do not contribute to the imported V8 report.

## Security and Analysis

The repo uses GitHub CI, CodeQL, Dependabot alerts/security updates,
Dependabot malware alerting, SonarQube Cloud / SonarCloud analysis, and Vercel
preview deployment checks as separate signals. SonarCloud runs on pull requests
and pushes to `master`; CI supplies its validated `coverage/lcov.info` artifact.
It requires `SONAR_TOKEN` in both Actions secrets and Dependabot secrets for
Dependabot-originated pull requests.

See [Security and Code Analysis](docs/security-and-analysis.md) for setup notes
and the remote SonarCloud verification checklist.

## Proof and Honesty Rules

This repo intentionally separates:

- real public production proof
- public delivery examples
- pilot/prototype work
- academic or technical proof
- planned system direction

Do not add invented outcomes, testimonials, screenshots, metrics, or artifacts.
If a project needs stronger proof, add the real artifact or leave a TODO.
