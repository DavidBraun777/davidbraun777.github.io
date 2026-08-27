# dbraun.io

Professional portfolio for David Braun, organized around a single systems-level
identity while retaining consulting, delivery, enterprise, and research proof.

**Live site:** [dbraun.io](https://dbraun.io)

## Professional North Star

**Primary identity:** AI Systems / Platform Architect

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
- `time2move.io` is a paused client project retained as past delivery evidence;
  do not describe it as currently live.
- `DealerFlow`, where shown, should be treated cautiously as pilot/proof work
  unless stronger artifacts and bounded pilot facts are added.
- `WeatherForge` is secondary technical proof. It should not be described as a
  production client system unless real deployment proof is added.
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

- [ ] Synchronize `resume.pdf` with the AI Systems / Platform Architect
  positioning once an editable resume source is available
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

### Architect

The AI Systems / Platform Architect identity must increasingly be backed by
architecture artifacts, cross-layer decisions, deployed systems,
security/reliability evidence, and measurable outcomes. It is professional
positioning, not a fabricated historical appointment.

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
