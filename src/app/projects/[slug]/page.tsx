import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectRedirectPage({ params }: Props) {
  const { slug } = await params
  redirect(`/case-studies/${slug}`)
}
