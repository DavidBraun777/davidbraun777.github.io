import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/David Braun/)
    // Hero section should be visible
    await expect(page.locator('main')).toBeVisible()
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    // Check key nav links exist
    await expect(header.getByRole('link', { name: /projects/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /writing/i })).toBeVisible()
  })

  test('writing page loads', async ({ page }) => {
    await page.goto('/writing')
    await expect(page).toHaveTitle(/Writing/)
  })

  test('contact section is reachable from the homepage', async ({ page }) => {
    await page.goto('/')
    const contact = page.locator('#contact')
    await expect(contact).toBeAttached()
  })

  test('legacy routes redirect to the new IA', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/writing$/)

    await page.goto('/background')
    await expect(page).toHaveURL(/\/resume$/)
  })

  test('CSP header is set', async ({ page }) => {
    const response = await page.goto('/')
    const csp = response?.headers()['content-security-policy']
    expect(csp).toBeDefined()
    expect(csp).toContain("script-src")
    expect(csp).toContain("'unsafe-inline'")
  })

  test('security headers are present', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers() ?? {}
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['strict-transport-security']).toContain('max-age=')
  })

  test('404 page works', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })
})
