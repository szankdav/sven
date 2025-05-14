import { Request, Response } from 'express';

export const errorHandler = (req: Request, res: Response) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.render('error', { routeError: '', missingTokenError: 'Missing token! Please try again with the help of Sven! If the problem persists, please let Sven know!', expiredTokenError: '' });
  }
  return res.status(404).render('error', { routeError: 'Page not found!', missingTokenError: '', expiredTokenError: '' });
};
