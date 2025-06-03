import { request } from 'undici';
import { logger } from '../../winston/winston.js';
import { DiscordUserResponse } from '../types/discordUserResponse.js';

export const getDiscordUserService = async (token_type: string, access_token: string) => {
    try {
        const userResponse = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token_type} ${access_token}`,
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
        throw new Error(`Error getting User from Discord API: ${error}`);
    }
};