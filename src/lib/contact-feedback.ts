export function getSchedulingUrl(value?: string): string | null {
  if (!value) return null

  try {
    const url = new URL(value.trim())
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null
    return url.href
  } catch {
    return null
  }
}

interface ContactFailure {
  message: string
  retryAfterSeconds: number
}

export function getContactFailure(response: Pick<Response, 'status' | 'headers'>): ContactFailure {
  if (response.status === 429) {
    // The contact route sends Retry-After as whole seconds. Bound the timer to
    // the browser's supported delay; an invalid header must not create a lockout.
    const header = response.headers.get('Retry-After')
    const seconds = header !== null && /^\d+$/.test(header) ? Number(header) : 0
    const retryAfterSeconds = Number.isSafeInteger(seconds) && seconds > 0 && seconds <= 2_147_483
      ? seconds
      : 0
    const wait = retryAfterSeconds > 0
      ? 'Wait ' + retryAfterSeconds + (retryAfterSeconds === 1 ? ' second' : ' seconds') + ' before sending again.'
      : 'Please wait a moment before trying again.'
    return { message: 'Too many attempts. ' + wait + ' Your draft is still here.', retryAfterSeconds }
  }

  const messages: Partial<Record<number, string>> = {
    400: 'Please check your inquiry details and try again.',
    403: 'This inquiry could not be accepted. Try again later.',
    413: 'This inquiry is too large. Shorten the message and try again.',
  }
  const message = messages[response.status] ?? 'The contact service is temporarily unavailable. Try again later.'
  return { message: message + ' Your draft is still here.', retryAfterSeconds: 0 }
}
