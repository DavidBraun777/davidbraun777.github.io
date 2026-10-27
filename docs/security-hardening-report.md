# Security hardening report

Date: October 26, 2026  
Repository: `DavidBraun777/davidbraun777.github.io`  
Working branch: `feat/ieee-dataport-profile`

## Executive summary

This pass removes an unused vulnerable development dependency, makes production contact submissions depend on working distributed rate limiting, bounds request-body consumption, and strengthens security regression checks. It also moves the configured runtime from end-of-life Node.js 20 to supported Node.js 24, adds an explicit production dependency audit to CI, and denies embedded objects through CSP.

The site's design, custom MDX styling, contact-form interface, professional positioning, research claims, and existing IEEE DataPort implementation are preserved. No packages were upgraded relative to the working tree at the start of this task. No commits, pushes, deployments, real email submissions, or production secret changes were performed.

**Deployment blocker:** actual Vercel Production/Preview environment variables, trusted IP routing, Redis access, and Resend delivery are **Not Verified**. Production contact submissions now return HTTP 503 when distributed protection is unavailable. A passing build does not establish that the production contact form will accept submissions. Complete the [deployment prerequisites](#deployment-prerequisites) before rollout.

## Vulnerability comparison

These are npm audit findings for the inspected lockfile, not a claim that the entire application is vulnerability-free.

| Dependency scope | Before: low / moderate / high / critical | After: low / moderate / high / critical |
| --- | --- | --- |
| All dependencies | 0 / 2 / 0 / 0 | 0 / 0 / 0 / 0 |
| Production dependencies (`--omit=dev`) | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

Both baseline moderate findings belonged to the development dependency chain: direct `@tailwindcss/typography` and its vulnerable transitive `postcss-selector-parser@6.0.10`. The underlying advisory concerns CPU exhaustion from quadratic selector parsing; the two package findings do not represent two independently exposed application endpoints. See [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).

The application's exposure was build tooling processing repository-controlled CSS, with no identified runtime path parsing attacker-supplied selectors. Typography was not registered in the Tailwind CSS 4 configuration. Existing MDX components already supply styling, so its removal also allowed removal of inactive `prose`, `prose-lg`, and `dark:prose-invert` classes.

`npm uninstall` removed only four package entries: `@tailwindcss/typography`, `postcss-selector-parser`, `cssesc`, and `util-deprecate`. Comparison against the task-start manifest/lockfile found no package-version changes; the other change was the root Node engine constraint. Pre-existing Next.js 16.4.3, Vitest 4.1.12, and Happy DOM 21.0.4 installations were preserved. No force fix, downgrade, or new dependency override was used. No npm audit advisories remain in the resulting tree.

## Security findings

Severity below describes the assessed application or operational risk. Only the dependency row uses npm's advisory severity. Conditions that depend on uninspected deployment state remain qualified.

| Severity | Component and exploitability assumptions | Actual exposure | Remediation | Verification | Remaining risk |
| --- | --- | --- | --- | --- | --- |
| Moderate advisory; limited application exposure | Typography's selector parser; attacker-controlled selectors would be needed to exploit parser CPU cost | Development dependency; repository-controlled CSS; no runtime selector endpoint identified | Removed unused plugin and inactive classes | All-dependency and production audits return zero; lockfile comparison | Unrelated or undisclosed dependency flaws are outside audit guarantees |
| Medium | Contact rate limiting; missing Redis or an outage combined with multiple serverless instances | Previous fallback enforced only per-instance counts and could admit submissions without distributed protection | Production fails closed with generic 503; memory fallback remains development/test only | Missing configuration, initialization/runtime failures, timeout, cooldown, concurrent initialization, and recovery tests | Redis outages intentionally stop submissions; actual production configuration is Not Verified |
| Medium | Contact identity; caller can vary untrusted forwarding headers | Previous `x-real-ip`/`x-forwarded-for` handling accepted insufficiently validated caller identities | Trust only Vercel's platform header when `VERCEL=1`; validate and normalize IPv4/IPv6; otherwise one `unknown` bucket | Spoofed, invalid, equivalent IPv6, mapped IPv4, and shared-unknown quota tests | Shared networks can share quotas; address rotation/botnets remain possible; non-Vercel hosts need an explicitly reviewed proxy integration |
| Medium | Contact body parsing; unauthenticated callers can submit oversized streams | Previously parsed the whole JSON body without an application byte ceiling | Count streamed bytes and stop/cancel above 16 KiB; return 413 before Resend | Missing/misleading Content-Length, multibyte/chunk boundaries, exact limit, cancellation, and maximum valid fields tested | Platform request/time limits still matter; byte limits are not complete denial-of-service prevention |
| Medium | Contact failure logs; upstream errors may contain sensitive details | Previous logging included raw service errors; no actual leaked credential was established | Fixed error categories and generic responses; no raw Redis/Resend errors | Failure tests assert private error contents are absent | Operator access and log retention remain account responsibilities |
| Medium | Runtime maintenance; unsupported runtime receives no normal security maintenance | `.nvmrc` selected Node.js 20 for CI | `.nvmrc` and engine constraint now select Node.js 24 | Clean install, lint, types, tests, build, and bundle checks under Node 24 | Confirm Vercel actually deploys Node 24; continue patch maintenance |
| Medium | Merge controls; a contributor can merge without enforced checks | Read-only GitHub inspection found no `master` branch protection or repository rulesets | Document required manual branch/ruleset configuration | Protection endpoint returned 404; rulesets list was empty | Settings were not modified; CI failure alone currently does not guarantee a blocked merge |
| Low / defense in depth | Browser embedding and dependency regressions | Existing security headers and audits were present, with no explicit object restriction or moderate production audit threshold | Added `object-src 'none'`, header regression tests, and production moderate audit | Configuration and served-header browser tests pass | Inline-script/style permissions remain for current rendering compatibility |

### Contact behavior and preserved protections

- Distributed checks retain the five-per-minute sliding window. Actual exhaustion returns 429 with a positive `Retry-After`. Missing or unavailable production protection returns 503 instead of using process-local memory.
- Redis initialization is shared across concurrent first requests. Initialization and checks each have a two-second deadline; Redis requests receive an abort signal and retries are disabled. Upstash's success-on-timeout behavior is disabled, and a timeout-marked success is rejected defensively. Failures enter a 60-second cooldown, after which initialization is retried.
- The body limit measures actual bytes read, not just Content-Length. Valid maximum-field examples fit: 7,760 UTF-8 bytes and 15,110 bytes when JSON-escaped, below 16,384 bytes.
- Existing required/type/length/email validation, control-character removal, server-controlled recipients, single-line subjects, HTML escaping at render time, and submission-ID idempotency forwarding remain. Duplicate IDs are passed to Resend with the same idempotency key; local tests do not prove the remote provider's deduplication behavior.
- Origin/Referer checks remain defense in depth. Requests without a recognized Origin or fallback Referer are rejected, production does not accept localhost, and an explicitly rejected Origin is not rescued by an allowed Referer. Scripted clients can supply an allowed Origin, so it is not authentication.

## Code changes

Paths below describe this security pass, separately from work already present when it began.

| File | Reason |
| --- | --- |
| `package.json` | Remove unused Typography; require Node `24.x`; preserve earlier dependency updates |
| `package-lock.json` | Reproduce that removal and root engine change; preserve remaining resolved versions |
| `.nvmrc` | Select supported Node 24 for local work and CI |
| `src/app/writing/[slug]/page.tsx` | Remove inactive Typography utilities; retain layout classes and custom MDX components |
| `src/lib/rate-limit.ts` | Production fail-closed protection, retryable shared initialization, bounded checks, trusted validated IP identities, safe logs |
| `src/app/api/contact/route.ts` | Bounded JSON stream reader, 413/503 handling, stricter Origin precedence, generic service-error handling |
| `src/__tests__/lib/rate-limit.test.ts` | Deterministic mocked Redis, recovery/timeout/concurrency, local fallback, and IP trust regression tests |
| `src/__tests__/api/contact/route.test.ts` | Contact body boundaries, unavailable protection, validation/sanitization, origin, idempotency, and failure behavior |
| `next.config.ts` | Add `object-src 'none'` while retaining compatible existing headers |
| `src/__tests__/config/security-headers.test.ts` | Assert security headers and distinct production/development CSP behavior |
| `e2e/smoke.spec.ts` | Strengthen assertions against actual served security headers |
| `.github/workflows/ci.yml` | Add `npm audit --omit=dev --audit-level=moderate` alongside the existing high-severity audit |
| `.github/dependabot.yml` | Keep routine minor/patch updates grouped; leave major upgrades for individual review |
| `.env.example` | Explain production Redis requirements, server-only credentials, and Vercel trust assumptions |
| `README.md` | Update runtime, environment setup, failure behavior, and deployment verification guidance |
| `docs/security-and-analysis.md` | Describe the added audit and distinguish existing checks from unenforced merge requirements |
| `docs/security-hardening-report.md` | Record evidence, limitations, deployment blockers, and follow-up steps |

No GitHub Actions commit SHA was changed. Existing CodeQL, SonarCloud, Dependabot, coverage, browser testing, and SHA-pinned actions were retained. The IEEE DataPort profile implementation was preserved byte for byte.

## Verification

Baseline: 139 unit/integration tests passed before this pass. An intermediate run on the pre-existing Node 26 installation passed 195 tests. Final runtime validation used Node.js **24.22.1**, npm **11.19.1**, from an official archive checked against its published SHA-256; this was a temporary local runtime, not a global installation.

Node 20 is end of life according to the [Node.js release schedule](https://nodejs.org/en/about/previous-releases). Node 24 is supported by Vercel, which accepts `engines.node: "24.x"`; see [Vercel's supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

| Command or inspection | Actual result |
| --- | --- |
| `npm ci` on Node 24 | Passed; lockfile installation reproducible |
| `npm ls --depth=0` | Passed |
| `npm audit` | Passed; zero findings |
| `npm audit --omit=dev` | Passed; zero production findings |
| `npm audit --audit-level=high` | Passed; zero findings |
| `npm audit --omit=dev --audit-level=moderate` | Passed; zero findings |
| `npm run lint` | Passed on Node 24 |
| `npm run typecheck` | Passed on Node 24 |
| `npm run test:coverage` | Passed: 195 tests across 14 files on Node 24 |
| `npm run build` | Passed on Node 24; 37 pages generated |
| `npm run size-check` | Passed: 798 KB JavaScript, 55 KB CSS; JavaScript below the 1,500 KB budget |
| `npm run e2e` | Passed: 47 Chromium browser tests on Node 24 against the production build; Redis/Resend variables explicitly empty. Repeated with `CI=true`: 47 passed, exercising production-only CSP assertions and automatic server teardown |
| Desktop/mobile, light/dark visual checks | Passed for the inspected cases below; no introduced visual regression observed |
| Final `git diff --check`, `git status --short`, `git diff --stat` | Passed/inspected; changes remain uncommitted and existing work is preserved |

Coverage: statements **58.67%**, branches **49.10%**, functions **47.53%**, lines **58.82%**. The contact route has **100% line / 96.72% branch** coverage; rate limiting has **93.75% line / 91.66% branch** coverage. These figures describe measured test coverage, not proof that every security failure mode is covered.

The automated tests mock Redis and Resend, restore environment overrides, and make no live email or Redis API calls. They cover successful submission, malformed JSON, missing fields, invalid email, origin failures, size failures, actual rate exhaustion, unavailable distributed protection, recovery, Resend failure, duplicate submission IDs, and safe rendering/logging. Existing non-blocking Vite configuration and npm install-script policy notices remain; the install, build, and checks completed successfully.

The production browser run exercised existing navigation and the IEEE DataPort profile as well as the new header assertions. Separate local HTTP checks with Redis/Resend variables empty returned 403 for missing/rejected Origins and a generic 503 for an allowed production Origin, before email delivery. These verify the local failure path, not live provider configuration.

Writing-page comparison covered widths 1280 and 390 in both light and dark themes. All 56 inspected elements retained identical computed font sizes, colors, margins, padding, and bounds before and after Typography removal. Desktop-light and mobile-dark screenshots were inspected. Home, Research, and Contact were also checked at desktop 1280/light and mobile 390/dark: all returned 200, with no horizontal overflow or introduced visual regression observed.

Two limits remain explicit: the existing light-theme fenced-code text has low contrast, unchanged by this cleanup; and current authored MDX posts contain no images, so no representative authored-image browser case was available. The existing image component was preserved byte for byte. Neither observation is represented as a completed image-content visual test.

### Secret review and GitHub settings

- A pattern scan of current tracked files found no credential matches. `.env.local` is ignored. Inspection found only the intended public analytics identifier `NEXT_PUBLIC_GA_ID` exposed through a public environment-variable name.
- A scan of 199 public build JS/HTML/RSC files found zero matches for the available local Resend credential value; no local Upstash token was available for an exact-value comparison. Only variable names/counts were reported, never values. Source inspection found Redis and Resend usage confined to the server contact path. This was not an exhaustive Git-history or external log audit.
- Read-only GitHub metadata showed dependency alerts/security updates, secret scanning, and push protection enabled. Default workflow permissions were read-only; workflow approval of pull requests was disabled; first-time fork-contributor approval was configured.
- The `SONAR_TOKEN` secret name exists in Actions and Dependabot metadata. No Resend, Upstash, or Vercel secret names were present in the inspected Actions metadata. GitHub secret values were not retrieved; absence there says nothing about Vercel's separate configuration.
- `master` protection returned 404 and the repository ruleset list was empty. No settings were changed. Remote execution of the new workflow changes is **Not Verified** until an authorized push and run.
- CI installs with `npm ci --ignore-scripts`, defaults to `contents: read`, and disables persisted checkout credentials. CodeQL retains its necessary narrowly scoped reporting permissions. The token-bearing Sonar job skips fork pull requests and scans in a fresh checkout without executing project dependency installation or test code.

## Deployment prerequisites

**Status: Not Verified. Do not treat this change as deployable until these checks are complete.**

### Environment and service configuration

Configure each applicable Vercel **Production and Preview** environment, then create a new deployment so it receives the configuration. Vercel Preview builds also run with `NODE_ENV=production`, so they require distributed protection too.

| Variable or setting | Requirement |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Required HTTPS REST endpoint for the intended Redis database |
| `UPSTASH_REDIS_REST_TOKEN` | Required server-only credential with permissions for the rate limiter's read/write/script operations; read-only credentials will not work |
| `RESEND_API_KEY` | Required server-only sending credential; scope it to the intended sending domain where supported |
| `CONTACT_NOTIFICATION_EMAIL` | Preferred required server-controlled recipient; existing `CONTACT_EMAIL` is a legacy fallback only |
| `CONTACT_FROM_EMAIL` | Defaults to `contact@dbraun.io`; that sender/domain, or the configured alternative, must be verified and authorized in Resend |
| `CONTACT_FROM_NAME` | Optional; defaults to `dbraun.io Contact`; must remain a nonempty valid display name |
| Vercel system environment variables | Enable platform access to `VERCEL=1` and `VERCEL_URL`; do not manufacture these on another host |
| Node runtime | Confirm deployment build/runtime use Node 24, matching `.nvmrc` and `engines.node` |
| `NEXT_PUBLIC_GA_ID`, `CAL_LINK` | Optional existing public analytics/scheduling configuration; neither is a credential or required for contact protection |

Keep Redis/Resend credentials out of `NEXT_PUBLIC_*`, source control, preview screenshots, client bundles, and logs. Prefer separate preview resources, minimum required privileges, and provider-supported rotation with an overlap/verification plan; no credentials were rotated here.

Vercel documents its platform forwarding headers and the difference from generic forwarding headers in [request headers](https://vercel.com/docs/headers/request-headers). The implementation accepts only one valid `x-vercel-forwarded-for` address when the platform runtime sets `VERCEL=1`. Confirm traffic traverses Vercel's trusted edge and that custom proxies/rewrites do not replace this value. Enable platform environment variables as described in [system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables). Outside that deployment model, requests deliberately share `unknown`; do not set `VERCEL=1` manually to bypass this restriction.

### Controlled validation before rollout

1. Use an isolated, access-controlled preview with separate Redis resources and an approved test recipient. Verify the environment names and runtime without printing secret values. Confirm the preview hostname matches its platform-provided `VERCEL_URL` for allowed-origin checks.
2. Submit invalid JSON with an allowed Origin from that preview. Expect **400**, not 503: distributed protection runs before parsing, while invalid data cannot send email. Check sanitized status logs and service connectivity.
3. From one real client, repeat invalid submissions within one minute. Accounting for prior attempts, the sixth attempt should receive **429** with a positive `Retry-After`. Varying caller-supplied `x-real-ip` or `x-forwarded-for` must not create fresh quotas. Check trusted-edge header handling through the actual deployment; do not expose a public header-debug endpoint.
4. After quota reset, send an oversized JSON body and confirm **413** with no Resend delivery. Also confirm a missing or rejected Origin/Referer receives **403**.
5. Test missing configuration/outage only on the isolated preview: remove its preview-only Redis credential or use a controlled invalid preview credential, redeploy if configuration changed, and expect **503** with a generic response and no email. Never disable production Redis for this test. Restore the preview configuration, redeploy if needed, and wait at least 60 seconds for a retained instance's cooldown before checking recovery with invalid JSON. The local tests verify same-process retry recovery independently of redeployment.
6. Only with the owner's explicit approval and the test recipient's consent, send one valid, clearly identified test submission. Confirm successful delivery, correct recipient/sender/reply-to, readable HTML/plain text, and provider idempotency behavior if separately tested. No automated real-message test was performed in this pass.
7. Confirm served security headers, hydration, analytics when enabled, and representative Home/Research/Writing/Contact pages on mobile and desktop in both themes. Then review and authorize the production rollout separately.

### Repository settings that still require manual changes

Configure a branch protection rule or ruleset for `master` requiring the successful `ci`, `e2e`, and `codeql` jobs from this repository's CI workflow. Select the actual check contexts after a completed run, require review as appropriate, restrict bypass permissions, and decide whether branches must be up to date before merging. Keep dependency-update pull requests subject to those checks.

Retain enabled dependency alerts/security updates, secret scanning, and push protection. Review who can approve fork runs and access secrets. Sonar is intentionally conditional for fork compatibility: do not require a skipped check in a way that blocks safe fork contributions. A successful scanner invocation is not evidence that a Sonar Quality Gate was evaluated or enforced; keep that gate advisory until its separate results and coverage import are verified.

## Deferred recommendations

1. **High priority: complete deployment validation and merge enforcement.** These are unresolved operational prerequisites, not application-code workarounds.
2. **Medium priority: stage a stricter CSP through report-only monitoring.** Current static Next.js rendering, hydration, JSON-LD, and optional analytics use compatible inline permissions. Keep the functioning enforced policy while adding a deliberately designed `Content-Security-Policy-Report-Only` policy and an authenticated/abuse-bounded report collector or managed reporting service. Define retention/redaction, test representative routes/themes and analytics, inspect real violation reports, and only then enforce individual restrictions. Do not convert static pages to dynamic nonce rendering solely for scanner scores. Broad HTTPS image compatibility also remains until actual image sources are inventoried and tested.
3. **Medium priority if abuse is observed: add deployment-edge controls.** Evaluate Vercel WAF/bot controls, provider spending alerts, and contact failure-rate monitoring before adding CAPTCHA or new security frameworks. Per-IP limits cannot stop distributed attackers and can affect users behind shared networks.
4. **Routine operations: keep runtime/dependencies current and rotate credentials deliberately.** Review major upgrades separately, retain least-privilege server credentials, and verify delivery/protection during rotations. A targeted historical secret audit can be scheduled separately if repository history or incident evidence warrants it.
5. **Separate visual accessibility cleanup:** improve the pre-existing light-theme fenced-code contrast and add an image-bearing MDX fixture when image rendering needs direct browser coverage. Typography removal did not change the inspected code styling or existing image component.

No additional scanners, security frameworks, packages, public endpoints, or disruptive CSP changes were introduced merely to improve scanner output.
