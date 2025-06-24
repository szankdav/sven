import { request } from 'undici';
import { DiscordOAuthTokenResponse } from '../types/discordOAuthTokenResponse.js';
import { logger } from '../../winston/winston.js';
import { config } from '../../config.js';

export const oauthService = async (codeFromBody: string): Promise<null | DiscordOAuthTokenResponse> => {
    try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: config.DISCORD_CLIENT_SVEN_ID,
                client_secret: config.DISCORD_CLIENT_SVEN_SECRET,
                code: codeFromBody,
                grant_type: 'authorization_code',
                redirect_uri: 'https://svenbot.cloud/login',
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