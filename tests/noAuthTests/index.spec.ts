import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Root Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/`);
    });

    test('should display the main heading and paragraph correctly', async ({ page }) => {
        await expect(page).toHaveTitle('Discord Server Monitoring');

        const navbar = page.getByRole('navigation');

        const navbarText = navbar.locator('div[class="mb-8 text-2xl font-bold"]');
        await expect(navbarText).toBeVisible();
        await expect(navbarText).toHaveText('Server Logs');
        await expect(navbarText).toHaveClass('mb-8 text-2xl font-bold');

        const navbarLogin = navbar.locator('a[href="https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Flogin&scope=guilds+identify"]');
        await expect(navbarLogin).toBeVisible();

        const rootHeader = page.getByRole('heading', { name: 'Know Your Server', level: 1 });
        await expect(rootHeader).toBeVisible();
        await expect(rootHeader).toHaveClass('text-base md:text-2xl font-bold');

        const rootParagraph = page.getByText('Monitor, Collect Statistics, Make Conclusions');
        await expect(rootParagraph).toBeVisible();
        await expect(rootParagraph).toHaveClass('text-sm text-gray-600');

        const mainLoginAnchor = page.locator('div[class="text-center space-y-4"] > a[href="https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Flogin&scope=guilds+identify"]');
        await expect(mainLoginAnchor).toBeVisible();
        await expect(mainLoginAnchor).toHaveClass('inline-block py-2 px-6 rounded-lg bg-gray-700 hover:bg-gray-600 text-white border border-white transition duration-300 ease-in-out');
    });

    test('should navigate to the /login page when Login button is clicked in main section', async ({ page }) => {
        const mainLoginAnchor = page.locator('div[class="text-center space-y-4"] > a[href="https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Flogin&scope=guilds+identify"]');
        await expect(mainLoginAnchor).toBeVisible();

        await mainLoginAnchor.click();

        await expect(page).toHaveURL('https://discord.com/oauth2/authorize?client_id=1352273717623001209&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&scope=guilds+identify');
    });

    test('should navigate to the /login page when Login button is clicked in the navbar', async ({ page }) => {
        const navbarLoginAnchor = page.locator('div[class="mt-auto pt-4 border-t border-gray-700"] > a[href="https://discord.com/oauth2/authorize?client_id=1352273717623001209&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&scope=guilds+identify"]');
        await expect(navbarLoginAnchor).toBeVisible();

        await navbarLoginAnchor.click();

        await expect(page).toHaveURL('https://discord.com/oauth2/authorize?client_id=1352271959232086026&response_type=code&redirect_uri=https%3A%2F%2Fsvenbot.cloud%2Flogin&scope=guilds+identify');
    });
});
