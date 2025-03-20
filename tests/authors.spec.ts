import { test, expect } from "@playwright/test";

test("/authors page should display the correct text with empty database", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/authors/100000000");
  await expect(page).toHaveTitle("Discord logger statisztika");
  await expect(page.locator("h4")).toHaveText(
    "No authors to show... Are you sure you are at the right URL?",
  );
  await expect(page.getByTestId("goBack")).toHaveText("Go back to home page");
});

test("/authors page should display a list of 10 authors", async ({ page }) => {
  await page.goto("http://localhost:3000/authors/1");

  await page.waitForSelector(".authorRow");

  const authors = await page.locator(".authorRow").count();
  expect(authors).toBe(10);
});

test("/authors page navigation buttons should work correctly", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/authors/1");

  await page.click("#nextButton");
  await expect(page).toHaveURL(/.2/);

  await page.click("#previousButton");
  await expect(page).toHaveURL(/.1/);

  await page.click("#secondPageNumberButton");
  await expect(page).toHaveURL(/.2/);

  await page.click("#thirdPageNumberButton");
  await expect(page).toHaveURL(/.3/);

  await page.click("#thirdPageNumberButton");
  await expect(page).toHaveURL(/.4/);

  await page.click("#firstPageNumberButton");
  await expect(page).toHaveURL(/.3/);
});

test("/authors page click on author name should open author messages", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/authors/1");

  await page.waitForSelector(".authorRow");

  const authors = page.locator(".authorRow");
  const dataId = await authors.first().getAttribute("data-id");
  await authors.first().click();
  await expect(page).toHaveURL(
    `http://localhost:3000/messages/author/${dataId}`,
  );
});
