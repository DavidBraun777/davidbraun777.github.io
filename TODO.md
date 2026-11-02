# dbraun.io backlog

Reviewed November 2, 2026. This list tracks remaining work, not unverified
portfolio claims or a queue for another homepage redesign. Setup and verification
commands live in [README](README.md); operating rules live in
[maintenance](docs/maintenance.md).

## Operational checks

- [ ] Verify real contact delivery with one explicitly authorized, controlled
  production submission; record the tested deployment, receipt and failure/retry
  behavior. Mocked tests and successful builds do not establish delivery.
- [ ] Confirm production Resend sender/recipient and Upstash configuration remain
  correct. Verify fail-closed behavior in a controlled environment.
- [ ] Decide whether GA should collect data. If enabled, verify its actual behavior
  and publish an accurate privacy notice based on the deployed setup; if disabled,
  keep `NEXT_PUBLIC_GA_ID` unset. Do not invent retention or compliance claims.
- [ ] Review branch protection/rulesets and required checks against current GitHub
  settings. Historical audit observations do not establish today's settings.
- [ ] Check current Sonar overall/new-code results for the exact deployed revision;
  local V8 coverage is a separate measurement.

## Evidence that would materially strengthen the portfolio

Add only artifacts or measurements that actually exist and are cleared for public
release. Prioritize one complete case study over many incomplete additions.

- [ ] DealerFlow: walkthrough, lifecycle/notification evidence, bounded pilot facts
  and David's operational responsibility. Retain the existing real screenshot.
- [ ] VIFG: one additional useful real artifact and bounded operational facts such
  as release cadence, maintenance scope, measured accessibility or a defined
  reliability window. No inferred uptime, traffic or adoption figures.
- [ ] WeatherForge: actual dashboard captures and reproducible data preparation/
  validation instructions; retain the team attribution and implementation role.
- [ ] RAGeATM: inspectable run output and a broader evaluation set with failure
  cases. The current seven-question check is not general accuracy. Any separate
  repo update should use the qualitative comparison, not unsupported percentages.
- [ ] A real deployed AI/data workflow with evaluation, failure handling, latency,
  cost where relevant, monitoring and a measurable user/operational result.
- [ ] Research: update the accepted conference work only when public proceedings,
  DOI or other verified records become available; keep restricted data private.
- [ ] Testimonials or commercial outcomes only when real, specific and approved.

## Ongoing maintenance

- [ ] Review public project, résumé, research and scheduling links monthly,
  including VIFG, ARK Landscaping, Matt Laur, WeatherForge and RAGeATM.
- [ ] Update actual job/degree/credential changes and separately reviewed résumé
  PDFs when they occur. Verify external profiles before changing them.
- [ ] Record a production performance baseline if optimizing speed; the aggregate
  bundle budget is not a Lighthouse score or field Core Web Vitals measurement.
- [ ] Perform periodic manual keyboard and physical-phone checks alongside the
  automated Chromium/mobile WebKit journeys and axe checks.
- [ ] Keep dependency updates compatible with Node 24 and the committed lockfile;
  run the existing audit, coverage and browser gates without weakening them.
- [ ] Track [the minimatch amplification advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249)
  in the development lint toolchain. The November 2 audit still reports moderate
  findings through older transitive minimatch consumers; the production-only
  audit reports none. Do not apply the audit tool's suggested breaking ESLint
  downgrade or force incompatible major overrides merely to clear the report.

## Optional later work

- [ ] Build a separate People's Connection LLC site when its scope, offers and
  operations are ready. Planning references do not establish a live second site.
- [ ] Use a niche playbook after a current evidence pack is complete.
- [ ] Add new articles when there is a specific engineering decision or result to
  explain. Link existing articles to relevant real evidence.

## Implemented decisions to preserve

- [x] Wide desktop homepage, responsive phone layout and complete footer restored;
  project showcases stay on Work.
- [x] ARK Landscaping and Matt Laur live client stories included in Work.
- [x] Time2Move public content uses project-level historical attribution and keeps
  personal client identifiers/private materials out.
- [x] VIFG production, DealerFlow pilot and academic/R&D work remain distinct.
- [x] Approved industry résumé and research CV have canonical `/resumes/` URLs,
  with legacy résumé redirects retained.
- [x] Unsupported retrieval capability percentages and public screenshot
  placeholders removed; qualitative tradeoffs and actual limitations retained.
- [x] Contact feedback persists, failed drafts are retained, retry guidance uses
  the API response, and booking links require a valid configuration.
- [x] Article revision dates are separate from publication dates.
- [x] Current README/docs separated from historical reports and optional plans.
