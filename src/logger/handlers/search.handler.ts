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
    const { authorName } = req.body;
    // const pageNumber = await authorController(db, authorName);
    const matchingAuthors = await authorController(db, authorName);
    res.send(matchingAuthors);
  } catch (error) {
    logger.error('Search handler error:', error);
    next(error);
  }
};
