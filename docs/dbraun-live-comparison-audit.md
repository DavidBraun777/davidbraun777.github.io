# dbraun.io Live vs Local Audit

## Executive Summary
The local version is worse as a business website, with a few useful technical-proof improvements buried inside it. The live site wins because it is clearer about the buyer, the pain, the outcome, and the strongest public proof: VIFG. The local site pivots too hard into "Applied AI and Data Systems" and starts reading like a student/project portfolio or AI capability catalog instead of a consulting site for small and midsized businesses. The biggest regression is proof hierarchy: WeatherForge and RAGeATM are now promoted ahead of VIFG on the homepage and case-study index, even though VIFG is still the strongest public production proof. The second biggest regression is conversion clarity: "Book a Call" and "workflow you want to improve" became the broader and weaker "Work With Me" and "prototype" language. The local case-study detail template is directionally useful because it adds metrics, architecture, limitations, GitHub links, and honest prototype boundaries. Keep that proof discipline, but do not let it drive the whole brand. Build, lint, and unit tests pass, but local link checking found a real footer/resume bug. Recommended direction: selectively revert the weak public-facing sections, preserve the richer WeatherForge/RAGeATM detail work, and restore the live site's business strategy before iterating.

Verification performed: `git status --short`, `npm run build`, `npm run lint`, `npm test`, local production server at `http://localhost:3000`, live comparison against `https://www.dbraun.io/`, rendered HTML extraction, Browser screenshots/DOM snapshots, internal link checks, console checks, mobile/desktop responsive checks, and axe accessibility scans.

## Changed Files
| File | Type of change | Likely impact | Needs review? |
|---|---|---|---|
| `e2e/smoke.spec.ts` | Smoke expectations changed from DGM/Book a Call to RAGeATM/Work With Me | Codifies the weaker local positioning and proof hierarchy | Yes |
| `src/app/case-studies/[slug]/page.tsx` | Case-study detail template expanded with metrics, architecture, limitations, repositories, related cards | Mostly useful for technical credibility, but adds generic sections to every project | Yes |
| `src/app/case-studies/page.tsx` | Stage-based production/pilot/R&D index replaced by flat table-of-contents grid | Major proof hierarchy regression; VIFG no longer leads | Yes |
| `src/app/contact/page.tsx` | Contact hero shifted from workflow improvement to AI/data prototype | Narrows conversion path and weakens SMB buyer relevance | Yes |
| `src/app/layout.tsx` | Global metadata, keywords, schema, and social copy shifted to applied AI/data | SEO/brand strategy moved away from workflow automation consulting | Yes |
| `src/app/page.tsx` | Homepage rewritten around AI/data systems, dashboards, RAG, WeatherForge, RAGeATM | Major positioning and conversion regression | Yes |
| `src/app/services/page.tsx` | Services changed from business problem/outcome framing to AI/data categories | Mixed: cleaner taxonomy, weaker buyer pain and commercial sharpness | Yes |
| `src/app/why-work-with-me/page.tsx` | Credibility intro shifted toward student/AI portfolio framing | Makes the page more self-focused and less buyer-focused | Yes |
| `src/app/writing/page.tsx` | Writing metadata/copy shifted to applied AI/data | Low direct impact, but reinforces broader brand drift | Yes |
| `src/components/layout/footer.tsx` | Footer description and build tagline changed to applied systems | Global business positioning regression | Yes |
| `src/components/layout/header.tsx` | Header tagline and CTA changed to applied AI/data and Work With Me | Global conversion and positioning regression | Yes |
| `src/components/sections/contact.tsx` | Intake options, placeholders, fit points, and person copy shifted to AI/data prototypes | High conversion impact; excludes some workflow buyers | Yes |
| `src/components/site/project-card.tsx` | Cards now prefer context/display title labels | Potentially useful, but can over-promote prototype labels | Yes |
| `src/data/profile.ts` | Core profile, audience, services, signals, conversion points rewritten | High-impact brand and buyer relevance regression | Yes |
| `src/data/systems.ts` | Adds RAGeATM, detailed WeatherForge metrics, architecture fields, limitations, GitHub URLs, and reorders systems | Useful proof expansion, but order demotes VIFG and changes strategic direction | Yes |
| `src/lib/social-card.tsx` | Social card copy shifted to applied AI/data | Reinforces weaker broad AI/data positioning | Yes |
| `src/__tests__/content/` | New content punctuation test directory | Useful style guard if desired | Low |
| `src/components/site/metric-card.tsx` | New metric display component | Useful for richer case studies | Low |
| `src/components/site/tech-tag.tsx` | New tech badge wrapper | Useful small component | Low |

