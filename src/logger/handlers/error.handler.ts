import { Request, Response } from 'express';

export const errorHandler = (req: Request, res: Response) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.render('error', { routeError: '', missingTokenError: "You are on a page that requires authentication. If you came here by accident, please close the window. If you are here on purpose, but don't understand what is happening, ask the site operator for help, or try logging in again with Sven!", expiredTokenError: '' });
  }
  return res.status(404).render('error', { routeError: 'Page not found!', missingTokenError: '', expiredTokenError: '' });
};
