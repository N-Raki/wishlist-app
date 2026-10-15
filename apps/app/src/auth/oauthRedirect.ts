import { supabase } from '@/lib/supabase';
import type { SignInError } from './signIn';

export type RedirectParams = { code?: string; error?: string };

/** Reads the query and fragment of the address the provider sent the user back to. */
export function redirectParams(url: string): RedirectParams {
  const params: Record<string, string> = {};
  const [beforeHash = '', hash = ''] = url.split('#');
  const query = beforeHash.split('?')[1] ?? '';
  for (const part of [query, hash]) {
    for (const pair of part.split('&')) {
      const [key, value = ''] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
    }
  }
  return { code: params.code, error: params.error };
}

// Android can hand the same redirect both to the browser session and to the router: the code
// is single-use, so both get the result of one exchange.
const exchanges = new Map<string, Promise<SignInError | null>>();

/** Turns the redirect into a session. `cancelled` when the user backed out at the provider. */
export function completeRedirect({ code, error }: RedirectParams): Promise<SignInError | null> {
  if (error) return Promise.resolve(error === 'access_denied' ? 'cancelled' : 'providerFailed');
  if (!code) return Promise.resolve('providerFailed');
  let exchange = exchanges.get(code);
  if (!exchange) {
    exchange = supabase.auth.exchangeCodeForSession(code).then(({ error }) => (error ? 'providerFailed' : null));
    exchanges.set(code, exchange);
  }
  return exchange;
}
