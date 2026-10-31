-- Unique, human-friendly reference per application (e.g. VKA-261031-7F3K9Q).
-- Résumés are stored under a name that includes this reference, so two uploads
-- called "resume.pdf" can never collide or be mistaken for each other, and a
-- SHA-256 checksum lets admins confirm a file hasn't been altered.
alter table public.job_applications add column if not exists reference_code text;
create unique index if not exists job_applications_reference_code_key on public.job_applications (reference_code);

alter table public.application_files add column if not exists original_filename text;
alter table public.application_files add column if not exists sha256 text;

update public.job_applications
   set reference_code = 'VKA-' || to_char(created_at, 'YYMMDD') || '-' || upper(substr(md5(id::text), 1, 6))
 where reference_code is null;

update public.application_files f
   set original_filename = coalesce(f.original_filename, f.filename),
       sha256 = coalesce(f.sha256, encode(extensions.digest(f.data, 'sha256'), 'hex')),
       filename = case when f.filename like a.reference_code || '%' then f.filename else a.reference_code || '_' || f.filename end
  from public.job_applications a
 where a.id = f.application_id;

alter table public.job_applications alter column reference_code set not null;

-- Return the checksum alongside the file for admin downloads.
drop function if exists public.get_resume(uuid);
create function public.get_resume(p_application_id uuid)
returns table (filename text, original_filename text, mime_type text, size_bytes integer, sha256 text, data_base64 text)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not authorized' using errcode = '42501'; end if;
  return query
    select f.filename, f.original_filename, f.mime_type, f.size_bytes, f.sha256, encode(f.data, 'base64')
    from public.application_files f where f.application_id = p_application_id;
end; $$;
revoke all on function public.get_resume(uuid) from public, anon;
grant execute on function public.get_resume(uuid) to authenticated;
