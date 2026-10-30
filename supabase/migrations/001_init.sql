-- VK Soft Solutions — initial schema
-- Public form submissions are written ONLY by the Vercel function (/api/submit)
-- after Turnstile verification. Browsers never get insert rights.
-- Admins (rows in admin_users) read and manage everything through RLS.

create extension if not exists pgcrypto with schema extensions;

-- ───────────────────────── Admins ─────────────────────────
create table if not exists public.admin_users (
  email      text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ───────────────────────── Inquiries ─────────────────────────
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  kind        text not null default 'project' check (kind in ('project','hire_talent','general')),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) <= 254),
  phone       text check (char_length(phone) <= 40),
  company     text check (char_length(company) <= 150),
  service     text not null check (char_length(service) <= 60),
  message     text not null check (char_length(message) between 10 and 4000),
  details     jsonb not null default '{}'::jsonb,
  source_page text,
  status      text not null default 'new' check (status in ('new','in_progress','qualified','closed','spam')),
  notes       text,
  ip_hash     text,
  user_agent  text
);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

-- ───────────────────────── Jobs ─────────────────────────
create table if not exists public.jobs (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  slug             text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title            text not null,
  department       text not null default 'Technology',
  location         text not null default 'Remote (US)',
  employment_type  text not null default 'Full-time' check (employment_type in ('Full-time','Contract','Contract-to-hire','Part-time','Internship')),
  experience       text,
  summary          text not null default '',
  responsibilities text[] not null default '{}',
  requirements     text[] not null default '{}',
  is_published     boolean not null default false
);
create index if not exists jobs_published_idx on public.jobs (is_published, created_at desc);

-- ───────────────────────── Applications ─────────────────────────
create table if not exists public.job_applications (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  job_id             uuid references public.jobs(id) on delete set null,
  job_title          text not null default 'General application',
  name               text not null check (char_length(name) between 2 and 100),
  email              text not null check (char_length(email) <= 254),
  phone              text check (char_length(phone) <= 40),
  location           text check (char_length(location) <= 120),
  linkedin           text check (char_length(linkedin) <= 300),
  experience_years   text check (char_length(experience_years) <= 20),
  work_authorization text check (char_length(work_authorization) <= 80),
  cover_letter       text check (char_length(cover_letter) <= 4000),
  has_resume         boolean not null default false,
  status             text not null default 'new' check (status in ('new','screening','interview','offer','hired','rejected')),
  notes              text,
  source_page        text,
  ip_hash            text,
  user_agent         text
);
create index if not exists applications_created_idx on public.job_applications (created_at desc);
create index if not exists applications_status_idx on public.job_applications (status);

-- Resumes live in their own table so list queries stay light.
create table if not exists public.application_files (
  application_id uuid primary key references public.job_applications(id) on delete cascade,
  filename       text not null,
  mime_type      text not null,
  size_bytes     integer not null check (size_bytes <= 3 * 1024 * 1024),
  data           bytea not null,
  created_at     timestamptz not null default now()
);

-- ───────────────────────── Newsletter ─────────────────────────
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null unique check (email = lower(email) and char_length(email) <= 254),
  status     text not null default 'active' check (status in ('active','unsubscribed')),
  source_page text,
  ip_hash    text
);

-- ───────────────────────── Rate limiting ─────────────────────────
create table if not exists public.submission_log (
  id         bigserial primary key,
  created_at timestamptz not null default now(),
  ip_hash    text not null,
  kind       text not null
);
create index if not exists submission_log_ip_idx on public.submission_log (ip_hash, created_at desc);

-- ───────────────────────── updated_at trigger ─────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists inquiries_touch on public.inquiries;
create trigger inquiries_touch before update on public.inquiries for each row execute function public.touch_updated_at();
drop trigger if exists jobs_touch on public.jobs;
create trigger jobs_touch before update on public.jobs for each row execute function public.touch_updated_at();
drop trigger if exists applications_touch on public.job_applications;
create trigger applications_touch before update on public.job_applications for each row execute function public.touch_updated_at();

-- ───────────────────────── Row level security ─────────────────────────
alter table public.admin_users            enable row level security;
alter table public.inquiries              enable row level security;
alter table public.jobs                   enable row level security;
alter table public.job_applications       enable row level security;
alter table public.application_files      enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.submission_log         enable row level security;

-- Start from a clean slate for API roles, then grant only what is needed.
revoke all on public.admin_users, public.inquiries, public.jobs, public.job_applications,
  public.application_files, public.newsletter_subscribers, public.submission_log from anon, authenticated;
