import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.render('login', { err: '' });
  } catch (error) {
    logger.error('Login view error:', error);
    next(error);
  }
};