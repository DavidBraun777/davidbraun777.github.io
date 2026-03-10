# David Braun | Portfolio

A modern, responsive portfolio website built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Framer Motion.

**Live Site:** [dbraun.io](https://dbraun.io)

---

## dbraun.io Upgrade Roadmap

### Executive Summary

**Goal:** Transform dbraun.io from a strong engineer portfolio into a **top-tier AI engineer website and technical authority platform** — positioning David Braun as an applied AI / infrastructure / systems engineer rather than a broad generalist.

This roadmap covers strategic content upgrades, structural improvements, and operational polish. Each item is categorized by execution status, ownership, and priority phase.

---

### Completed by AI in This Pass

- [x] **Sharpen hero positioning for AI engineer identity** — Updated typewriter roles to lead with AI/infrastructure identity instead of generic titles. *(Owner: AI)*
- [x] **Improve About section AI positioning** — Rewrote bio and competency cards to emphasize AI engineering, infrastructure, and applied ML identity while staying factual. *(Owner: AI)*
- [x] **Update CurrentStatus component** — Replaced generic status items with AI/infrastructure-focused items grounded in David's actual Master's program and work. *(Owner: AI)*
- [x] **Add "Currently Building" section scaffold** — Created new section component with placeholder content and TODO markers for David to fill in. Wired into homepage. *(Owner: AI)*
- [x] **Improve project descriptions toward case-study style** — Rewrote project descriptions using problem → approach → outcome structure where facts support it. Added TODO comments for missing metrics. *(Owner: AI)*
- [x] **Add navigation for new sections** — Updated header nav to include "Building" section with scroll spy support. *(Owner: AI)*
- [x] **Create docs/architecture/ placeholder** — Added folder with README for future architecture diagrams. *(Owner: AI)*
- [x] **Write comprehensive README upgrade plan** — This document. *(Owner: AI)*

### Execution Backlog — What Still Matters Most

These are the highest-leverage remaining tasks for `dbraun.io`. They are ordered by business and credibility impact, not by ease.

| Priority | Task | Why it matters | Where to update | Done when |
|------|------|------|------|------|
| P0 | Fill in the "Currently Building" section with real work | This is the clearest signal that the site reflects current momentum instead of a static resume | `src/components/sections/currently-building.tsx` | 3 real initiatives are listed with title, one-sentence objective, current status, and next milestone |
| P0 | Add verified metrics to flagship projects | Metrics turn project descriptions into proof instead of claims | `src/data/projects.ts` | At least 3 flagship projects include concrete outcomes such as users, uptime, latency, performance gains, or scope handled |
| P0 | Add real visuals for flagship projects | Screenshots and diagrams increase scanability and trust faster than additional prose | `public/images/projects/` and `src/data/projects.ts` | Every featured project has a representative image or diagram; no flagship project relies on a generic fallback |
| P1 | Add real testimonials or intentionally keep the section hidden | Social proof helps, but placeholder credibility hurts; this should either be real or absent | `src/data/testimonials.ts` | 2-3 approved quotes with real names/roles are added, or the section remains intentionally omitted |
| P1 | Publish the first 2-3 authority posts | Blog content creates internal-link targets, SEO surface area, and evidence of technical depth | `src/content/blog/` | 2-3 posts are published and linked from relevant projects or homepage sections |
| P1 | Add architecture diagrams for top projects | Diagrams showcase systems thinking and create reusable proof assets for the future business site | `docs/architecture/` | 2 project diagrams exist and are referenced from the README and/or related project content |
| P1 | Add a "How Working With Me Works" section | This closes the gap between interest and action by clarifying process, communication style, and engagement expectations | New homepage section (recommended: `src/components/sections/working-with-me.tsx`) | The site explains the engagement flow in 3-5 steps and points to the contact CTA |
| P2 | Add an "AI Infrastructure Lab" section | This is a differentiated proof asset for AI + infrastructure positioning, but it only helps if it is concrete and public-safe | New homepage section plus `public/images/` assets | Public-safe specs, goals, and 1-2 visuals are published with a clear explanation of why the lab exists |

### Decision Log — Needed to Unblock Content

These decisions should be made before expanding copy or adding new sections, so the site grows coherently.

| Decision | Why it matters | Current default | Recommended next step |
|------|------|------|------|
| Final hero positioning title | Affects hero copy, metadata, About copy, and future business-site messaging | Rotating titles in the typewriter | Pick one primary title and use the others as supporting language |
| Availability and engagement model | Determines CTA language and whether the site feels portfolio-only or work-ready | General "Get In Touch" CTA | Decide whether to show availability and preferred engagement types |
| Which projects become full case studies first | Prevents spreading effort across too many projects at once | None selected yet | Start with `VIFG`, `security-lab`, and one AI/ML project |
| Whether to add FAQ | Useful only if the same objections keep appearing in real conversations | No FAQ section yet | Add only after repeated questions justify it |
| Whether to add a technical-depth mode | Can help advanced readers, but may complicate the UX if done too early | No toggle yet | Prefer project-level technical details before adding a global mode |
| Whether to add a resource hub | Good for long-term SEO, but only if there is capacity to maintain it | No resource hub yet | Defer until there are enough blog posts and reusable resources |

### Suggested Next 3 Work Sessions

#### Session 1 — Proof Pass
1. Add metrics to `src/data/projects.ts` for the top 3 projects.
2. Add real screenshots/diagrams under `public/images/projects/`.
3. Update featured projects to use the new assets.

#### Session 2 — Story Pass
1. Replace placeholder entries in `src/components/sections/currently-building.tsx`.
2. Finalize the primary hero positioning statement.
3. Add a "How Working With Me Works" section.

#### Session 3 — Authority Pass
1. Publish 2 blog posts in `src/content/blog/`.
2. Add 2 architecture diagrams in `docs/architecture/`.
3. Cross-link posts and projects so the site starts building topical authority.

### Later Backlog

- [ ] Add AI experiments / research section once there are 2-3 concrete projects worth showing
- [ ] Add engineering constraints / tradeoffs to flagship projects
- [ ] Add "What I Deliver" section focused on outcomes and deliverables
- [ ] Improve open-source credibility through public repos or contributions
- [ ] Add project timelines if case studies become more detailed
- [ ] Add collaborator / mentor credibility only with permission
- [ ] Audit site messaging against `public/Resume.pdf`
- [ ] Add a FAQ if real conversations show repeated objections or clarifications
- [ ] Add a resource hub only when there is enough content to support it

### Inputs David Still Needs to Provide

- Primary positioning title for the hero and metadata
- 3 current projects or experiments for the "Currently Building" section
- 2-3 approved testimonials with real names, roles, and companies
- Screenshots or diagrams for each featured project
- Verified metrics for `vifg`, `portfolio`, `security-lab`, and any other flagship work
- Public-safe AI lab details: hardware specs, workloads, and photos if desired
- Preferred engagement model: full-time, consulting, contract, or advisory
- The first 2 blog topics to publish from the strategy below
- The first 2 projects that should receive architecture diagrams

---

### Blog Strategy — Suggested Topics

These are suggested topics based on David's background. **None of these posts exist yet** — they need to be written.

**AI / ML Topics:**
- Lessons from my first semester in an AI Master's program
- Building a local AI inference stack: hardware choices and tradeoffs
- Practical machine learning for engineers who aren't data scientists

**Infrastructure / DevOps Topics:**
- Running 12 isolated VMs on Proxmox: my security lab architecture
- From Ansible playbooks to production: automating infrastructure at Securian Financial
- Pi-hole + custom DNS: network-level security for home labs

**Career / Industry Topics:**
- Why I'm pursuing an AI Master's after 5+ years in industry
- The intersection of cybersecurity and AI: what engineers need to know
- Accessibility-first development: lessons from building for the visually impaired

---

## Documentation

This repository hosts the personal portfolio website (`dbraun.io`).

Strategic documentation for the two-site expansion plan lives under `docs/`:

- `docs/README.md` — Documentation index
- `docs/dual-site-strategy.md` — Portfolio + business-site expansion strategy
- `docs/portfolio-vs-business-matrix.md` — Ownership split for growth initiatives
- `docs/ia-sitemap.md` — IA/sitemap for both domains
- `docs/cross-domain-architecture.md` — Cross-domain flow architecture diagrams
- `docs/execution-playbook.md` — Positioning + 12-week execution plan
- `docs/niches/README.md` — Niche project playbooks for building sellable proof
- `docs/architecture/README.md` — Architecture diagrams (placeholder for future diagrams)

## Dependency Maintenance Notes

### Blocked Dependabot PRs: ESLint 10 Migration

Two Dependabot PRs are intentionally **not safe to merge yet**:

- `#27` — `deps: bump @eslint/js from 9.39.2 to 10.0.1`
- `#19` — `deps: bump the linting group with 2 updates`

These are blocked by the current lint stack, not by application code.

#### Why `#27` is blocked

The repo uses a flat ESLint config in `eslint.config.mjs` and imports the top-level `@eslint/js` package directly:

```js
import eslint from "@eslint/js";
```

That means the root `@eslint/js` version must stay aligned with the root `eslint` version.

When `@eslint/js` is upgraded to `10.x` while `eslint` remains on `9.x`, package installation fails during deploys with an `ERESOLVE` peer dependency conflict:

- `@eslint/js@10` expects `eslint@^10`
- this repo currently uses `eslint@^9.39.2`

This failure was reproduced on Vercel during `npm install`, so `@eslint/js` must remain on the ESLint 9 line until the full lint stack moves together.

#### Why `#19` is blocked

The linting group PR attempts to move the repo onto ESLint 10, but the current plugin stack is not ready for that jump.

The immediate blocker is:

- `eslint-plugin-react@7.37.5`

That plugin currently supports ESLint 9 but not ESLint 10 in this repository's dependency graph, so `npm ci` fails before linting even runs.

In other words:

- `#27` fails because `@eslint/js` was upgraded **without** upgrading `eslint`
- `#19` fails because upgrading `eslint` to `10.x` requires additional plugin/config upgrades that are not yet in place

#### Current safe state

The safe, deployable state is:

- `eslint` on `^9.39.2`
- `@eslint/js` on `^9.39.2`

This alignment was restored after Vercel failed with a dependency resolution error.

#### Future upgrade path

Do **not** merge piecemeal ESLint 10 PRs into `master`.

When revisiting ESLint 10, upgrade and validate the lint stack together:

1. `eslint`
2. `@eslint/js`
3. `typescript-eslint`
4. `eslint-plugin-react`
5. `eslint-config-next` and related Next lint packages

Then re-run:

1. `npm ci`
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm test`
5. `npm run build`

Also note:

- ESLint 10 requires a newer Node baseline than ESLint 9
- if the repo adopts ESLint 10 later, confirm local, CI, and Vercel Node versions are all compatible before merging

## Features

- **Modern Stack** — Next.js 16 with App Router, TypeScript, Tailwind CSS v4
- **Dark Mode** — Dark theme by design for optimal readability
- **Animations** — Smooth scroll-reveal and hover effects with Framer Motion and GSAP
- **MDX Blog** — Write blog posts in Markdown with React component support
- **Contact Form** — Server-side email handling with Resend, input validation, and rate limiting
- **Responsive** — Mobile-first design with collapsible navigation
- **SEO Optimized** — Metadata, Open Graph, and structured data
- **Accessible** — Semantic HTML, keyboard navigation, reduced motion support
- **Tested** — Unit and integration tests with Vitest

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Blog | [MDX](https://mdxjs.com/) via next-mdx-remote |
| Email | [Resend](https://resend.com/) |
| Testing | [Vitest](https://vitest.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/DavidBraun777/davidbraun777.github.io.git
cd davidbraun777.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Email configuration (Resend) — required in production
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional: override recipient (defaults to davidjbraun777@gmail.com)
CONTACT_EMAIL=your-email@example.com

# Optional: Upstash Redis for distributed rate limiting
# Falls back to in-memory rate limiting when not set
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

Get your Resend API key at [resend.com](https://resend.com). For distributed rate limiting, create a free Redis database at [upstash.com](https://upstash.com).

**Note:** The contact form returns a 500 error if `RESEND_API_KEY` is not set.

## Project Structure

```
docs/                      # Strategic docs (portfolio + business expansion)
├── README.md              # Docs index
├── dual-site-strategy.md  # Two-site architecture and SEO linking plan
├── portfolio-vs-business-matrix.md
├── ia-sitemap.md          # IA/sitemap for both domains
├── cross-domain-architecture.md
├── execution-playbook.md
└── architecture/          # Architecture diagrams (future)
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + Tailwind
│   ├── api/contact/        # Contact form API route
│   └── blog/               # Blog listing and post pages
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Header, Footer, CurrentStatus
│   ├── sections/           # Page sections (Hero, About, etc.)
│   └── blog/               # Blog-specific components
├── content/blog/           # MDX blog posts
├── data/                   # Static data (experience, skills, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and validation
└── providers/              # React context providers
```

## Customization

### Personal Information

Edit the data files in `src/data/`:

- `experience.ts` — Work history
- `education.ts` — Education and certifications
- `projects.ts` — Portfolio projects
- `skills.ts` — Technical skills by category
- `testimonials.ts` — Colleague testimonials
- `social-links.ts` — Social media links and resume URL

### Styling

The design system is defined in `src/app/globals.css`:

- Colors are configured in the `@theme` block
- Modify `--color-primary-*` for the main accent color
- Accent colors: `--color-accent-cyan`, `--color-accent-violet`, etc.

### Blog Posts

Add new posts to `src/content/blog/` as `.mdx` files:

```mdx
---
title: "Your Post Title"
description: "A brief description of the post"
date: "2025-01-15"
author: "David Braun"
tags: ["Next.js", "React"]
---

Your content here...
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit & integration tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run size-check` | Check bundle size budget |
| `npx playwright test` | Run E2E smoke & accessibility tests |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/new)
3. Add environment variables in Project Settings
4. Deploy

Vercel will automatically deploy on every push to `master`.

### Custom Domain

1. In Vercel, go to Project Settings → Domains
2. Add your domain (e.g., `dbraun.io`)
3. Update DNS records as instructed
4. Update `metadataBase` in `src/app/layout.tsx`

## Performance

The site is optimized for Core Web Vitals:

- **Static Generation** — Pages are pre-rendered at build time
- **Image Optimization** — Automatic WebP/AVIF conversion via `next/image`
- **Font Optimization** — Self-hosted fonts via `next/font`
- **Code Splitting** — Automatic route-based splitting

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**David Braun**
- Email: [davidjbraun777@gmail.com](mailto:davidjbraun777@gmail.com)
- LinkedIn: [david-braun777](https://linkedin.com/in/david-braun777)
- GitHub: [DavidBraun777](https://github.com/DavidBraun777)
