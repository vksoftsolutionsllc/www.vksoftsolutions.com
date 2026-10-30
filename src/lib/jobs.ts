import { env } from "./env";

export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string | null;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  created_at: string;
};

const FIELDS = "id,slug,title,department,location,employment_type,experience,summary,responsibilities,requirements,created_at";

// Plain REST keeps supabase-js out of the public bundle. RLS only returns published jobs.
async function rest<T>(query: string): Promise<T> {
  const res = await fetch(`${env.supabaseUrl}/rest/v1/jobs?${query}`, {
    headers: { apikey: env.supabaseKey, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Jobs request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export function fetchJobs() {
  return rest<Job[]>(`select=${FIELDS}&is_published=eq.true&order=created_at.desc`);
}

export async function fetchJob(slug: string) {
  const rows = await rest<Job[]>(`select=${FIELDS}&is_published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ?? null;
}
