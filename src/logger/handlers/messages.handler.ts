import { NextFunction, Response, Request } from 'express';
import {
  messagesByAuthorsController,
  messagesController,
} from '../controller/messages.controller.js';
import { db } from '../database/database.js';
import { logger } from '../../winston/winston.js';

export const messagesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page } = req.params;
    const renderObject = await messagesController(db, [page]);
    if (renderObject) {
      res.render(renderObject.viewName, renderObject.options);
    } else {
      next();
    }
  } catch (error) {
    logger.error('Messages handler error:', error);
    next(error);
  }
};

export const messagesByAuthorsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorId = req.params.id;
    const renderObject = await messagesByAuthorsController(db, [authorId]);
    if (renderObject) {
      res.render(renderObject.viewName, renderObject.options);
    } else {
      next();
    }
  } catch (error) {
    logger.error('Messages handler error:', error);
    next(error);
  }
};
