import {
  afterAll,
  beforeAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import request from 'supertest';
import app, { redisClient } from '../../../app';
import { pool } from '../../db/db';
import { CREDITS_GUEST, Free } from '../../lib/constantsBackend';

describe('Tests for the creation and fetching of a guest user', () => {
  describe('Success cases', () => {
    beforeAll(async () => {
      await redisClient.del('guest:testFingerprint');
      await redisClient.del('guest:testFingerprint2');
    });
    afterAll(async () => {
      await redisClient.del('guest:testFingerprint');
      await redisClient.del('guest:testFingerprint2');
    });
    const fingerprint = 'testFingerprint';
    it('Creates a guest user inside the redis database', async () => {
      const res = await request(app)
        .get('/api/auth/createGuestUser')
        .set('fingerprint', fingerprint);
      expect(res.status).not.toBe(400);
    });

    it('Instantiates a guest user from the redis database', async () => {
      const res = await request(app)
        .get('/api/auth/instantiateUserIsolated')
        .set('fingerprint', fingerprint);
      expect(res.status).not.toBe(400);
      expect(res.body).toHaveProperty('user');
    });

    it('Fetches a user', async () => {
      const userRes = await request(app)
        .post('/api/auth/instantiateUser')
        .set('fingerprint', fingerprint);
      expect(userRes.status).toBe(200);
      expect(userRes.body).toHaveProperty('isGuest');
    });

    it("Adds 10 credits to a guest user's account if a month has passed and sets a new updatedAt value", async () => {
      const fingerprint = 'testFingerprint2';
      const oldUpdatedAt = new Date(Date.now() - 2592000000);
      await redisClient.hSet(`guest:${fingerprint}`, {
        isGuest: 'true',
        fingerprint: fingerprint,
        guestId: `guest:${fingerprint}.${Date.now()}`,
        credits: CREDITS_GUEST,
        updatedAt: String(oldUpdatedAt),
      });
      const userRes = await request(app)
        .post('/api/auth/instantiateUser')
        .set('fingerprint', fingerprint);
      expect(userRes.status).toBe(200);
      expect(userRes.body.credits).toBe(20);
      expect(userRes.body.updatedAt).not.toBe(String(oldUpdatedAt));
    });
  });

  describe('Failure cases', () => {
    const fingerprint = 'testFingerprint';
    afterAll(async () => {
      await redisClient.del(`guest:${fingerprint}`);
    });
    beforeAll(async () => {
      await redisClient.del(`guest:${fingerprint}`);
      await request(app)
        .get('/api/auth/createGuestUser')
        .set('fingerprint', fingerprint);
    });
    it("Doesn't create a new guest user because user with the same fingerprint exists in redis database", async () => {
      const guestCreate = await redisClient.hGet(
        `guest:${fingerprint}`,
        'guestId',
      );

      await request(app)
        .get('/api/auth/createGuestUser')
        .set('fingerprint', fingerprint);

      const guestCreateAfter = await redisClient.hGet(
        `guest:${fingerprint}`,
        'guestId',
      );
      expect(guestCreate).toBe(guestCreateAfter);
    });
  });
});

describe('Tests for the registering and logging in of a user', () => {
  describe('Success cases', () => {
    let authCookies: string[];
    const fingerprint = 'testFingerprint';
    beforeAll(async () => {
      await pool.query('DELETE FROM users WHERE email LIKE $1', [
        'testEmail%@gmail.com',
      ]);
      await redisClient.del(`guest:${fingerprint}`);
    });
    afterAll(async () => {
      await pool.query('DELETE FROM users WHERE email LIKE $1', [
        'testEmail%@gmail.com',
      ]);
      await redisClient.del(`guest:${fingerprint}`);
    });

    it('Registers a user and creates refresh and access cookies', async () => {
      const userRes = await request(app)
        .post('/api/auth/register')
        .send({ email: 'testEmail@gmail.com', password: 'testPass123!!DFE#%' });
      console.log(`got status: ${userRes.status}`);
      expect(userRes.status).toBe(200);
      authCookies = userRes.headers['set-cookie'] as unknown as string[];
      expect(authCookies.some((c) => c.startsWith('accessCookie'))).toBe(true);
      expect(authCookies.some((c) => c.startsWith('refreshCookie'))).toBe(true);
    });

    it('Logs in a user and creates refresh and access cookies', async () => {
      const userRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testEmail@gmail.com', password: 'testPass123!!DFE#%' });
      expect(userRes.status).toBe(200);
      authCookies = userRes.headers['set-cookie'] as unknown as string[];
      expect(authCookies.some((c) => c.startsWith('accessCookie'))).toBe(true); // [some] checks for the first value to appear in an array
      expect(authCookies.some((c) => c.startsWith('refreshCookie'))).toBe(true);
    });

    it('Instantiates a user from the database', async () => {
      const res = await request(app)
        .get('/api/auth/instantiateUserIsolated')
        .set('fingerprint', fingerprint)
        .set('Cookie', authCookies);
      expect(res.status).not.toBe(400);
      expect(res.body).toHaveProperty('user');
    });

    it('Fetches a logged in user', async () => {
      const fingerprint = 'testFingerprint';
      const userRes = await request(app)
        .post('/api/auth/instantiateUser')
        .set('fingerprint', fingerprint)
        .set('Cookie', authCookies);
      expect(userRes.status).toBe(200);
      expect(userRes.body).not.toHaveProperty('isGuest');
      expect(userRes.body).toHaveProperty('email');
    });

    it('Adds the required amount of monthly credits to the logged in user', async () => {
      const testEmail = 'testEmail2@gmail.com';
      const authRes = await request(app)
        .post('/api/auth/register')
        .send({ email: testEmail, password: 'testPass123!!DFE#%' });
      let authCookies2 = authRes.headers['set-cookie'] as unknown as string[];
      await pool.query('UPDATE users SET updated_at = $1 WHERE email = $2', [
        new Date(Date.now() - 2592000000),
        testEmail,
      ]);

      const userRes = await request(app)
        .post('/api/auth/instantiateUser')
        .set('fingerprint', fingerprint)
        .set('Cookie', authCookies2);
      expect(userRes.body.credits).toBe(10 + Free.monthlyCredits);
    });

    it('Logs out a user', async () => {
      const userRes = await request(app).post('/api/auth/logout');
      expect(userRes.status).toBe(200);
      const cookies = userRes.headers['set-cookie'] as unknown as string[];
      expect(cookies.some((c) => c.startsWith('accessCookie=;'))).toBe(true); // [some] checks for the first value to appear in an array
      expect(cookies.some((c) => c.startsWith('refreshCookie=;'))).toBe(true);
    });
  });

  describe('Failure cases', () => {
    let authCookies: string[];
    const fingerprint = 'testFingerprint';

    afterAll(async () => {
      await pool.query('DELETE FROM users WHERE email LIKE $1', [
        'testEmail%@gmail.com',
      ]);
      await redisClient.del(`guest:${fingerprint}`);
    });
    beforeAll(async () => {
      await pool.query('DELETE FROM users WHERE email LIKE $1', [
        'testEmail%@gmail.com',
      ]);
      await redisClient.del(`guest:${fingerprint}`);
    });

    it('throws a LoginAccountDoesntExist error when logging in because of an email that doesnt exist in the database', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testEmail@gmail.com', password: 'testPass123!!DFE#%' });
      expect(res.status).toBe(400);
      expect(res.body.cause).toBe('LoginAccountDoesntExist');
    });

    it('throws a RegisterAccountExists error when registering because of an email that exists in the database', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'testEmail@gmail.com', password: 'testPass123!!DFE#%' });
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'testEmail@gmail.com', password: 'testPass123!!DFE#%' });
      expect(res.status).toBe(400);
      expect(res.body.cause).toBe('RegisterAccountExists');
    });
  });
});
