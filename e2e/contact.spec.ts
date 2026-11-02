import { expect, test, type Page } from '@playwright/test'

async function fillInquiry(page: Page) {
  await page.getByLabel('Name', { exact: true }).fill('Portfolio Test')
  await page.getByLabel('Email', { exact: true }).fill('portfolio-test@example.test')
  await page.locator('#contact-subject').fill('Engineering role conversation')
  await page.locator('#contact-message').fill('I would like to discuss the engineering role and team context.')
}

test.describe('contact delivery feedback', { tag: '@cross-browser' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.clock.install({ time: new Date('2026-01-01T08:00:00Z') })
  })

  test('keeps a failed draft and confirmation visible, with a safe retry of the same inquiry', async ({ page }) => {
    const submissionIds: string[] = []
    // Every contact request is intercepted. This test never invokes email delivery.
    await page.route('**/api/contact', async route => {
      submissionIds.push(route.request().headers()['x-contact-submission-id'])
      await route.fulfill({
        status: submissionIds.length === 1 ? 503 : 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: submissionIds.length !== 1 }),
      })
    })
    await page.goto('/contact?type=employment')
    const form = page.getByRole('form', { name: 'Tell me about the engineering opportunity.', exact: true })
    await fillInquiry(page)
    await page.clock.pauseAt(new Date('2026-01-01T10:00:00Z'))
    const send = form.getByRole('button', { name: 'Send inquiry', exact: true })
    await send.click()
    await expect.poll(() => submissionIds.length).toBe(1)
    await expect(form.getByRole('alert')).toContainText('temporarily unavailable')
    await page.clock.fastForward(6_000)
    await expect(form.getByRole('alert')).toContainText('Your draft is still here.')
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Portfolio Test')
    await expect(page.locator('#contact-message')).toHaveValue('I would like to discuss the engineering role and team context.')
    await expect(send).toBeEnabled()

    await send.click()
    await expect(form.getByRole('status')).toContainText('Message sent.')
    expect(submissionIds).toHaveLength(2)
    expect(submissionIds[0]).toMatch(/^[a-f\d-]{36}$/)
    expect(submissionIds[1]).toBe(submissionIds[0])
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('')
    await expect(page.locator('#contact-inquiry-type')).toHaveValue('employment')
    await page.clock.fastForward(6_000)
    await expect(form.getByRole('status')).toContainText('Message sent.')
    await page.getByLabel('Name', { exact: true }).fill('Another inquiry')
    await expect(form.getByRole('status')).toHaveCount(0)
  })

  test('uses the server retry delay and never submits the retained draft automatically', async ({ page }) => {
    let requests = 0
    await page.route('**/api/contact', async route => {
      requests += 1
      await route.fulfill({
        status: requests === 1 ? 429 : 200,
        headers: requests === 1 ? { 'Retry-After': '30' } : {},
        contentType: 'application/json',
        body: JSON.stringify({ success: requests !== 1 }),
      })
    })
    await page.goto('/contact?type=employment')
    const form = page.getByRole('form', { name: 'Tell me about the engineering opportunity.', exact: true })
    await fillInquiry(page)
    await page.clock.pauseAt(new Date('2026-01-01T10:00:00Z'))
    const submit = form.locator('button[type="submit"]')
    await submit.click()
    await expect.poll(() => requests).toBe(1)
    await expect(form.getByRole('alert')).toContainText('Wait 30 seconds before sending again.')
    await expect(submit).toBeDisabled()
    await expect(page.locator('#contact-message')).not.toHaveValue('')
    await page.clock.fastForward(29_000)
    await expect(submit).toBeDisabled()
    expect(requests).toBe(1)
    await page.clock.fastForward(1_000)
    await expect(submit).toBeEnabled()
    await expect(form.getByRole('alert')).toContainText('try sending your inquiry again now')
    expect(requests).toBe(1)
    await submit.click()
    await expect(form.getByRole('status')).toContainText('Message sent.')
    expect(requests).toBe(2)
  })
})
