import { test, expect } from '@playwright/test';

test('home page should display missing token error message if not existing url is requested and there is no logged in admin', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/1');

  await expect(page.locator('h1')).toHaveText('Missing token! Please try again with the help of Sven! If the problem persists, please let Sven know!');
  await expect(page.locator('h4')).toHaveText(
    'Please start from the Home page!',
  );
});

test('/authors page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/1000');

  await expect(page.locator('h4')).toHaveText(
    'No authors to show... Are you sure you are at the right URL?',
  );
  await expect(page.getByTestId('goBack')).toHaveText('Go back to home page');
});

test('/messages page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/1000');

  await expect(page.locator('h4')).toHaveText(
    'No messages to show... Are you sure you are at the right URL?',
  );
  await expect(page.getByTestId('goBack')).toHaveText('Go back to home page');
});
