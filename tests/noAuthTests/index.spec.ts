import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Root Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/`);
    });

    test('should display the main heading and paragraph correctly', async ({ page }) => {
        await expect(page).toHaveTitle(/Discord Server Monitoring/);

        const header = page.getByRole('heading', { name: 'Know Your Server', level: 1 });
        await expect(header).toBeVisible();
        await expect(header).toHaveClass('text-base md:text-2xl font-bold');

        const paragraph = page.getByText('Monitor, Collect Statistics, Make Conclusions');
        await expect(paragraph).toBeVisible();
        await expect(paragraph).toHaveClass('text-sm text-gray-600');

        const mainLoginAnchor = page.getByTestId('mainLoginButton');
        await expect(mainLoginAnchor).toBeVisible();
        await expect(mainLoginAnchor).toHaveClass('mt-6 inline-block py-2 px-6 rounded-lg bg-gray-700 hover:bg-gray-600 text-white border border-white transition duration-300 ease-in-out');
    });

    test('should navigate to the /login page when Login button is clicked in main section', async ({ page }) => {
        const loginAnchor = page.getByTestId('mainLoginButton');
        await expect(loginAnchor).toBeVisible();

        await loginAnchor.click();

        await expect(page).toHaveURL('https://discord.com/oauth2/authorize?client_id=1352273717623001209&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&scope=guilds+identify');
    });

    test('should navigate to the /login page when Login button is clicked in the navbar', async ({ page }) => {
        const loginAnchor = page.getByTestId('navbarLoginButton');
        await expect(loginAnchor).toBeVisible();

        await loginAnchor.click();

        await expect(page).toHaveURL('https://discord.com/oauth2/authorize?client_id=1352273717623001209&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&scope=guilds+identify');
    });
});
