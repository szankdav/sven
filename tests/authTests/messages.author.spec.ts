import { test, expect } from '@playwright/test';

test('/messages/author page should display the correct text for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/author');
  await expect(page).toHaveTitle('Discord Server Monitoring');
  await expect(page.locator('h1')).toHaveText(
    "You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in with Sven!"
  );
});

test('/messages/author/**** page should display the correct text for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/author/alma');
  await expect(page).toHaveTitle('Discord Server Monitoring');
  await expect(page.locator('h1')).toHaveText(
    "You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in with Sven!"
  );
});

test('/messages/author/*number* page should display the correct text for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/author/1');
  await expect(page).toHaveTitle('Discord Server Monitoring');
  await expect(page.locator('h1')).toHaveText(
    "You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in with Sven!"
  );
});

