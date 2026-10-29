# Sonar cleanup verification — October 28, 2026

This cleanup addresses the 26 supplied new-code findings against published
`master` revision `ba84b4d73d6f93a8af7622737cdc6c12998d2fa7` (including PR #147).
It preserves the existing local work. No Sonar scope, exclusions, quality profile,
complexity limit, new-code definition, or coverage threshold was changed. No
suppression or issue-acceptance workaround was added.

## Individual dispositions

All entries below are implemented and locally verified. These numbers track the
supplied worklist, not Sonar issue keys. The GitHub check did not expose issue keys
or rule locations. Original line numbers are replaced with stable function names.
The owner will reconcile the individual issues in Sonar after reviewing the PR.

| # | File / finding | Disposition and evidence |
| --- | --- | --- |
| 1 | `content-navigation.ts`: font-ready promise | Documented intentional `void` scheduling of the complete `.then()` chain; mounted guard and notification lifecycle retained. Loading, loaded, and disposed navigation tests pass. |
| 2 | `content-navigation.ts`: `attemptNavigation` complexity 27 | Synchronous coordinator now 4; route readiness, declared disclosures, target resolution, actual ancestors, positioning and highlighting have separate responsibilities. All helpers are at most 6. |
| 3 | `content-navigation.ts`: attribute removal | `delete element.dataset.contentActive` removes the attribute; cleanup tests retain row-plus-cell behavior. |
| 4 | `content-navigation.ts`: attribute assignment | `element.dataset.contentActive = ''` preserves presence with an empty value; navigation tests assert the actual attribute. |
| 5 | `search/client.ts`: C0-control `charCodeAt` | One `codePointAt(0)` per nonempty character; the `< 32` rejection is preserved, including percent-decoded controls. |
| 6 | `search/client.ts`: DEL `charCodeAt` | The same computed code point handles the separate `=== 127` check; raw and encoded DEL regressions pass. |
| 7 | `search/client.ts`: pending initialization | `pendingIndex ??=` retains a non-async API, concurrent promise identity, one lazy request, success caching, failure reset/rethrow, timeout and timer cleanup. Existing lifecycle tests pass. |
| 8 | `search/destinations.ts`: fingerprint `charCodeAt` | Full code points replace leading UTF-16 code units. Normalization, constants, integer arithmetic and output formatting are unchanged. Published inventory matches exactly; distinct emoji no longer collide in the tested case. |
| 9 | `case-studies/[slug]/page.tsx`: complexity 17 | Page now 5; `StandardCaseStudyContent` is 6. Complete rendered HTML for all 10 actual case studies matched the baseline byte for byte. Optional-content tests pass. |
| 10 | `header-navigation-item.tsx`: complexity 16 | Component now 13; presentational `NavigationLinksPanel` is 2 (its mapping callback is 4). Desktop/mobile pointer, keyboard and focus behavior remains covered. |
| 11 | `site-search.tsx`: complexity 18 | Component now 3; status calculation and result presentation extracted, with helpers at most 5. Loading, retry, empty states, pagination, selection and focus tests pass. |
| 12 | `site-search.tsx`: nested ternary | `searchStatus` uses explicit branches, retaining every displayed status string and precedence. |
| 13 | `project-destinations.ts`: complexity 25 | `createProjectContent` now 4; registry, story, standard and retrieval registration are separated. Largest helper is 11. Order, duplicate detection, missing-target errors and successor-site distinction are retained. |
| 14 | `readable-mdx.ts`: hidden-attribute complexity 19 | `hidesContent` now 5; literal AST decoding is separate from visibility policy. Literal/string distinctions and ambiguous-expression exclusions remain tested. |
| 15 | `readable-mdx.ts`: visitor complexity 25 | Visitor now 11; heading, disclosure, table and list handlers preserve scoped traversal, ordered ancestry and directly owned prose. No expression evaluation added. |
| 16 | `readable-mdx.ts`: heading-depth nested ternary | `headingDepth` uses clear branches (complexity 2); published article IDs and rendered anchors remain identical. |
| 17 | `readable-mdx.ts`: block-kind nested ternary | `blockGranularity` uses clear branches (complexity 2); block/row/section classification remains identical. |
| 18 | `search.ts`: ranking complexity 29 | `searchContent` now 4; qualification, title bonuses, cell selection, snippets and final filtering are separated. All helpers are at most 9. Full numeric results for 20 captured queries match. |
| 19 | `search.ts`: snippet-position nested ternary | `snippetMatchPosition` preserves phrase-first, earliest-term and zero fallback selection; captured snippets match. |
| 20 | `search.ts`: zero in `weights` | Uses `weights.includes(0)`; every distinct term must still qualify. |
| 21 | `search.ts`: zero in `localWeights` | Uses `localWeights.includes(0)`; genuinely local matching and positive-weight predicates remain intact. |
| 22 | `header.tsx`: desktop nested ternary | Shared `nextNavigationSection` uses explicit branches; closing a different section leaves the active section unchanged. |
| 23 | `header.tsx`: mobile nested ternary | The same state-transition helper retains mobile behavior and close semantics; menu interaction tests pass. |
| 24 | `build-index.ts`: retrieval nested ternary | `retrievalSearchText` names the optional ladder-text assembly; complete index comparison preserves displayed cells and whitespace. |
| 25 | `build-index.ts`: nested template literal | `certificationDescription` names optional date text; complete index comparison preserves exact output. |
| 26 | `urarina-hybrid-retrieval/page.tsx`: mutable props | `ContextLink` uses `Readonly` props; rendered links and page tests remain unchanged. |

Local rule checking used `eslint-plugin-sonarjs` 4.2.2 outside the repository,
without adding a project dependency. All 12 affected source files pass cognitive
complexity at the unchanged limit of 15, nested-conditional (S3358), nested-template
(S4624), and read-only-props (S6759) checks. Cognitive complexity is S3776.
This checks extracted helpers as well as the original functions; it is not a claim
that the local plugin reproduces the entire configured cloud quality profile.

## Compatibility evidence

Before changing the algorithms, the actual baseline produced an immutable capture
of the full index, record IDs/URLs, row and cell destinations, disclosure ancestry,
fallbacks, project manifests and ranked query results. Compact SHA-256 expectations
in `published-search-compatibility.test.ts` were calculated from that capture,
not from the refactored implementation. Canonical serialization sorts object
keys while retaining array order and complete field values.

- All **615 records** and **661 record/cell destination entries** are identical.
  No published anchors changed, so no legacy aliases are required by this change.
- All **10 project manifests** match, including Time2Move's original-work proof
  context and separately labeled Hombuzz successor link.
- All **20 query comparisons** match complete ordering, scores, selected row/cell
  destinations and excerpts. Queries include BM25, RAGeATM BM25, RAGeATM, Static
  embeddings, BM25 keyword, BM25 weak, Time2Move, Hombuzz, article-body prose,
  short technology terms, multiword matches, and no-match queries.
- The MDX-only comparison matched **322 article records / 318 destinations**.
  Existing rendering/extraction consistency and insertion-stability tests pass.
- An independent render comparison of all **10 real case studies** against the
  baseline found byte-identical HTML, including public wording and IDs. Existing
  component tests continue to cover optional branches beyond the actual content.
- Fingerprint regressions preserve empty, ASCII, accented, decomposed and whitespace
  normalization outputs. Previously `😀` and `😁` both hashed to `fegh9k`; complete
  code-point hashing now produces distinct `1r2uqn` and `1h391o` values. None of the
  published destinations use content affected by that distinction.
- URL validation retains protocol-relative, backslash, C0, DEL, malformed encoding,
  traversal and canonical-normalization rejection; safe encoded Unicode remains valid.

The font-ready scheduling policy follows the native API contract:
[`FontFaceSet.ready` only fulfills](https://drafts.csswg.org/css-font-loading/#font-face-set-ready).
The intentional `void` is not an exception handler. Unexpected callback exceptions
remain observable, as before; no empty catch or fictitious font-download rejection
branch was added. Disposal still prevents late scrolling or focus changes.

The fixed-point `prepareMdxSource` repair is unchanged. Reconstruction, idempotence,
malformed-input rejection and real MDX rendering regressions remain in the suite.

## Fresh local validation

Node **24.22.1**, repository runtime and validation scripts:

| Measure | Pre-change capture | After cleanup |
| --- | ---: | ---: |
| Unit/component tests | 456 in 42 files | **486 in 44 files** |
| Executable lines | 1,752 / 1,752 | **1,790 / 1,790** |
| Branch outcomes | 1,543 / 1,543 | **1,541 / 1,541** |
| Statements | 2,036 / 2,036 | **2,092 / 2,092** |
| Functions | 629 / 629 | **657 / 657** |
| Eligible source files | 87 | **87** |
| Uncovered lines / branches | 0 / 0 | **0 / 0** |

The 30 additional tests comprise 21 captured compatibility checks, six fingerprint
cases, and three additional URL-validation cases. Named helpers add executable
lines/functions while equivalent condition simplifications reduce total branch
outcomes by two. All four metrics remain exactly 100%, including each eligible
file, and the unchanged LCOV guard verifies raw counts and complete scope.

- `npm run lint`, `npm run typecheck`, `npm run test:coverage`: pass.
- `npm run build`: pass, 40 generated pages.
- `npm run size-check`: pass, **870 KB JS / 58 KB CSS**; JS budget 1,500 KB.
- `npm audit` and `npm audit --omit=dev`: **zero vulnerabilities**.
- `npm run e2e -- --workers=2 --reporter=line`: **70 passed** against a freshly
  restarted production build. BM25 opens the disclosure, focuses the actual cell,
  clears the sticky header and adds one history entry. Static embeddings,
  article-body matches, same-page/repeated selection after collapse, copied URLs,
  refresh, back/forward, Escape restoration, new tabs, mobile horizontal visibility,
  reduced motion, and obsolete-target fallback all pass.
- Remote workflow results are recorded in the associated PR and final delivery
  report, so this source document does not imply that an unrun remote analysis
  has passed.

## Sonar scope and remaining reconciliation

The supplied `master` view showed **26 Open/Confirmed new-code findings** and
**32 All issues**. The latest accessible pre-cleanup GitHub Sonar check referred
to `ba84b4d`, failed Reliability C, and exposed no issue annotations. Actual issue
keys and the six additional findings were not available through that check.
An unauthenticated empty API result is not evidence of zero issues.

The owner will manually verify issue closure in Sonar. GitHub CI checks the actual
PR revision, imports revision-bound LCOV, and runs CodeQL and Sonar analysis.
A green PR gate or zero new PR issues does **not** establish closure of every
existing issue on `master`. No merge is part of this task, so default-branch
post-merge analysis remains a separate step. The six findings outside the supplied
list remain unidentified here and require the owner's inventory review.
