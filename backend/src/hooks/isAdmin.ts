import type { Request, Response } from 'express';

export const isAdmin = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  try {
    const userRole = req.user.role;
    if (userRole === 'admin') {
      return res.status(200).json({ message: 'Authorization successful' });
    } else {
      return res.status(403).json({ message: 'Unauthorized user' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Something went wrong in isAdmin' });
  }
};
