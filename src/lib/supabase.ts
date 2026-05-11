import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const SUPABASE_CONFIGURED = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_project_url_here' &&
  supabaseAnonKey !== 'your_anon_key_here'
);

if (!SUPABASE_CONFIGURED) {
  console.warn(
    '⚠️ Supabase credentials missing or not configured. Check your .env file.\n' +
    'Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY\n' +
    'The app will run in demo mode without backend features.'
  );
}

/**
 * Create a mock Supabase client that doesn't crash when credentials are missing.
 * This allows the UI to render without a real backend connection.
 */
const createMockClient = (): SupabaseClient => {
  /* Create with a valid dummy URL so the SDK doesn't throw */
  return createClient('https://demo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDI0NjQ0NSwiZXhwIjoxOTM1ODIyNDQ1fQ.demo');
};

export const supabase: SupabaseClient = SUPABASE_CONFIGURED
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export { SUPABASE_CONFIGURED };
