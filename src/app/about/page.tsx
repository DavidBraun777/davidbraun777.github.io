import { permanentRedirect } from 'next/navigation'

export default function AboutRedirectPage() {
  return permanentRedirect('/experience')
}
