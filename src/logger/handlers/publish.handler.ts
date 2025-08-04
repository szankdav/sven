import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { getArticleArray, getNewsArray } from '../../bot/services/publish.service.js';

export const publishHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        res.render('publish', {
            foremArticles: getArticleArray(),
            hwswNews: getNewsArray(),
            isLoggedIn: true,
            title: 'Discord Server Monitoring',
            layout: 'layout',
            error: '',
            styles: ['/css/index.css'],
            scripts: ['/js/navbar.js', '/js/publish.js'],
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};