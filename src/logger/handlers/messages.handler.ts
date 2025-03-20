import { NextFunction, Response, Request } from "express";
import {
  messagesByAuthorsController,
  messagesController,
} from "../controller/message.controller.js";
import { db } from "../database/database.js";
import { logger } from "../../winston/winston.js";

export const messagesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params["page"]);
    const renderObject = await messagesController(db, page);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    logger.error("Messages handler error:", error);
    next(error);
  }
};

export const messagesByAuthorsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorId = [parseInt(req.params["id"])];
    const renderObject = await messagesByAuthorsController(db, authorId);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    logger.error("Messages handler error:", error);
    next(error);
  }
};
