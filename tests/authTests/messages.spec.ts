import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Messages Page', () => {
  test('/messages page should redirect to root page for an unauthorized visitor', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/messages`);
    await expect(page).toHaveURL(/.*/);
  });

  test('/messages/**** page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/messages/alma`);
    await expect(page).toHaveURL(/.*/);
  });

    test('/messages/*number* page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/messages/5`);
    await expect(page).toHaveURL(/.*/);
  });
});

