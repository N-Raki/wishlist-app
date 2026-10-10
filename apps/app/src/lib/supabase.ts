import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import { config } from '@/config';
import type { Database } from './database.types';

export const supabase = createClient<Database>(config.supabaseUrl, config.supabaseKey, {
  auth: {
    // Undefined while pages are pre-rendered for the web, where there is no storage.
    storage: typeof localStorage === 'undefined' ? undefined : localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Native apps are not told when they leave the screen: refresh tokens only while in the foreground.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
