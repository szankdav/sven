import { NextFunction, Request, Response } from 'express';

export const homeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.render('index');
  } catch (error) {
    next(error);
  }
};
