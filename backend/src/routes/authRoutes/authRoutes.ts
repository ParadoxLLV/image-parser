import express from 'express';
import {
  fetchUser,
  generateAuthUrl,
  googleCallback,
  logout,
  register,
  instantiateUser,
  createGuestUser,
  login,
  generateRefreshAccessToken,
  githubCallback,
} from '../../controllers/Controllers/authController';

const authRouter = express.Router();

authRouter.get('/generateAuthUrl', generateAuthUrl);

// google
authRouter.get('/google/callback', googleCallback);
// github
authRouter.get('/github/callback', githubCallback);
// normal
authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/generateAccessToken', generateRefreshAccessToken);

authRouter.post(
  '/instantiateUser',
  createGuestUser,
  instantiateUser,
  fetchUser,
);

authRouter.get('/createGuestUser', createGuestUser, (req, res) => {
  res.status(200).json({ success: true });
});

authRouter.get('/instantiateUserIsolated', createGuestUser, instantiateUser, (req, res) => {
  res.status(200).json({ user: req.user });
});

authRouter.post('/fetchUser', fetchUser);

authRouter.post('/logout', logout);

export default authRouter;
