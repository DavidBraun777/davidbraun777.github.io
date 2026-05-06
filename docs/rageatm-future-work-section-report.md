# RAGeATM Future Work Section Report

## Summary
Added an optional, collapsed “Future Work: Retrieval Capability Ladder” section to the RAGeATM case-study detail page. The content is stored on the RAGeATM system data object and rendered conditionally by the shared case-study detail template, so no other case study gets the ladder unless its data explicitly includes it.

The section includes the safe TF-IDF/BM25 vs embedding/LLM-assisted retrieval claim, the overclaim guardrail, a 12-level retrieval capability ladder, a clean interpretation table, heuristic-percentage disclaimer, and compact future-work paragraph.

## Files Changed
| File | Change |
|---|---|
| `src/data/systems.ts` | Added optional retrieval capability ladder types and RAGeATM-specific ladder data. |
| `src/app/case-studies/[slug]/page.tsx` | Renders the optional ladder through the existing disclosure panel with mobile-safe horizontal table scrolling. |
| `docs/rageatm-github-followup.md` | Added reminder to mirror the ladder into the RAGeATM GitHub README or docs later. |
| `docs/rageatm-future-work-section-report.md` | Added this implementation report. |

## UI Behavior
The section uses the existing `DisclosurePanel` component, which renders native `details` / `summary` markup. It is collapsed by default. The wide ladder table and clean interpretation table are wrapped in horizontal overflow containers so mobile pages do not break layout.

## Strategic Check
- RAGeATM remains secondary technical proof.
- VIFG remains primary production proof.
- No homepage or case-study index proof hierarchy was changed.
- No production-readiness overclaim was introduced.
- The percentages are labeled as heuristic gauges, not benchmark claims.
- The section does not claim that LLMs truly understand the question beneath the question.
- The section is intentionally collapsed. If it were expanded by default, it would make the page feel more like an academic/research portfolio than a consulting site.

## Verification
- `npm run lint`: passed.
- `npm test`: passed, 5 files and 68 tests. Existing mocked negative-path logs appeared for rate-limit and contact-mail tests.
- `npm run build`: passed. Next.js generated all static pages and case-study routes successfully.
- Rendered check: RAGeATM shows the ladder collapsed by default, expands cleanly, and has no full-page horizontal overflow on desktop or 390px mobile.
- Rendered check: VIFG does not show the ladder and still shows public production proof.
- Rendered check: the case-study index still shows VIFG before RAGeATM and does not expose the ladder.
