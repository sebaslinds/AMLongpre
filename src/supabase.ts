import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const isPlaceholder = (val: string | undefined) => !val || val.trim() === '' || val.includes('YOUR_SUPABASE');

const isValidUrl = (url: string | undefined) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidJwt = (token: string | undefined) => {
  if (!token) return false;
  return token.split('.').length === 3;
};

const fallbackUrl = 'https://ohbciguplljqzzhgwefc.supabase.co';
const fallbackKey = 'sb_publishable_JJ83Zknthh0bAAEpREFHnA_XrCInCNL';

// Only use the environment URL if it's a valid URL format and not a placeholder
const supabaseUrl = (envUrl && isValidUrl(envUrl) && !isPlaceholder(envUrl)) ? envUrl : fallbackUrl;
const supabaseAnonKey = (envKey && isValidJwt(envKey) && !isPlaceholder(envKey)) ? envKey : fallbackKey;

let supabase: ReturnType<typeof createClient> | null = null;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error("Error creating Supabase client:", error);
}

export { supabase };
