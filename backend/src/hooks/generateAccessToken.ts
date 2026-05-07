import type { Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const generateAccessToken = (
  req: Request,
  res: Response,
  payload: JwtPayload,
) => {
  const token = jwt.sign(
    { username: payload.username, email: payload.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: '15m',
    },
  );

  res.cookie('accessCookie', token, {
    maxAge: 1000 * 60 * 15,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
};
