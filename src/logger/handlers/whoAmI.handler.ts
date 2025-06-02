import { NextFunction, Request, Response } from 'express';
import { request } from 'undici';
import { DiscordUserResponse } from '../types/discordUserResponse';
import { logger } from '../../winston/winston.js';

export const whoAmI = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            res.render('error', { routeError: '', loginError: "You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in with Sven!" });
            return;
        }

        const userResponse = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        if (userResponse.statusCode !== 200) {
            res.render('error', { routeError: '', loginError: "You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in with Sven!" });
            return;
        }

        const userData = await userResponse.body.json() as DiscordUserResponse;
        const { username } = userData;
        res.status(200).send({ username });
    } catch (error) {
        logger.error(`Error during User login request at Discord API: ${error}`);
        next();
    }
};