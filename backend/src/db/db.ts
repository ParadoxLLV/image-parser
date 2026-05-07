import dotenv from 'dotenv';
import { Pool } from 'pg'

dotenv.config({ path: '../.env' });

export const pool = new Pool({
    connectionString: process.env.PGCONNECTIONSTRING,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});