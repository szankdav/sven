// eslint-disable-next-line import/no-extraneous-dependencies
import { Locator, Page } from '@playwright/test';

export class HomePage {
    private url = 'http://localhost:3000/home';

    private homePage: Page;

    private header: Locator;

    private authorsCard: Locator;

    private authorsCardHeader: Locator;

    private authorsCardImage: Locator;

    private authorsCardDescription: Locator;

    private messageCard: Locator;

    constructor(page: Page) {
        this.homePage = page;
        this.header = page.getByRole('heading', { name: 'Dashboard', level: 1 });
        this.authorsCard = this.homePage.getByRole('link', { name: 'All Authors' });
        this.authorsCardHeader = this.authorsCard.getByRole('heading', { name: 'All Authors', level: 2 });
        this.authorsCardDescription = this.authorsCard.locator('p', { hasText: 'Explore the list of all contributing authors.' });
        this.authorsCardImage = this.authorsCard.locator('img[alt="Authors"]');
        this.messageCard = this.homePage.getByRole('link', { name: 'All Messages' });
    }

    async goTo() {
        await this.homePage.goto(this.url);
    };

    async clickAuthorsCard() {
        await this.authorsCard.click();
    }

    async clickMessagesCard() {
        await this.messageCard.click();
    };

    async getAuthorsCard() {
        return this.authorsCard;
    };

    async getAuthorsCardImage() {
        return this.authorsCardImage;
    };

    async getMessagesCard() {
        return this.messageCard;
    };

    async getHeader() {
        return this.header;
    }

    async getAuthorsCardHeader() {
        return this.authorsCardHeader;
    }

    async getAuthorsCardDescription() {
        return this.authorsCardDescription;
    };
};