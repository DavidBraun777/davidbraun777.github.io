import type { Metadata } from 'next'
import { Contact } from '@/components/sections/contact'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book a call about workflow automation, system integration, or operational software consulting.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Contact"
          title="Book a call about the workflow that is costing you time."
          description="For business owners and operators who need to reduce manual work, connect systems, or clean up an unreliable process."
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
