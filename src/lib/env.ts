export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY as string,
};
