# dbraun.io information architecture

This document describes the implemented portfolio, reviewed November 2, 2026.
The three audience paths are engineering employment, consulting, and research.
The shared identity is **AI Systems & Platform Engineer**; historical employer
titles and project maturity remain unchanged.

## Navigation and homepage

Primary navigation, in order: **Work, Experience, Services, Research, Contact**.
The David Braun brand is the home link. Research and Experience have contextual
submenus. The mobile menu preserves the same primary order; desktop navigation
appears when the layout has room at the `xl` breakpoint.

The homepage presents:

1. Wide hero with professional identity, value proposition and primary actions.
2. Four career/research highlights with context.
3. Employer, client and researcher pathways.
4. Technical capabilities and evidence-standards link.
5. Contact invitation.
6. Full footer: identity/faith, Explore, Connect and Research Profiles.

Phone layouts use compact spacing and reflow the same essential information.
The homepage does not render project cards or a live-client row. Work owns those
lists. Preserve the desktop presence and full footer rather than compressing all
viewports to the phone layout.

## Canonical routes

| Route | Purpose / next step |
| --- | --- |
| `/` | Positioning and audience paths → Work, Contact, résumé |
| `/case-studies` | Work index grouped into Client work, Applications and data projects, and Experiments and work in progress |
| `/case-studies/[system-id]` | Specific ownership, implementation, artifacts, status and limitations |
| `/experience` | Employment, education, credentials → employment inquiry or résumé |
| `/experience/career-story` | Deeper career narrative |
| `/services` | Consulting offers, scope, deliverables and planning ranges → consulting inquiry |
| `/research` | Accepted and published work, attribution and researcher profiles |
| `/research/urarina-hybrid-retrieval` | Current accepted research status and public provenance |
| `/approach/evidence` | Evidence, maturity and review standards |
| `/writing` | Published articles |
| `/writing/[slug]` | Article with publication and optional substantive-revision date |
| `/resumes` | Approved industry résumé and research CV; request fallback when an asset is not cleared |
| `/contact` | Single form for all professional inquiry types and optional scheduling link |

The sitemap includes canonical public page routes, case studies and published
articles. Draft articles and redirects are excluded. Writing modification dates
use the actual `updated` date when supplied, not the build date. Public document
URLs are defined in `src/data/resumes.ts` and are not researcher identities.

## Inquiry routing

`/contact?type=employment`, `consulting`, `research`, `speaking`, or `other`
preselects the matching inquiry type. Invalid values fall back to an unselected
form. The consulting option reveals the optional service selector. A valid
`CAL_LINK` enables the additional booking action; without it, the form remains
the contact path.

## Permanent redirects

`next.config.ts` owns these aliases. Do not add obsolete URLs to new internal
links or to the sitemap.

| Source | Destination |
| --- | --- |
| `/about`, `/background`, `/resume`, `/why-work-with-me` | `/experience` |
| `/resume.pdf`, `/David-J-Braun-Resume-2026.pdf` | `/resumes/David-J-Braun-Resume-Software-Platform-2026.pdf` |
| `/projects`, `/systems` | `/case-studies` |
| `/projects/[slug]` | `/case-studies/[slug]` |
| `/blog` | `/writing` |
| `/blog/[slug]` | `/writing/[slug]` |

The capitalized `/Resume.pdf` alias follows Next.js's case-insensitive matching
of the configured `/resume.pdf` redirect. The research CV's canonical path is
`/resumes/David-J-Braun-CV-AI-Research-2026.pdf`.

## Evidence and discovery

VIFG leads Client work, followed by ARK Landscaping, Matt Laur and the historical
Time2Move engagement. DealerFlow, WeatherForge and RAGeATM retain their pilot or
academic/prototype labels. Do not promote an inactive or experimental system to
production because its case study is polished.

Search builds from the same public data and MDX sources. Deep links can target
specific paragraphs, diagrams and comparison cells inside disclosures. Preserve
semantic destinations when editing content; see [search maintenance](search.md).
Writing, the résumé directory, career narrative and evidence standards remain
available through contextual links, search and the footer without expanding the
primary navigation.
