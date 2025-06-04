import { test, expect } from '@playwright/test';

test('/authors page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/');
  await expect(page).toHaveURL(/.*/);
});

test('/authors/**** page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/authors/alma');
  await expect(page).toHaveURL(/.*/);
});

