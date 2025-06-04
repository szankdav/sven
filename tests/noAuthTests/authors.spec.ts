import { test, expect } from '@playwright/test';

test('/authors page should display the correct text with empty database', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/100000000');
  await expect(page).toHaveTitle('Discord Server Monitoring');
  await expect(page.locator('h4')).toHaveText(
    'No authors to show... Are you sure you are at the right URL?',
  );
  await expect(page.getByTestId('goBack')).toHaveText('Go back to home page');
});

test('/authors page should display a list of 10 authors', async ({ page }) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.waitForSelector('.authorRow');

  const authors = await page.locator('.authorRow').count();
  expect(authors).toBe(10);
});

test('/authors page navigation buttons should work correctly', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.click('#nextButton');
  await expect(page).toHaveURL(/.2/);

  await page.click('#previousButton');
  await expect(page).toHaveURL(/.1/);

  await page.click('#secondPageNumberButton');
  await expect(page).toHaveURL(/.2/);

  await page.click('#thirdPageNumberButton');
  await expect(page).toHaveURL(/.3/);

  await page.click('#thirdPageNumberButton');
  await expect(page).toHaveURL(/.4/);

  await page.click('#firstPageNumberButton');
  await expect(page).toHaveURL(/.3/);
});

test('/authors page click on author name should open author messages', async ({
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
});

test('/authors page should show proper message if not existing page number is requested', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/1000');

  await expect(page.locator('h4')).toHaveText(
    'No authors to show... Are you sure you are at the right URL?',
  );
  await expect(page.getByTestId('goBack')).toHaveText('Go back to home page');
});

test('/authors page search bar should display results in the dropdown menu if a letter is written in it', async ({page}) => {
  await page.goto('http://localhost:3000/authors/1');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.press('a');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').count()).toBeGreaterThanOrEqual(1);
});

test('/authors page search bar should display the proper message in the dropdown menu if there is no result', async ({page}) => {
  await page.goto('http://localhost:3000/authors/1');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.pressSequentially('aaaaaa');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').textContent()).toBe('No author found!');
});

test('/authors page should redirect to /home if page number parameter is not a valid number', async ({page}) => {
  await page.goto('http://localhost:3000/authors/alma');
  await expect(page).toHaveURL(/.*home/);
});

test('/authors page should redirect to /home if page number parameter is a negative number', async ({page}) => {
  await page.goto('http://localhost:3000/authors/-1');
  await expect(page).toHaveURL(/.*home/);
});
