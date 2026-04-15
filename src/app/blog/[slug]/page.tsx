import { permanentRedirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostRedirectPage({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/writing/${slug}`)
}
