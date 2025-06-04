import { request } from 'undici';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../winston/winston.js';

export const discordAuthGuardHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'playwrightTest') {
    return next();
  }
  const token = req.cookies?.access_token;

  if (!token) {
    // return res.render('error', { routeError: '', loginError: "You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in with Sven!", isLoggedIn: false });
    return res.redirect('/');
  }

  try {
    const userResponse = await request('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (userResponse.statusCode !== 200) {
      return res.render('error', { routeError: '', loginError: 'Invalid or expired Discord token, please start a new login with the help of Sven!', isLoggedIn: false });
    }

    return next();
  } catch (err) {
    logger.error('Discord auth failed:', err);
    return next(err);
  }
};
