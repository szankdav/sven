import { test, expect } from '@playwright/test';
import { HomePage } from './pageObjects/home.page';

const BASE_URL = 'http://localhost:3000';

let homePageObject: HomePage;

test.describe('Dashboard Page', () => {
    test.beforeEach(async ({ page }) => {
        homePageObject = new HomePage(page);
        homePageObject.goTo();
        // await page.goto(`${BASE_URL}/home`);
    });

    test('should display the main dashboard heading and cards correctly', async ({ page }) => {
        await expect(page).toHaveTitle(/Dashboard/);

        const dashboardHeader = await homePageObject.getHeader();
        await expect(dashboardHeader).toBeVisible();
        await expect(dashboardHeader).toHaveClass(/text-4xl/);

        const authorsCard = await homePageObject.getAuthorsCard();
        await expect(authorsCard).toBeVisible();
        await expect(authorsCard).toHaveClass(/block/);

        const authorsImage = await homePageObject.getAuthorsCardImage();
        await expect(authorsImage).toBeVisible();
        await expect(authorsImage).toHaveAttribute('src', '/asserts/authors.jpg');

        const authorsHeading = await homePageObject.getAuthorsCardHeader();
        await expect(authorsHeading).toBeVisible();
        await expect(authorsHeading).toHaveText('All Authors');

        const authorsDescription = await homePageObject.getAuthorsCardDescription();
        await expect(authorsDescription).toBeVisible();
        await expect(authorsDescription).toHaveText('Explore the list of all contributing authors.');

        const messagesCard = page.getByRole('link', { name: 'All Messages' });
        await expect(messagesCard).toBeVisible();
        await expect(messagesCard).toHaveClass(/block/);

        const messagesImage = messagesCard.locator('img[alt="Messages"]');
        await expect(messagesImage).toBeVisible();
        await expect(messagesImage).toHaveAttribute('src', '/asserts/messages.jpg');

        const messagesHeading = messagesCard.getByRole('heading', { name: 'All Messages', level: 2 });
        await expect(messagesHeading).toBeVisible();
        await expect(messagesHeading).toHaveText('All Messages');

        const messagesDescription = messagesCard.locator('p', { hasText: 'View and manage all messages from your users.' });
        await expect(messagesDescription).toBeVisible();
        await expect(messagesDescription).toHaveText('View and manage all messages from your users.');
        
        // await expect(page).toHaveTitle(/Dashboard/);

        // const dashboardHeader = page.getByRole('heading', { name: 'Dashboard', level: 1 });
        // await expect(dashboardHeader).toBeVisible();
        // await expect(dashboardHeader).toHaveClass(/text-4xl/);

        // const authorsCard = page.getByRole('link', { name: 'All Authors' });
        // await expect(authorsCard).toBeVisible();
        // await expect(authorsCard).toHaveClass(/block/);

        // const authorsImage = authorsCard.locator('img[alt="Authors"]');
        // await expect(authorsImage).toBeVisible();
        // await expect(authorsImage).toHaveAttribute('src', '/asserts/authors.jpg');

        // const authorsHeading = authorsCard.getByRole('heading', { name: 'All Authors', level: 2 });
        // await expect(authorsHeading).toBeVisible();
        // await expect(authorsHeading).toHaveText('All Authors');

        // const authorsDescription = authorsCard.locator('p', { hasText: 'Explore the list of all contributing authors.' });
        // await expect(authorsDescription).toBeVisible();
        // await expect(authorsDescription).toHaveText('Explore the list of all contributing authors.');


        // const messagesCard = page.getByRole('link', { name: 'All Messages' });
        // await expect(messagesCard).toBeVisible();
        // await expect(messagesCard).toHaveClass(/block/);

        // const messagesImage = messagesCard.locator('img[alt="Messages"]');
        // await expect(messagesImage).toBeVisible();
        // await expect(messagesImage).toHaveAttribute('src', '/asserts/messages.jpg');

        // const messagesHeading = messagesCard.getByRole('heading', { name: 'All Messages', level: 2 });
        // await expect(messagesHeading).toBeVisible();
        // await expect(messagesHeading).toHaveText('All Messages');

        // const messagesDescription = messagesCard.locator('p', { hasText: 'View and manage all messages from your users.' });
        // await expect(messagesDescription).toBeVisible();
        // await expect(messagesDescription).toHaveText('View and manage all messages from your users.');
    });

    test('should navigate to authors page when "All Authors" card is clicked', async ({ page }) => {
        const authorsCard = page.getByRole('link', { name: 'All Authors' });
        await expect(authorsCard).toBeVisible();

        await authorsCard.click();

        await expect(page).toHaveURL(`${BASE_URL}/authors/1`);
        await expect(page.getByRole('heading', { name: 'Server Authors' })).toBeVisible();
    });

    test('should navigate to messages page when "All Messages" card is clicked', async ({ page }) => {
        const messagesCard = page.getByRole('link', { name: 'All Messages' });
        await expect(messagesCard).toBeVisible();

        await messagesCard.click();

        await expect(page).toHaveURL(`${BASE_URL}/messages/1`);
        await expect(page.getByRole('heading', { level: 1, name: 'Messages' })).toBeVisible();
    });

    test('should have correct styling on cards', async ({ page }) => {
        const authorsCardDiv = page.locator('a[href="/authors/1"] > div');
        await expect(authorsCardDiv).toHaveClass(/bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg/);
    });
});