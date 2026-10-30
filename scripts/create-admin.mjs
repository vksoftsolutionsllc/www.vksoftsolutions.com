// Creates (or resets) a confirmed Supabase Auth user and grants admin access.
// Usage: npm run admin:create -- you@example.com [password]
// If no password is given a strong one is generated and printed once.
import { randomBytes } from "node:crypto";
import { connect } from "./db.mjs";

const email = (process.argv[2] || "").trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run admin:create -- you@example.com [password]");
  process.exit(1);
}
const password = process.argv[3] || randomBytes(12).toString("base64url") + "!9";

const client = await connect();
try {
  await client.query("begin");
  const existing = await client.query("select id from auth.users where email = $1", [email]);
  let id;
  if (existing.rowCount) {
    id = existing.rows[0].id;
    await client.query(
      `update auth.users set encrypted_password = extensions.crypt($2, extensions.gen_salt('bf')),
         email_confirmed_at = coalesce(email_confirmed_at, now()), updated_at = now() where id = $1`,
      [id, password]);
  } else {
    const res = await client.query(
      `insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
         raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
         confirmation_token, recovery_token, email_change_token_new, email_change,
         email_change_token_current, phone_change, phone_change_token, reauthentication_token)
       values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', $1,
         extensions.crypt($2, extensions.gen_salt('bf')), now(),
         '{"provider":"email","providers":["email"]}', '{"name":"Administrator"}', now(), now(),
         '', '', '', '', '', '', '', '')
       returning id`, [email, password]);
    id = res.rows[0].id;
    await client.query(
      `insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
       values (gen_random_uuid(), $1::uuid, $2::text, jsonb_build_object('sub', $2::text, 'email', $3::text, 'email_verified', true),
         'email', now(), now(), now())`, [id, String(id), email]);
  }
  await client.query("insert into public.admin_users (email) values ($1) on conflict do nothing", [email]);
  await client.query("commit");
  console.log(`Admin ready: ${email}`);
  if (!process.argv[3]) console.log(`Temporary password: ${password}\nChange it after first login (Admin → Settings).`);
} catch (err) {
  await client.query("rollback");
  throw err;
} finally {
  await client.end();
}
