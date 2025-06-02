import { NextFunction, Request, Response } from 'express';
import { request } from 'undici';
import { logger } from '../../winston/winston.js';
import { DiscordOAuthTokenResponse } from '../types/discordOAuthTokenResponse.js';
import { DiscordUserResponse } from '../types/discordUserResponse.js';
import { config } from '../../config.js';

// Itt mi a szep visszateresi tipus?
const oauthRequest = async (codeFromBody: string): Promise<null | DiscordOAuthTokenResponse> => {
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

        if (tokenResponseData.statusCode !== 200) {
            logger.error('Discord OAuth2 login denied!');
            return null;
        }
        return tokenResponseData.body.json() as unknown as DiscordOAuthTokenResponse;
    } catch (error) {
        throw new Error(`Error during Discord OAuth2 token request: ${error}`);
    }
};

export const userRequest = async (oauthData: DiscordOAuthTokenResponse) => {
    try {
        const userResponse = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
        });

        if (userResponse.statusCode !== 200) {
            logger.error('Discord API user request denied!');
            return null;
        }

        const userData = await userResponse.body.json() as DiscordUserResponse;
        const { username } = userData;
        return username;
    } catch (error) {
        throw new Error(`Error during User login request at Discord API: ${error}`);
    }
};

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

        const oauthData = await oauthRequest(codeFromBody);
        if (oauthData === null) {
            res.redirect('/error');
            return;
        }

        const username = await userRequest(oauthData);
        if (username === null) {
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