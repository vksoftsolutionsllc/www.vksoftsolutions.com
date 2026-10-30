import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config();

export async function connect() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set (see .env.example)");
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}
