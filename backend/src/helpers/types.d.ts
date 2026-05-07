import { SessionUser } from './../../../frontend/src/helpers/Schemas/sessionSchema';
import { UserSchema } from './../../../frontend/src/helpers/Schemas/userSchema';
import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: UserSchema | SessionUser,
      session?: SessionUser;
    }
  }
}