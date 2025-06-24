import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authors Page', () => {
  test('/authors page should redirect to root page for an unauthorized visitor', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/authors`);
    await expect(page).toHaveURL(/.*/);
  });

  test('/authors/**** page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/authors/alma`);
    await expect(page).toHaveURL(/.*/);
  });

    test('/authors/*number* page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/authors/5`);
    await expect(page).toHaveURL(/.*/);
  });
});

