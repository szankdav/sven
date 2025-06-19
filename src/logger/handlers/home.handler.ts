import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';

export const homeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.render('home', {
            isLoggedIn: true,
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
