import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Root Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
  });

  test('should display the correct texts', async ({ page }) => {
    await expect(page).toHaveTitle('Discord Server Monitoring');

    const navbar = page.getByRole('navigation');

    const navbarText = navbar.locator('div[class="mb-8 text-2xl font-bold"]');
    await expect(navbarText).toBeVisible();
    await expect(navbarText).toHaveText('Server Logs');
    await expect(navbarText).toHaveClass('mb-8 text-2xl font-bold');

    const navbarLogin = navbar.locator('a[href="https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Fapi%2Flogin&scope=guilds+identify"]');
    await expect(navbarLogin).toBeVisible();

    const rootHeader = page.getByRole('heading', { name: 'Know Your Server', level: 1 });
    await expect(rootHeader).toBeVisible();
    await expect(rootHeader).toHaveClass('text-base md:text-2xl font-bold');

    const rootParagraph = page.getByText('Monitor, Collect Statistics, Make Conclusions');
    await expect(rootParagraph).toBeVisible();
    await expect(rootParagraph).toHaveClass('text-sm text-gray-600');

    const rootLogin = page.locator('div[class="text-center space-y-4"] > a[href="https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Fapi%2Flogin&scope=guilds+identify"]');
    await expect(rootLogin).toBeVisible();
    await expect(rootLogin).toHaveText('Login');
  });

  test('should route to the /login page if Login button is clicked on either in the nav sidebar or in the page', async ({ page }) => {
    const navbar = page.getByRole('navigation');;

    const navbarLogin = navbar.locator('a[href="https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Fapi%2Flogin&scope=guilds+identify"]');
    await expect(navbarLogin).toBeVisible();
    await navbarLogin.click();
    await expect(page).toHaveURL('https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Fapi%2Flogin&scope=guilds+identify');

    await page.goto(`${BASE_URL}/`);

    const rootLogin = page.locator('div[class="text-center space-y-4"] > a[href="https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Fapi%2Flogin&scope=guilds+identify"]');
    await expect(rootLogin).toBeVisible();
    await expect(rootLogin).toHaveText('Login');
    await rootLogin.click();
    await expect(page).toHaveURL('https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Fapi%2Flogin&scope=guilds+identify');
  });
});