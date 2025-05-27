import { test, expect } from '@playwright/test';

test('/ page should display the correct text when there is no cookie or no code included', async ({
    page,
}) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Discord Server Monitoring');
    await expect(page.getByTestId('errorH1')).toHaveText(
        'Discord Server Monitoring website says:',
    );
    await expect(page.getByTestId('errorH3')).toHaveText(
        'Something went wrong during login, please try again with the help of Sven! If the problem persists, please let Sven know!',
    );
});

test('/ page should display four discord logo img', async ({
    page,
}) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Discord Server Monitoring');
    await expect(page.getByTestId('discordImg').first()).toBeInViewport();
    await expect(page.getByTestId('discordImg').nth(1)).toBeInViewport();
    await expect(page.getByTestId('discordImg').nth(2)).toBeInViewport();
    await expect(page.getByTestId('discordImg').nth(3)).toBeInViewport();
    await expect(page.getByTestId('discordImg')).toHaveCount(4);
});

test('/ page should have welcome text hided', async ({
    page,
}) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Discord Server Monitoring');
    await expect(page.getByTestId('welcomeH1')).toBeHidden();
});

test('/ page should have already logged in text hided', async ({
    page,
}) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Discord Server Monitoring');
    await expect(page.getByTestId('loggedInH1')).toBeHidden();
});