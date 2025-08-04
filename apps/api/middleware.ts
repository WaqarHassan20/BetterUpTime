import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization!;
  if (!header) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  try {
    const token = jwt.verify(header, process.env.JWT_SECRET!);
    req.userId = token.sub as string;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
