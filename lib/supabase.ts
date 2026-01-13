import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable. Make sure it is set in .env.local and restart your dev server.');
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

// Server-side client with secret key for admin operations
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseSecretKey) {
  console.warn('Missing SUPABASE_SECRET_KEY - admin operations will fail');
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseSecretKey || supabasePublishableKey, // Fallback to publishable key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
