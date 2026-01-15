export function createClient(): never {
  throw new Error('Supabase browser client is disabled. Supabase is server-side DB-only.');
}