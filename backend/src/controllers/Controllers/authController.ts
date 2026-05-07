import {
  Free,
  Plus,
  Premium,
  Pro,
  CREDITS_GUEST,
  MONTHLY_CREDITS_GUEST,
  GUEST_SESSION_EXPIRES,
} from './../../lib/constantsBackend';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { getUseroAuthInfo, getOAuth2Client, scopes } from '../../helpers/oAuth';
import { generateAccessToken } from '../../hooks/generateAccessToken';
import { pool } from '../../db/db';
import bcrypt from 'bcrypt';
import type { UserSchema } from '../../../../frontend/src/helpers/Schemas/userSchema';
import { generateRefreshToken } from '../../hooks/generateRefreshToken';
import axios from 'axios';
import { redisClient } from '../../../app';

export const generateAuthUrl = (req: Request, res: Response) => {
  const { provider, type } = req.query;
  try {
    if (provider === 'google') {
      const googleAuthUrl = getOAuth2Client().generateAuthUrl({
        access_type: 'offline',
        include_granted_scopes: true,
        prompt: 'consent',
        scope: scopes,
        state: JSON.stringify({
          provider,
          type,
        }),
      });
      console.log(googleAuthUrl);
      return res.status(200).json({ url: googleAuthUrl });
    } else if (provider === 'github') {
      const state = encodeURIComponent(
        JSON.stringify({
          provider,
          type,
        }),
      );
      const redirectUri = process.env.GITHUB_REDIRECT_URI;
      const clientId = process.env.GITHUB_CLIENT_ID;
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=read:user,user:email`;
      console.log(githubAuthUrl);
      return res.status(200).json({ url: githubAuthUrl });
    }
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return res.status(500).json({ error: 'Failed to generate auth URL' });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const { code, state } = req.query;
  const stateObj = JSON.parse(state as string);
  const { type, provider } = stateObj;
  try {
    const oAuth2Client = getOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code as string);
    oAuth2Client.setCredentials(tokens);
    const userData = await getUseroAuthInfo();

    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [userData.email],
    );

    const userExists = existingUser.rows.length > 0;
    let newUser;

    if (!userExists && type === 'register') {
      await client.query(
        'INSERT INTO users (username, email, auth_provider, picture) VALUES ($1, $2, $3, $4)',
        [userData.name, userData.email, provider, userData.picture],
      );
      newUser = await client.query(`SELECT * FROM users WHERE email = $1`, [
        userData.email,
      ]);
    } else if (userExists && type === 'register') {
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=RegisterAccountExists',
      );
    }

    const jwtPayload = {
      username: newUser
        ? newUser.rows[0].username
        : existingUser.rows[0].username,
      email: newUser ? newUser.rows[0].email : existingUser.rows[0].email,
    };

    generateRefreshToken(req, res, jwtPayload);
    generateAccessToken(req, res, jwtPayload);

    if (!userExists && type === 'login') {
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=LoginAccountDoesntExist',
      );
    }

    if (type === 'login') {
      return res.redirect(
        `http://localhost:5173/auth-success?successCause=SuccessfulLogin`,
      );
    }
    if (type === 'register') {
      return res.redirect(
        `http://localhost:5173/auth-success?successCause=SuccessfulRegister`,
      );
    }
  } catch (error) {
    if (type === 'login') {
      console.error('GOOGLE CALLBACK ERROR', error);
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=UnsuccessfulLogin',
      );
    }
    if (type === 'register') {
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=UnsuccessfulRegister',
      );
    }
  } finally {
    client.release();
  }
};

