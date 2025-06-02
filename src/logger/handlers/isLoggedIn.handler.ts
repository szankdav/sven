import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';

export const isLoggedIn = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const cookie = req.cookies.access_token;

        if (!cookie) {
            logger.info('Cookie not found, new login process started.');
            res.send({ result: false });
            return;
        }

        res.redirect('/home');
    } catch (error) {
        logger.error(error);
        next(error);
    }
};