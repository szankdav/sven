// import { test, expect } from '@playwright/test';

// test('/login page should display the correct text when there is no cookie or no code included', async ({
//   page,
// }) => {
//   await page.goto('http://localhost:3000/login');
//   await expect(page).toHaveTitle('Discord Server Monitoring');
//     await expect(page.getByTestId('errorH1')).toHaveText(
//     'Discord Server Monitoring website says:',
//   );
//   await expect(page.getByTestId('errorH3')).toHaveText(
//     'Something went wrong during login, please try again with the help of Sven! If the problem persists, please let Sven know!',
//   );
// });