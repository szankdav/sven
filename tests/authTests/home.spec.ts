import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Home Page', () => {
  test('/home page should redirect to root page for an unauthorized visitor', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/home`);
    await expect(page).toHaveURL(/.*/);
  });

  test('/home/**** page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/home/alma`);
    await expect(page).toHaveURL(/.*/);
  });
});

