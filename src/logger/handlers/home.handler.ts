import { NextFunction, Request, Response } from "express";
import { logger } from "../../winston/winston.js";

export const homeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.render("index");
  } catch (error) {
    logger.error("Home handler error:", error);
    next(error);
  }
};
