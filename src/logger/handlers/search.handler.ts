import { NextFunction, Request, Response } from 'express';
import { db } from '../database/database.js';
import { logger } from '../../winston/winston.js';
import { authorController } from '../controller/author.controller.js';

export const searchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorName = [req.body.authorName];
    const pageNumber = await authorController(db, authorName);
    res.send(pageNumber.toString());
  } catch (error) {
    logger.error('Search handler error:', error);
    next(error);
  }
};
