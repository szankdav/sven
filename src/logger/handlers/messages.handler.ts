import { NextFunction, Response, Request } from 'express';
import {
  messageController,
  messagesByAuthorsController,
  messagesController,
} from '../controller/messages.controller.js';
import { db } from '../database/database.js';

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
    next(error);
  }
};

export const messageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { messageid } = req.body;
    const message = await messageController(db, [Number(messageid)]);

    if(message){
      res.send({ content: message });
    }
  } catch (error) {
    logger.error('Message handler error:', error);
    next(error);
  }
};
