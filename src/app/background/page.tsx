import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Badge } from '@/components/ui/badge'
import { experiences } from '@/data/experience'
import { education, certifications } from '@/data/education'
import { focusAreas, otherSkills, positioningTracks, skillCategories } from '@/data/skills'
import { resumeUrl } from '@/data/social-links'

export const metadata: Metadata = {
  title: 'Experience & Skills',
  description:
    'Experience, skills, certifications, and education relevant to AI systems engineering, backend platforms, and infrastructure-backed software.',
}

export default function BackgroundPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 md:pt-32 lg:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section
          id="experience-overview"
          className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/45 sm:p-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">
            Experience & Skills
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Experience, skills, and credentials behind the systems.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            This page shows the background behind the portfolio: backend engineering,
            infrastructure automation, cloud delivery, security work, applied AI
            systems, and current graduate study in artificial intelligence.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            The strongest fit is work where backend platforms, workflow automation,
            infrastructure, and AI-enabled product logic need to ship together as one
            system.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-500"
            >
              <FileText className="h-4 w-4" />
              Open resume
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {positioningTracks.map((track) => (
              <article
                key={track.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300">
                  Best-fit role
                </p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {track.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {track.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="work-experience" className="mt-20">
          <SectionHeader
            align="left"
            title="Work Experience"
            subtitle="Roles across consulting, enterprise engineering, infrastructure, security, and application development that support systems-focused AI work."
          />

          <div className="space-y-6">
            {experiences.map((experience) => (
              <article
                key={experience.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {experience.role}
                      </h2>
                      {experience.companyUrl ? (
                        <a
                          href={experience.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
                        >
                          {experience.company}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          {experience.company}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                      {experience.description}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary-500" />
                      {experience.startDate} - {experience.endDate || 'Present'}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      {experience.location}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Highlights
                    </p>
                    <ul className="mt-4 space-y-3">
                      {experience.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                        >
                          <span className="mt-1 text-primary-500">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {experience.technologies ? (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                        Stack and Tools
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {experience.technologies.map((technology) => (
                          <Badge key={technology} variant="outline" className="text-sm">
                            {technology}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="mt-20">
          <SectionHeader
            align="left"
            title="Skills"
            subtitle="Current stack organized around applied AI systems, backend and platform engineering, cloud infrastructure, and production delivery."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {skillCategories.map((category) => {
              const Icon = category.icon

              return (
                <article
                  key={category.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-2xl bg-primary-100 p-3 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="default" className="cursor-default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300">
                Working Style
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherSkills.workingStyle.map((item) => (
                  <Badge key={item} variant="outline" className="text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300">
                Additional
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherSkills.additional.map((item) => (
                  <Badge key={item} variant="outline" className="text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="focus-areas" className="mt-20">
          <SectionHeader
            align="left"
            title="Current Focus Areas"
            subtitle="Where the stack is going deeper right now as the work moves further toward AI systems and platform engineering."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {focusAreas.map((area) => (
              <article
                key={area.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {area.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {area.signals.map((signal) => (
                    <Badge key={signal} variant="outline" className="text-sm">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="education-credentials"
          className="mt-20 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <SectionHeader
              align="left"
              title="Education"
              subtitle="Academic work that supports the applied systems and AI focus of the portfolio."
            />

            <div className="space-y-6">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex rounded-2xl bg-primary-100 p-3 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {item.degree} in {item.field}
                        </h3>
                        {item.inProgress ? <Badge variant="secondary">In Progress</Badge> : null}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        {item.institutionUrl ? (
                          <a
                            href={item.institutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
                          >
                            {item.institution}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span>{item.institution}</span>
                        )}
                        <span>
                          {item.startDate} - {item.endDate || 'Present'}
                        </span>
                      </div>

                      {item.description ? (
                        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      ) : null}

                      {item.coursework ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.coursework.map((course) => (
                            <Badge key={course} variant="outline" className="text-sm">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              align="left"
              title="Certifications"
              subtitle="Credentials that support the infrastructure and cloud side of the work."
            />

            <div className="space-y-6">
              {certifications.map((certification) => (
                <a
                  key={certification.id}
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                      <Image
                        src={certification.badgeImage}
                        alt={certification.name}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-accent-amber" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {certification.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {certification.issuer} • {certification.issueDate}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200">
                        View credential
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
