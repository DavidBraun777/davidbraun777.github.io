# David Braun | Portfolio

A modern, responsive portfolio website built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Framer Motion.

**Live Site:** [dbraun.io](https://dbraun.io)

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