## Page-by-Page Comparison
### Home
| Area | Live version | Local version | Winner | Reason |
|---|---|---|---|---|
| Hero | "Remove manual work from the workflows that keep slowing your business down." | "Applied AI and Data Systems for Practical Decision Support" | Live | Live names a costly buyer problem. Local names a broad capability category. |
| Main copy | SMB workflow, lead flow, handoffs, data movement, dependable systems | Dashboards, grounded AI assistants, automations, internal tools | Live | Local is less concrete about the business buyer and business pain. |
| Proof | VIFG first, public since 2020, production result shown immediately | WeatherForge and RAGeATM are the visible homepage proof links | Live | Local demotes the strongest production proof below prototypes. |
| Layout | Hero plus buyer pain aside, then proof and trust story | Shorter, cleaner sections with capability cards | Mixed | Local is visually simpler, but live gives more persuasive context. |
| CTA | Primary "Book a Call", secondary services | Primary "View Case Studies", secondary "Work With Me" | Live | Live makes the conversion path obvious. Local pushes visitors into browsing. |
| Credibility | Enterprise logos, public sites, faith statement, VIFG production | Mostly project capability preview | Live | Local feels more like a portfolio landing page. |
| Buyer clarity | Owners/operators with lead handling, handoffs, data movement | Anyone needing AI/data decision support | Live | Local buyer is less specific. |
| Mobile behavior | Strong first viewport: problem, buyer, CTA, pain proof | Text fits, but first viewport is generic AI/data positioning | Live | No major fit issue, but weaker message density. |
| SEO/accessibility concerns | Better title/description for workflow automation consulting | Broader AI/data title/description | Live | Local loses niche specificity and commercial intent. |

### Services
| Area | Live version | Local version | Winner | Reason |
|---|---|---|---|---|
| Hero | "What you can hire me for." | "Practical AI and data systems, scoped before they grow." | Live | Live is direct and buyer-oriented. Local is polished but abstract. |
| Main copy | Services framed as problem, help, and outcome | Services framed as categories, use cases, and who it helps | Mixed | Local taxonomy is cleaner, but live sells the business problem better. |
| Proof | Points to VIFG, WeatherForge, DGM, DealerFlow with maturity caveat | Supporting examples only WeatherForge and RAGeATM | Live | Local overweights prototypes and underweights public delivery. |
| Layout | Four core service cards plus fit/process/proof | Five category cards plus scoped process and examples | Local | Local is visually organized and scannable. |
| CTA | Book a Call and View Case Studies | Work With Me and View Case Studies | Live | "Book a Call" is clearer for a buyer-ready service page. |
| Credibility | Business outcome language: fewer missed opportunities, less re-entry, reliability | Capability language: dashboards, pipelines, assistants | Live | Local reads more like a capabilities menu than a consulting offer. |
| Buyer clarity | SMB workflow friction is explicit | Operators/founders/analysts are mentioned, but pain is diluted | Live | Local is broader and less conversion-focused. |
| Mobile behavior | No page-level overflow in audit | No page-level overflow in audit | Tie | Both are responsive enough in tested viewports. |
| SEO/accessibility concerns | Live services axe scan passed | Local services has serious contrast failures on small "Who it helps" labels | Live | Local introduces an accessibility issue on this page. |

