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

test('/messages/author page search bar should display results in the dropdown menu if a letter is written in it', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/author/1');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.press('a');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').count()).toBeGreaterThanOrEqual(1);
});

test('/messages/author page search bar should display the proper message in the dropdown menu if there is no result', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/author/1');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.pressSequentially('aaaaaa');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').textContent()).toBe('No author found!');
});

test('/messages/author page should redirect to /home if page number parameter is not a valid number', async ({page}) => {
  await page.goto('http://localhost:3000/messages/author/alma');
  await expect(page).toHaveURL(/.*home/);
});

test('/messages/author page should redirect to /home if page number parameter is a negative number', async ({page}) => {
  await page.goto('http://localhost:3000/messages/author/-1');
  await expect(page).toHaveURL(/.*home/);
});

test('/messages/author page should show the correct message if author is not found with the given id', async ({page}) => {
  await page.goto('http://localhost:3000/messages/author/1000000000000');
  await expect(page.locator('h1')).toHaveText('No author found with this ID!');
});