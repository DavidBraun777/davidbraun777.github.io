# David Braun | Portfolio

A modern, responsive portfolio website built with Next.js 14+, TypeScript, Tailwind CSS, and Framer Motion.

**Live Site:** [dbraun.io](https://dbraun.io)

## Features

- **Modern Stack** — Next.js 14+ with App Router, TypeScript, Tailwind CSS v4
- **Dark Mode** — System preference detection with manual toggle
- **Animations** — Smooth scroll-reveal and hover effects with Framer Motion
- **MDX Blog** — Write blog posts in Markdown with React component support
- **Contact Form** — Server-side email handling with Resend
- **Responsive** — Mobile-first design with collapsible navigation
- **SEO Optimized** — Metadata, Open Graph, and structured data
- **Accessible** — Semantic HTML, keyboard navigation, reduced motion support

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 14+](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Blog | [MDX](https://mdxjs.com/) via next-mdx-remote |
| Email | [Resend](https://resend.com/) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
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
# Email configuration (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=your-email@example.com

# Optional: Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Get your Resend API key at [resend.com](https://resend.com).

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
│   ├── layout/             # Header, Footer, ThemeToggle
│   ├── sections/           # Page sections (Hero, About, etc.)
│   └── blog/               # Blog-specific components
├── content/blog/           # MDX blog posts
├── data/                   # Static data (experience, skills, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
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

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/new)
3. Add environment variables in Project Settings
4. Deploy

Vercel will automatically deploy on every push to `main`.

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
