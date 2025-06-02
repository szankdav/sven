import { test, expect } from '@playwright/test';

test('/ page should display the correct title and text', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  await expect(page).toHaveTitle('Discord Server Monitoring');
  await expect(page.getByTestId('welcomeH1')).toHaveText(
    'Welcome to Discord Logger! (Watched by Watchtower!)',
  );
  await expect(page.getByTestId('welcomeH3')).toHaveText(
    'Here you can find all of the users that ever sent a message on your server.',
  );
  await expect(page.getByTestId('welcomeP')).toHaveText(
    'If you want to see the users, go to Authors page. If you want to see all the messages, go to Messages page.',
  );
});

test('/home page text navigation links should work correctly', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/home');
  await page.click('text=Author');
  await expect(page).toHaveURL(/.*authors/);

  await page.goBack();
  await page.click('text=Messages');
  await expect(page).toHaveURL(/.*messages/);
});

test('/home page search bar should display results in the dropdown menu if a letter is written in it', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.press('a');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').count()).toBeGreaterThanOrEqual(1);
});

test('/home page search bar should display the proper message in the dropdown menu if there is no result', async ({ page }) => {
  await page.goto('http://localhost:3000/home');
  const searchInput = page.getByTestId('searchInput');
  await searchInput.click();
  await searchInput.pressSequentially('aaaaaa');
  const searchDropdown = page.getByTestId('searchDropdown');
  await expect(searchDropdown).toBeVisible();
  expect(await searchDropdown.locator('li').textContent()).toBe('No author found!');
});
