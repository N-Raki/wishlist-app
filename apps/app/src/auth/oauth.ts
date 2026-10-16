import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import { completeRedirect, redirectParams } from './oauthRedirect';
import type { ReturnTo } from './returnTo';
import type { SignInError } from './signIn';

/**
 * Google's page opens in a browser session over the app and comes back through the app's link,
 * so the sign-in sheet stays where it was. `wishme://auth/callback` in builds, an `exp://`
 * address in Expo Go: both are allowed in Supabase (docs/setup.md).
 */
export async function signInWithGoogle(_returnTo: ReturnTo): Promise<SignInError | null> {
  const redirectTo = Linking.createURL('auth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data.url) return 'providerFailed';
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return 'cancelled';
  return completeRedirect(redirectParams(result.url));
}
