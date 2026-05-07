# dbraun.io Current State Reassessment

## Executive Verdict

The site is launch-worthy as a consulting/portfolio site. It is not "finished," but the remaining work is mostly proof density, production verification, and cleanup, not core positioning or code quality. Local and live are effectively aligned: `dev` is clean, `HEAD` is already an ancestor of `origin/master`, `HEAD..origin/master` has no file diff, and live `www.dbraun.io` now shows the restored VIFG-first, workflow-first version. The biggest remaining risk is not the UI, the stack, or the homepage headline; it is that several projects still rely on described proof instead of embedded proof artifacts. The second risk is operational: analytics collection is currently blocked by CSP evidence in tracked Playwright logs, and production contact delivery still needs a controlled live-send check if you are going to rely on the form for real leads. Stop obsessing over hero copy, extra UI polish, and the dual-site/niche roadmap before the current proof layer is stronger. Fix immediately: verify the live contact form end to end, decide whether GA should actually collect, and add one real proof pack to DealerFlow or VIFG. WeatherForge and RAGeATM are now framed honestly as secondary technical proof; do not promote them like production systems until the screenshots and usage proof exist.

## Current Git / Repo State

| Item | Current State | Evidence | Assessment |
|---|---|---|---|
| Current branch | `dev` tracking `origin/dev` | `git status --short --branch` -> `## dev...origin/dev` | Clean local branch. |
| Dirty/staged files before audit | None | Initial `git status --short --branch` only printed branch line | Clean. |
| Dirty/staged files after verification | Only this report is now untracked | Post-verification `git status --short --branch` printed clean branch state before the report; final status shows `?? docs/dbraun-current-state-reassessment.md` | Commands did not dirty tracked source files, and no source/application file was modified. |
| Relation to deployed branch | `HEAD` is ancestor of `origin/master`; `HEAD..origin/master` has no diff | `git merge-base --is-ancestor HEAD origin/master` returned success; `git diff --stat HEAD..origin/master` empty | Local source and master content are aligned. |
| Live state | Live homepage/case-studies/resume match restored direction | `curl https://www.dbraun.io/case-studies` found VIFG, WeatherForge, RAGeATM, stage sections; `curl -I -L https://www.dbraun.io/resume.pdf` returned 200 | Live is not behind local in the areas checked. |
| Ignored generated files | `.next`, `.next-dev`, `playwright-report`, `test-results`, `.env.local`, `.DS_Store`, `src/.DS_Store`, `tsconfig.tsbuildinfo`, `node_modules` | `.gitignore:11-19`, `.gitignore:24-43`, `git status --ignored --short` | Correctly ignored, but `.next` is ~793M and `.next-dev` is ~1.0G local noise. |
| Suspicious tracked generated files | `.playwright-mcp/console-*.log` are tracked | `git ls-files .playwright-mcp` returned three log files; `git log -- .playwright-mcp` -> `8071d61` | These should not have been committed. Do not delete in this audit, but remove in a cleanup commit later. |
| Casing-sensitive file issues | No duplicate tracked paths differing only by case | case-folded `git ls-files` duplicate check returned no output | No current casing collision. |
| Deployment branch | CI triggers on `master`; `origin/HEAD -> origin/master`; Vercel live responds | `.github/workflows/ci.yml:3-7`, branch graph, live curl | Fine if PRs continue merging `dev` to `master`. |
| Local install consistency | Local `node_modules` is not lockfile-clean | `npm ci --dry-run` would change 40 packages and add 6; `package-lock.json:8621-8622` has Next 16.2.3 while local `npm ls next` shows 16.2.4 | Verification passed, but it used local installed versions, not exactly `npm ci` versions. |

## Verification Results