revoke all on sequence public.submission_log_id_seq from anon, authenticated;

grant select on public.jobs to anon;
grant select, insert, update, delete on public.jobs to authenticated;
grant select, update, delete on public.inquiries, public.job_applications, public.newsletter_subscribers to authenticated;
grant select, insert, delete on public.admin_users to authenticated;
-- application_files: no direct API access; admins use get_resume().

drop policy if exists jobs_public_read on public.jobs;
create policy jobs_public_read on public.jobs for select to anon, authenticated using (is_published or public.is_admin());
drop policy if exists jobs_admin_write on public.jobs;
create policy jobs_admin_write on public.jobs for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists inquiries_admin on public.inquiries;
create policy inquiries_admin on public.inquiries for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists applications_admin on public.job_applications;
create policy applications_admin on public.job_applications for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists subscribers_admin on public.newsletter_subscribers;
create policy subscribers_admin on public.newsletter_subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_users_admin on public.admin_users;
create policy admin_users_admin on public.admin_users for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────── Admin RPCs ─────────────────────────
create or replace function public.get_resume(p_application_id uuid)
returns table (filename text, mime_type text, size_bytes integer, data_base64 text)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized' using errcode = '42501'; end if;
  return query
    select f.filename, f.mime_type, f.size_bytes, encode(f.data, 'base64')
    from public.application_files f where f.application_id = p_application_id;
end; $$;

create or replace function public.admin_dashboard_stats(p_days integer default 30)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  since timestamptz := date_trunc('day', now()) - make_interval(days => greatest(p_days, 1) - 1);
  result jsonb;
begin
  if not public.is_admin() then raise exception 'not authorized' using errcode = '42501'; end if;
  select jsonb_build_object(
    'totals', jsonb_build_object(
      'inquiries',     (select count(*) from inquiries where status <> 'spam'),
      'applications',  (select count(*) from job_applications),
      'subscribers',   (select count(*) from newsletter_subscribers where status = 'active'),
      'open_jobs',     (select count(*) from jobs where is_published),
      'new_inquiries', (select count(*) from inquiries where status = 'new'),
      'new_applications', (select count(*) from job_applications where status = 'new')
    ),
    'period', jsonb_build_object(
      'inquiries',        (select count(*) from inquiries where created_at >= since and status <> 'spam'),
      'applications',     (select count(*) from job_applications where created_at >= since),
      'subscribers',      (select count(*) from newsletter_subscribers where created_at >= since),
      'prev_inquiries',   (select count(*) from inquiries where created_at >= since - (now() - since) and created_at < since and status <> 'spam'),
      'prev_applications',(select count(*) from job_applications where created_at >= since - (now() - since) and created_at < since),
      'prev_subscribers', (select count(*) from newsletter_subscribers where created_at >= since - (now() - since) and created_at < since)
    ),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'day', to_char(d, 'YYYY-MM-DD'),
        'inquiries',    (select count(*) from inquiries i where i.created_at >= d and i.created_at < d + interval '1 day' and i.status <> 'spam'),
        'applications', (select count(*) from job_applications a where a.created_at >= d and a.created_at < d + interval '1 day')
      ) order by d), '[]'::jsonb)
      from generate_series(since, date_trunc('day', now()), interval '1 day') d
    ),
    'by_service', (
      select coalesce(jsonb_agg(jsonb_build_object('service', service, 'count', c) order by c desc), '[]'::jsonb)
      from (select service, count(*) c from inquiries where created_at >= since and status <> 'spam' group by service) s
    ),
    'inquiry_status', (
      select coalesce(jsonb_object_agg(status, c), '{}'::jsonb)
      from (select status, count(*) c from inquiries group by status) s
    ),
    'application_status', (
      select coalesce(jsonb_object_agg(status, c), '{}'::jsonb)
      from (select status, count(*) c from job_applications group by status) s
    ),
    'top_jobs', (
      select coalesce(jsonb_agg(jsonb_build_object('job_title', job_title, 'count', c) order by c desc), '[]'::jsonb)
      from (select job_title, count(*) c from job_applications where created_at >= since group by job_title order by c desc limit 6) j
    )
  ) into result;
  return result;
end; $$;

revoke all on function public.get_resume(uuid) from public, anon;
revoke all on function public.admin_dashboard_stats(integer) from public, anon;
grant execute on function public.get_resume(uuid) to authenticated;
grant execute on function public.admin_dashboard_stats(integer) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