### Case Studies
| Area | Live version | Local version | Winner | Reason |
|---|---|---|---|---|
| Hero | "A portfolio of production, pilot, and R&D work." | "Case studies and project notes." | Live | Live tells the visitor how to interpret maturity. Local sounds like a table of contents. |
| Main copy | Explains VIFG, pilots, R&D, WeatherForge/DGM/StormIQ relationship | Says to open case studies for evidence and metrics | Live | Local is shorter but less strategically useful. |
| Proof | VIFG featured first with problem/result/ownership/live site | Flat card grid starts with WeatherForge, RAGeATM, then VIFG | Live | This is the clearest local regression. |
| Layout | Hierarchical: Production, Pilot, R&D | Flat two-column card index | Live | Local is cleaner but destroys priority and maturity hierarchy. |
| CTA | Book a Call; VIFG live-site link; talk-through workflow link | Work With Me; no VIFG live-site CTA on index | Live | Local removes the strongest public proof action. |
| Credibility | Production ownership and stage labels are explicit | Prototype labels are honest, but prototypes lead | Live | Honest labels do not compensate for wrong ordering. |
| Buyer clarity | Shows what is live, in pilot, and in progress | Makes the visitor infer maturity from badges | Live | Local increases cognitive load. |
| Mobile behavior | Stage hierarchy remains understandable | Cards are readable but first card is an academic prototype | Live | Mobile makes the proof-order problem more severe. |
| SEO/accessibility concerns | Live has serious contrast issue on small Problem/Result labels | Local avoids that case-index contrast issue | Local | Local is cleaner on axe for this page, but the strategic page is worse. |

### Why Work With Me
| Area | Live version | Local version | Winner | Reason |
|---|---|---|---|---|
| Hero | "Credibility you can skim quickly." | "Applied AI and data systems credibility you can skim quickly." | Live | Live answers a buyer trust question. Local adds brand jargon. |
| Main copy | Starts with business problem, delivery, VIFG, public client work, Treasurer role | Starts with Master's student, AI/data builder, WeatherForge/RAGeATM | Live | Local creates student portfolio energy before commercial trust. |
| Proof | Enterprise roles, VIFG stewardship, public client surfaces | Same underlying sections, but intro reframes proof around prototypes | Live | Local weakens the credibility hierarchy before the solid proof appears. |
| Layout | Same core page structure | Same core page structure | Tie | Most layout remains usable. |
| CTA | Book a Call | Work With Me | Live | Live is more concrete. |
| Credibility | Production ownership, enterprise discipline, faith/stewardship balanced | Honest prototype boundaries, but self-focused early | Live | Local includes useful honesty, but in the wrong position. |
| Buyer clarity | Businesses needing dependable systems | Consulting leads, hiring teams, founders, professors, research conversations | Live | Local audience is too broad for a consulting website. |
| Mobile behavior | Scannable; no page-level overflow | Scannable; no page-level overflow | Tie | No major responsive regression found. |
| SEO/accessibility concerns | Better business credibility metadata | Metadata shifts toward dashboards/RAG/prototypes | Live | Local loses buyer-intent language. |

### Contact
| Area | Live version | Local version | Winner | Reason |
|---|---|---|---|---|
| Hero | "Tell me about the workflow you want to improve." | "Tell me about the AI, data, or decision-support system you want to prototype." | Live | Live invites the current buyer. Local narrows to prototype-minded prospects. |
| Main copy | Form gathers workflow, bottleneck, desired outcome | Form gathers data, users, constraints, intended decision | Mixed | Local is useful for AI/data work, but weaker for broader workflow consulting. |
| Proof | Direct contact, response time, fit examples tied to workflow friction | Direct contact, prototype limits, AI/data fit examples | Live | Live better supports consulting conversion. |
| Layout | Same core form/sidebar structure | Same core form/sidebar structure | Tie | Layout did not materially regress. |
| CTA | Send plus optional short call | Send plus optional short call | Tie | Primary form path remains. |
| Credibility | "Scopes the problem, builds the system, follows through after launch" | "Builds the prototype, documents the limits" | Live | Local sounds less production-ready. |
| Buyer clarity | Workflow, systems, leads, requests | Dashboard, document assistant, data pipeline | Live | Local is narrower and more technical. |
| Mobile behavior | No page-level overflow; one non-page overflow observation | Same | Tie | No visible page-level horizontal overflow found. |
| SEO/accessibility concerns | Contact axe issue: nested complementary landmark | Same nested complementary landmark remains | Tie | Local does not repair this existing issue. |

