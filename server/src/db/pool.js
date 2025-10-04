import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = new pg.Pool({ connectionString });

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // eslint-disable-next-line no-console
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}
