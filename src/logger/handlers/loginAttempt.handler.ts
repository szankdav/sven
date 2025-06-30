import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { DiscordOAuthTokenResponse } from '../types/discordOAuthTokenResponse.js';
import { getDiscordUserService } from '../services/user.service.js';
import { getUserServersService } from '../services/guilds.service.js';
import { oauthService } from '../services/oauth.service.js';
import { svenServers } from '../../bot/client/sven.js';
import { userGuild } from '../types/userGuild.type.js';

const createCookies = (res: Response, oauthData: DiscordOAuthTokenResponse) => {
    res.cookie('access_token', oauthData.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600 * 1000,
    });
};

const canLogIn = async (userGuilds: Array<userGuild>): Promise<boolean> => {
    const botServers: Array<string> = (await svenServers()).map((server) => server.id);
    return userGuilds.some(guild => botServers.includes(guild.id) && guild.permissions === 2147483647);
};

export const loginAttemptHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const codeFromBody: string = req.body.code;

        if (!codeFromBody) {
            logger.error('Code not found in header for Discord Oauth login!');
            res.redirect('/error?code=401');
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

        const guilds: Array<userGuild> | null = await getUserServersService(oauthData.token_type, oauthData.access_token);
        if (guilds === null) {
            res.redirect('/error');
            return;
        }

        if (await canLogIn(guilds)) {
            createCookies(res, oauthData);
            logger.info(`Successful login with username: ${username.username}`);
            res.redirect('/home');
        } else {
            logger.error(`Unsuccesfull login because of insufficient permissions with username: ${username.username}`);
            res.redirect('/error');
            return;
        };

    } catch (error) {
        logger.error(error);
        next();
    }
};