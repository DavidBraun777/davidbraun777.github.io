# Security and Code Analysis

This repo uses several separate checks. SonarCloud adds another analysis layer;
it does not replace GitHub CodeQL, Dependabot, CI, or Vercel preview checks.

## Current Stack

- GitHub Actions CI runs on pull requests to `master` and pushes to `master`.
  The CI workflow covers `npm ci --ignore-scripts`, lint, TypeScript, Vitest with
  V8 coverage, LCOV validation, high-severity `npm audit`, production build,
  bundle-size checks, Playwright e2e, SonarCloud, and CodeQL.
- GitHub CodeQL runs JavaScript/TypeScript analysis and reports security alerts
  through GitHub code scanning.
- Dependabot manages dependency update pull requests from `.github/dependabot.yml`
  and GitHub Dependabot alerts/security updates track known vulnerable packages.
- Dependabot malware alerts are handled through GitHub's dependency security
  tooling when GitHub flags a malicious package event.
- Secret scanning and push protection should remain enabled in GitHub repository
  settings where available. This is a repo setting, not application code.
- SonarQube Cloud / SonarCloud runs additional code-quality and security analysis.
- Vercel preview deployments remain useful deployment checks for pull requests,
  but they are not a replacement for code analysis or dependency scanning.

## SonarCloud Setup Notes

- The SonarCloud workflow runs on pull requests and pushes to `master`.
- Pull requests from forked repositories are skipped so `SONAR_TOKEN` is not
  exposed to untrusted code.
- The workflow uses `SonarSource/sonarqube-scan-action`.
- `SONAR_TOKEN` must exist in GitHub Actions secrets.
- `SONAR_TOKEN` must also exist in Dependabot secrets so Dependabot-originated
  pull requests can run analysis.
- `sonar-project.properties` defines the Sonar project metadata and analysis
  scope. It keeps the repository root available for analysis, classifies
  `src/__tests__` and `e2e` as tests without source/test overlap, and imports
  `coverage/lcov.info`. Declarative tool/test configuration, declarative data,
  and thin social-image wrappers remain analyzed but are excluded from coverage
  calculations; executable scripts and production configuration remain
  coverage-eligible.
- The primary CI job generates and validates `coverage/lcov.info`, then uploads
  only that report as an artifact. The Sonar job starts from a fresh checkout,
  downloads the report, validates it, and scans without installing dependencies
  or running project code in the token-bearing job.
- The Sonar job uses `actions/checkout` with `fetch-depth: 0` so SonarCloud
  receives full Git history for branch and pull request analysis.
- GitHub Actions references touched by the CI repair are pinned to full commit
  SHAs for supply-chain hardening.
- SonarCloud does not replace CodeQL or Dependabot; keep all three signals.
- CPD and New Code configuration remain unchanged. The Quality Gate remains
  advisory while the repaired measurement pipeline is verified.

The resulting measurement flow is:

```text
Primary CI
  install -> lint -> typecheck -> Vitest/V8 coverage -> validate LCOV
          -> audit -> build -> size check -> upload coverage/lcov.info
                                                   |
                                                   +-> Playwright e2e job
                                                   `-> Sonar job: fresh checkout
                                                                  -> download LCOV
                                                                  -> validate + scan
```

The legacy standalone Sonar workflow was removed after the integrated job
proved that it downloads, validates, and imports the CI-generated LCOV report.
The isolated job in `.github/workflows/ci.yml` is now the sole scanner entry
point.

## Remote Verification

After pushing the CI repair:

1. Confirm the integrated Sonar job explicitly logs LCOV import.
2. Confirm Sonar no longer reports artificial 0% coverage.
3. Confirm `src/__tests__` and `e2e` are classified as tests, not main source.
4. Confirm new-code coverage reflects the imported report.
5. Re-measure duplication before considering any CPD exclusion.
6. Confirm each pull request update produces exactly one integrated Sonar scan.
7. Keep SonarCloud out of required branch protection until normal and Dependabot
   pull requests have produced several stable, trustworthy runs.

## Later Options

- Revisit CPD exclusions and New Code configuration only after the corrected
  coverage and test classification produce a trustworthy baseline.
- Consider OSSF Scorecard or OSV Scanner later, but do not add them until the
  current CI, Dependabot, CodeQL, SonarCloud, and Vercel signals are stable.
