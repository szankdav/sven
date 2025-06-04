import { test, expect } from '@playwright/test';

test('/***** page should redirect to root page if there is no logged in user', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/alma');
  await expect(page).toHaveURL(/.*/);
});

test('/ page should display the correct text', async ({
    page,
}) => {
    // await page.route('http://localhost:3000/js/login.js', route => {
    //     route.abort();
    // });

    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Discord Server Monitoring');
        await expect(page.locator('h1')).toHaveText("Welcome to your Discord Server Monitoring site! Please log in with your Discord account to see your server's statistics!");
    await expect(page.getByRole('link', { name: 'Click here!' })).toBeVisible();
});