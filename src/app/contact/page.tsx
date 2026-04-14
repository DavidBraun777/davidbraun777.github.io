import type { Metadata } from 'next'
import { Contact } from '@/components/sections/contact'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact David Braun for career opportunities, consulting conversations, or technical project work.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Contact"
          title="Start a conversation."
          description="Use this page for full-time opportunities, consulting conversations, collaboration, or system-specific questions. The form is structured to make the next step low-friction."
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
