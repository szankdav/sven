import { Request, Response } from 'express';

export const loginErrorHandler = (req: Request, res: Response) => res.status(500).render('error', { routeError: '', loginError: 'Error during login! Ask the site operator for help, or try again logging in with Sven!' });
