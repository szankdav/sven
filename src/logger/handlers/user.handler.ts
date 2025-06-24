import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { getDiscordUserService } from '../services/user.service.js';

export const userDataHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            res.sendStatus(401);
            return;
        }

        const userResponse = await getDiscordUserService('Bearer', token);
        if (userResponse === null) {
            res.redirect('/error');
            return;
        }

        res.status(200).send({ username: userResponse.username, global_name: userResponse.global_name, userAvatar: userResponse.avatar, userId: userResponse.id });
    } catch (error) {
        logger.error(`Error during User login request at Discord API: ${error}`);
        next();
    }
};