import { test, expect } from '@playwright/test';

test('/ page should display the correct text when there is no cookie or no code included', async ({
    page,
}) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Discord Server Monitoring');
    await expect(page.getByTestId('loginError')).toHaveText('Error during login! Ask the site operator for help, or try again logging in with Sven!');
});