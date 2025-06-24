import { Request } from 'express';
import { request } from 'undici';
import { logger } from '../../winston/winston.js';

export const authUserService = async (req: Request): Promise<boolean> => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return false;
        }

        const userResponse = await request('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        if (userResponse.statusCode !== 200) {
            return false;
        }

        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};