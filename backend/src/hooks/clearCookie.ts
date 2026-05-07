import type { Request, Response } from 'express';

export const clearCookie = (req: Request, res: Response) => {
  const { cookieName } = req.body;
  try {
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return res
      .status(200)
      .json({ success: `Successfully deleted cookie ${cookieName}` });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        message: `Couldn't delete cookie with the name of ${cookieName}`,
        error: error,
      });
  }
};
