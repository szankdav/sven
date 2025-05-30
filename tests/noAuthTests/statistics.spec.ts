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

test('/statistics/author page search bar should display results in the dropdown menu if a letter is written in it', async ({ page }) => {
  await page.goto('http://localhost:3000/statistics/author/1');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.press('a');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').count()).toBeGreaterThanOrEqual(1);
});

test('/statistics/author page search bar should display the proper message in the dropdown menu if there is no result', async ({ page }) => {
  await page.goto('http://localhost:3000/statistics/author/1');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.pressSequentially('aaaaaa');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').textContent()).toBe('No author found!');
});