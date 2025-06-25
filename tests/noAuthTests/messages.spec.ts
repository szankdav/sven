import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Messages Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/messages/1`);
  });

  test('should display the main heading and paragraph correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Discord Server Monitoring/);

    const header = page.getByRole('heading', { name: 'Messages', level: 1 });
    await expect(header).toBeVisible();
    await expect(header).toHaveClass('text-3xl font-bold mb-4');

    const paragraph = page.getByText("Here you can see all the messages sent on your server! If you want to see an author's messages, click on the author's name!");
    await expect(paragraph).toBeVisible();
    await expect(paragraph).toHaveClass('text-xl md:text-2xl font-semibold mb-4');
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

  test('pagination buttons should work correctly', async ({
    page,
  }) => {
    await page.click('#nextButton');
    await expect(page).toHaveURL(/.2/);

    await page.click('#previousButton');
    await expect(page).toHaveURL(/.1/);

    await page.click('#secondPageNumberButton');
    await expect(page).toHaveURL(/.2/);

    await page.click('#thirdPageNumberButton');
    await expect(page).toHaveURL(/.3/);

    await page.click('#thirdPageNumberButton');
    await expect(page).toHaveURL(/.4/);

    await page.click('#firstPageNumberButton');
    await expect(page).toHaveURL(/.3/);
  });

  test('should display a list of 10 messages in desktop view', async ({ page }) => {
    const authorsTable = page.getByRole('table');
    const authors = authorsTable.locator('a[href^="/messages/author/"]');
    await expect(authors).toHaveCount(10);
  });

  test('should display a list of 10 messages in mobile view', async ({ page }) => {
    const authorsCards = page.locator('div[class="grid grid-cols-1 gap-4 md:hidden"]');
    const authors = authorsCards.locator('a[href^="/messages/author/"]');
    await expect(authors).toHaveCount(10);
  });

  test('should open messages if author is clicked', async ({
    page,
  }) => {
    const messagesTable = page.getByRole('table');
    const authors = messagesTable.locator('a[href^="/messages/author/"]');
    await authors.first().click();
    await expect(page).toHaveURL(
      'http://localhost:3000/messages/author/1',
    );
  });

  test('should open the whole message if short message is clicked and close it when X button is clicked', async ({
    page,
  }) => {
    const messagesTable = page.getByRole('table');
    const shortMessage = messagesTable.locator('[data-messageid="1"]');
    await shortMessage.click();

    const messageContent = page.locator('.messageContent').first();
    await expect(messageContent).toBeVisible();

    const closeButton = page.locator('.messageCloseButton').first();
    await expect(closeButton).toHaveText('X');
    await closeButton.click();
    await expect(messageContent).not.toBeVisible();
  });

  test('should display the proper message if not existing page number is requested', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/authors/1000');

    await expect(page.locator('p', { hasText: 'No authors to show... Are you sure you are at the right URL?' })).toBeVisible();
  });

  test('should navigate to the home page if Go back to home page button is clicked', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/authors/1000');
    const backButton = page.locator('a[href="/home"]', { hasText: 'Go back to home page' });
    await backButton.click();
    await expect(page).toHaveURL('http://localhost:3000/home');
  });

  test('should redirect to /home if page number parameter is not a valid number', async ({ page }) => {
    await page.goto('http://localhost:3000/authors/alma');
    await expect(page).toHaveURL(/.*home/);
  });

  test('should redirect to /home if page number parameter is a negative number', async ({ page }) => {
    await page.goto('http://localhost:3000/authors/-1');
    await expect(page).toHaveURL(/.*home/);
  });
});