export const githubCallback = async (req: Request, res: Response) => {
  const state = req.query.state;
  const code = req.query.code;
  const { type, provider } = JSON.parse(decodeURIComponent(state as string));
  console.log(`githubCallback with ${type}, ${provider}`);
  const client = await pool.connect();
  try {
    if (!type || !provider) {
      throw new Error(
        "Either the type or provider wasn't provided in githubCallback",
      );
    }
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      throw new Error(`${tokenRes.data.error}`);
    }
    console.log(`token ${accessToken}`);

    const userRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`response received:`);
    console.log(userRes);

    const emailRes = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const email = emailRes.data.find((e) => e.primary && e.verified)?.email;
    console.log(email);

    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    const userExists = existingUser.rows.length > 0;
    let newUser;

    console.log(
      `user info: ${userRes.data.login} ${userRes.data.avatar_url} ${userRes.data.created_at}`,
    );
    if (!userExists && type === 'register') {
      await client.query(
        'INSERT INTO users (username, email, auth_provider, picture) VALUES ($1, $2, $3, $4)',
        [userRes.data.login, email, provider, userRes.data.avatar_url],
      );
      newUser = await client.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);
    } else if (userExists && type === 'register') {
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=RegisterAccountExists',
      );
    }

    const user = newUser?.rows[0] ?? existingUser.rows[0];
    if (!user) throw new Error('No user found');
    const jwtPayload = {
      username: user.username,
      email: user.email,
    };

    generateRefreshToken(req, res, jwtPayload);
    generateAccessToken(req, res, jwtPayload);

    console.log(email);
    console.log(userRes.data.login);
    console.log(userRes.data.created_at);

    if (!userExists && type === 'login') {
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=LoginAccountDoesntExist',
      );
    }

    if (type === 'login') {
      return res.redirect(
        `http://localhost:5173/auth-success?successCause=SuccessfulLogin`,
      );
    }
    if (type === 'register') {
      return res.redirect(
        `http://localhost:5173/auth-success?successCause=SuccessfulRegister`,
      );
    }
  } catch (error) {
    console.error('CALLBACK ERROR:', error);
    if (type === 'login') {
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=UnsuccessfulLogin',
      );
    }
    if (type === 'register') {
      return res.redirect(
        'http://localhost:5173/auth-fail?failCause=UnsuccessfulRegister',
      );
    }
  }
};

export const generateRefreshAccessToken = (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshCookie;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token found' });
    }

    const validRefreshCookie = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!validRefreshCookie) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const jwtPayload = {
      username: validRefreshCookie.username,
      email: validRefreshCookie.email,
    };

    generateAccessToken(req, res, jwtPayload);

    return res.status(200).json({
      message: 'Access token refreshed successfully',
      success: true,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Token refresh failed' });
  }
};

export const createGuestUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // fingerprint
    console.log(req.headers);
    const fingerprint = req.headers['fingerprint'] as string;
    console.log(`${fingerprint} [createGuestUser]`);
    if (!fingerprint) {
      return res.status(400).json({ error: 'No fingerprint provided [createGuestUser]' });
    }
    req.fingerprint = fingerprint;
    const userData = await redisClient.exists(`guest:${fingerprint}`);
    if (userData === 0) {
      await redisClient.hSet(`guest:${fingerprint}`, {
        isGuest: 'true',
        fingerprint: fingerprint,
        guestId: `guest:${fingerprint}.${Date.now()}`,
        credits: CREDITS_GUEST,
        updatedAt: String(new Date(Date.now())),
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const instantiateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await pool.connect();
  try {
    const accessToken = req.cookies.accessCookie;
    const refreshToken = req.cookies.refreshCookie;

    if (!refreshToken) {
      if (!req.fingerprint) {
        return res
          .status(400)
          .json({ message: 'Fingerprint not provided [instantiateUser]' });
      }
      const result = await redisClient.hGetAll(`guest:${req.fingerprint}`);
      console.log(result.updatedAt);
      const countDays =
        (Date.now() - Date.parse(result.updatedAt)) / (1000 * 60 * 60 * 24);

      const monthsPassed = Math.floor(countDays / 30);

      const newCredits =
        monthsPassed > 0
          ? monthsPassed * MONTHLY_CREDITS_GUEST + Number(result.credits)
          : result.credits;

      const newUpdatedAt =
        monthsPassed > 0
          ? new Date(Date.now() - (countDays % 30) * 24 * 60 * 60 * 1000)
          : result.updatedAt;

      await redisClient.hSet(`guest:${req.fingerprint}`, {
        credits: String(newCredits),
        updatedAt: String(newUpdatedAt),
      });

      req.user = {
        isGuest: true,
        fingerprint: result.fingerprint,
        guestId: result.guestId,
        credits: Number(newCredits),
        updatedAt: new Date(newUpdatedAt),
      };

      console.log('[instantiateUser] GUEST USER', req.user);
      next();
    } else {
      const verifiedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      if (!accessToken) {
        generateAccessToken(req, res, verifiedRefresh);
      }

      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [verifiedRefresh.email],
      );
      if (result.rowCount === 0) {
        throw new Error(
          "User not found in db [instantiateUser]",
        );
      }
      const userSubscription = result.rows[0].subscription;
      let monthlyCredits;
      switch (userSubscription) {
        case 'free':
          monthlyCredits = Free.monthlyCredits;
          break;
        case 'plus':
          monthlyCredits = Plus.monthlyCredits;
          break;
        case 'premium':
          monthlyCredits = Premium.monthlyCredits;
          break;
        case 'pro':
          monthlyCredits = Pro.monthlyCredits;
          break;
        default:
          monthlyCredits = MONTHLY_CREDITS_GUEST;
      }

      const countDays =
        (Date.now() - Date.parse(result.rows[0].updated_at)) /
        (1000 * 60 * 60 * 24);

      const monthsPassed = Math.floor(countDays / 30);

      const newCredits =
        monthsPassed > 0
          ? monthsPassed * monthlyCredits + result.rows[0].credits
          : 0;

      console.log('countDays', countDays);
      console.log('monthsPassed', monthsPassed);
      console.log('newCredits', newCredits);

      const newUpdatedAt =
        monthsPassed > 0
          ? new Date(Date.now() - (countDays % 30) * 24 * 60 * 60 * 1000)
          : result.rows[0].updated_at;

      if (monthsPassed > 0) {
        await client.query(
          'UPDATE users SET updated_at = $1, credits = $2 WHERE email = $3',
          [newUpdatedAt, newCredits, result.rows[0].email],
        );
      }

      const updatedUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [result.rows[0].email],
      );

      req.user = updatedUser.rows[0];

      console.log('[instantiateUser] USER', req.user);
      next();
    }
  } catch (error) {
    console.log('[instantiateUser]', error);
    return res
      .status(401)
      .json({ message: 'Something went wrong [instantiateUser]', error });
  } finally {
    client.release();
  }
};

