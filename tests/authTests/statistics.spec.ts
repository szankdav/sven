import { test, expect } from '@playwright/test';

test('/statistics/author page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/statistics/author');
  await expect(page).toHaveURL(/.*/);
});

test('/statistics/author/**** page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/statistics/author/alma');
  await expect(page).toHaveURL(/.*/);
});

test('/statistics/author/*number* page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/statistics/author/1');
  await expect(page).toHaveURL(/.*/);
});

