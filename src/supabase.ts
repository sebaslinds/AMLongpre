import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yzmmlufuvjsnphhjmzex.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bW1sdWZ1dmpzbnBoaGptemV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTk2NDQsImV4cCI6MjA4ODc5NTY0NH0.UT_-ZHPwHmI-hopoQlW7AYH0G3p2c3GI-XJXLbu4eWU';

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase config is missing. Please add it to your .env file.");
}

export { supabase };
