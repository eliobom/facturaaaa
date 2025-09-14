import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Read from expo.extra first (configured in app.json), fallback to process.env for web/build tools
const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
const SUPABASE_URL = extra?.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = extra?.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // During development we log a clear error to help diagnose missing config
  console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Check app.json extra or env.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Expo Router + RN
  },
});
