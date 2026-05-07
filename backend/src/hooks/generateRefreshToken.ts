import { redisClient } from '../../app';
import type { Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const generateRefreshToken = (
  req: Request,
  res: Response,
  payload: JwtPayload,
) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });

  res.cookie('refreshCookie', token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
};
