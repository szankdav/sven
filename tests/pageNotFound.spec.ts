import { test, expect } from '@playwright/test';

test('/home page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/1');

  await expect(page.locator('h1')).toHaveText('Page not found!');
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
