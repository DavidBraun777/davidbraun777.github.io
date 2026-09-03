import type { Metadata } from 'next'
import { Contact } from '@/components/sections/contact'
import { PageIntro } from '@/components/site/page-intro'
import { parseInquiryType } from '@/lib/contact-validation'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description:
    'Contact David Braun about engineering roles, consulting projects, research collaboration, speaking, or other professional inquiries.',
  path: '/contact',
})

interface ContactPageProps {
  searchParams: Promise<{ type?: string | string[] }>
}

export default async function ContactPage({
  searchParams,
}: Readonly<ContactPageProps>) {
  const { type } = await searchParams
  const initialInquiryType = parseInquiryType(type)

  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Contact"
          title="Start a focused conversation."
          description="Choose the kind of inquiry, then share enough context for a useful next step. The same form supports engineering roles, consulting projects, research collaboration, speaking, and other professional conversations."
        />
      </div>
      <Contact
        key={initialInquiryType ?? 'general'}
        calLink={process.env.CAL_LINK}
        initialInquiryType={initialInquiryType}
        showSectionHeader={false}
        sectionId="contact-form"
      />
    </div>
  )
}
