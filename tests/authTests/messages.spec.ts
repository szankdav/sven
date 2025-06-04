import { test, expect } from '@playwright/test';

test('/messages page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/');
  await expect(page).toHaveURL(/.*/);
});

test('/messages/**** page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/alma');
  await expect(page).toHaveURL(/.*/);
});

test('/messages/*number* page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/1');
  await expect(page).toHaveURL(/.*/);
});
