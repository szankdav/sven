import { Request, Response } from 'express';
import { authUserService } from '../services/auth.service.js';

export const errorHandler = async (req: Request, res: Response) => {
    const checkLoginResult = await authUserService(req);
    res.status(404).render('error', { routeError: 'Page not found!', loginError: '', isLoggedIn: checkLoginResult });
};
