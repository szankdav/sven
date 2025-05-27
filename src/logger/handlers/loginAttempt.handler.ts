import { NextFunction, Request, Response } from 'express';
import { request } from 'undici';
import { logger } from '../../winston/winston.js';
import { DiscordOAuthTokenResponse } from '../types/discordOAuthTokenResponse.js';
import { DiscordUserResponse } from '../types/discordUserResponse.js';
import { interactionData } from '../../bot/commands/utility/logintostatistics.js';
import { config } from '../../config.js';

const sendErrorMessageForOperators = async (errorMessage: string) => {
    logger.error(errorMessage);
    interactionData.interaction.user.send('Úgy látom, nem sikerült a bejelentkezés! Próbáld meg kicsit később újra! A biztonság kedvéért értesítettem az üzemeltetőt a hibáról! 😉');
    const members = await interactionData.interaction.guild?.members.fetch();
    const operators = Array.from(members!.values()).filter(
        member => member.user.username === 'szank_dav'
        // member => meber.user.discriminator === '0' <---- Üzenet küldése minden adminnak  
    );
    await Promise.all(
        operators?.map(async member => {
            try {
                await member.user.send(`Szia! Értesítelek, hogy történt egy sikertelen bejelentkezés a ${interactionData.interaction.guild?.name} szerveren. A felhasználó: ${interactionData.interaction.user.globalName}. Tájékoztattam privát üzenetben, hogy már rajta vagy a hibán! 😉`);
            } catch (error) {
                logger.error(`Nem sikerült üzenetet küldeni az üzemeltetőnek: ${member.user.tag}. ${error}`);
            }
        })
    );
};

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
            sendErrorMessageForOperators(`Discord OAuth2 login denied! Login started by User: ${interactionData.interaction.user.globalName} from server: ${interactionData.interaction.guild?.name}`);
            return null;
        }
        return tokenResponseData.body.json() as unknown as DiscordOAuthTokenResponse;
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

        if (userResponse.statusCode !== 200) {
            sendErrorMessageForOperators(`Discord API user request denied started by User: ${interactionData.interaction.user.globalName} from server: ${interactionData.interaction.guild?.name}`);
            return null;
        }

        const userData = await userResponse.body.json() as DiscordUserResponse;
        const { username } = userData;
        return username;
    } catch (error) {
        throw new Error(`Error during User login request at Discord API: ${error}`);
    }
};

const createCookies = (res: Response, username: string, oauthData: DiscordOAuthTokenResponse) => {
    res.cookie('user_info', JSON.stringify({ username, server: interactionData.interaction.guild?.name }), {
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
            if (Object.keys(interactionData.interaction).length === 0) {
                logger.error('Login attempt without a valid code and interaction was made!');
                res.sendStatus(401);
                return;
            }
            sendErrorMessageForOperators(`Login attempt without a valid code was made by User: ${interactionData.interaction.user.globalName} from server: ${interactionData.interaction.guild?.name}`);
            res.sendStatus(401);
            return;
        }

        const oauthData = await oauthRequest(codeFromBody);
        if (oauthData === null) {
            res.sendStatus(401);
            return;
        }

        const username = await userRequest(oauthData);
        if (username === null) {
            res.sendStatus(401);
            return;
        }

        createCookies(res, username, oauthData);
        logger.info(`Successful login with username: ${username}, from server: ${interactionData.interaction.guild?.name}`);
        res.json({ username, server: interactionData.interaction.guild?.name });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};