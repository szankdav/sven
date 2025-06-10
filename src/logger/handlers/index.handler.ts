import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { authUserService } from '../services/auth.service.js';

export const indexHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const isLoggedIn = await authUserService(req);
        res.render('index', {
            isLoggedIn,
            title: 'Discord Server Monitoring',
            layout: 'layout',
            styles: ['/css/index.css'],
            scripts: ['/js/searchbar.js', '/js/navbar.js'],
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};