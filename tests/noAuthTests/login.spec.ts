import { test, expect } from '@playwright/test';

test('/ page should display the correct text when there is no cookie or no code included', async ({
    page,
}) => {
    await page.route('http://localhost:3000/js/login.js', route => {
        route.abort();
    });

    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveTitle('Discord Server Monitoring');
    await expect(page.getByTestId('loadingImg')).toBeVisible();
    await expect(page.getByTestId('loadingText')).toHaveText('Loading');
});