import { test, expect } from '@playwright/test';

// test('home page should display missing token error message if not existing url is requested and there is no logged in admin', async ({
//   page,
// }) => {
//   await page.goto('http://localhost:3000/1');

//   await expect(page.locator('h1')).toHaveText("You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in again with Sven!");
// });

test('/messages page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/alma');

  await expect(page.locator('h1')).toHaveText('Page not found!');
  await expect(page.locator('h4')).toHaveText('Please start from the Home page!');
});

test('/messages/author page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/author/alma');
  await expect(page.getByTestId('id')).toHaveText('ID: 0');
  await expect(page.getByTestId('name')).toHaveText('Name: -');
  await expect(page.getByTestId('created')).toHaveText('Created: -');
});

test('/authors page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/alma');

  await expect(page.locator('h1')).toHaveText('Page not found!');
  await expect(page.locator('h4')).toHaveText('Please start from the Home page!');
});

test('/statictics page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/statistics/alma');

  await expect(page.locator('h1')).toHaveText('Page not found!');
  await expect(page.locator('h4')).toHaveText('Please start from the Home page!');
});

test('/statictics/author page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/statistics/author/alma');
  await expect(page.getByTestId('id')).toHaveText('ID: -');
  await expect(page.getByTestId('name')).toHaveText('Name: -');
  await expect(page.getByTestId('created')).toHaveText('Created: -');
});

test('/home page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/home/alma');

  await expect(page.locator('h1')).toHaveText('Page not found!');
  await expect(page.locator('h4')).toHaveText('Please start from the Home page!');
});

test('/ page should redirect to error page if not existing url is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/alma');

  await expect(page.locator('h1')).toHaveText('Page not found!');
  await expect(page.locator('h4')).toHaveText('Please start from the Home page!');
});