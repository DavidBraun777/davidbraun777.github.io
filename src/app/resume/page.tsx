import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { PageIntro } from '@/components/site/page-intro'
import { SignalGrid } from '@/components/site/signal-grid'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { certifications, education } from '@/data/education'
import { experiences } from '@/data/experience'
import { resumeHighlights } from '@/data/profile'
import { focusAreas, otherSkills, skillCategories } from '@/data/skills'
import { resumeUrl } from '@/data/social-links'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume highlights, experience, skills, education, and credentials for David Braun.',
}

export default function ResumePage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Resume"
          title="Resume, highlights, and the supporting detail behind the portfolio."
          description="This page surfaces the core proof from the resume directly in the site so visitors can understand credibility without needing to open a PDF first."
          actions={[
            { label: 'Open PDF Resume', href: resumeUrl, icon: FileText, external: true },
            { label: 'Contact', href: '/contact', variant: 'secondary' },
          ]}
        />

        <SignalGrid items={resumeHighlights} />

        <section>
          <SectionHeader
            align="left"
            title="Experience"
            subtitle="Detailed roles and responsibilities, with deeper highlights available on demand."
          />
          <div className="grid gap-5">
            {experiences.map((experience, index) => (
              <DisclosurePanel
                key={experience.id}
                title={`${experience.role} · ${experience.company}`}
                summary={`${experience.startDate} to ${experience.endDate ?? 'Present'} · ${experience.description}`}
                defaultOpen={index === 0}
              >
                <ul className="space-y-3">
                  {experience.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-sm leading-7 text-text-secondary"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                {experience.technologies ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.technologies.map((technology) => (
                      <Badge key={technology} variant="outline" className="text-sm">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </DisclosurePanel>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Skills and focus areas"
            subtitle="Grouped to make the technical range easier to scan."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skillCategories.map((category) => (
              <article
                key={category.id}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  {category.name}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-lg font-semibold text-text-primary">
                Working style
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherSkills.workingStyle.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherSkills.additional.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-lg font-semibold text-text-primary">
                Current focus areas
              </h3>
              <div className="mt-4 grid gap-4">
                {focusAreas.map((area) => (
                  <div key={area.title}>
                    <p className="text-sm font-semibold text-text-primary">
                      {area.title}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-text-secondary">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Education and credentials"
            subtitle="Academic and certification signals that support the current trajectory."
          />
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-text-primary">
                    {item.degree} in {item.field}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-link-primary">
                    {item.institution}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {item.startDate} to {item.endDate ?? 'Present'}
                  </p>
                  {item.secondaryCredential ? (
                    <p className="mt-4 text-sm leading-7 text-text-secondary">
                      Additional credential: {item.secondaryCredential}.
                    </p>
                  ) : null}
                  {item.coursework ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.coursework.map((course) => (
                        <Badge key={course} variant="outline">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="space-y-5">
              {certifications.map((item) => (
                <a
                  key={item.id}
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    Certification
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-text-primary">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">
                    {item.issuer} · {item.issueDate}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
