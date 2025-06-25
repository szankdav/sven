import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/messages/author/1`);
  });

  test('should display results in if a letter is written in the search bar', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search authors...');
    await searchInput.click();
    await searchInput.press('a');
    const searchDropdown = page.getByLabel('authorsList');
    await expect(searchDropdown).toBeVisible();
    await expect(searchDropdown.locator('li').first()).toBeVisible();
    expect(await searchDropdown.locator('li').count()).toBeGreaterThanOrEqual(1);
  });

  test('should display the proper message in searchresult if there is no result', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search authors...');
    await searchInput.click();
    await searchInput.pressSequentially('aaaaaa');
    const searchDropdown = page.getByLabel('authorsList');
    await expect(searchDropdown).toBeVisible();
    await expect(searchDropdown.locator('li').first()).toBeVisible();
    expect(await searchDropdown.locator('li').textContent()).toBe('No author found!');
  });

  test('should go back to authors list page if Go back to authors button is clicked', async ({
    page,
  }) => {
    const goBackButton = page.locator('a[href^="/authors/"]', { hasText: 'Go back to authors' });
    await goBackButton.click();
    await expect(page).toHaveURL(/.*authors\/1/);
  });

  test('should go back to messages list page if Go back to messages button is clicked', async ({
    page,
  }) => {
    const goBackButton = page.locator('a[href^="/messages/"]', { hasText: 'Go back to messages' });
    await goBackButton.click();
    await expect(page).toHaveURL(/.*messages\/1/);
  });

  test('should go to authors statistics page if Go to authors statistics button is clicked', async ({
    page,
  }) => {
    const goToAuthorsStatisticsButton = page.locator('a[href^="/statistics/author/1"]', { hasText: "Go to author's statistics" });
    await goToAuthorsStatisticsButton.click();
    await expect(page).toHaveURL(/.*statistics\/author\/1/);
  });

  test('should redirect to /home if page number parameter is not a valid number', async ({ page }) => {
    await page.goto('http://localhost:3000/messages/author/alma');
    await expect(page).toHaveURL(/.*home/);
  });

  test('should redirect to /home if page number parameter is a negative number', async ({ page }) => {
    await page.goto('http://localhost:3000/messages/author/-1');
    await expect(page).toHaveURL(/.*home/);
  });

  test('should show the correct message if author is not found with the given id', async ({ page }) => {
    await page.goto('http://localhost:3000/messages/author/1000000000000');
    const errorHeader = page.getByRole('heading', { name: 'Error!', level: 1 });
    await expect(errorHeader).toBeVisible();
    const errorParagraph = page.getByText('No author found with this ID!');
    await expect(errorParagraph).toBeVisible();
  });

});