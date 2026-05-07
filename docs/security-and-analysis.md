# Security and Code Analysis

This repo uses several separate checks. SonarCloud adds another analysis layer;
it does not replace GitHub CodeQL, Dependabot, CI, or Vercel preview checks.

## Current Stack

- GitHub Actions CI runs on pull requests to `master` and pushes to `master`.
  The CI workflow covers `npm ci`, lint, TypeScript, Vitest, high-severity
  `npm audit`, production build, bundle-size check, Playwright e2e, and CodeQL.
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
  scope/exclusions.
- The Sonar workflow uses `actions/checkout` with `fetch-depth: 0` so SonarCloud
  receives full Git history for branch and pull request analysis.
- The Sonar workflow pins GitHub Actions references to full commit SHAs for
  supply-chain hardening.
- SonarCloud does not replace CodeQL or Dependabot; keep all three signals.

The first passing pull request check for PR #86 showed:

- Quality Gate passed
- 0 new issues
- 0 security hotspots

A fuller baseline scan should happen after PR #86 is merged and the workflow
runs from the `master` push event.

## How To Verify After Merge

After PR #86 is merged:

1. Open GitHub Actions and confirm the SonarCloud workflow ran on the `master`
   push event.
2. Open the SonarQube Cloud project dashboard and confirm there is a `master`
   branch analysis.
3. Confirm the Quality Gate passes.
4. Confirm there are no unexpected security hotspots.
5. Do not make SonarCloud a required branch protection check until it has a few
   stable runs on normal pull requests and Dependabot pull requests.

## Later Options

- Consider Sonar coverage reporting later if the test setup starts producing
  `coverage/lcov.info`.
- Consider OSSF Scorecard or OSV Scanner later, but do not add them until the
  current CI, Dependabot, CodeQL, SonarCloud, and Vercel signals are stable.
