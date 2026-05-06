# dbraun.io Selective Restoration Report

## Summary
- Restored the site lead from applied AI/data portfolio language back to workflow automation, system integration, dependable systems, lead flow, handoffs, and operational reliability for small and midsized businesses.
- Preserved the useful local case-study proof work: WeatherForge/RAGeATM metrics, architecture, limitations, GitHub links, tech tags, and richer detail pages.
- Rewrote the homepage, services page, case-study index, contact framing, metadata, header, footer, and social preview language so business outcomes lead and AI/data work supports the offer.
- Fixed the proof hierarchy so VIFG is first on the homepage, first on the case-study index, and clearly marked as public production proof.
- Fixed case-study proof links so GitHub repositories are labeled as repositories, live URLs are labeled as live proof, and missing proof links do not render misleading blocks.
- Fixed the resume URL from `/Resume.pdf` to `/resume.pdf`.
- Updated smoke tests so they enforce the restored strategy instead of the weaker local positioning.

## Strategic Result
The site now reads primarily as workflow automation / dependable systems consulting.

It no longer opens as an applied AI/data portfolio. AI, RAG, dashboards, data pipelines, and technical prototypes still appear, but they are subordinate supporting capabilities. That is the right direction for buyer trust. The strongest remaining risk is that the case-study detail pages are still dense and technical; they are useful proof, but they need careful ordering so buyers do not mistake technical depth for the main offer.

## Files Changed
| File | Change | Reason |
|---|---|---|
| `src/app/page.tsx` | Rebuilt homepage around workflow friction, SMB outcomes, VIFG first proof, and direct buyer CTA. | Restore the live-style promise and stop leading with applied AI/data. |
| `src/app/case-studies/page.tsx` | Replaced flat proof grid with Production, Pilot / client-facing, Prototype / academic, and R&D / active build sections. | Restore maturity-aware proof hierarchy with VIFG first. |
| `src/app/case-studies/[slug]/page.tsx` | Kept metrics/architecture/limitations/related cards, fixed proof-link labeling, and curated related studies by stage. | Preserve technical proof without misleading repository/live-site claims or recommending prototypes first from VIFG. |
| `src/data/systems.ts` | Restored VIFG to the top of `orderedSystemIds`, clarified VIFG as public production proof, and kept richer WeatherForge/RAGeATM fields. | Make production proof outrank technical prototypes while preserving useful local detail. |
| `src/data/profile.ts` | Restored brand, services, credibility points, conversion points, and contact paths to workflow automation/dependable systems language. | Re-anchor the site in buyer pain and commercial outcomes. |
| `src/app/services/page.tsx` | Reframed services by business problem, help provided, and outcome; kept AI/data/RAG/dashboard support as secondary capability language. | Merge local taxonomy with live buyer framing. |
| `src/app/contact/page.tsx` | Restored workflow-first contact framing. | Make the intake about improving workflows, not only prototypes. |
| `src/components/sections/contact.tsx` | Updated intake options, labels, sidebar copy, and placeholders around workflows, systems, constraints, and outcomes. | Keep the form practical for automation, integration, data, websites, and AI-assisted workflows. |
| `src/app/why-work-with-me/page.tsx` | Restored buyer credibility intro, VIFG/public client proof, enterprise delivery background, stewardship, and lower-priority AI graduate context. | Avoid opening with student/portfolio identity. |
| `src/app/layout.tsx` | Restored workflow automation/systems consulting metadata and kept applied AI/data terms secondary. | SEO should target commercial intent first. |
| `src/components/layout/header.tsx` | Restored workflow automation/dependable systems tagline and `Book a Call` CTA. | Keep navigation and conversion buyer-facing. |
| `src/components/layout/footer.tsx` | Restored consulting/workflow automation/dependable delivery description. | Stop the footer from reading like an applied AI portfolio tagline. |
| `src/lib/social-card.tsx` | Restored social preview copy around the buyer promise with AI/data as support. | Keep shared previews commercially clear. |
| `src/data/social-links.ts` | Changed resume URL to `/resume.pdf`. | Match the actual `public/resume.pdf` path. |
| `e2e/smoke.spec.ts` | Updated smoke expectations for VIFG-first proof, direct CTA, and workflow-first contact path. | Make tests protect the restored strategy. |
| `src/app/writing/page.tsx` | Adjusted writing metadata/description back toward workflow and system themes. | Avoid a stray applied AI portfolio signal. |
| `src/components/site/project-card.tsx` | Uses `contextLabel` and `displayTitle` where present. | Preserve useful local scannability and maturity labels in project cards. |
| `docs/dbraun-selective-restoration-report.md` | Added this report. | Document the restoration and verification. |

## Proof Hierarchy Check
- VIFG is first production proof on the homepage and case-study index.
- VIFG is labeled as Public Production Proof and Production.
- WeatherForge and RAGeATM are visible as secondary technical proof, not the headline proof.
- WeatherForge is labeled Prototype / Academic Project with applied dashboard prototype state.
- RAGeATM is labeled Prototype / Academic Project with local RAG prototype state.
- R&D and active-build work stays labeled below production and pilot work.
- No prototype is presented as stronger than the public production proof.

## Conversion Check
- Primary CTA is direct: `Book a Call`.
- Homepage and services page lead toward buyer action instead of generic portfolio browsing.
- Contact page is workflow-first: "Tell me about the workflow you want to improve."
- Intake still supports workflows, automations, integrations, operational software, websites, data pipelines, and AI-assisted workflows.
- AI/data prototype work remains available, but it no longer dominates the conversion path.

## Verification
- `npm run lint`: passed.
- `npm test`: passed, 5 files and 68 tests. Expected mocked negative-path logs appeared for Upstash fallback and contact-mail configuration failures.
- `npm run build`: passed. Next.js generated all static pages and case-study routes successfully.
- `npx playwright test e2e/smoke.spec.ts --project=chromium`: passed, 11/11.
- Manual rendered inspection: Home, Services, Case Studies, Why Work With Me, Contact, VIFG, WeatherForge, and RAGeATM all rendered at desktop width without horizontal overflow.
- Manual mobile inspection at 390px: same inspected pages rendered without horizontal overflow.

## Remaining Issues
- Console inspection showed Google Analytics requests to `https://www.google.com/g/collect` blocked by the current CSP. This is not caused by the restoration copy work, but it should be reviewed if analytics collection matters.
- The contact page intentionally repeats the workflow headline in the page intro and form section. It is clear, but a later polish pass could reduce the repetition.
- The technical case-study detail pages are stronger than the local index was, but still dense. They should stay, with VIFG and buyer-facing pages continuing to do the commercial positioning work.
- Playwright generated an untracked `.playwright-mcp/` log directory during manual inspection. I left it untouched because the task explicitly prohibited deletion or discard actions.
