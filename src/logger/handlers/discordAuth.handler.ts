import { request } from 'undici';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../winston/winston.js';

export const discordAuthGuardHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'playwrightTest') {
    return next();
  }
  const token = req.cookies?.access_token;

  if (!token) {
    return res.redirect('/');
  }

  try {
    const userResponse = await request('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (userResponse.statusCode !== 200) {
      res.redirect('/error');
    }

    return next();
  } catch (err) {
    logger.error('Discord authentication failed:', err);
    return next(err);
  }
};
