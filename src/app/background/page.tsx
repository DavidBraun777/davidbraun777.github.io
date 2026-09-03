import { permanentRedirect } from 'next/navigation'

export default function BackgroundRedirectPage() {
  return permanentRedirect('/experience')
}
