import { request } from 'undici';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../winston/winston.js';

export const discordAuthHandler = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.render('error', { routeError: '', missingTokenError: 'Missing token! Please try again with the help of Sven! If the problem persists, please let Sven know!', expiredTokenError: '' });
  }

  try {
    const discordRes = await request('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (discordRes.statusCode !== 200) {
      return res.render('error', { routeError: '', missingTokenError: '', expiredTokenError: 'Invalid or expired Discord token, please start a new login with the help of Sven!' });
    }

    return next();
  } catch (err) {
    logger.error('Discord auth failed:', err);
    return next(err);
  }
};
