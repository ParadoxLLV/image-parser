import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '../.test.env' : '../.env',
});
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/authRoutes/authRoutes';
import serverRouter from './src/routes/serverRoutes/serverRoutes';
import { createClient } from 'redis';
import express from 'express';
import { stripeWebhook } from './src/controllers/Controllers/stripeWebhook';
import {
  createGuestUser,
  instantiateUser,
} from './src/controllers/Controllers/authController';

const app = express();

export const redisClient = createClient({
  url: `redis://localhost:${process.env.REDIS_PORT}`,
});

await redisClient.connect();

app.use(
  '/api/server/stripe-webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'fingerprint'],
  }),
);

app.use('/api/auth', authRouter);
app.use('/api/server', createGuestUser, instantiateUser, serverRouter);

export default app;