| Command | Result | Notes |
|---|---:|---|
| `git status --short --branch` | Pass | Clean at start and after verification; final report file is the only intended new untracked worktree change. |
| `node --version` / `npm --version` | Pass | Local used Node `v25.9.0` and npm `11.12.1`; repo has `.nvmrc` = `20` and `package.json` requires `>=20.9.0`. |
| `npm run lint` | Pass | ESLint completed with no reported issues. |
| `npm test` | Pass | Vitest: 5 test files, 68 tests passed. |
| `npx tsc --noEmit` | Pass | No TypeScript output or errors. |
| `npm run build` | Pass | Next built successfully, generated 32 static pages/routes. Build used local installed Next `16.2.4`; lockfile pins `16.2.3`. |
| `npm run size-check` | Pass | JS 849 KB, CSS 52 KB, 651 KB under the 1500 KB JS budget. |
| `npx playwright test e2e/smoke.spec.ts e2e/a11y.spec.ts --project=chromium` | Pass | 18 tests passed. Warnings only: local `FORCE_COLOR`/`NO_COLOR` warning and Next smooth-scroll warning. |
| `npm audit --audit-level=high` | Pass | Exit 0 at high threshold, but reported 2 moderate PostCSS advisories. Do not blindly run `npm audit fix --force`; it suggested a breaking downgrade path. |
| `npm ci --dry-run` | Pass | No source changes, but it proved local `node_modules` drift from lockfile. |
| Live URL checks | Pass | `www.dbraun.io/`, `/resume.pdf`, VIFG, time2move, arklandscaping, WeatherForge GitHub, and RAGeATM GitHub responded successfully. |

Production contact delivery was not tested because that would submit a real live inquiry. The e2e contact tests mock `/api/contact` (`e2e/a11y.spec.ts:61-90`), so they prove UI behavior, not Resend delivery.

## TODO.md Audit

