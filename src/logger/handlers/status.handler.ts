import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';

export const statustHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const user = req.cookies.user_info;

        if (!user) {
            logger.info('User cookie not found, new login process started.');
            res.sendStatus(404);
            return;
        }

        const { username, server } = JSON.parse(user);
        res.status(200).json({ username, server });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};