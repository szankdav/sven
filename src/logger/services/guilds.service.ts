import { request } from 'undici';
import { logger } from '../../winston/winston.js';
import { userGuild } from '../types/userGuild.type.js';

export const getUserServersService = async (token_type: string, access_token: string): Promise<Array<userGuild> | null> => {
    try {
        const guildsResponse = await request('https://discord.com/api/users/@me/guilds', {
            headers: {
                authorization: `${token_type} ${access_token}`,
            },
        });

        if (guildsResponse.statusCode !== 200) {
            logger.error('Discord API guilds request denied!');
            return null;
        }
        const guilds = await guildsResponse.body.json() as Array<userGuild>;

        return guilds;
    } catch (error) {
        throw new Error(`Error getting Guilds from Discord API: ${error}`);
    }
};