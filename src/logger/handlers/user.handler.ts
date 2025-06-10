import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { getDiscordUserService } from '../services/user.service.js';

export const usernameHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return;
        }

        const userResponse = await getDiscordUserService('Bearer', token);
        if (userResponse === null) {
            res.redirect('/error');
            return;
        }

        const { global_name, username } = userResponse;
        res.status(200).send({ username, global_name });
    } catch (error) {
        logger.error(`Error during User login request at Discord API: ${error}`);
        next();
    }
};

export const userAvatarHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return;
        }

        const userResponse = await getDiscordUserService('Bearer', token);
        if (userResponse === null) {
            res.redirect('/error');
            return;
        }

        res.status(200).send({ userId: userResponse.id, userAvatar: userResponse.avatar });
    } catch (error) {
        logger.error(`Error during User login request at Discord API: ${error}`);
        next();
    }
};