import { test, expect } from '@playwright/test';

test('/home page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/home');
  await expect(page).toHaveURL(/.*/);
});

test('/home/**** page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/home/alma');
  await expect(page).toHaveURL(/.*/);
});

