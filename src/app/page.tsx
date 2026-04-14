import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, FileText, Mail, NotebookPen } from 'lucide-react'
import { PostCard } from '@/components/blog/post-card'
import { ProjectCard } from '@/components/site/project-card'
import { SignalGrid } from '@/components/site/signal-grid'
import { SectionHeader } from '@/components/ui/section-header'
import { contactPaths, homeSignals, processPreview, profile, whatIDoAreas } from '@/data/profile'
import { socialLinks } from '@/data/social-links'
import { featuredSystems } from '@/data/systems'
import { getAllPosts } from '@/lib/mdx'

const homeProjectIds = [
  'stormiq',
  'roboreceptionist',
  'naics-startup-planning-system',
  'vifg-nonprofit-platform',
]

export default function Home() {
  const posts = getAllPosts().slice(0, 3)
  const selectedProjects = featuredSystems.filter((project) => homeProjectIds.includes(project.id))

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_56%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_48%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 md:pt-16 lg:px-8 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="relative z-10">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-700 dark:text-primary-300">
                Personal authority site
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                Hi, I&apos;m David Braun.
              </h1>
              <p className="mt-5 max-w-3xl text-2xl font-medium leading-9 text-slate-800 dark:text-slate-100">
                AI systems engineer and software builder focused on real operational systems.
              </p>
              <div className="mt-6 space-y-3 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                <p>{profile.graduateStatus}</p>
                <p>{profile.graduateProgram}</p>
                <p>{profile.graduation}</p>
                <p>{profile.summary}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </a>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Explore Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/writing"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <NotebookPen className="h-4 w-4" />
                  Read Writing
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Mail className="h-4 w-4" />
                  Work With Me
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-950">
                  {profile.location}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-950">
                  {profile.availability}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon

                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : undefined}
                      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="relative z-10">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_80px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950">
                <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[340px] bg-gradient-to-br from-slate-200 via-slate-100 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <Image
                      src="/images/profile/Smolder.png"
                      alt="David Braun portrait"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 32vw, 100vw"
                      priority
                    />
                  </div>
                  <div className="p-6 sm:p-7">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-700 dark:text-primary-300">
                      First-screen clarity
                    </p>
                    <div className="mt-4 space-y-3">
                      {[
                        'AI systems, workflow software, and infrastructure-backed products',
                        'Graduate student in AI with a Big Data certificate in progress',
                        'Interested in full-time roles, research-minded engineering work, and selective consulting',
                        'Strongest when architecture, implementation, and product judgment all need to show up together',
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-primary-200 bg-primary-50 p-4 dark:border-primary-900 dark:bg-primary-950/40">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
                        Where to start
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
                        Start with projects for proof, systems for technical depth, writing for
                        thinking, and resume for credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SignalGrid items={homeSignals} />
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="left"
            title="Selected work"
            subtitle="A smaller set of projects that best show how I approach system design, architecture boundaries, and truthful delivery."
          />
          <div className="grid gap-6">
            {selectedProjects.map((system) => (
              <ProjectCard key={system.id} system={system} compact />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
            >
              See the full project archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50/80 dark:bg-slate-900/35">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What I do"
            subtitle="Work that sits at the intersection of engineering execution, system architecture, and applied product judgment."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {whatIDoAreas.map((area) => {
              const Icon = area.icon

              return (
                <article
                  key={area.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {area.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader
                align="left"
                title="How I approach the work"
                subtitle="A concise version of the engineering philosophy. The deeper system thinking lives on the systems page."
                className="mb-8"
              />
              <p className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
                I prefer projects where the hard part is not just the feature, but the
                routing, constraints, validation, state, observability, and delivery path
                around it. That is usually where the actual product value lives.
              </p>
              <Link
                href="/systems"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
              >
                Explore systems and engineering artifacts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {processPreview.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50/80 dark:bg-slate-900/35">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="left"
            title="Writing and insights"
            subtitle="Short essays on AI systems, workflow automation, architecture tradeoffs, and building things that have to survive contact with reality."
          />
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              Writing previews will appear here as new essays are published.
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-10">
            <SectionHeader
              align="left"
              title="Next step"
              subtitle="The site is structured for both career conversations and future client or consulting opportunities. Pick the path that fits."
              className="mb-8"
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {contactPaths.map((path) => {
                const Icon = path.icon

                return (
                  <article
                    key={path.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                      {path.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {path.description}
                    </p>
                    <Link
                      href={path.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
                    >
                      {path.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
