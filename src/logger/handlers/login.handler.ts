import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { authUserService } from '../services/auth.service.js';

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const isLoggedIn = await authUserService(req);
    res.render('login', {
      isLoggedIn,
      title: 'Discord Server Monitoring',
      layout: 'layout',
      styles: ['/css/login.css'],
      scripts: ['/js/login.js'],
    });
  } catch (error) {
    logger.error('Login view error:', error);
    next(error);
  }
};