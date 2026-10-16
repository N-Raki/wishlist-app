import { supabase } from '@/lib/supabase';
import { type ReturnTo, returnTo } from './returnTo';
import type { SignInError } from './signIn';

/**
 * The whole page leaves for Google, then comes back to /auth/callback, which picks up where
 * the user was from `returnTo`.
 */
export async function signInWithGoogle(after: ReturnTo): Promise<SignInError | null> {
  returnTo.save(after);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  return error ? 'providerFailed' : null;
}