| TODO Item | Status | Keep / Rewrite / Delete | Priority | Evidence | Notes |
|---|---|---|---|---|---|
| Add at least one real artifact to each flagship project | Still valid | Rewrite | P1 high ROI | `TODO.md:20`; WeatherForge screenshot placeholder `src/data/systems.ts:211-234`; DealerFlow missing artifacts `src/data/systems.ts:1077-1085`; VIFG current proof `src/data/systems.ts:1166-1175` | Correct direction, wrong severity. Not a launch blocker, but it is the main credibility unlock. Focus first on DealerFlow or VIFG, not "each flagship." |
| Add truthful metrics or bounded operational facts to top projects | Partially valid | Keep | P1 high ROI | `TODO.md:21`; WeatherForge has metrics `src/data/systems.ts:129-155`; RAGeATM has metrics `src/data/systems.ts:298-323`; VIFG missing bounded facts per `docs/audits/elite-audit-2026-04-15.md:183-188` | WeatherForge/RAGeATM are better now. VIFG and DealerFlow still need human-sourced operational facts. |
| Build one heavyweight case study for the strongest flagship project | Partially valid | Rewrite | P1 high ROI | `TODO.md:22`; case-study detail template already exists `src/app/case-studies/[slug]/page.tsx:112-260`; latest audit says DealerFlow is the trust split point `docs/audits/elite-audit-2026-04-15.md:231-240` | Do not build another generic "heavyweight" page. Build a proof pack inside the existing DealerFlow or VIFG page. |
| Confirm live/demo URLs and project-state truthfulness | Still valid | Keep | P1 high ROI | `TODO.md:23`; current state labels in `src/data/systems.ts:217`, `src/data/systems.ts:558`, `src/data/systems.ts:631`, `src/data/systems.ts:1031`, `src/data/systems.ts:1116`; live URL checks returned 200 | Link health is good today. Truthfulness still needs owner review because "Beta Pilot," "Active Build," and "Production" are claims only you can fully verify. |
| Human-review ownership wording line by line | Still valid | Keep | P2 polish | `TODO.md:24`; ownership claims in `src/data/systems.ts:219`, `src/data/systems.ts:560`, `src/data/systems.ts:632`, `src/data/systems.ts:1036`, `src/data/systems.ts:1123` | Worth doing once. It is overclaim-risk reduction, not a reason to delay launch. |
| Expand blog cross-linking to flagship systems | Still valid | Rewrite | P2 polish | `TODO.md:30`; search found no flagship links inside `src/content/blog`; writing index only links to case studies/contact `src/app/writing/page.tsx:28-29` | Useful, but proof assets matter more. Add links opportunistically after proof pages are stronger. |
| Add structured data / schema where useful | Partially valid | Rewrite | P2 polish | `TODO.md:31`; Person/WebSite schema exists `src/app/layout.tsx:87-143`; breadcrumbs exist `src/app/case-studies/[slug]/page.tsx:65-90`; sitemap exists `src/app/sitemap.ts:11-58` | Do not add schema for its own sake. Add Service/CreativeWork only where it maps to real pages and proof. |
| Verify production headers, contact form behavior, and deployed live behavior after push | Partially valid | Keep | P1 high ROI | `TODO.md:32`; live headers returned CSP/HSTS/security headers; Playwright checks headers `e2e/smoke.spec.ts:95-110`; contact delivery still untested live | Headers and live routes are good. Controlled live contact send remains the missing production verification. |
| Create or formalize a screenshot / diagram asset pipeline | Still valid | Rewrite | P2 polish | `TODO.md:33`; architecture doc TODO is outdated `docs/architecture/README.md:7-12`; screenshot placeholders are explicit `src/app/case-studies/[slug]/page.tsx:565-581` | Useful after you capture the first new proof pack. Do not build process before assets. |
| Add a privacy page if needed | Partially valid | Rewrite | P2 polish | `TODO.md:39`; contact page has only a privacy blurb `src/components/sections/contact.tsx:417-419`; GA component exists `src/components/analytics/google-analytics.tsx:7-57`; robots disallows `/api/` only `src/app/robots.ts:3-12` | If GA and contact intake are live, a simple privacy page is reasonable. Not a launch blocker. |
| Add lightweight analytics | Partially valid | Rewrite | P1 high ROI | `TODO.md:40`; GA component exists `src/components/analytics/google-analytics.tsx:7-57`; CSP excludes `https://www.google.com` in `next.config.ts:12`; tracked logs show GA collect blocked in `.playwright-mcp/console-2026-05-06T14-20-10-684Z.log:1` | Analytics is already added. The task is to fix/verify collection or disable it. |
| Add testimonials only if they are real and strong | Still valid | Keep | P3 backlog | `TODO.md:41`; latest audit says no testimonials/client proof `docs/audits/elite-audit-2026-04-15.md:116-125` | Strong testimonials would help consulting trust. Weak ones would hurt. Not immediate. |
| Add more case-study visuals where they genuinely improve clarity | Still valid | Merge | P1 high ROI | `TODO.md:42`; WeatherForge placeholder `src/data/systems.ts:211-234`; DealerFlow planned artifacts `src/data/systems.ts:1077-1085`; VIFG evidence set `src/data/systems.ts:1166-1175` | Merge this into "real proof artifacts." Visuals beat more prose. |
| Run extra content experiments | Bad idea / low ROI | Delete | Delete | `TODO.md:48`; latest audit says proof remains the bottleneck `docs/audits/elite-audit-2026-04-15.md:151-166` | Content experiments are a distraction until the proof gap is closed. |
| Publish more thought-leadership posts | Still valid | Rewrite | P3 backlog | `TODO.md:49`; writing depth still thin per `docs/audits/elite-audit-2026-04-15.md:70`, `docs/audits/elite-audit-2026-04-15.md:157` | Useful later. More posts will not fix weak project proof. |
| Apply non-essential UI polish | Bad idea / low ROI | Delete | Delete | `TODO.md:50`; lint/test/build/e2e pass; homepage/services/contact already buyer-oriented in `src/app/page.tsx:60-80`, `src/app/services/page.tsx:51-58`, `src/app/contact/page.tsx:18-26` | Stop. This is where productive-feeling churn will waste time. |

