import { AuthApiError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { isValidEmail, sendCode, verifyCode } from './signIn';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signInWithOtp: jest.fn(), verifyOtp: jest.fn() } },
}));

const auth = jest.mocked(supabase.auth);

test.each(['lea@example.fr', 'hugo.martin+noel@exemple.co.uk'])('accepts %s', (email) => {
  expect(isValidEmail(email)).toBe(true);
});

test.each(['', 'lea', 'lea@', 'lea@example', 'lé a@example.fr'])('rejects "%s"', (email) => {
  expect(isValidEmail(email)).toBe(false);
});

test('asks for the code e-mail in the app language', async () => {
  auth.signInWithOtp.mockResolvedValue({ data: { user: null, session: null }, error: null });
  await expect(sendCode('lea@example.fr')).resolves.toBeNull();
  expect(auth.signInWithOtp).toHaveBeenCalledWith({
    email: 'lea@example.fr',
    options: { shouldCreateUser: true, data: { locale: expect.stringMatching(/^(fr|en)$/) } },
  });
});

test.each([
  [new AuthApiError('Token has expired or is invalid', 403, 'otp_expired'), 'invalidCode'],
  [new AuthApiError('Too many requests', 429, 'over_email_send_rate_limit'), 'tooManyRequests'],
  [new AuthApiError('Database error', 500, 'unexpected_failure'), 'unknown'],
  [new Error('Network request failed'), 'unknown'],
])('explains %s as %s', async (error, expected) => {
  auth.verifyOtp.mockResolvedValue({ data: { user: null, session: null }, error } as never);
  await expect(verifyCode('lea@example.fr', '123456')).resolves.toBe(expected);
});
