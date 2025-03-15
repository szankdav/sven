import { NextFunction, Request, Response } from "express";
import { messageLoggerController } from "../controller/messageLogger.controller.js";
import { db } from "../database/database.js";
import { logger } from "../../winston/winston.js";
import { DiscordMessage } from "../types/discordMessage.type.js";

export const messageLoggerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message: DiscordMessage = req.body.message;
        await messageLoggerController(db, message);
        res.sendStatus(200);
    } catch (error) {
        logger.error("MessageLogger handler error:", error);
        next(error);
    }
}

// export const messageLoggerHandlerByFunction = async (message: DiscordMessage) => {
//     try {
//         await messageLoggerController(db, message);
//     } catch (error) {
//         logger.error("MessageLogger handler error:", error);
//     }
// }