## Other Recommendations Found

| Source File | Recommendation / Issue | Priority | Still Valid? | Evidence | Action |
|---|---|---|---|---|---|
| `docs/audits/elite-audit-2026-04-15.md` | VIFG needs a real release artifact, another real surface screenshot, and bounded operational facts. | P1 high ROI | Yes | `docs/audits/elite-audit-2026-04-15.md:183-188`; current VIFG proof list `src/data/systems.ts:1128-1175` | Add one concrete VIFG proof pack: screenshot, release/deploy artifact, uptime/release cadence/accessibility fact. |
| `docs/audits/elite-audit-2026-04-15.md` | DealerFlow needs lifecycle diagram, notification/queue artifact, walkthrough, and bounded pilot facts. | P1 high ROI | Yes | `docs/audits/elite-audit-2026-04-15.md:200-205`; `src/data/systems.ts:1041-1085` | Highest proof ROI if DealerFlow is still real and defensible. |
| `docs/audits/elite-audit-2026-04-15.md` | Make DealerFlow undeniable as the most important next move. | P1 high ROI | Still mostly valid | `docs/audits/elite-audit-2026-04-15.md:231-247` | Do this if DealerFlow is the second flagship you want reviewers to trust. Otherwise apply the same proof-pack logic to VIFG or WeatherForge. |
| `docs/audits/elite-audit-2026-04-15.md` | Contact section server-rendered at opacity 0. | Delete | Stale | Old issue at `docs/audits/elite-audit-2026-04-15.md:95-98`; current contact has `initial={{ opacity: 1 }}` at `src/components/sections/contact.tsx:137-140` and `src/components/sections/contact.tsx:343-346` | Retire this. It has already been fixed. |
| `docs/audits/elite-audit-2026-04-15.md` | README drifted away from product story. | P2 polish | Partially stale | Old issue `docs/audits/elite-audit-2026-04-15.md:91-93`; current README is consulting-focused `README.md:3-15`, but omits RAGeATM in current in-progress list `README.md:22-27` | Light README refresh only. Do not overwork it. |
| `docs/dbraun-live-comparison-audit.md` | Restore VIFG-first proof hierarchy, workflow-first copy, CTA, resume link, and stage-aware case studies. | Delete | Done | Recommendations `docs/dbraun-live-comparison-audit.md:97-115`; restoration report confirms fixes `docs/dbraun-selective-restoration-report.md:3-10`, `docs/dbraun-selective-restoration-report.md:39-53`; current source `src/app/case-studies/page.tsx:75-187` | Treat the live-comparison audit as historical. Do not keep re-litigating it. |
| `docs/dbraun-live-comparison-audit.md` and `docs/dbraun-selective-restoration-report.md` | Verify/fix GA CSP collection. | P1 high ROI | Yes | `docs/dbraun-live-comparison-audit.md:112`; `docs/dbraun-selective-restoration-report.md:63-64`; `next.config.ts:12`; tracked log `.playwright-mcp/console-2026-05-06T14-20-10-684Z.log:1` | Add the actual GA collect endpoint to CSP or turn GA off until it matters. Verify with browser console. |
| `docs/dbraun-selective-restoration-report.md` | Contact page repeats workflow headline. | P3 backlog | Valid but low ROI | `docs/dbraun-selective-restoration-report.md:65`; current repetition `src/app/contact/page.tsx:18-26` and `src/components/sections/contact.tsx:149-154` | Ignore unless editing contact copy anyway. Clarity beats cleverness here. |
| `docs/dbraun-selective-restoration-report.md` | Technical case-study detail pages are dense. | P2 polish | Yes | `docs/dbraun-selective-restoration-report.md:66`; detail page sections `src/app/case-studies/[slug]/page.tsx:122-260`; RAGeATM ladder `src/data/systems.ts:376-556` | Keep density behind stage labels/collapses. Do not make homepage more technical. |
| `docs/dbraun-selective-restoration-report.md` | Playwright MCP logs were generated and left. | P2 polish | More serious than reported | Report says untracked `docs/dbraun-selective-restoration-report.md:67`; `git ls-files .playwright-mcp` proves they are tracked | In a later approved cleanup, remove tracked logs and add `.playwright-mcp/` to `.gitignore`. |
| `docs/architecture/README.md` | Decide which project diagrams to build first. | P3 backlog | Mostly stale | `docs/architecture/README.md:7-12` recommends Security Lab and PDF Audiobook, which are not current top proof priorities | Rewrite or retire. Current diagram priority is DealerFlow, VIFG, WeatherForge, then DGM/StormIQ. |
| `docs/rageatm-github-followup.md` | Mirror RAGeATM retrieval ladder to GitHub README/docs. | P3 backlog | Yes, low commercial ROI | `docs/rageatm-github-followup.md:3-13`; current RAGeATM ladder in `src/data/systems.ts:376-556` | Do later if RAGeATM repo is being reviewed. It is not buyer-facing urgency. |
| `docs/dual-site-strategy.md` | Split `dbraun.io` and People's Connection LLC into separate sites. | P3 backlog | Conditional | `docs/dual-site-strategy.md:5-15`, `docs/dual-site-strategy.md:98-116` | Valid only when offers/pricing/CRM are ready. Premature second-site work is a distraction right now. |
| `docs/portfolio-vs-business-matrix.md` | Build business conversion stack, offers, case-study split, SEO clusters. | P3 backlog | Conditional | `docs/portfolio-vs-business-matrix.md:26-31` | Useful business strategy, not current `dbraun.io` launch work. |
| `docs/ia-sitemap.md` | Add `work-with-peoples-connection` bridge page and business IA. | P3 backlog | Stale for current repo | `docs/ia-sitemap.md:30-67`, `docs/ia-sitemap.md:136-145`; current nav is Home/Services/Case Studies/Why/Contact `src/data/profile.ts:84-90` | Ignore until there is a real business domain and buying path. |
| `docs/cross-domain-architecture.md` | Use UTM cross-domain links, shared analytics, dual-format case studies. | P3 backlog | Conditional | `docs/cross-domain-architecture.md:51-66`, `docs/cross-domain-architecture.md:85-122` | Good later. First fix current-site analytics and proof. |
| `docs/execution-playbook.md` | Build a separate business site in week 1 and add cross-domain CTAs/events. | P3 backlog | Too broad now | `docs/execution-playbook.md:64-86`, `docs/execution-playbook.md:167-175` | Do not start this until current proof/contact/analytics are stable. |
| `docs/niches/*` | Pick a niche, build flagship projects, offer pages, and cross-domain proof. | P3 backlog | Valid but not immediate | Niche deliverables `docs/niches/README.md:46-64`; selection priority `docs/niches/00-selection-framework.md:36-45`; roadmap `docs/niches/90-day-niche-roadmap.md:14-54` | Keep as strategy. Do not let it compete with proof-pack work. |
| `README.md` / `.env.example` / `src/lib/resend.ts` | Env docs are slightly inconsistent. | P2 polish | Yes | README uses `CONTACT_EMAIL` `README.md:81-82`; `.env.example` uses `CONTACT_NOTIFICATION_EMAIL`, `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME` `.env.example:5-10`; code supports fallback `src/lib/resend.ts:38-56` | Clarify docs later. Not a runtime blocker. |
| `src/components` / `src/hooks` | Some components/hooks appear unused. | P3 backlog | Yes, low ROI | Search found declarations for `ProjectCard`, `CurrentStatus`, `MobileSectionDisclosure`, `ImageLightbox`, `useGSAP`, `useScrollSpy` without imports elsewhere | Cleanup later only if you are already doing repo hygiene. Not buyer-facing. |

