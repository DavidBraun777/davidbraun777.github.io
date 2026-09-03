# dbraun.io Information Architecture

This document records the implemented information architecture for `dbraun.io`.
The site supports three professional goals without splitting into separate public
funnels:

1. Employment opportunities for AI systems, platform, and software engineering.
2. Qualified consulting leads for People's Connection LLC.
3. Research inquiries and collaborations.

## Primary Navigation

1. Home
2. Services
3. Case Studies
4. Research
5. Experience
6. Contact

The canonical professional identity across these routes is **AI Systems & Platform
Engineer**. Architecture remains a capability, not a retroactive employment title.

## Canonical Sitemap

```text
/
|-- /services
|-- /case-studies
|   |-- /case-studies/[system-id]
|-- /research
|-- /experience
|   |-- /experience/career-story
|-- /approach/evidence
|-- /writing
|   |-- /writing/[slug]
|-- /contact
|-- /David-J-Braun-Resume-2026.pdf
```

The career-story and evidence-standards pages are deeper supporting routes. They
are linked contextually but intentionally omitted from primary navigation.

## Page Roles and Conversion Paths

| Page | Primary purpose | Primary path |
| --- | --- | --- |
| Home | Establish positioning, proof, and audience paths | View Work / Contact Me |
| Services | Explain purchasable consulting engagements | Discuss a Project |
| Case Studies | Show maturity-labeled engineering proof | Discuss a similar workflow |
| Research | Present accepted and published research accurately | Discuss Research |
| Experience | Provide a concise professional record | Discuss a Role |
| Career Story | Preserve the deeper five-chapter through-line | Experience / Evidence Standards |
| Evidence Standards | Explain maturity, claim, and review discipline | Case Studies / Research |
| Contact | Route all professional inquiry types through one form | Send inquiry |

## Contact Intents

The single `/contact` route supports these query parameters and preselected
inquiry types:

- `/contact?type=employment`
- `/contact?type=consulting`
- `/contact?type=research`

Speaking and other professional inquiries use the same form selector without a
separate public route.

## Permanent Redirects

Legacy aliases resolve directly to the current canonical destination:

| Source | Destination |
| --- | --- |
| `/why-work-with-me` | `/experience` |
| `/about` | `/experience` |
| `/background` | `/experience` |
| `/resume` | `/experience` |
| `/resume.pdf` | `/David-J-Braun-Resume-2026.pdf` |
| `/projects` | `/case-studies` |
| `/projects/[slug]` | `/case-studies/[slug]` |
| `/blog` | `/writing` |
| `/blog/[slug]` | `/writing/[slug]` |
| `/systems` | `/case-studies` |

Aliases are not sitemap entries and must not emit obsolete canonical metadata.

## Evidence Hierarchy

Primary pages show proof and retain visible Production, Pilot, and R&D labels.
The rationale behind those labels, research publication status, limitations,
AI-assisted work, and quality evidence lives on `/approach/evidence`. This keeps
the main visitor journey concise while preserving claim discipline for readers
who want the deeper standard.