## Regression List
| Priority | Regression | Where | Why it hurts | Recommended action |
|---|---|---|---|---|
| P0 | Homepage abandons the SMB workflow automation promise | `src/app/page.tsx`, `src/data/profile.ts`, metadata | The first screen no longer tells a buyer what costly problem you solve | Restore live homepage positioning and merge only a restrained AI/data capability mention |
| P0 | VIFG no longer leads the proof hierarchy | Home, case-studies index, `src/data/systems.ts` order | Demotes the strongest public production proof beneath prototypes | Put VIFG first everywhere public proof is introduced |
| P0 | Global brand shifts from consulting/business site to broad AI/data portfolio | `src/app/layout.tsx`, header, footer, social card | Makes the site sound less commercially focused and less buyer-ready | Restore workflow automation/systems consulting as the umbrella |
| P0 | Footer Resume PDF link is broken locally | `src/data/social-links.ts`, footer, why page | `/Resume.pdf` is 404 on local while `public/resume.pdf` exists; this is a credibility bug | Change the URL to `/resume.pdf` or add a deliberate uppercase asset/redirect |
| P1 | Case-study index loses production/pilot/R&D structure | `src/app/case-studies/page.tsx` | Visitors cannot quickly tell what is production, pilot, or R&D | Restore live stage sections and VIFG featured card |
| P1 | Contact path now asks for a prototype instead of a business workflow | `src/app/contact/page.tsx`, `src/components/sections/contact.tsx` | Filters out practical SMB workflow buyers and reduces production confidence | Restore workflow-first wording; keep AI/data fields as optional examples |
| P1 | Services page is less outcome-led | `src/app/services/page.tsx` | Capability categories are less persuasive than problem/outcome service cards | Merge local taxonomy into live problem/outcome cards |
| P1 | Why page starts with student/portfolio framing | `src/app/why-work-with-me/page.tsx` | Weakens commercial credibility before the strong work history appears | Restore buyer credibility intro; move AI graduate/prototype honesty lower |
| P1 | Primary CTA language is weaker | Header, home, services, contact | "Work With Me" is broad; "Book a Call" is clearer for a consulting conversion | Prefer "Book a Call" for primary CTAs, or use "Start a Project" only if intake remains primary |
| P1 | Detail template shows "Public Repository" even when no repo exists | `src/app/case-studies/[slug]/page.tsx` | On production/live-site projects, this label is misleading and template-driven | Make the block conditional: "Public Repository" only for GitHub; "Live proof" for external URLs |
| P1 | Related case studies are no longer stage-aware | `src/app/case-studies/[slug]/page.tsx` | VIFG detail pages recommend prototypes first, diluting proof context | Restore stage-aware related logic or manually curate related cards |
| P1 | Local services page has serious axe contrast failures | `src/app/services/page.tsx` | Small muted labels fail contrast on light background | Increase label contrast/size or use existing live-safe styling |
| P1 | Local headless console audit saw GA CSP errors | `next.config.ts` behavior observed locally | Browser console errors reduce production confidence, even if analytics still mostly works | Verify GA endpoint behavior and allow the actual collect endpoint or suppress GA locally |
| P2 | Screenshot placeholders are honest but visually weak | Case-study details for WeatherForge/RAGeATM/DGM | Large placeholder blocks feel unfinished | Keep the honesty, but add real screenshots before featuring these projects heavily |
| P2 | "Applied AI/data" wording is repeated heavily | Layout, home, services, contact, why | Repetition makes the site feel generic and buzzword-adjacent | Use it as a supporting capability, not the main brand phrase |
| P2 | New no-em-dash test is narrow | `src/__tests__/content/` | It prevents one style issue but does not measure commercial clarity | Keep only if this is an intentional house style |

