import { isAuthApiError } from '@supabase/supabase-js';
import i18n from '@/i18n';
import { supabase } from '@/lib/supabase';

export type SignInError = 'invalidEmail' | 'invalidCode' | 'tooManyRequests' | 'unknown';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return emailPattern.test(email);
}

/** Sends a one-time code; the account is created on first use. */
export async function sendCode(email: string): Promise<SignInError | null> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    // Picks the language of the e-mail (supabase/templates/code.html).
    options: { shouldCreateUser: true, data: { locale: i18n.language } },
  });
  return error ? toSignInError(error) : null;
}

export async function verifyCode(email: string, code: string): Promise<SignInError | null> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email',
  });
  return error ? toSignInError(error) : null;
}

function toSignInError(error: unknown): SignInError {
  if (!isAuthApiError(error)) return 'unknown';
  if (error.status === 429) return 'tooManyRequests';
  if (error.code === 'otp_expired' || error.code === 'invalid_credentials') return 'invalidCode';
  if (error.code === 'email_address_invalid' || error.code === 'validation_failed') return 'invalidEmail';
  return 'unknown';
}
