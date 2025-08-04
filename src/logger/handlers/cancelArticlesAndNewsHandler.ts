import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { cancelButtonClickInAdminDashboard } from '../../bot/services/publish.service.js';

export const cancelArticlesAndNewsHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const { type, id } = req.body;
        const selectResult = await cancelButtonClickInAdminDashboard(type, id);
        if (selectResult) {
            res.status(200).end();
        } else {
            res.status(404).end();
        };
    } catch (error) {
        logger.error(`Error during article or new : ${error}`);
        next();
        res.status(500).end();
    }
};