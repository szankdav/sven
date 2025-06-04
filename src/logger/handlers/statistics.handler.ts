import { NextFunction, Request, Response } from 'express';
import { statisticsByAuthorController } from '../controller/statistics.controller.js';
import { db } from '../database/database.js';
import { logger } from '../../winston/winston.js';

export const statisticsByAuthorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorId = req.params.id;
    const renderObject = await statisticsByAuthorController(db, [authorId]);
    if (renderObject) {
      res.render(renderObject.viewName, renderObject.options);
    } else {
      next();
    }
  } catch (error) {
    logger.error('Statistics handler error:', error);
    next(error);
  }
};
