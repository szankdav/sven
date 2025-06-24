import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Messages/author Page', () => {
  test('/messages/author page should redirect to root page for an unauthorized visitor', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/messages/author`);
    await expect(page).toHaveURL(/.*/);
  });

  test('/messages/author/**** page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/messages/author/alma`);
    await expect(page).toHaveURL(/.*/);
  });

    test('/messages/author/*number* page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/messages/author/5`);
    await expect(page).toHaveURL(/.*/);
  });
});