## Buyer-Facing Site Assessment

| Category | Grade | Reason |
|---|---:|---|
| Above-the-fold clarity | A- | Homepage says "Workflow automation for small and midsized businesses" and uses the headline from `src/data/profile.ts:70`; CTA is `Book a Call` at `src/app/page.tsx:73-80`. |
| Homepage explains what you sell | A- | It clearly sells workflow automation, system integration, data movement, and practical AI/dashboard support as supporting capabilities `src/app/page.tsx:28-45`, `src/app/page.tsx:182-217`. |
| Project trust vs confusion | B | VIFG leads and projects are stage-labeled `src/app/case-studies/page.tsx:75-187`, but the site still has many R&D/prototype projects, which can dilute the buyer's attention. |
| WeatherForge/RAGeATM credibility framing | B+ | Both are labeled Prototype / Academic Project `src/data/systems.ts:114`, `src/data/systems.ts:283`; metrics and limitations are explicit `src/data/systems.ts:129-155`, `src/data/systems.ts:361-369`. Missing screenshots keep them from feeling fully real. |
| Contact conversion quality | B+ | Form asks for workflow, bottleneck, users, constraints, and outcome `src/components/sections/contact.tsx:70-72`, `src/components/sections/contact.tsx:190-252`; optional call exists `src/components/sections/contact.tsx:306-327`. Live delivery still needs a real submission test. |
| Resume/link reliability | A- | `resumeUrl` is lowercase `src/data/social-links.ts:23`; e2e verifies asset and link `e2e/smoke.spec.ts:64-82`; live `/resume.pdf` returned 200. Uppercase `/Resume.pdf` is 404, but no current link uses it. |
| Mobile/responsive risk | B | Playwright only configures Desktop Chrome `playwright.config.ts:14-18`; previous reports manually checked mobile, and current e2e passed, but mobile screenshots were not part of this audit. |
| Visual consistency | B+ | Consistent restrained cards, badges, and stage sections. The site is still card-heavy, but not incoherent. |
| Content hierarchy | B+ | VIFG first on home/case studies `src/app/page.tsx:110-180`, `src/app/case-studies/page.tsx:82-167`; technical proof is secondary `src/app/page.tsx:219-262`. |
| Consulting credibility | B | Strong enough for a first call, not yet premium-trust. Latest audit remains accurate: no testimonials, no scoped engagement examples, no pricing logic, and limited client outcome proof `docs/audits/elite-audit-2026-04-15.md:116-125`. |

