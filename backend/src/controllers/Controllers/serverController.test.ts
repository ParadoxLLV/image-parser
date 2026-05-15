import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import app, { redisClient } from '../../../app';
import { pool } from '../../db/db';
import sharp from 'sharp';

describe('Tests for image format conversion and removing of credits', () => {
  let authCookies: string[];
  const fingerprint = 'testFingerprint';

  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE email LIKE $1', [
      'testEmail%@gmail.com',
    ]);
    await redisClient.del(`guest:${fingerprint}`);

    await request(app).post('/api/auth/instantiateUser').set('fingerprint', fingerprint);
    const res = await request(app).post('/api/auth/register').send({ email: 'testEmail@gmail.com', password: 'testPass123!!DFE#%' });
    authCookies = res.headers['set-cookie'] as unknown as string[];
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email LIKE $1', [
      'testEmail%@gmail.com',
    ]);
    await redisClient.del(`guest:${fingerprint}`);
    console.log(await redisClient.exists(`guest:${fingerprint}`));
  });

  describe('Success cases', () => {
    it('Successfully converts an image(s) and removes the required amount of credits, logged in user', async () => {
      const fileBuffer = await sharp({
        create: {
          width: 20,
          height: 20,
          channels: 3,
          background: { r: 255, g: 0, b: 255 },
        },
      })
        .png()
        .toBuffer();

      const oldUser = await pool.query('SELECT * FROM users WHERE email = $1', [
        'testEmail@gmail.com',
      ]);

      const res = await request(app)
        .post('/api/server/processFile')
        .set('Cookie', authCookies)
        .set('fingerprint', fingerprint)
        .attach('file', fileBuffer, 'test.png')
        .field('convertingToFormat', 'jpg');

      const newUser = await pool.query('SELECT * FROM users WHERE email = $1', [
        'testEmail@gmail.com',
      ]);
      expect(newUser.rows[0].credits).not.toBe(oldUser.rows[0].credits);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('Successfully converts an image(s) and removes the required amount of credits, guest user', async () => {
      const fileBuffer = await sharp({
        create: {
          width: 20,
          height: 20,
          channels: 3,
          background: { r: 255, g: 0, b: 255 },
        },
      })
        .png()
        .toBuffer();

      const oldUser = await redisClient.hGetAll(`guest:${fingerprint}`);

      const res = await request(app)
        .post('/api/server/processFile')
        .set('fingerprint', fingerprint)
        .attach('file', fileBuffer, { filename: 'test.png' })
        .field('convertingToFormat', 'jpg');

      const newUser = await redisClient.hGetAll(`guest:${fingerprint}`);
      expect(Number(newUser.credits)).not.toBe(Number(oldUser.credits));
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('Failure cases', () => {
    it('Fails to convert an image because due to a lack of credits, logged in user', async () => {
      const fileBuffer = await sharp({
        create: {
          width: 20,
          height: 20,
          channels: 3,
          background: { r: 255, g: 0, b: 255 },
        },
      })
        .png()
        .toBuffer();

      await request(app)
        .post('/api/server/removeCredits')
        .set('Cookie', authCookies)
        .set('fingerprint', fingerprint)
        .send({ amount: 10 });
      
      const fileRes = await request(app)
        .post('/api/server/processFile')
        .set('Cookie', authCookies)
        .set('fingerprint', fingerprint)
        .attach('file', fileBuffer, { filename: 'test.png' })
        .field('convertingToFormat', 'png');

      expect(fileRes.status).not.toBe(200);
    });

    it('Fails to convert an image because due to a lack of credits, guest user', async () => {
      const fileBuffer = await sharp({
        create: {
          width: 20,
          height: 20,
          channels: 3,
          background: { r: 255, g: 0, b: 255 },
        },
      })
        .png()
        .toBuffer();

      const res = await request(app)
        .post('/api/server/removeCredits')
        .set('fingerprint', fingerprint)
        .send({ amount: 10 });
    
        
      console.log("WEDJIDWEWEDJEDWEDJWIEDJIOWEWEDJIOWEDWERFFRERF", res.body);
      const guestCheck = await redisClient.hGetAll(`guest:${fingerprint}`);
      console.log("user is guest?", guestCheck.isGuest);
      console.log("user credits", guestCheck.credits);

      const fileRes = await request(app)
        .post('/api/server/processFile')
        .set('fingerprint', fingerprint)
        .attach('file', fileBuffer, { filename: 'test.png' })
        .field('convertingToFormat', 'png');

      expect(fileRes.status).not.toBe(200);
    });
  });
});