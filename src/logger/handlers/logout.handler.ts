import { NextFunction, Request, Response } from 'express';
import { logger } from '../../winston/winston.js';

export const logoutHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    logger.info(`User logged out successfully: ${req.body.username}`);
    res.sendStatus(200);
  } catch (error) {
    logger.error('Logout handler error:', error);
    next(error);
  } 
};