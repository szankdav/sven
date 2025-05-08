import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';
import { login } from '../controller/login.controller.js';
import { db } from '../database/database.js';

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.render('login');
  } catch (error) {
    logger.error('Login view error:', error);
    next(error);
  }
};

export const loginAttempHandler = async (req: Request,
  res: Response,
  next: NextFunction,): Promise<void> => {
  try {
    const username = req.body.name;
    if(await login(db, [username])){
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
};