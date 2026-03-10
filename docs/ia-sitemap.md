# IA and Sitemap: Portfolio + People's Connection LLC

This document defines an implementation-ready information architecture for:

- `dbraun.io` (personal authority and trust)
- `business-domain.com` (People's Connection LLC commercial engine)

Replace `business-domain.com` with your final production domain.

## 1) Domain Responsibilities

### `dbraun.io` (Portfolio)

Primary job:

- Establish David Braun as a high-agency builder, strategist, and operator.
- Demonstrate proof through projects, writing, and outcomes.
- Route qualified commercial intent to People's Connection LLC.

### `business-domain.com` (Business)

Primary job:

- Convert service demand into booked calls, paid discovery, and deals.
- Present offers, process, outcomes, and buying path.
- Operate marketing, sales, and service clarity at scale.

## 2) Portfolio IA (`dbraun.io`)

## Global Navigation

1. About
2. Work (Projects)
3. Insights (Blog)
4. Case Studies (Summary)
5. Contact
6. Work With People's Connection LLC (primary cross-link CTA)

## Sitemap (Portfolio)

```text
/
|-- /about
|-- /work
|   |-- /work/[project-slug]
|-- /insights
|   |-- /insights/[post-slug]
|-- /case-studies
|   |-- /case-studies/[summary-slug]
|-- /work-with-peoples-connection
|-- /contact
|-- /now (optional)
|-- /speaking (optional)
|-- /resume
```

## Page Purpose and CTAs (Portfolio)

| Page | Primary Goal | Primary CTA | Secondary CTA |
| --- | --- | --- | --- |
| Home | Fast trust and positioning | Work with People's Connection LLC | View projects |
| About | Narrative and point of view | See case studies | Read insights |
| Work | Technical credibility | Discuss similar build | Read related case study |
| Insights | Authority and SEO | Book strategy call | Subscribe |
| Case study summary | Outcome proof | View full business case study | Contact David |
| Work with People's Connection LLC | Route intent | Go to business site offer page | Book call |

## 3) Business IA (`business-domain.com`)

## Global Navigation

1. Services
2. Solutions
3. Case Studies
4. Process
5. Pricing
6. Resources
7. About (Founder + company)
8. Book Discovery Call (primary CTA)

## Sitemap (Business)

```text
/
|-- /services
|   |-- /services/[service-slug]
|-- /solutions
|   |-- /solutions/[problem-slug]
|-- /industries
|   |-- /industries/[industry-slug]
|-- /case-studies
|   |-- /case-studies/[full-case-slug]
|-- /pricing
|-- /process
|-- /book
|-- /paid-discovery
|-- /resources
|   |-- /resources/[guide-slug]
|-- /about
|   |-- /about/founder (links to dbraun.io/about)
|-- /contact
|-- /legal/privacy
|-- /legal/terms
```

## Page Purpose and CTAs (Business)

| Page | Primary Goal | Primary CTA | Secondary CTA |
| --- | --- | --- | --- |
| Home | Clarify offer and outcome | Book discovery | View services |
| Services | Explain capabilities by package | Start paid discovery | Book call |
| Solutions | Match pain to solution | Book call | Read case study |
| Case studies | Prove outcomes | Start project intake | Book call |
| Pricing | Pre-qualify and reduce sales friction | Start paid discovery | Contact |
| Process | De-risk engagement | Book call | Download process PDF |
| About | Human trust and founder credibility | Book call | Visit founder portfolio |

## 4) Cross-Domain Link Endpoints

Implement these links first:

| Source | Target | Intent |
| --- | --- | --- |
| `dbraun.io/work-with-peoples-connection` | `business-domain.com/services` | Service handoff |
| `dbraun.io/case-studies/[summary]` | `business-domain.com/case-studies/[full]` | Deep proof handoff |
| `dbraun.io/insights/[post]` | `business-domain.com/solutions/[problem]` | Insight -> offer handoff |
| `business-domain.com/about/founder` | `dbraun.io/about` | Founder trust |
| `business-domain.com/case-studies/[full]` | `dbraun.io/work/[project]` | Technical depth proof |

Use UTM on every cross-domain CTA:

- `utm_source=portfolio`
- `utm_medium=referral`
- `utm_campaign=cross_domain_handoff`

## 5) Tomorrow-Build Starter Scope

If you want to start tomorrow with minimal risk, build these first:

1. `business-domain.com/` (hero + services snapshot + primary CTA)
2. `business-domain.com/services`
3. `business-domain.com/book`
4. `business-domain.com/about/founder`
5. `dbraun.io/work-with-peoples-connection`

Everything else can layer in after these five pages are live.
