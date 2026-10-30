// Applies supabase/migrations/*.sql in order, once each.
// Usage: npm run db:migrate
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { connect } from "./db.mjs";

const dir = "supabase/migrations";
const client = await connect();
try {
  await client.query(`create table if not exists public._migrations (name text primary key, applied_at timestamptz not null default now())`);
  await client.query(`alter table public._migrations enable row level security`);
  await client.query(`revoke all on public._migrations from anon, authenticated`);
  const applied = new Set((await client.query("select name from public._migrations")).rows.map(r => r.name));
  const files = (await readdir(dir)).filter(f => f.endsWith(".sql")).sort();
  for (const file of files) {
    if (applied.has(file)) { console.log(`skip   ${file}`); continue; }
    const sql = await readFile(join(dir, file), "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into public._migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log(`apply  ${file}`);
    } catch (err) {
      await client.query("rollback");
      throw new Error(`${file}: ${err.message}`);
    }
  }
} finally {
  await client.end();
}
