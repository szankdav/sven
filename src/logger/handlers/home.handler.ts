import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { authUserService } from '../services/auth.service.js';

export const homeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const isLoggedIn = await authUserService(req);
    res.render('home', {
            isLoggedIn,
            title: 'Dashboard',
            layout: 'layout',
            styles: ['/css/index.css'],
            scripts: ['/js/navbar.js'],
        });
  } catch (error) {
    logger.error('Home handler error:', error);
    next(error);
  }
};
