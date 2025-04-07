import { NextFunction, Request, Response } from 'express';
import { authorsController } from '../controller/author.controller.js';
import { db } from '../database/database.js';

export const authorsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params.page, 10);
    const renderObject = await authorsController(db, page);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    next(error);
  }
};
