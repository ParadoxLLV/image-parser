import type { Request, Response } from 'express';

export const getCookie = (req: Request, res: Response) => {
  const { cookieName } = req.body;
  try {
    const cookie = req.cookies[cookieName];
    res.status(200).json(cookie);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
