import { expect, test } from '@playwright/test'

test('home route renders the starter content', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Hello World')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Build from a stronger baseline.' }),
  ).toBeVisible()
  await expect(page.getByText('Starter App')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Learn more about this starter' })).toBeVisible()
})

test('users can navigate between home and about routes', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Learn more about this starter' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'What this project gives you out of the box.',
    }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Back to home' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Build from a stronger baseline.' }),
  ).toBeVisible()
})