Blunt buyer read: the site now tells a business what you do and why to contact you. The gap is not clarity. The gap is proof that the work repeatedly produced real operational outcomes.

## Technical Health Assessment

- Build/lint/test status: strong. Lint, TypeScript, Vitest, build, bundle-size check, and Playwright all passed.
- Routing/link health: strong for tested routes. Redirects exist in `next.config.ts:63-105`; e2e verifies legacy routes and 404 `e2e/smoke.spec.ts:84-115`; live resume and external proof links responded.
- Accessibility risk: moderate. Axe runs only home and writing for serious/critical violations `e2e/a11y.spec.ts:24-44`; contact form labels/live regions are tested `e2e/a11y.spec.ts:46-110`. Services, case studies, detail pages, and mobile are not covered by axe.
- SEO metadata: good. Global metadata is buyer-oriented `src/app/layout.tsx:26-85`; Person/WebSite structured data exists `src/app/layout.tsx:87-143`; sitemap and robots exist `src/app/sitemap.ts:5-58`, `src/app/robots.ts:3-12`. Service/CreativeWork schema is optional polish.
- Performance risk: low from current evidence. Bundle check is comfortably under budget. No Lighthouse command is configured, so no Lighthouse score should be claimed.
- Dependency/tooling risk: moderate. Local runtime and `node_modules` drift from lockfile; `npm ci --dry-run` would change many packages. `package-lock.json` has PostCSS 8.5.8 (`package-lock.json:9096-9097`) and `npm audit --audit-level=high` still reports moderate PostCSS advisories.
- Playwright/e2e usefulness: good but narrow. It protects nav, VIFG proof hierarchy, CTA, resume PDF, redirects, headers, 404, and basic a11y. It does not catch GA CSP console errors, live production contact delivery, broad mobile layout, or full-site axe issues.
- CI/CD readiness: good. CI runs lint, typecheck, tests, audit high, build, size-check, e2e, and CodeQL on `master`/PRs to `master` (`.github/workflows/ci.yml:3-83`, `.github/workflows/ci.yml:93-112`). It will not fail on moderate audit advisories.
- Dead code/unnecessary complexity: present but low risk. Some exported components/hooks appear unused. This is cleanup debt, not commercial debt.

