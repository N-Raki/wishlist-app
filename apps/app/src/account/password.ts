import { isAuthApiError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/** The same minimum as the auth server (supabase/config.toml, and docs/setup.md for the hosted projects). */
export const passwordMinLength = 8;

export type PasswordResult = 'saved' | 'needsCode' | 'weak' | 'same' | 'invalidCode' | 'unknown';

/**
 * Sets or changes the password. An account not signed in recently must first prove it is its
 * owner with a code sent by e-mail (`secure_password_change`): the result is then `needsCode`,
 * and the call is made again with that code as `nonce`.
 */
export async function savePassword(password: string, nonce?: string): Promise<PasswordResult> {
  const { error } = await supabase.auth.updateUser({ password, nonce });
  if (!error) return 'saved';
  if (!isAuthApiError(error)) return 'unknown';
  switch (error.code) {
    case 'reauthentication_needed':
      return (await supabase.auth.reauthenticate()).error ? 'unknown' : 'needsCode';
    case 'reauthentication_not_valid':
      return 'invalidCode';
    case 'weak_password':
      return 'weak';
    case 'same_password':
      return 'same';
    default:
      return 'unknown';
  }
}
