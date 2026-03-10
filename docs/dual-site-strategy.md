# Dual-Site Strategy: dbraun.io + People's Connection LLC

## Decision

Keep `dbraun.io` as the personal portfolio and launch a separate business
website for People's Connection LLC.

Rationale:

- Clear identity: personal authority site vs company services site.
- Better conversion paths: hiring/freelance validation on portfolio, service
  packaging and checkout flow on business site.
- Cleaner SEO intent: `person + expertise` queries on portfolio, `service +
  problem` queries on business site.

## Site Roles

### 1) Portfolio site (`dbraun.io`)

Primary purpose:

- Build trust in David Braun as an individual operator/engineer
- Prove capability through projects, writing, and selected case studies
- Route qualified service interest to the business site

Core pages:

- Home (bio, positioning, credibility)
- Projects
- Blog/thought leadership
- Contact
- "Work with People's Connection LLC" CTA page (bridge page)

### 2) Business site (People's Connection LLC brand)

Primary purpose:

- Convert service demand into leads/revenue
- Present offers, pricing structure, intake process, and outcomes
- Operate as the commercial system of record

Core pages:

- Services and package pages
- Industry/problem pages
- Full case studies with outcomes
- Discovery call and/or paid discovery checkout
- Privacy, terms, and company trust pages

## Cross-Linking and SEO Plan

Goal: link both sites for user clarity and brand trust without creating
duplicate-content confusion.

### Navigation model

- Portfolio global nav/footer: add "People's Connection LLC" link.
- Business global nav/footer: add "Founder: David Braun" link to `dbraun.io`.
- Bridge links should be contextual, not hidden or only footer-deep.

### Content boundaries

- Portfolio case studies: short executive summaries.
- Business case studies: full commercial detail.
- Portfolio posts can link to service explainers on business site.
- Business pages can cite founder expertise via portfolio deep links.

### SEO guardrails

- Use canonicals per domain page (do not cross-canonical unrelated pages).
- Avoid near-duplicate copy across both sites.
- Distinct metadata strategy:
  - Portfolio: person/expertise terms
  - Business: services/industry/problem terms
- Add structured data:
  - Portfolio: `Person`, `Article`
  - Business: `Organization`, `Service`, `FAQPage` where appropriate
- Use UTM tags on cross-domain CTA links to measure handoff performance.

### Internal linking pattern

- From portfolio to business:
  - project -> related service
  - blog insight -> implementation offer
- From business to portfolio:
  - service -> founder credibility page
  - case study -> related technical write-up

## Measurement (Shared)

Track both sites as separate properties with shared attribution standards:

- Conversion events: booked call, paid discovery, qualified lead form
- Handoff events: portfolio -> business click-through
- Funnel metrics: session -> CTA click -> lead -> closed deal
- Search metrics: impressions, rankings, branded/non-branded growth

## 90-Day Rollout (High Level)

### Phase 1 (0-30 days)

- Finalize business brand naming and domain.
- Add cross-links from `dbraun.io` to business placeholder/coming-soon page.
- Define analytics events and attribution conventions.

### Phase 2 (31-60 days)

- Launch core business pages (services, contact, discovery CTA).
- Publish 2-3 commercial case studies.
- Add portfolio bridge page for service inquiries.

### Phase 3 (61-90 days)

- Launch productized offers and intake flow.
- Build topical content clusters on business domain.
- Optimize cross-domain conversion paths based on analytics.

## Notes

- Keep portfolio tone personal and technical.
- Keep business tone outcomes-driven and buyer-focused.
- Treat the two sites as a connected system, not competitors.