## Launch Blockers

| Blocker | Why It Matters | Exact Fix | Files Likely Involved |
|---|---|---|---|
| None confirmed by this audit | Local verification passed and live route/link checks passed. | Do not invent blockers. Before outreach or paid traffic, perform a controlled live contact-form submission and confirm receipt. | `src/app/api/contact/route.ts`, `src/lib/resend.ts`, production env |

## Highest-ROI Next Actions

| Rank | Task | Impact | Effort | Why Now |
|---:|---|---:|---:|---|
| 1 | Verify live contact form delivery with one controlled production submission. | High | Low | Contact is the conversion path; e2e only mocks it. |
| 2 | Fix GA CSP or disable GA until you care about collection. | Medium | Low | Analytics is already wired, but tracked logs show collection blocked by CSP. |
| 3 | Add a DealerFlow proof pack: short walkthrough, lifecycle diagram, notification/queue artifact, and bounded pilot facts. | High | Medium | Latest audit identifies DealerFlow as the current trust split point. |
| 4 | Add VIFG bounded operating facts and one real delivery artifact beyond the deployment diagram. | High | Medium | VIFG is the strongest proof. More concrete facts would make it much harder to dismiss. |
| 5 | Add WeatherForge dashboard screenshots and data-refresh/validation notes. | Medium | Medium | WeatherForge has strong metrics but still uses screenshot placeholders. |
| 6 | Add a small RAGeATM demo proof surface or terminal evidence, then mirror the ladder to GitHub. | Medium | Low | RAGeATM is honest and secondary; a visible demo would make it feel less abstract. |
| 7 | Update README/TODO/docs to retire stale audit recommendations and reflect current RAGeATM/proof state. | Medium | Low | The repo story should stop fighting the current site story. |
| 8 | In a later approved cleanup, remove tracked `.playwright-mcp` logs and ignore the directory. | Medium | Low | Tracked generated logs make the repo look careless. |
| 9 | Broaden Playwright to include mobile viewport, services/case-study axe scans, and console-error checks. | Medium | Medium | Current e2e is useful but misses the GA CSP problem and most pages. |
| 10 | Add a simple privacy page if GA/contact intake remain live. | Low | Low | It is a trust polish item for a consulting site with analytics and project intake. |

## Things to Stop Doing / Deprioritize

- Stop re-auditing the homepage promise. The current promise is clear enough: workflow automation and systems consulting.
- Stop treating WeatherForge/RAGeATM as launch blockers. They are correctly labeled as secondary technical proof.
- Stop building a second business site before the current site has verified contact delivery, working analytics if desired, and stronger proof artifacts.
- Stop adding thought-leadership posts as a substitute for proof. More prose will not fix "show me it was real."
- Stop adding non-essential UI polish. Lint/test/build/e2e pass and the buyer flow is coherent.
- Stop expanding the RAGeATM capability ladder. It is already collapsed and safely caveated; more academic detail will not sell consulting work.
- Stop relying on labels as artifacts. "Notification pipeline" is not a notification artifact. "Release artifact" is not a release artifact.
- Stop trusting local `node_modules` as the truth. Use Node 20 and a clean `npm ci` environment when doing dependency/security work.

