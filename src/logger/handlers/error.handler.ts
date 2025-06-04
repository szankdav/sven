import { Request, Response } from 'express';

export const errorHandler = async (req: Request, res: Response) => {
    res.status(404).redirect('/home');
};
