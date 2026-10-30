import pg from "pg";

// One small pool per warm function instance. Supavisor (transaction mode)
// multiplexes these onto Postgres, so max: 1 is plenty for serverless.
let pool: pg.Pool | undefined;

export function db() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not configured");
    pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return pool;
}
