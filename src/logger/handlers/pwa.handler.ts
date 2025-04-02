import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { logger } from '../../winston/winston.js';

export const pwaHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.sendFile(path.join(__dirname, '../../pwa/index.html'));
    } catch (error) {
        logger.error('Error: ', error);
        next(error);
    }
};