## Improvements Worth Keeping
| Improvement | Where | Why it may be worth keeping | Caveat |
|---|---|---|---|
| WeatherForge quantified metrics | `src/data/systems.ts`, WeatherForge detail page | Specific record counts, data range, sources, and limitations improve technical credibility | Keep only if the numbers are verified and not overstated |
| RAGeATM detail page | `src/data/systems.ts`, `src/app/case-studies/[slug]/page.tsx` | Honest small-scope RAG proof is better than vague AI claims | Do not feature it above VIFG on main buyer pages |
| Limitations and next-improvements sections | Case-study detail template | Mature, honest framing reduces overclaim risk | Avoid applying generic "limitations" blocks where they make production work look incomplete |
| GitHub links for prototype projects | Case-study detail pages | Lets technical visitors inspect the work | Do not call every project a repository-backed case study |
| MetricCard and TechTag components | `src/components/site/metric-card.tsx`, `src/components/site/tech-tag.tsx` | Useful small components for structured proof | Use them to support proof, not replace buyer-facing problem/result copy |
| Prototype / Academic Project labels | WeatherForge, RAGeATM | Clear maturity labels are trust-building | Labels must not become the first impression of the whole site |
| More structured architecture sections | Case-study detail template | Helps technical credibility and hiring/research conversations | Keep details subordinate to business proof on public consulting pages |
| Content punctuation test | `src/__tests__/content/` | Enforces a style preference consistently | It is not a positioning or quality test |

## Copy/Positioning Audit
The local site does not clearly preserve the live site's core promise: "I help businesses reduce manual workflow friction." It still communicates that you build dependable systems, but the center of gravity moves to dashboards, RAG, data pipelines, prototypes, and decision support. That is a narrower and more technical offer, and it reads less like a business consulting site for owners/operators. VIFG is no longer treated as the strongest public production proof on the homepage or case-studies index, which is the most damaging local change. WeatherForge and RAGeATM are framed more honestly as prototype/academic work in their detail pages, but the main pages feature them too prominently. DGM and StormIQ remain labeled as R&D/active build, which is good. The buyer still has a contact path, but the CTA and form copy now imply "prototype conversation" more than "fix my workflow."

| Category | Live score | Local score | Winner | Notes |
|---|---:|---:|---|---|
| Buyer clarity | 9 | 5 | Live | Live names SMB workflow pain; local names broad technical categories. |
| Commercial credibility | 8 | 5 | Live | Local leans student/project/AI portfolio. |
| Technical credibility | 7 | 8 | Local | Local detail pages add stronger metrics and architecture. |
| Proof hierarchy | 9 | 4 | Live | Local puts prototypes before VIFG. |
| Honesty/maturity of project framing | 8 | 8 | Tie | Local is stronger in detail pages, weaker in top-level ordering. |
| Conversion path | 8 | 6 | Live | Local still has contact, but CTA language and hero intent are weaker. |
| Visual hierarchy | 8 | 6 | Live | Local is cleaner in places but flattens proof priority. |
| Accessibility | 7 | 7 | Tie | Both have axe issues; local introduces service contrast failures and keeps contact landmark issue. |
| SEO | 8 | 6 | Live | Local loses workflow automation/SMB search intent and broadens into crowded AI terms. |
| Overall trust | 8 | 5 | Live | Local feels more technically interesting but less commercially trustworthy. |

## Recommended Restoration Plan
### Minimum Safe Fix
Restore the live homepage positioning, header tagline, footer description, global metadata, primary CTA language, and contact framing. Put VIFG back as the first proof item on the homepage and case-studies page. Fix the broken resume link. Keep the richer WeatherForge/RAGeATM detail data, but stop featuring those projects above VIFG. Repair the local services contrast issue and verify the GA CSP console errors before shipping.