export const register = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;
    const existingUserSearch = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    const exists = existingUserSearch.rows.length > 0;
    if (exists) {
      return res.status(400).json({
        message:
          'Account with such email already exists, try a different email.',
        cause: 'RegisterAccountExists',
      });
    } else {
      const encryptPassword = await bcrypt.hash(password, 10);
      const cutEmail = email.split('@')[0];
      const result = await client.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [cutEmail, email, encryptPassword],
      );

      const jwtPayload = {
        username: cutEmail,
        email: email,
      };

      generateRefreshToken(req, res, jwtPayload);
      generateAccessToken(req, res, jwtPayload);

      req.user = result.rows[0] as UserSchema;
      console.log('REQ.USER AFTER REGISTERING', req.user);

      return res.status(200).json({
        message: 'Register attempt successful',
        cause: 'SuccessfulRegister',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: error,
      message: 'Register attempt unsuccessful',
      cause: 'UnsuccessfulRegister',
    });
  } finally {
    client.release();
  }
};

export const login = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;
    const exists = await client.query(`SELECT * from users WHERE email = $1`, [
      email,
    ]);

    if (exists.rows.length == 0) {
      return res.status(400).json({
        message: 'Account with the provided details does not exist.',
        cause: 'LoginAccountDoesntExist',
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      exists.rows[0].password,
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Credentials don't match. try again.",
        cause: 'LoginAccountDoesntExist',
      });
    }

    const jwtPayload = {
      username: exists.rows[0].username,
      email: email,
    };

    generateRefreshToken(req, res, jwtPayload);
    generateAccessToken(req, res, jwtPayload);

    req.user = exists.rows[0] as UserSchema;
    return res.status(200).json({
      message: 'Login attempt successful',
      cause: 'SuccessfulLogin',
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      error: error,
      cause: 'UnsuccessfulLogin',
      message: 'Login attempt unsuccessful.',
    });
  } finally {
    client.release();
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    console.log('CLEARING');
    res.clearCookie('refreshCookie');
    res.clearCookie('accessCookie');
    req.user = undefined;
    console.log('CLEARED');
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Something went wrong in logout', error });
  }
};

export const fetchUser = (req: Request, res: Response) => {
  try {
    console.log('[fetchUser] USER', req.user);
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(400).json({
      error: 'Something went wrong in fetchUser',
      details: error,
    });
  }
};
