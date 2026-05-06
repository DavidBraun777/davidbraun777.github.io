import type { Metadata } from 'next'
import { Contact } from '@/components/sections/contact'
import { PageIntro } from '@/components/site/page-intro'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description:
    'Start a consulting conversation about workflow automation, system integration, operational software, data movement, or practical AI-assisted workflow support.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Contact"
          title="Tell me about the workflow you want to improve."
          description="Start with the intake form so I can understand the workflow, bottleneck, users, constraints, and desired outcome before we talk."
        />
      </div>
      <Contact
        calLink={process.env.CAL_LINK}
        showSectionHeader={false}
        sectionId="contact-form"
      />
    </div>
  )
}
