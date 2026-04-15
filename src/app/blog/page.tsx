import { permanentRedirect } from 'next/navigation'

export default function BlogRedirectPage() {
  permanentRedirect('/writing')
}
