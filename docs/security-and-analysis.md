# Security and code analysis

This guide describes the repository's configured checks, reviewed November 2,
2026. It does not assert current dashboard results, repository settings or live
service behavior. Verify those against the exact revision and deployment.

## Check stack

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on pull requests to
`master` and pushes to `master`. Action references are pinned to commit SHAs.

| Job / signal | Configured behavior |
| --- | --- |
| Primary CI | Node 24, locked install without lifecycle scripts, lint, TypeScript, unit/integration coverage, slug validation, audit gates, production build and bundle budget |
| Dependency audits | `npm audit --audit-level=high` for the whole dependency tree; `npm audit --omit=dev --audit-level=moderate` for production dependencies |
| Browser tests | Production build, runner Chrome Stable for the full Chromium suite, Playwright WebKit for tagged mobile journeys |
| SonarQube Cloud / SonarCloud | Consumes the primary job's validated LCOV artifact and analyzes the same checkout revision |
| CodeQL | JavaScript/TypeScript analysis in its own job |
| Dependabot | Update configuration in `.github/dependabot.yml`; alerts and security updates also depend on GitHub settings |
| Vercel | Preview/deployment signal outside the code-analysis jobs |

These signals answer different questions. A green build does not prove real
email delivery, complete accessibility, absence of all vulnerabilities, or
strong portfolio evidence. Vercel success is not a substitute for tests.

## Coverage and Sonar import

`npm run test:coverage` runs Vitest with V8 coverage and enforces 100% lines,
branches, statements and functions per eligible file. The subsequent
`scripts/check-coverage.mjs` validates raw LCOV hits, file completeness, unique
repository-relative paths and matching counters. A rounded percentage, missing
file, zero-hit outcome or empty overall denominator cannot pass.

`scripts/coverage-scope.mjs` derives tracked and untracked JS/TS files from the
existing Sonar scope/exclusions. Runtime configuration and executable scripts
are included; a new file does not escape coverage merely because no test imports
it. Type-only files may have zero executable lines but remain in the inventory.
Keep tests in `src/__tests__`; do not add exclusions or lower thresholds to make
an implementation pass. Browser tests do not add to the V8 report.

The primary CI job uploads `coverage/lcov.info`, its SHA-256 checksum and the
checked-out Git revision. The Sonar job downloads that same-run artifact,
verifies checksum and revision, checks expected source paths and scans with full
Git history. It does not install dependencies or execute project code in the
scanner job that has the token. The integrated job is the sole scanner path.

`SONAR_TOKEN` is required in Actions secrets and Dependabot secrets for
Dependabot-originated PRs. Fork PR scans are skipped to avoid exposing the token
to untrusted code. Secret values never belong in docs or screenshots.

Local V8 and Sonar executable-line/condition denominators can differ. A local
100% report does not establish Sonar's overall or new-code percentage. Confirm
the completed background task, analyzed revision and uncovered counts for each
scope. Do not change the new-code definition, CPD exclusions or quality gate
merely to hide a failing result.

## Browser coverage and its limits

The Chromium suite covers navigation, content, search/deep links, résumé assets,
responsive layouts, console errors and automated accessibility scans. Tests
tagged `@cross-browser` also run in mobile WebKit, including selected navigation,
phone layout and mocked contact recovery. The project names are `chromium` and
`webkit-mobile`; the latter uses Playwright's iPhone 13 device profile.

This is selected WebKit coverage, not the full suite on every browser. Device
emulation is not a physical-device test. Axe checks for serious/critical issues
supplement manual keyboard, focus, contrast, zoom and screen-reader review.
Run `npm run build` before E2E. The test-only HTTPS entry point generates an
ephemeral OpenSSL certificate and serves the production build on localhost.
Playwright trusts that local certificate so WebKit can exercise the real
`upgrade-insecure-requests` policy. Production CSP headers are not stripped or
weakened, and the deployment server remains unchanged.

## Contact deployment checks

Use [.env.example](../.env.example) and the README environment table. The API
retains server-side validation and size limits, HTML escaping, fixed recipient
configuration, distributed production rate limiting and provider idempotency.
Only Vercel's managed client-IP header is trusted when `VERCEL=1`.

Production, including Vercel Preview, requires working Upstash REST credentials.
Missing or unavailable rate-limit protection returns HTTP 503 before delivery;
only development and tests use the memory fallback. Resend requires a valid API
key, recipient and verified sender. Keep all credentials server-only.

Before claiming a production contact flow is verified:

1. Confirm the deployed revision and the environment configuration without
   exposing values in logs, PRs or screenshots.
2. Use an explicitly authorized controlled inquiry and confirm receipt at the
   intended destination. Local mocked-provider tests do not establish this.
3. Verify validation, rate-limit response and safe failure behavior in a controlled
   environment. Check that errors retain the visitor's draft and `Retry-After`
   guidance is usable; do not disable protection to make a test send succeed.
4. Confirm the optional scheduling destination and any enabled analytics match
   the actual deployment. If analytics is disabled, leave `NEXT_PUBLIC_GA_ID` unset.

The [October 26 hardening report](security-hardening-report.md) preserves the
original review and detailed deployment checklist. Its then-observed GitHub
settings and verification results are historical, not live configuration facts.

## Remote verification and repository settings

For a PR, inspect the checks attached to its exact head/merge revision. Confirm
one Sonar scan, successful LCOV import, proper source/test classification and
current results; repeat after a material update. Do not equate an older green
run with a newer commit's status.

Branch protection/rulesets, required checks, secret scanning, push protection,
and Dependabot settings are controlled in GitHub. Review their current state
separately. Passing workflows alone do not establish merge enforcement. Choosing
or changing required checks is a repository-policy decision, not an implicit
side effect of a documentation update.

Keep new security tooling targeted at a demonstrated gap. Preserve current
protections and analysis scope; record any check that could not run and why.
