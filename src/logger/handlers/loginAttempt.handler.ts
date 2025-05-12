import { NextFunction, Request, Response } from 'express';
import { request } from 'undici';
import { logger } from '../../winston/winston.js';
import { DiscordOAuthTokenResponse } from '../types/discordOAuthTokenResponse.js';
import { DiscordUserResponse } from '../types/discordUserResponse.js';
import { server } from '../../bot/commands/utility/logintostatistics.js';

export const loginAttemptHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const codeFromBody = req.body.code;
        if (!codeFromBody) {
            res.sendStatus(401);
            return;
        }

        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: '1352273717623001209',
                client_secret: '-SVQ9SKfWj-M0VOeoHLeCs8PFaicdqm0',
                code: codeFromBody,
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:3000/login',
                scope: 'identify',
            }).toString(),
        });

        if (tokenResponseData.statusCode === 401) {
            res.sendStatus(401);
            return;
        }

        const oauthData = await tokenResponseData.body.json() as DiscordOAuthTokenResponse;

        const userResponse = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
        });

        const userData = await userResponse.body.json() as DiscordUserResponse;
        const { username } = userData;

        res.cookie('user_info', JSON.stringify({ username, server }), {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600 * 1000,
        });

        res.cookie('access_token', oauthData.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600 * 1000,
        });

        res.json({ username, server });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};