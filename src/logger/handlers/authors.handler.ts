import { NextFunction, Request, Response } from "express";
import { authorsController } from "../controller/author.controller.js";
import { db } from "../database/database.js";
import { logger } from "../../winston/winston.js";

export const authorsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.params["page"]);
    const renderObject = await authorsController(db, page);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    logger.error("Author handler error:", error);
    next(error);
  }
};
