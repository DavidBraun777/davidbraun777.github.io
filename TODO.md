# dbraun.io TODO

This backlog separates true launch checks from proof work, optional polish, and
retired recommendations. Do not use it as a redesign queue.

## P0 Launch Blockers

- [ ] Verify the live contact form end to end with one controlled production submission.
- [ ] Decide whether Google Analytics should collect now. If yes, verify no browser console block; if no, keep `NEXT_PUBLIC_GA_ID` unset.
- [ ] Before dependency/security work, verify with Node 20 and a clean `npm ci` environment so local drift does not hide lockfile issues.

## P1 Buyer/Portfolio Improvements

Proof-pack work below requires real artifacts, facts, screenshots, logs, diagrams, or
operational details from David. Do not invent proof.

- [ ] Add a DealerFlow proof pack: walkthrough GIF/video, lifecycle diagram, notification/queue artifact, and bounded pilot facts.
- [ ] Add VIFG bounded operational facts: release cadence, maintenance scope, accessibility evidence, traffic/user range, uptime window, or equivalent defensible facts.
- [ ] Add one real VIFG artifact beyond the deployment diagram.
- [ ] Add WeatherForge dashboard screenshots and reproducible data-refresh/validation notes.
- [ ] Add a small RAGeATM demo surface or terminal/log proof, then mirror the retrieval ladder into the RAGeATM GitHub README/docs.
- [ ] Human-review ownership, status, and production/pilot/prototype wording line by line.
- [ ] Re-check public proof links monthly: VIFG, time2move, arklandscaping, WeatherForge GitHub, RAGeATM GitHub, resume PDF.

## P2 Technical Polish

- [ ] Broaden Playwright coverage beyond the current smoke/a11y suite when it catches real deployment risk.
- [ ] Add Service or CreativeWork schema only where it maps to real pages and proof.
- [ ] Add a simple privacy page if GA/contact intake remain live.
- [ ] Formalize screenshot/diagram naming and placement after the first new proof pack exists.
- [ ] Remove any future generated browser/tool logs from Git tracking and keep them ignored.

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
- [x] Lightweight Playwright coverage added for console errors, mobile rendering, and additional axe scans.
