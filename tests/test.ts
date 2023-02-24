import { expect, test } from '@playwright/test';

test('root layout', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('JamSpot');
	// await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
});
