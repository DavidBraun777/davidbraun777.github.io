# Coverage verification — 2026-10-28

## Revision and evidence

The initial checkout was clean on `dev` at
`9971307639d2e02ea7445c01150c6fc4ac33fdf7`. Its source tree
`53eb1b5776c3e532ade9b1d36365ad5ca1f91a63` is identical to the latest inspected
`master` merge, `6dfea7257ad4a7bf9e1d81b9f591e5fb20ed2607`.
This report describes the working-tree changes based on that revision.

[Baseline GitHub Actions run 40639034131](https://github.com/DavidBraun777/davidbraun777.github.io/actions/runs/40639034131)
completed successfully. Its Sonar job downloaded the same-run `vitest-lcov`
artifact, imported `coverage/lcov.info`, identified `master` and the exact merge
revision above, and submitted analysis successfully. The scanner log contained
no LCOV path/import warnings. This establishes successful baseline import, not
100% baseline coverage or a completed result for these new changes.

Remote verification for this change uses GitHub Actions, as requested. The
pipeline checks exact raw coverage, file completeness, and report checksum and
revision before Sonar import. The review's CI link identifies the tested snapshot.
A passing PR pipeline does not establish that these changes have been merged into
`master`, or independently establish Sonar's overall/new-code dashboard metrics.
No project identity, new-code period, quality gate or Sonar exclusions changed.

## Baselines and final local result

The supplied screenshot is a separate observed analysis. Its timestamp/revision
was not provided, so it is not treated as the current local baseline.

| Scope | Covered / executable lines | Uncovered lines | Covered / conditions or V8 branch outcomes | Uncovered conditions/outcomes |
| --- | ---: | ---: | ---: | ---: |
| Screenshot: overall (67.1% combined) | 1,062 / 1,555 | 493 | 708 / 1,081 | 373 |
| Screenshot: new code (79.1% combined) | 631 / 777 | 146 | 474 / 620 | 146 |
| Fresh local baseline, original 83-file instrumentation | 1,338 / 1,680 | 342 | 1,129 / 1,503 | 374 |
| Final local, corrected 87-file instrumentation | **1,747 / 1,747** | **0** | **1,543 / 1,543** | **0** |

The fresh baseline passed 312 tests in 24 files. Its line coverage was 79.64%
and branch coverage 75.11%. Final coverage passes 438 tests in 41 files, with
2,031/2,031 statements and 628/628 functions also covered. These are exact raw
counts, not rounded claims. Three type-only/re-export files have zero executable
lines; they are included in the inventory but do not establish coverage by themselves.

V8 and Sonar use different executable-line/condition denominators. This change
makes no unsupported claim that the screenshot is stale or that a source-map
bug explains the difference. The evidenced problems are:

1. Missing behavioral tests, particularly asynchronous search/UI, navigation,
   contact submission, optional content, route fallbacks and browser lifecycle.
2. Incomplete instrumentation: Sonar's existing repository-wide scope included
   `next.config.ts` and `scripts/check-bundle-size.mjs`, while Vitest covered only
   `src`. Those two existing files now add 29 executable lines. The two new
   coverage scripts add 40 lines and are themselves fully tested.
3. Several redundant guards were unreachable by the surrounding lifecycle or
   content invariants. Their small simplifications, plus the registry extraction,
   account for the remaining denominator difference. No reachable validation or
   error handling was removed.

## Behavioral coverage and small refactors

Tests execute the actual application implementations. Mocks control external
HTTP/delivery, Next routing/theme, animation scheduling, geometry and fixture
content. The real loader, search ranking, form, disclosure state and navigation
controller run. The existing browser regressions remain unchanged.

- Search client: caching, concurrent requests, timeout/network/HTTP/JSON errors,
  retry and cleanup. Search dialog/header: loading, pagination, empty/error states,
  query edits, shortcuts, keyboard selection, dismiss/selection focus and mobile menus.
- Navigation: nested unmounting disclosures, delayed fonts/rendering, direct and
  repeated fragments, registration replacement, cancellation, stale-target
  fallback, horizontal table movement, highlighting and scroll-to-top coordination.
- Contact: native field validation, contextual inputs, disabled pending state,
  successful reset, HTTP/network recovery and timer cleanup; no inquiry is sent.
- Content/routes: real search-index response, redirects, metadata, missing pages,
  empty/optional content, analytics/theme variants, hooks and server rendering.
- Runtime configuration/scripts: production/development headers and output paths,
  legacy redirects, nested bundle accounting, missing builds and budget boundaries.
- Coverage pipeline: omitted/unimported files, existing exclusions, duplicate or
  invalid paths, missing files, raw zero/invalid hits, mismatched counters and CLI.

The only application refactors are:

- `selectFeaturedSystems` extracts the existing map selection and missing-entry
  validation so valid ordering and invalid registries can both be tested.
- The unconditional native disclosure ref exists before its layout effect;
  its null return was unreachable.
- MDX row candidates require nonempty readable child cells, so the first cell
  exists; the alternate row-node title fallback was unreachable.
- Fallback navigation skips the disclosure-ID loop, so a fallback-only branch
  inside that loop was unreachable. Each request cancellation clears its sole
  timeout before replacement; atomic timeout callbacks cannot belong to a canceled
  request. The redundant identity guards were removed while keeping both deadlines.

Happy DOM emits delayed `hashchange` events for History API updates, unlike real
browsers. The navigation test helper models browser-accurate push/replace URL
updates without those events, eliminating a false race without changing the app.
Explicit fragment/popstate tests and actual browser back/forward tests remain.

## Scope and pipeline

`sonar-project.properties` is unchanged. `scripts/coverage-scope.mjs` reads that
scope and enumerates tracked plus untracked JS/TS with Git, respecting generated
file ignores. Vitest includes all eligible files even if never imported. Dynamic
route bracket characters are escaped in the instrumentation globs.

Existing coverage exclusions remain: `eslint.config.mjs`, `playwright.config.ts`,
`postcss.config.mjs`, `vitest.config.ts`, the education/experience/profile/skills/
social-links data files, and the opengraph/twitter image wrappers. Test directories
remain classified as tests. There are no added exclusions or ignore pragmas.

All four Vitest metrics require 100% per file. `npm run test:coverage` also runs
`coverage:check`, which requires all 87 eligible files, unique existing relative
paths, matching raw LCOV counters and positive hits for every DA/BRDA outcome.
Zero-denominator files must still be present, and the overall report must have
nonzero line and branch totals.

CI binds the validated report to its checkout revision and SHA-256 checksum.
The Sonar job downloads from the same workflow run and checks both before
scanning. It still does not install dependencies or run project code in the
job that receives `SONAR_TOKEN`.

## Local validation

Runtime: Node 24.22.1 (configured 24.x), lockfile v3, Next 16.4.3, Vitest 4.1.12.

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test:coverage`: 438 tests, 41 files; all four metrics 100%; LCOV guard passed.
- `npm run build`: passed, 40 static pages generated.
- `npm run size-check`: 869 KB JavaScript / 1,500 KB budget; 58 KB CSS.
- `npm run e2e -- --reporter=line`: 70 Chromium tests passed against a fresh production build.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `npm audit --omit=dev --audit-level=moderate`: zero vulnerabilities.
- `git diff --check`: passed.

Browser coverage includes the actual BM25 cell below the sticky header, open
ancestors, focus, highlight and one history entry; repeated collapsed selections,
Static embeddings, article paragraphs, copied links, refresh, back/forward,
Escape focus, mobile horizontal visibility, reduced motion and unavailable targets.
Browser tests do not contribute fabricated coverage to LCOV.

## Complete eligible-file worklist

Each cell is **uncovered / total**. “Outside prior instrumentation” identifies
existing eligible runtime files missing from the original Vitest scope; “new”
identifies coverage tooling added by this change. Final zero totals represent
non-executable files, not missing records.

| Source | Before lines | Before outcomes | Final lines | Final outcomes |
| --- | ---: | ---: | ---: | ---: |
| `next.config.ts` | Outside prior instrumentation | Outside prior instrumentation | 0 / 6 | 0 / 6 |
| `scripts/check-bundle-size.mjs` | Outside prior instrumentation | Outside prior instrumentation | 0 / 23 | 0 / 10 |
| `scripts/check-coverage.mjs` | new | new | 0 / 29 | 0 / 29 |
| `scripts/coverage-scope.mjs` | new | new | 0 / 11 | 0 / 5 |
| `src/app/layout.tsx` | 0 / 8 | 0 / 0 | 0 / 8 | 0 / 0 |
| `src/app/page.tsx` | 1 / 17 | 1 / 4 | 0 / 17 | 0 / 4 |
| `src/app/robots.ts` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/sitemap.ts` | 0 / 7 | 1 / 2 | 0 / 7 | 0 / 2 |
| `src/app/about/page.tsx` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/api/contact/route.ts` | 0 / 101 | 0 / 61 | 0 / 101 | 0 / 61 |
| `src/app/approach/evidence/page.tsx` | 0 / 9 | 0 / 2 | 0 / 9 | 0 / 2 |
| `src/app/background/page.tsx` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/blog/page.tsx` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/blog/[slug]/page.tsx` | 2 / 2 | 0 / 0 | 0 / 2 | 0 / 0 |
| `src/app/case-studies/page.tsx` | 1 / 14 | 6 / 28 | 0 / 14 | 0 / 28 |
| `src/app/case-studies/[slug]/page.tsx` | 2 / 61 | 5 / 86 | 0 / 61 | 0 / 86 |
| `src/app/contact/page.tsx` | 4 / 4 | 2 / 2 | 0 / 4 | 0 / 2 |
| `src/app/experience/page.tsx` | 0 / 17 | 15 / 51 | 0 / 17 | 0 / 51 |
| `src/app/experience/career-story/page.tsx` | 0 / 6 | 0 / 0 | 0 / 6 | 0 / 0 |
| `src/app/projects/page.tsx` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/projects/[slug]/page.tsx` | 2 / 2 | 0 / 0 | 0 / 2 | 0 / 0 |
| `src/app/research/page.tsx` | 0 / 10 | 1 / 10 | 0 / 10 | 0 / 10 |
| `src/app/research/urarina-hybrid-retrieval/page.tsx` | 0 / 8 | 0 / 0 | 0 / 8 | 0 / 0 |
| `src/app/resume/page.tsx` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/resumes/page.tsx` | 0 / 3 | 0 / 0 | 0 / 3 | 0 / 0 |
| `src/app/search-index.json/route.ts` | 2 / 2 | 0 / 0 | 0 / 2 | 0 / 0 |
| `src/app/services/page.tsx` | 12 / 12 | 2 / 2 | 0 / 12 | 0 / 2 |
| `src/app/systems/page.tsx` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/why-work-with-me/page.tsx` | 1 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/app/writing/page.tsx` | 6 / 6 | 4 / 4 | 0 / 6 | 0 / 4 |
| `src/app/writing/[slug]/page.tsx` | 17 / 17 | 8 / 8 | 0 / 17 | 0 / 8 |
| `src/components/analytics/google-analytics.tsx` | 16 / 16 | 10 / 10 | 0 / 16 | 0 / 10 |
| `src/components/blog/mdx-components.tsx` | 8 / 29 | 7 / 10 | 0 / 29 | 0 / 10 |
| `src/components/blog/post-card.tsx` | 3 / 3 | 3 / 3 | 0 / 3 | 0 / 3 |
| `src/components/layout/current-status.tsx` | 10 / 10 | 11 / 11 | 0 / 10 | 0 / 11 |
| `src/components/layout/footer.tsx` | 0 / 10 | 1 / 6 | 0 / 10 | 0 / 6 |
| `src/components/layout/header-navigation-item.tsx` | 0 / 41 | 0 / 66 | 0 / 41 | 0 / 66 |
| `src/components/layout/header.tsx` | 10 / 61 | 15 / 50 | 0 / 61 | 0 / 50 |
| `src/components/layout/scroll-to-top.tsx` | 48 / 48 | 28 / 28 | 0 / 48 | 0 / 28 |
| `src/components/sections/contact.tsx` | 44 / 44 | 32 / 32 | 0 / 44 | 0 / 32 |
| `src/components/site/case-study-story.tsx` | 0 / 13 | 2 / 10 | 0 / 13 | 0 / 10 |
| `src/components/site/content-destination-manifest.tsx` | 0 / 3 | 0 / 0 | 0 / 3 | 0 / 0 |
| `src/components/site/disclosure-panel.tsx` | 4 / 11 | 4 / 8 | 0 / 10 | 0 / 6 |
| `src/components/site/metric-card.tsx` | 0 / 1 | 0 / 7 | 0 / 1 | 0 / 7 |
| `src/components/site/page-intro.tsx` | 0 / 5 | 2 / 17 | 0 / 5 | 0 / 17 |
| `src/components/site/project-card.tsx` | 3 / 3 | 22 / 22 | 0 / 3 | 0 / 22 |
| `src/components/site/resume-card.tsx` | 0 / 2 | 0 / 2 | 0 / 2 | 0 / 2 |
| `src/components/site/signal-grid.tsx` | 0 / 3 | 1 / 4 | 0 / 3 | 0 / 4 |
| `src/components/site/site-search.tsx` | 47 / 78 | 35 / 46 | 0 / 78 | 0 / 46 |
| `src/components/site/tech-tag.tsx` | 0 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/components/site/theme-toggle.tsx` | 0 / 8 | 1 / 10 | 0 / 8 | 0 / 10 |
| `src/components/ui/badge.tsx` | 0 / 4 | 0 / 1 | 0 / 4 | 0 / 1 |
| `src/components/ui/button.tsx` | 3 / 3 | 7 / 7 | 0 / 3 | 0 / 7 |
| `src/components/ui/card.tsx` | 12 / 12 | 3 / 3 | 0 / 12 | 0 / 3 |
| `src/components/ui/external-link-action.tsx` | 0 / 3 | 0 / 3 | 0 / 3 | 0 / 3 |
| `src/components/ui/image-lightbox.tsx` | 4 / 29 | 4 / 16 | 0 / 29 | 0 / 16 |
| `src/components/ui/input.tsx` | 11 / 11 | 22 / 22 | 0 / 11 | 0 / 22 |
| `src/components/ui/mobile-section-disclosure.tsx` | 4 / 4 | 7 / 7 | 0 / 4 | 0 / 7 |
| `src/components/ui/section-header.tsx` | 0 / 1 | 3 / 10 | 0 / 1 | 0 / 10 |
| `src/data/career-story.ts` | 0 / 13 | 0 / 0 | 0 / 13 | 0 / 0 |
| `src/data/case-study-story.ts` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| `src/data/past-client-work.ts` | 0 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/data/research.ts` | 0 / 8 | 0 / 0 | 0 / 8 | 0 / 0 |
| `src/data/resumes.ts` | 0 / 5 | 0 / 0 | 0 / 5 | 0 / 0 |
| `src/data/services.ts` | 0 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/data/systems.ts` | 1 / 20 | 2 / 4 | 0 / 21 | 0 / 4 |
| `src/data/urarina-research.ts` | 0 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/hooks/index.ts` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| `src/hooks/useGSAP.ts` | 1 / 29 | 3 / 16 | 0 / 29 | 0 / 16 |
| `src/hooks/useScrollSpy.ts` | 26 / 26 | 9 / 9 | 0 / 26 | 0 / 9 |
| `src/lib/contact-validation.ts` | 1 / 77 | 2 / 85 | 0 / 77 | 0 / 85 |
| `src/lib/content-navigation.ts` | 18 / 151 | 39 / 121 | 0 / 149 | 0 / 115 |
| `src/lib/mdx.ts` | 0 / 48 | 2 / 38 | 0 / 48 | 0 / 38 |
| `src/lib/rate-limit.ts` | 5 / 96 | 4 / 60 | 0 / 96 | 0 / 60 |
| `src/lib/resend.ts` | 2 / 20 | 4 / 16 | 0 / 20 | 0 / 16 |
| `src/lib/seo.ts` | 0 / 8 | 3 / 14 | 0 / 8 | 0 / 14 |
| `src/lib/social-card.tsx` | 0 / 4 | 0 / 0 | 0 / 4 | 0 / 0 |
| `src/lib/utils.ts` | 0 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/lib/search/build-index.ts` | 1 / 61 | 10 / 71 | 0 / 61 | 0 / 71 |
| `src/lib/search/client.ts` | 1 / 36 | 4 / 71 | 0 / 36 | 0 / 71 |
| `src/lib/search/destinations.ts` | 0 / 13 | 1 / 4 | 0 / 13 | 0 / 4 |
| `src/lib/search/project-destinations.ts` | 0 / 104 | 4 / 67 | 0 / 104 | 0 / 67 |
| `src/lib/search/readable-mdx.ts` | 0 / 106 | 21 / 162 | 0 / 106 | 0 / 160 |
| `src/lib/search/search.ts` | 0 / 77 | 1 / 94 | 0 / 77 | 0 / 94 |
| `src/lib/search/static-pages.ts` | 0 / 1 | 0 / 0 | 0 / 1 | 0 / 0 |
| `src/lib/search/types.ts` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| `src/providers/theme-provider.tsx` | 2 / 2 | 0 / 0 | 0 / 2 | 0 / 0 |

## Changed files

- `.github/workflows/ci.yml`
- `README.md`
- `docs/coverage-verification.md`
- `docs/security-and-analysis.md`
- `package.json`
- `scripts/check-coverage.mjs`
- `scripts/coverage-scope.mjs`
- `src/__tests__/components/analytics-status.test.tsx`
- `src/__tests__/components/contact-interactions.test.tsx`
- `src/__tests__/components/content-navigation-edges.test.ts`
- `src/__tests__/components/scroll-to-top.test.tsx`
- `src/__tests__/components/search-interactions.test.tsx`
- `src/__tests__/components/server-content.test.tsx`
- `src/__tests__/components/ui-behavior.test.tsx`
- `src/__tests__/config/bundle-size.test.ts`
- `src/__tests__/config/coverage-pipeline.test.ts`
- `src/__tests__/config/security-headers.test.ts`
- `src/__tests__/content/system-registry.test.ts`
- `src/__tests__/helpers/mounted-ui.tsx`
- `src/__tests__/hooks/useGSAP-server.test.ts`
- `src/__tests__/hooks/useGSAP.test.ts`
- `src/__tests__/hooks/useScrollSpy.test.tsx`
- `src/__tests__/lib/contact-validation.test.ts`
- `src/__tests__/lib/mdx-destinations.test.tsx`
- `src/__tests__/lib/mdx.test.ts`
- `src/__tests__/lib/project-destinations.test.tsx`
- `src/__tests__/lib/rate-limit.test.ts`
- `src/__tests__/lib/resend.test.ts`
- `src/__tests__/lib/search-client.test.ts`
- `src/__tests__/lib/search-index-variants.test.ts`
- `src/__tests__/lib/search.test.ts`
- `src/__tests__/lib/seo.test.ts`
- `src/__tests__/pages/optional-content.test.tsx`
- `src/__tests__/pages/route-behavior.test.tsx`
- `src/components/site/disclosure-panel.tsx`
- `src/data/systems.ts`
- `src/lib/content-navigation.ts`
- `src/lib/search/readable-mdx.ts`
- `vitest.config.ts`
