import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Statistics Page', () => {
  test('/statistics page should redirect to root page for an unauthorized visitor', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/statistics`);
    await expect(page).toHaveURL(/.*/);
  });

  test('/statistics/**** page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/statistics/alma`);
    await expect(page).toHaveURL(/.*/);
  });

    test('/statistics/*number* page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/statistics/5`);
    await expect(page).toHaveURL(/.*/);
  });

    test('/statistics/author page should redirect to root page for an unauthorized visitor', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/statistics/author`);
    await expect(page).toHaveURL(/.*/);
  });

  test('/statistics/author/**** page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/statistics/author/alma`);
    await expect(page).toHaveURL(/.*/);
  });

    test('/statistics/author/*number* page should redirect to root page for an unauthorized guest', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/statistics/author/5`);
    await expect(page).toHaveURL(/.*/);
  });
});

