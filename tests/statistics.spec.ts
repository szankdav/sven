import { test, expect } from '@playwright/test';

test('/statistics/author page should display the correct title and text', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/statistics/author/1');
  await expect(page).toHaveTitle('Discord Server Monitoring');
  await expect(page.getByRole('heading').nth(0)).toHaveText('Author:');
});

test('/statistics/author page navigation buttons should work correctly', async ({
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

  await page.getByTestId('nextAuthorStatistics').click();
  await expect(page).toHaveURL(
    `http://localhost:3000/statistics/author/${parseInt(dataId!, 10) + 1}`,
  );

  await page.getByTestId('previousAuthorStatistics').click();
  await expect(page).toHaveURL(
    `http://localhost:3000/statistics/author/${dataId}`,
  );

  await page.getByTestId('seeStatistics').click();
  await expect(page.getByRole('heading').nth(1)).toHaveText(
    'Here you can see the usage rate of each letter out of all the letters typed by the author:',
  );
  const progressBars = await page.getByRole('progressbar').count();
  expect(progressBars).toBe(35);

  await page.getByTestId('goBackToAuthor').click();
  await expect(page).toHaveURL(
    `http://localhost:3000/messages/author/${dataId}`,
  );
});
