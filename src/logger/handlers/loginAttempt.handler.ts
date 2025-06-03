import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { DiscordOAuthTokenResponse } from '../types/discordOAuthTokenResponse.js';
import { getDiscordUserService } from '../services/user.service.js';
import { getUserServersService } from '../services/guilds.service.js';
import { oauthService } from '../services/oauth.service.js';

const createCookies = (res: Response, oauthData: DiscordOAuthTokenResponse) => {
    res.cookie('access_token', oauthData.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600 * 1000,
    });
};

export const loginAttemptHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const codeFromBody: string = req.body.code;

        if (!codeFromBody) {
            logger.error('Code not found in header for Discord Oauth login!');
            res.redirect('/error');
            return;
        }

        const oauthData = await oauthService(codeFromBody);
        if (oauthData === null) {
            res.redirect('/error');
            return;
        }

        const username = await getDiscordUserService(oauthData.token_type, oauthData.access_token);
        if (username === null) {
            res.redirect('/error');
            return;
        }

        const guilds = await getUserServersService(oauthData.token_type, oauthData.access_token);
        if (guilds === null) {
            res.redirect('/error');
            return;
        }

        createCookies(res, oauthData);
        logger.info(`Successful login with username: ${username}`);
        res.redirect('/home');
    } catch (error) {
        logger.error(error);
        next();
    }
};