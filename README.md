# www.vksoftsolutions.com

The VK Soft Solutions website and admin panel. It's a React + Vite single-page app with Vercel serverless functions, Supabase (Postgres + Auth) and Cloudflare Turnstile.

| Path | What it is |
| --- | --- |
| `src/pages`, `src/components`, `src/data` | Public site. Copy lives in `src/data/*.ts`, company details in `src/config/site.ts` |
| `src/styles` | Design system (`globals`, `interior`, `contact` are ported from the design source; `site.css` holds the additions) |
| `src/admin` | Admin panel at `/admin`, lazy-loaded (dashboard, inquiries, applications, jobs, subscribers, settings) |
| `api/submit.ts` | The only write path for public forms: origin check, honeypot, validation, Turnstile, rate limit, insert |
| `supabase/migrations` | Database schema, row-level security (RLS) policies and admin RPCs |
| `scripts/` | `migrate.mjs` (apply migrations) and `create-admin.mjs` (create or reset an admin login) |

## Local development

```sh
npm install
cp .env.example .env.local   # fill in values (already filled on the original machine)
npm run dev                  # http://localhost:5173 — /api/submit runs locally too
npm run dev -- --hostname 127.0.0.1 --port 5172
```

The Turnstile widget only renders on hostnames listed in the Cloudflare dashboard. Add `localhost` there. You can also use Cloudflare's test keys for local work: site key `1x00000000000000000000AA` with secret `1x0000000000000000000000000000000AA`.

## Database

```sh
npm run db:migrate                          # applies supabase/migrations/*.sql once each
npm run admin:create -- someone@example.com # creates/resets a confirmed admin login, prints a temp password
```

Security model:

- Browsers (anon key) can read **published jobs only**.
- All form writes go through `/api/submit` over `DATABASE_URL`, after Turnstile verification.
- Signed-in users listed in `admin_users` can read and manage everything, enforced by RLS and `is_admin()`.
- Résumés live in `application_files`. Only admins can read them, through `get_resume()`.

## Deploying to Vercel

1. Push this folder to a Git repo and import it in Vercel. It detects the framework as **Vite**.
2. Under Project → Settings → Environment Variables, add:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`, `DATABASE_URL` (the pooler URL on port 6543), `IP_HASH_SALT`
3. Under Domains, add `www.vksoftsolutions.com` (primary) and `vksoftsolutions.com`. `vercel.json` redirects the apex domain to `www`.
4. Cloudflare Turnstile → widget → Hostnames: add `www.vksoftsolutions.com`, `vksoftsolutions.com`, and any `*.vercel.app` preview domain you use.
5. Supabase → Authentication → URL Configuration: set Site URL to `https://www.vksoftsolutions.com`. Add `https://www.vksoftsolutions.com/admin/**` and `http://localhost:5173/admin/**` to Redirect URLs. Password-reset links need these.
6. Supabase → Authentication → Attack Protection → **Enable CAPTCHA protection**: choose **Cloudflare Turnstile** and paste the Turnstile **secret** key. The admin login and forgot-password forms already send the Turnstile token. Once this is on, Supabase Auth rejects any attempt without a valid token, including direct API calls that skip the form.
7. Supabase → Authentication → Sign In / Providers: turn **off** “Allow new users to sign up”. The admin UI has no sign-up option; admins are created with `npm run admin:create -- email` and added in Admin → Settings.

## Before launch

- Fill in phone, office addresses and social links in `src/config/site.ts`. Empty fields are hidden.
- Contact details (phone, `info@vksoftsolutionsllc.com`, Cumming GA office and map) live in `src/config/site.ts`.
- Review the starter job descriptions (seeded as **drafts**) in Admin → Jobs, then publish real openings.
- Have the privacy policy and terms reviewed.
- Rotate the Supabase database password and the Turnstile secret, which were shared in plain text during setup. Then update `.env.local` and the Vercel environment variables.



Add their email in `Admin → Settings → Admin users`. I updated the help text there to describe this.
`Run npm run admin:create -- their@email.com` in the project folder. It creates their login and prints a temporary password to give them, which they can change in Settings.
