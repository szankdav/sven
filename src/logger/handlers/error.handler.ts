import { Request, Response } from "express";

export const errorHandler = (req: Request, res: Response) => {
  res.status(404).render("error", { err: "Page not found!" });
};
