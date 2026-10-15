import { useQuery } from '@tanstack/react-query';
import { config } from '@/config';

/** Sign-in providers turned on in this environment's Supabase project (docs/setup.md). */
export type Providers = { google: boolean };

export async function fetchProviders(): Promise<Providers> {
  const response = await fetch(`${config.supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: config.supabaseKey },
  });
  if (!response.ok) throw new Error(`Auth settings: ${response.status}`);
  const settings = (await response.json()) as { external?: Record<string, boolean> };
  return { google: settings.external?.google === true };
}

/** A provider's button shows only once it is known to be on, so a project without it never offers it. */
export function useProviders() {
  return useQuery({ queryKey: ['authProviders'], queryFn: fetchProviders, staleTime: Infinity });
}
