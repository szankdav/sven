import { test, expect } from '@playwright/test';

test('/messages/author page Go back to authors button should work correctly', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.waitForSelector('.authorRow');

  const authors = page.locator('.authorRow');
  const dataId = await authors.first().getAttribute('data-id');
  await authors.first().click();
  await expect(page).toHaveURL(
    `http://localhost:3000/messages/author/${dataId}`,
  );

  await page.getByTestId('goBackToAuthors').click();
  await expect(page).toHaveURL('http://localhost:3000/authors/1');
});

test('/messages/author page Go back to messages button should work correctly', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.waitForSelector('.authorRow');

  const authors = page.locator('.authorRow');
  const dataId = await authors.first().getAttribute('data-id');
  await authors.first().click();
  await expect(page).toHaveURL(
    `http://localhost:3000/messages/author/${dataId}`,
  );

  await page.getByTestId('goBackToMessages').click();
  await expect(page).toHaveURL('http://localhost:3000/messages/1');
});

test('/messages/author page Go to authors statistics button should work correctly', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.waitForSelector('.authorRow');

  const authors = page.locator('.authorRow');
  const dataId = await authors.first().getAttribute('data-id');
  await authors.first().click();
  await expect(page).toHaveURL(
    `http://localhost:3000/messages/author/${dataId}`,
  );

  await page.getByTestId('goToAuthorStatistics').click();
  await expect(page).toHaveURL(
    `http://localhost:3000/statistics/author/${dataId}`,
  );
});
