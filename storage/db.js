const { Pool } = require('pg');
require('dotenv').config();

// Use a single application-wide pool
const poolConfig = {
  // Prefer DATABASE_URL if provided; otherwise fall back to discrete params
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS || 5000),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  // Ideally report to monitoring in production
  console.error('Unexpected PG pool error', err);
});

async function sql(queryText, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(queryText, params);
    return result.rows;
  } finally {
    client.release();
  }
}

async function transaction(executor) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await executor(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { sql, transaction, pool };


