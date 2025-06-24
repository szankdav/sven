import { NextFunction, Request, Response } from 'express';
import { authorsController } from '../controller/authors.controller.js';
import { db } from '../database/database.js';

export const authorsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page } = req.params;
    const renderObject = await authorsController(db, [page]);
    if (renderObject) {
      res.render(renderObject.viewName, renderObject.options);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
