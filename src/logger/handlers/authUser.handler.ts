import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { authUserService } from '../services/auth.service.js';

export const authUser = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const isLoggedInResult = await authUserService(req);
        if (!isLoggedInResult) {
            res.send({ result: false });
            return;
        }

        res.send({ result: true });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
