import { Resend } from 'resend'
import { isValidEmail } from '@/lib/contact-validation'

export interface ContactEmailConfig {
  notificationEmail: string
  fromEmail: string
  fromName: string
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

function requireEnv(name: string): string {
  const value = readEnv(name)
  if (!value) {
    throw new Error(`${name} is not configured`)
  }
  return value
}

function assertValidEmail(value: string, envName: string): string {
  if (!isValidEmail(value)) {
    throw new Error(`${envName} must be a valid email address`)
  }
  return value
}

function sanitizeDisplayName(value: string): string {
  return value.trim().replace(/[\r\n"]/g, '').slice(0, 64)
}

export function getResendClient(): Resend {
  return new Resend(requireEnv('RESEND_API_KEY'))
}

export function getContactEmailConfig(): ContactEmailConfig {
  const notificationEmail = readEnv('CONTACT_NOTIFICATION_EMAIL') ?? readEnv('CONTACT_EMAIL')
  if (!notificationEmail) {
    throw new Error('CONTACT_NOTIFICATION_EMAIL is not configured')
  }

  const fromEmail = readEnv('CONTACT_FROM_EMAIL') ?? 'contact@dbraun.io'
  const fromName = sanitizeDisplayName(readEnv('CONTACT_FROM_NAME') ?? 'dbraun.io Contact')

  if (!fromName) {
    throw new Error('CONTACT_FROM_NAME must not be empty')
  }

  return {
    notificationEmail: assertValidEmail(
      notificationEmail,
      'CONTACT_NOTIFICATION_EMAIL'
    ),
    fromEmail: assertValidEmail(fromEmail, 'CONTACT_FROM_EMAIL'),
    fromName,
  }
}

export function formatFromAddress(name: string, email: string): string {
  return `${name} <${email}>`
}
