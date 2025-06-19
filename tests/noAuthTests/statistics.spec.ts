import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/statistics/author/1`);
  });

  test('should display the main heading and paragraph correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Discord Server Monitoring/);

    const header = page.getByRole('heading', { name: 'Statistics', level: 1 });
    await expect(header).toBeVisible();
    await expect(header).toHaveClass('text-3xl font-bold mb-4');

    const paragraph = page.getByText("Here you can see the statistics of the author's messages!");
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

  test('should Next Author and Previous Author buttons work correctly', async ({
    page,
  }) => {
    const nextAuthorButton = page.locator('.nextAuthor');
    await nextAuthorButton.click();
    await expect(page).toHaveURL(/.*statistics\/author\/2/);

    const previousAuthorButton = page.locator('.previousAuthor');
    await previousAuthorButton.click();
    await expect(page).toHaveURL(/.*statistics\/author\/1/);
  });

  test('should display the main texts in author card', async ({ page }) => {
    const header = page.getByRole('heading', { name: 'Author Details:', level: 4 });
    await expect(header).toBeVisible();
    await expect(header).toHaveClass('text-2xl font-bold mb-4');

    const idSpan = page.getByText('ID:');
    await expect(idSpan).toBeVisible();
    await expect(idSpan).toHaveClass('font-semibold');

    const nameSpan = page.getByText('Name:');
    await expect(nameSpan).toBeVisible();
    await expect(nameSpan).toHaveClass('font-semibold');

    const createdSpan = page.getByText('Created:');
    await expect(createdSpan).toBeVisible();
    await expect(createdSpan).toHaveClass('font-semibold');
  });

  test('should go back to author messages if Author Messages button is clicked', async ({ page }) => {
    const goBackToAuthorMessagesButton = page.getByRole('link', { name: 'Go back to Author Messages' });
    await expect(goBackToAuthorMessagesButton).toBeVisible();
    await goBackToAuthorMessagesButton.click();

    await expect(page).toHaveURL(/.*messages\/author\/1/);
  });

  test('should open Statistics if Show Statistics button is clicked', async ({ page }) => {
    const showStatisticsButton = page.getByRole('button', { name: 'Show Statistics' });
    await expect(showStatisticsButton).toBeVisible();
    await showStatisticsButton.click();

    const statisticsDiv = page.locator('#statistics');
    await expect(statisticsDiv).toBeVisible();
    const statisticsDivHeader = page.getByRole('heading', { name: 'Here you can see the usage rate of each letter out of all the letters typed by the author:', level: 4 });
    await expect(statisticsDivHeader).toBeVisible();
    await expect(statisticsDivHeader).toHaveClass('text-2xl font-bold mb-4');
  });

  test('should close Statistics if Show Hide button is clicked', async ({ page }) => {
    const showStatisticsButton = page.getByRole('button', { name: 'Show Statistics' });
    await expect(showStatisticsButton).toBeVisible();
    await showStatisticsButton.click();

    const hideStatisticsButton = page.getByRole('button', { name: 'Hide Statistics' });
    await expect(hideStatisticsButton).toBeVisible();
    await hideStatisticsButton.click();

    const statisticsDiv = page.locator('#statistics');
    await expect(statisticsDiv).not.toBeVisible();
  });

  test('should display the letters of the alphabet if Show Statistics button is clicked', async ({ page }) => {
    const showStatisticsButton = page.getByRole('button', { name: 'Show Statistics' });
    await expect(showStatisticsButton).toBeVisible();
    await showStatisticsButton.click();

    const statisticsDiv = page.locator('#statistics');
    await expect(statisticsDiv).toBeVisible();
    const letterSpans = statisticsDiv.locator('span.font-semibold');
    const letters = await letterSpans.count();

    expect(letters).toBe(35);
  });

  test('should display the progress bars if Show Statistics button is clicked', async ({ page }) => {
    const showStatisticsButton = page.getByRole('button', { name: 'Show Statistics' });
    await expect(showStatisticsButton).toBeVisible();
    await showStatisticsButton.click();

    const statisticsDiv = page.locator('#statistics');
    await expect(statisticsDiv).toBeVisible();
    const progressbarsDivs = statisticsDiv.locator('div.relative.w-full.h-4.bg-gray-700.rounded-full.overflow-hidden');
    const progressbars = await progressbarsDivs.count();
    const progressbarsInnerDivs = progressbarsDivs.locator('div.absolute.inset-0.bg-white.rounded-full.transition-all.duration-500.ease-out');
    const progressbarsInners = await progressbarsInnerDivs.count();

    expect(progressbars).toBe(35);
    expect(progressbarsInners).toBe(35);
  });

  test('should display the Raw Letter Counts if Show Statistics button is clicked', async ({ page }) => {
    const showStatisticsButton = page.getByRole('button', { name: 'Show Statistics' });
    await expect(showStatisticsButton).toBeVisible();
    await showStatisticsButton.click();

    const statisticsDiv = page.locator('#statistics');
    await expect(statisticsDiv).toBeVisible();
    const header = page.getByRole('heading', { name: 'Raw Letter Counts:', level: 4 });
    await expect(header).toBeVisible();
    await expect(header).toHaveClass('text-2xl font-bold mb-4');

    const rows = statisticsDiv.locator('tbody > tr');
    const rowCount = await rows.count();
    expect(rowCount).toBe(35);

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const id = row.locator('td').nth(0);
      const letter = row.locator('td').nth(1);
      const count = row.locator('td').nth(2);
      const createdAt = row.locator('td').nth(3);
      const updatedAt = row.locator('td').nth(4);

      // eslint-disable-next-line no-await-in-loop
      await expect(id).toBeVisible();
      // eslint-disable-next-line no-await-in-loop
      await expect(letter).toBeVisible();
      // eslint-disable-next-line no-await-in-loop
      await expect(count).toBeVisible();
      // eslint-disable-next-line no-await-in-loop
      await expect(createdAt).toBeVisible();
      // eslint-disable-next-line no-await-in-loop
      await expect(updatedAt).toBeVisible();
    }
  });

  test('/statistics/author page should redirect to /home if page number parameter is not a valid number', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/author/alma');
    await expect(page).toHaveURL(/.*home/);
  });

  test('/statistics/author page should redirect to /home if page number parameter is a negative number', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/author/-1');
    await expect(page).toHaveURL(/.*home/);
  });

  test('/statistics/author page should show the correct message if author is not found with the given id', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/author/1000000000000');
    const header = page.getByRole('heading', { name: 'Error!', level: 1 });
    await expect(header).toBeVisible();
    await expect(header).toHaveClass('text-3xl font-bold mb-4');

    const paragraph = page.getByText('No author found with this ID!');
    await expect(paragraph).toBeVisible();
    await expect(paragraph).toHaveClass('text-xl mb-4');

    const goBackButton = page.getByRole('link', { name: 'Go back to home page' });
    await expect(goBackButton).toBeVisible();
    await goBackButton.click();
    await expect(page).toHaveURL(/.*home/);
  });
});
