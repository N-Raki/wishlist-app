// Public settings of each environment. Everything here ships inside the app:
// only publishable values belong in this file, never a secret key.
export type Environment = 'local' | 'preprod' | 'production';

type EnvironmentConfig = { supabaseUrl: string; supabaseKey: string };

const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    // Defaults of `supabase start`. On a phone, point EXPO_PUBLIC_SUPABASE_URL at your computer's IP.
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321',
    supabaseKey: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
  },
  // Filled once the Supabase projects exist (docs/setup.md).
  preprod: { supabaseUrl: '', supabaseKey: '' },
  production: { supabaseUrl: '', supabaseKey: '' },
};

export function resolveConfig(name: string | undefined): EnvironmentConfig & { environment: Environment } {
  const environment = (name ?? 'local') as Environment;
  const config = environments[environment];
  if (!config) throw new Error(`Unknown EXPO_PUBLIC_APP_ENV "${name}"`);
  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error(`Supabase is not configured for "${environment}" in src/config.ts`);
  }
  return { environment, ...config };
}

export const config = resolveConfig(process.env.EXPO_PUBLIC_APP_ENV);
