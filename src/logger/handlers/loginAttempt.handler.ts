import { NextFunction, Request, Response } from 'express';
import { request } from 'undici';
import { logger } from '../../winston/winston.js';
import { DiscordOAuthTokenResponse } from '../types/discordOAuthTokenResponse.js';
import { DiscordUserResponse } from '../types/discordUserResponse.js';
import { server } from '../../bot/commands/utility/logintostatistics.js';
import { config } from '../../config.js';

const oauthRequest = async (codeFromBody: string) => {
    try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: config.DISCORD_CLIENT_SVEN_ID_DEV,
                client_secret: config.DISCORD_CLIENT_SVEN_DEV_SECRET,
                code: codeFromBody,
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:3000/',
                scope: 'identify',
            }).toString(),
        });

        if (tokenResponseData.statusCode === 401) {
            logger.error('Discord OAuth2 login denied!');
            return tokenResponseData.statusCode;
        }
        return tokenResponseData.body.json();
    } catch (error) {
        throw new Error(`Error during Discord OAuth2 token request: ${error}`);
    }
};

const userRequest = async (oauthData: DiscordOAuthTokenResponse) => {
    try {
        const userResponse = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
        });

        const userData = await userResponse.body.json() as DiscordUserResponse;
        const { username } = userData;
        return username;
    } catch (error) {
        throw new Error(`Error during User login request at Discord API: ${error}`);
    }
};

const createCookies = (res: Response, username: string, oauthData: DiscordOAuthTokenResponse) => {
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
};

export const loginAttemptHandler = async (req: Request,
    res: Response,
    next: NextFunction,): Promise<void> => {
    try {
        const codeFromBody: string = req.body.code;
        if (!codeFromBody) {
            logger.info(`Login attempt without a valid code was made at: ${new Date().toLocaleString()}`);
            res.sendStatus(401);
            return;
        }

        const oauthData = await oauthRequest(codeFromBody) as DiscordOAuthTokenResponse;
        const username = await userRequest(oauthData);
        createCookies(res, username, oauthData);

        logger.info(`Successful login with username: ${username}, from server: ${server.name}`);
        res.json({ username, server });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};