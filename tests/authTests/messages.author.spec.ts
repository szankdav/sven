import { test, expect } from '@playwright/test';

test('/messages/author/*number* page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/author/1');
  await expect(page).toHaveURL(/.*/);
});

test('/messages/author/***** page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/author/alma');
  await expect(page).toHaveURL(/.*/);
});

test('/messages/author page should redirect to root page for an unauthorized guest', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/messages/author/');
  await expect(page).toHaveURL(/.*/);
});

