import type { Request, Response } from "express";
import type { ExtendedRequest } from "../types/extended-request.js";

export const ping = (req: Request, res: Response) => {
  res.json({ pong: true });
};

export const privateping = (req: ExtendedRequest, res: Response) => {
  res.json({ pong: true, slug: req.userSlug });
};
