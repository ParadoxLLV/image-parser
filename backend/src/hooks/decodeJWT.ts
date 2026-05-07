import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const decodeJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
  token: string,
) => {
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    return verified;
  } catch (error) {
    throw error;
  }
};