## Proposed TODO.md Replacement

Do not replace `TODO.md` yet. This is the proposed replacement structure.

```md
# dbraun.io TODO

## P0 Launch Blockers

- [ ] Verify the live contact form end to end with one controlled production submission.
- [ ] Decide whether Google Analytics should collect now. If yes, fix CSP and verify no browser console block; if no, disable GA until needed.
- [ ] Before dependency/security work, verify with Node 20 and a clean `npm ci` environment so local drift does not hide lockfile issues.

## P1 Buyer/Portfolio Improvements

- [ ] Add a DealerFlow proof pack: walkthrough GIF/video, lifecycle diagram, notification/queue artifact, and bounded pilot facts.
- [ ] Add VIFG bounded operational facts: release cadence, maintenance scope, accessibility evidence, traffic/user range, uptime window, or equivalent defensible facts.
- [ ] Add one real VIFG artifact beyond the deployment diagram.
- [ ] Add WeatherForge dashboard screenshots and reproducible data-refresh/validation notes.
- [ ] Add a small RAGeATM demo surface or terminal/log proof, then mirror the retrieval ladder into the RAGeATM GitHub README/docs.
- [ ] Human-review ownership, status, and production/pilot/prototype wording line by line.
- [ ] Re-check public proof links monthly: VIFG, time2move, arklandscaping, WeatherForge GitHub, RAGeATM GitHub, resume PDF.

## P2 Technical Polish

- [ ] Broaden Playwright coverage to mobile viewport checks, services/case-study axe scans, and console-error detection.
- [ ] Clarify README/env docs around `CONTACT_NOTIFICATION_EMAIL`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME`, Upstash, and GA.
- [ ] Add Service or CreativeWork schema only where it maps to real pages and proof.
- [ ] Add a simple privacy page if GA/contact intake remain live.
- [ ] Formalize screenshot/diagram naming and placement after the first new proof pack exists.
- [ ] In an approved cleanup commit, remove tracked `.playwright-mcp` logs and ignore that directory.

## P3 Backlog / Later

- [ ] Build the separate People's Connection LLC site only when offers, pricing, CRM, and cross-domain measurement are ready.
- [ ] Use the niche playbooks after one current proof pack is complete.
- [ ] Add blog cross-links to case studies when the linked case studies have stronger artifacts.
- [ ] Publish more thought-leadership only after proof density improves.
- [ ] Add testimonials only if they are real, specific, and strong.
- [ ] Do non-essential UI polish only when attached to a real buyer-facing improvement.

## Done / Retired

- [x] VIFG restored as first public production proof.
- [x] Workflow-first homepage/contact/services framing restored.
- [x] Primary CTA restored to `Book a Call`.
- [x] Resume URL fixed to `/resume.pdf`.
- [x] Case-study index restored to production/pilot/prototype/R&D hierarchy.
- [x] WeatherForge and RAGeATM kept secondary and honestly labeled.
- [x] RAGeATM retrieval ladder added collapsed by default with overclaim guardrails.
- [x] Header, footer, metadata, and social card restored to workflow automation consulting.
- [x] Old live-vs-local restoration recommendations retired as historical context.
```

## Final Recommendation

1. Today: verify live contact delivery, then fix or intentionally disable GA collection. After that, choose the first proof pack target: DealerFlow if the pilot is defensible, VIFG if you want the safest public-production win.
2. This week: add one real proof pack, update TODO/README/docs to retire stale recommendations, and schedule a cleanup commit for tracked Playwright logs.
3. What can wait: dual-site strategy, niche roadmap execution, more thought leadership, testimonials, privacy page, schema polish, and UI refinements.
4. Ship/deploy after the P0 checks. For serious outreach, do at least one P1 proof-pack item first; the site is credible now, but the proof layer is what will move it from "good" to "hard to dismiss."