### Selective Revert Plan
Restore or merge back the live versions of `src/app/page.tsx`, `src/app/case-studies/page.tsx`, the top of `src/app/why-work-with-me/page.tsx`, the top of `src/app/contact/page.tsx`, and the global brand copy in `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, and `src/lib/social-card.tsx`. In `src/data/profile.ts`, restore the workflow automation consulting summary, audience, home signals, conversion points, and service problem/outcome framing. In `src/data/systems.ts`, preserve the new WeatherForge/RAGeATM detail fields but move `vifg-nonprofit-platform` back to the top of `orderedSystemIds`. In `src/app/case-studies/[slug]/page.tsx`, keep the enhanced detail template but make repository/live-proof sections conditional and make related case studies stage-aware again.

### Better Than Live Plan
After restoring what worked, reposition the site as "workflow automation and dependable systems consulting, with applied AI/data used where it genuinely helps." Add a small "Current R&D / technical lab" subsection below VIFG rather than replacing VIFG. Use the WeatherForge and RAGeATM detail pages as proof for technical visitors, not as the main buyer funnel. Keep the live site's buyer pain language, but add one sharper line explaining that your automation work can include dashboards, data pipelines, retrieval assistants, and internal tools when those are the right solution. Add real screenshots for WeatherForge and RAGeATM before promoting them heavily. Add a short proof matrix that clearly marks each project as Production, Pilot, Prototype, Academic, or R&D.

## Exact Patch Recommendations
| File | Section/component | Action | Reason |
|---|---|---|---|
| `src/app/page.tsx` | Hero | Restore live | Live headline is far more buyer-facing and conversion-focused. |
| `src/app/page.tsx` | Proof section | Merge live + local | Restore VIFG first; optionally add WeatherForge/RAGeATM as secondary technical examples. |
| `src/app/page.tsx` | Final CTA | Rewrite | Keep contact CTA, but make it about workflow/business improvement, not generic prototypes. |
| `src/app/case-studies/page.tsx` | Page intro | Restore live | Live explains production/pilot/R&D maturity and sets the right proof expectation. |
| `src/app/case-studies/page.tsx` | Case-study grid | Restore live | Bring back VIFG featured proof and stage sections. |
| `src/app/case-studies/[slug]/page.tsx` | Metrics/architecture/limitations | Keep local | This is the strongest local improvement. |
| `src/app/case-studies/[slug]/page.tsx` | Public Repository block | Rewrite | Show repository language only when `githubUrl` exists; otherwise show live proof or omit. |
| `src/app/case-studies/[slug]/page.tsx` | Related case studies | Merge live + local | Keep richer cards but restore stage-aware or curated related logic. |
| `src/app/services/page.tsx` | Service taxonomy | Merge live + local | Keep data/AI capabilities, but restore problem/outcome framing. |
| `src/app/services/page.tsx` | Supporting examples | Rewrite | Include VIFG first, then WeatherForge/RAGeATM as technical examples. |
| `src/app/contact/page.tsx` | Hero | Restore live | "Workflow you want to improve" fits the consulting buyer better. |
| `src/components/sections/contact.tsx` | Form options/placeholders | Merge live + local | Keep AI/data options, but lead with workflow automation/system integration. |
| `src/app/why-work-with-me/page.tsx` | Intro paragraphs | Restore live | Lead with delivery credibility and VIFG, not student/prototype identity. |
| `src/app/why-work-with-me/page.tsx` | Honest prototype paragraph | Keep local | Useful, but place it lower as supporting context. |
| `src/app/layout.tsx` | Metadata/keywords/schema | Merge live + local | Restore workflow automation consulting as primary; add AI/data as secondary keywords. |
| `src/components/layout/header.tsx` | Tagline and CTA | Restore live | Header should say what buyers can hire you for and push a clear call. |
| `src/components/layout/footer.tsx` | Footer description | Restore live | Footer should reinforce the consulting offer, not a portfolio label. |
| `src/lib/social-card.tsx` | Social card copy | Restore live | Social previews should sell the strongest buyer promise. |
| `src/data/profile.ts` | Core profile/audience/services/conversion | Restore live | Shared data currently causes the broad brand drift across the site. |
| `src/data/systems.ts` | WeatherForge/RAGeATM rich fields | Keep local | Good technical proof if verified. |
| `src/data/systems.ts` | `orderedSystemIds` | Restore live | VIFG must be first. |
| `src/data/social-links.ts` | `resumeUrl` | Rewrite | Local file is `public/resume.pdf`; `/Resume.pdf` is broken locally. |
| `e2e/smoke.spec.ts` | Case/CTA smoke expectations | Rewrite | Tests should enforce the restored proof hierarchy and CTA strategy. |
| `src/components/site/metric-card.tsx` | Component | Keep local | Useful for structured case-study proof. |
| `src/components/site/tech-tag.tsx` | Component | Keep local | Useful small display helper. |
| `src/__tests__/content/no-em-dash.test.ts` | Test | Keep local | Fine as a style guard if intentional. |

## Final Verdict
Selectively revert the weak sections.
