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
    await expect(header.getByRole('link', { name: /^home$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^services$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /case studies/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /why work with me/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /^contact$/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /projects/i })).toHaveCount(0)
  })

  test('services page loads', async ({ page }) => {
    await page.goto('/services')
    await expect(page).toHaveTitle(/Services/)
  })

  test('writing page loads', async ({ page }) => {
    await page.goto('/writing')
    await expect(page).toHaveTitle(/Writing/)
  })

  test('case studies page shows VIFG before secondary technical proof', async ({ page }) => {
    await page.goto('/case-studies')
    await expect(page.getByRole('heading', { name: /featured public production proof/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /vifg nonprofit platform/i }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /weatherforge/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /rageatm/i })).toBeVisible()

    const mainText = await page.locator('main').innerText()
    expect(mainText.indexOf('VIFG Nonprofit Platform')).toBeLessThan(
      mainText.indexOf('WeatherForge')
    )
  })

  test('homepage primary CTA goes to contact', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', {
        name: /remove manual work from the workflows that keep slowing your business down/i,
      })
    ).toBeVisible()
    await page.getByRole('link', { name: /^book a call$/i }).first().click()
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('contact path is workflow-first', async ({ page }) => {
    await page.goto('/contact')
    await expect(
      page.getByRole('heading', { name: /tell me about the workflow you want to improve/i }).first()
    ).toBeVisible()
  })

  test('legacy routes redirect to the new IA', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/writing$/)

    await page.goto('/background')
    await expect(page).toHaveURL(/\/why-work-with-me$/)

    await page.goto('/projects')
    await expect(page).toHaveURL(/\/case-studies$/)
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
