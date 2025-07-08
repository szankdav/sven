import { Article } from '../../types/foremArticle.type.js';
import { logger } from '../../../winston/winston.js';

export const getDailyArticles = async (): Promise<Article[] | null> => {
    try {
        const articlesArray: Article[] = [];
        const response = await fetch('https://dev.to/api/articles?per_page=10', {
            headers: { 'Content-Type': 'application/json' },
        });

        const fetchedArticles: Article[] = await response.json();
        fetchedArticles.forEach(article => {
            articlesArray.push(article);
        });

        return articlesArray;
    } catch (error) {
        logger.error('Error fetching articles:', error);
        return null;
    }
};

export const getArticleById = async (id: string | undefined): Promise<Article | null> => {
    try {
        if (id === undefined) {
            logger.error('ID is undefined: ', id);
            return null;
        };
        const response = await fetch(`https://dev.to/api/articles/${id}`, {
            headers: { 'Content-Type': 'application/json' },
        });

        const article: Article = await response.json();

        return article;

    } catch (error) {
        logger.error('Error fetching article by ID:', error);
        return null;
    }
};
