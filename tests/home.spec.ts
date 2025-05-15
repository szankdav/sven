import { test, expect } from '@playwright/test';

test('/ page should display the correct title and text', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle('Discord Server Monitoring');
  await expect(page.locator('h1')).toHaveText(
    'Welcome to Discord Logger! (Watched by Watchtower!)',
  );
  await expect(page.locator('h3')).toHaveText(
    'Here you can find all of the users that ever sent a message on your server.',
  );
  await expect(page.locator('p')).toHaveText(
    'If you want to see the users, go to Authors page. If you want to see all the messages, go to Messages page.',
  );
});

test('/home page text navigation links should work correctly', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/');
  await page.click('text=Author');
  await expect(page).toHaveURL(/.*authors/);

  await page.goBack();
  await page.click('text=Messages');
  await expect(page).toHaveURL(/.*messages/);
});
