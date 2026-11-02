# Portfolio maintenance

Reviewed against the repository on **November 2, 2026**. This is a maintenance
guide, not a claim that every external service or public profile was verified
on that date. [README](../README.md) owns setup commands and current behavior;
[TODO](../TODO.md) owns unfinished evidence and operational checks.

## Sources of truth

| Change | Update and verify |
| --- | --- |
| Runtime or dependency | `.nvmrc`, `package.json`, lockfile, CI; use a clean install and relevant installed framework documentation |
| Public route or navigation | App route, `src/data/profile.ts`, footer/context links, sitemap, metadata, search records and redirects |
| Project result or maturity | `systems.ts` or its imported client data, visible stage/limitations, any affected related cards and search destinations |
| Service scope or price | `src/data/services.ts`, Services page and contact selector; preserve agreed terms unless deliberately changed |
| Contact behavior or environment | Form, API, `.env.example`, README environment table, mocked regression tests |
| Article revision | MDX content and `updated` date; visible date, article metadata, JSON-LD and sitemap |
| Employment or education | Source data, Experience, relevant biography/metrics and approved résumé when separately reviewed |
| Publication status | DOI/byline verification, research data and status page; accepted does not mean proceedings published |
| Evidence asset | Cleared file under `public/`, descriptive alternative text/caption, source ownership, responsive rendering |

Do not copy exact package versions, passing test counts, or service status into
multiple evergreen documents. Exact checks belong with the tested revision in
the PR or a dated verification report. A lockfile upgrade does not establish that
deployed production uses it; a passing local test does not establish a remote
Sonar result or live email delivery.

## A change is ready to review when

1. The implementation and its documentation describe the same behavior.
2. New claims are supported by existing source, an actual artifact, or explicit
   owner-provided facts. Distinguish measured, observed, estimated and planned.
3. Relevant checks pass without reducing coverage, security or accessibility
   gates. Run the documented full verification before requesting merge.
4. Changed pages work in both themes and at narrow phone and wide desktop widths.
   Check keyboard navigation, focus, text wrapping and actual image content.
5. Search targets and copied URLs still reach meaningful content. Review old/new
   destination differences before updating published-index fixtures; see
   [search maintenance](search.md).
6. The PR records what changed, why, verification, and any remaining limitations.

The homepage and footer decision is settled: retain the wide desktop presence
and complete footer, use responsive spacing on phones, and keep project lists
on Work. A new case study is not a reason to add another homepage section.

## Writing and revision dates

`date` records the existing publication date; optional `updated` records a real
substantive revision. Use quoted ISO date strings such as `updated: "2026-11-02"`.
Keep explicit published heading IDs when editing their text. Do not rewrite publication history to match a package
upgrade or set modification dates to the build time. The portfolio rebuild
article retains its recorded publication date and explains its November 2026
revision; its current Next.js 16 description is not a claim about January 2025.

Prefer a specific engineering decision, its constraint and its consequence over
a list of tools or unsupported claims about what most teams do. Link to relevant
case studies where they supply evidence. Remove completed features from future
work. Mark drafts `draft: true` or `published: false` so neither public routes nor
search expose them.

## Evidence that improves the portfolio

The highest priorities are real production outcomes, architecture decisions and
operational evidence. For an AI project, record the evaluation set, baseline,
failure cases and measurement conditions before adding quality, cost or latency
claims. A seven-question sanity check cannot establish general accuracy; a
qualitative comparison cannot justify a percentage of human understanding.

For a useful case study, explain the problem, David's contribution, a meaningful
constraint, the implementation decision, the available result, and its limits.
Keep unfinished evidence in TODO. If there is no screenshot, omit the image
block until a real capture is available. Describe an unimplemented architecture
as proposed, not deployed. Do not turn a planned roadmap into a success story.

## Privacy, attribution and approved documents

- Preserve Time2Move's project-level historical account without personal client
  identifiers or successor-business links. Review visible copy, metadata, search
  and public docs together. Removing current text does not erase Git history or
  third-party caches.
- Keep Matt Laur's public brand and ARK Landscaping's business identity while
  excluding private correspondence, credentials and customer data.
- Preserve the WeatherForge collaborators and David's established implementation
  contribution. Do not turn collaborative work into a solo project.
- Follow [research identity](RESEARCH_IDENTITY.md). Prior research by others is
  background, not authored work; withheld datasets remain private.
- Keep editable résumé sources private. Review provenance, disclosure, two-page
  layout and extracted text before replacing PDFs or updating their test hashes.

## Review cadence

These are suggested maintenance intervals, not configured automations.

| When | Review |
| --- | --- |
| Every relevant PR | Code/doc agreement, source links, affected browser journeys and evidence labels |
| Monthly | Live project links, résumé links, scheduling destination and contact configuration; record what was actually checked |
| On career/research changes | Current job, degree completion, credential expiry, conference/proceedings status, approved document versions |
| On dependency/security updates | Clean Node 24 install, audit gates, lint/types/tests/build and relevant browser checks |
| Before claiming an operational result | Controlled validation and recorded conditions; do not infer it from CI |

Do not change external profiles, publish a new business site, or send a production
test inquiry merely because a planning document suggests it. Those are distinct
actions with their own scope and authorization.
